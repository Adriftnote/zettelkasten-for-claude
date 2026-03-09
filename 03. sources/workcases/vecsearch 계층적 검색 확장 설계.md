---
title: vecsearch 계층적 검색 확장 설계
type: workcase
permalink: sources/workcases/vecsearch-hierarchical-search-design
tags:
- vector-search
- hierarchical-search
- multi-hop
- clustering
- graph-traversal
- sqlite-vec
- complexity-reduction
date: 2026-03-09
---

# vecsearch 계층적 검색 확장 설계

> MOOSE-Star 논문(O(N^k) → O(log N) 복잡도 감소)을 분석하면서, vecsearch(sqlite-vec + e5-large) 시스템에 계층적 검색과 multi-hop 그래프 탐색을 적용하는 설계를 도출한 기록.

## 1. 전체 흐름

### 현재 vs 확장 아키텍처

```
현재 (flat search):
  query → embed → 3,002 chunks 전수비교 → Top-K
  복잡도: O(N) per query, multi-hop 시 O(N^k)

확장 후 (hierarchical + graph):
  query → embed → 클러스터 트리 탐색 → leaf 내 비교 → Top-K
                                          ↓
                              wikilink 그래프 탐색 (hop 2, 3...)
                                          ↓
                              벡터 유사도 × decay^hop 재정렬
  복잡도: O(log N) per hop, multi-hop 시 O(k × [log N + 이웃수])
```

### 모듈 구성

```
vectors.db (기존)
├── chunks            ← 메타데이터 (변경 없음)
├── vec_chunks        ← 벡터 (변경 없음)
├── sync_state        ← 동기화 (변경 없음)
│
├── cluster_tree [신규] ← K-means 계층 트리
│   - node_id, parent_id, depth
│   - centroid (float[1024])
│   - chunk_ids (leaf만)
│
└── graph_edges [신규]  ← wikilink 기반 엔티티 그래프
    - from_entity_id, to_entity_id
    - relation_type
```

## 2. 핵심 개념

### 2.1 왜 필요한가: 조합 폭발 문제

MOOSE-Star가 수학적으로 증명한 핵심 — "N개에서 k개를 조합하는 검색은 O(N^k)"

| 시나리오 | 현재 vecsearch | 필요한 것 |
|----------|---------------|----------|
| 단순 유사 검색 | O(N) ✅ 충분 | — |
| "A와 B를 연결하는 C" (2-hop) | O(N²) ⚠️ | O(2 × log N) |
| "A→B→C 연쇄 추론" (3-hop) | O(N³) ❌ 불가 | O(3 × log N) |

현재 3,002 chunks에서 single-hop은 1초 이내로 문제없지만, multi-hop이나 볼트 확장(10K+ entities) 시 병목.

### 2.2 MOOSE-Star에서 가져오는 3가지 기법

#### (A) Hierarchical K-means Cluster Tree — O(N) → O(log N)

AI 불필요. 순수 수학.

```python
# BUILD: 재귀 K-means로 트리 구축
# branching_factor=10, max_depth=3
# Level 0: 1개 root
# Level 1: 10개 클러스터 (대분류)
# Level 2: 100개 클러스터 (중분류)
# Level 3: ~1000개 leaf → 각 leaf에 ~3개 chunk

def build_cluster_tree(db_path, branching_factor=10, max_depth=3):
    # 1) vec_chunks에서 전체 임베딩 로드
    # 2) 재귀 K-means: 각 레벨에서 branching_factor개로 분할
    # 3) cluster_tree 테이블에 저장
    #    - internal node: centroid만 저장
    #    - leaf node: centroid + chunk_ids 저장

def _build_recursive(vectors, ids, tree, depth, max_depth, branch, parent_id):
    if depth >= max_depth or len(ids) <= branch:
        # Leaf: centroid + chunk_ids
        return
    k = min(branch, len(ids))
    kmeans = KMeans(n_clusters=k, n_init=3)
    labels = kmeans.fit_predict(vectors)
    for cluster_i in range(k):
        mask = labels == cluster_i
        _build_recursive(vectors[mask], ids[mask], ...)
```

```python
# SEARCH: beam search로 트리 탐색
def hierarchical_search(db_path, query_vec, top_k=5, beam_width=3):
    # Root에서 시작
    # 각 레벨: beam_width개 경로 동시 탐색
    # Leaf 도달: 해당 클러스터 내 chunk만 비교
    # → O(beam_width × depth + leaf_size) ≈ O(log N)
```

**beam_width 트레이드오프**:
- beam=1: 가장 빠름, 최적 클러스터 놓칠 수 있음
- beam=3: 속도/정확도 균형 (기본값)
- beam=5+: flat search에 수렴

#### (B) Multi-hop Graph Search — wikilink 활용

AI 불필요. 그래프 BFS + 벡터 재정렬.

```python
def multihop_search(db_path, memory_db_path, query_vec, hops=2, top_k=5, decay=0.7):
    """
    hop마다 decay로 가중치 감소:
      hop 0: 직접 벡터 검색 (weight=1.0)
      hop 1: 결과의 wikilink 이웃 (weight=0.7)
      hop 2: 이웃의 이웃 (weight=0.49)
    """
    scored = {}  # entity_id → best_score
    visited = set()

    # Hop 0: hierarchical_search로 시작점 확보
    # Hop 1+: basic-memory relations에서 이웃 탐색
    #   → 이웃 entity의 chunks 벡터를 query와 비교
    #   → score = cosine_sim × decay^hop
    # 최종: scored 정렬 → top_k 반환
```

**decay=0.7 근거**: 2-hop에서 0.49, 3-hop에서 0.34 → 원래 쿼리와 멀어질수록 가중치 자연 감소. 그래프 거리가 곧 관련성 감쇠를 반영.

#### (C) Centroid Pruning — Motivation Planning 대체

AI 근사 가능. 클러스터 centroid 거리로 무관 영역 제거.

```python
def prune_search_space(db_path, query_vec, threshold=0.3):
    """
    MOOSE-Star의 Motivation Planning을 알고리즘으로 근사:
    - LLM: "어떤 방향의 영감이 필요한가?" 판단
    - 대체: Level 1 클러스터 centroid와 거리 비교 → 상위 30%만 탐색
    → 검색 공간 N → Nm (Nm ≈ 0.3N)
    """
    # Level 1 (대분류) 클러스터 centroid와 query 유사도 비교
    # 상위 threshold% 클러스터만 active로 설정
    # hierarchical_search에서 active 클러스터 하위만 탐색
```

**한계**: LLM Motivation Planning보다 정밀도 낮음. LLM은 "이 배경지식에는 생화학 방향의 영감이 필요하다"고 추론하지만, centroid pruning은 벡터 거리만으로 판단. 그러나 vecsearch 용도(노트 탐색)에서는 충분.

### 2.3 AI 필요 여부 분석

| MOOSE-Star 단계 | AI 필요? | vecsearch 구현 |
|:---:|:---:|---|
| Sequential Decomposition | ❌ | multi-hop을 hop별 순차 실행 |
| Bounded Composition | ❌ | cosine distance threshold |
| Hierarchical Search | ❌ | K-means cluster tree + beam search |
| Motivation Planning | ⚠️ 부분적 | centroid pruning으로 근사 (품질 ↓, 속도 ✅) |

**결론: 핵심 3개는 100% 알고리즘. Motivation Planning만 약간의 품질 손해로 근사.**

## 3. 실제 적용

### 구현 범위

| 모듈 | 구현 난이도 | 의존성 | 우선순위 |
|------|:---:|--------|:---:|
| cluster_tree 빌드 | 중 | scikit-learn KMeans | 1 |
| hierarchical_search | 중 | cluster_tree 테이블 | 1 |
| graph_edges 구축 | 하 | basic-memory relations | 2 |
| multihop_search | 중 | graph_edges + hierarchical_search | 2 |
| centroid_pruning | 하 | cluster_tree Level 1 | 3 |

### CLI 확장 (안)

```bash
# 기존 명령어 (변경 없음)
vecsearch search "query" --top 5 --unique
vecsearch sync
vecsearch index

# 신규 명령어
vecsearch build-tree              # 클러스터 트리 구축
vecsearch build-tree --branch 10 --depth 3  # 파라미터 지정
vecsearch search "query" --mode hierarchical  # 계층 검색
vecsearch search "query" --hops 2 --decay 0.7  # multi-hop
vecsearch search "query" --hops 2 --prune 0.3  # pruning + multi-hop
```

### DB 스키마 추가

```sql
-- 클러스터 트리 (hierarchical_search용)
CREATE TABLE IF NOT EXISTS cluster_tree (
    node_id    INTEGER PRIMARY KEY,
    parent_id  INTEGER,              -- NULL = root
    depth      INTEGER NOT NULL,
    centroid   BLOB NOT NULL,        -- float[1024] serialized
    chunk_ids  TEXT,                 -- leaf만: "1,5,23,..." (comma-separated)
    FOREIGN KEY (parent_id) REFERENCES cluster_tree(node_id)
);

-- 엔티티 그래프 (multi-hop용)
CREATE TABLE IF NOT EXISTS graph_edges (
    from_entity_id  INTEGER NOT NULL,
    to_entity_id    INTEGER NOT NULL,
    relation_type   TEXT DEFAULT 'related',
    PRIMARY KEY (from_entity_id, to_entity_id)
);
CREATE INDEX idx_edges_from ON graph_edges(from_entity_id);
CREATE INDEX idx_edges_to ON graph_edges(to_entity_id);
```

### 복잡도 비교

|          | 현재 (flat)     | 확장 후 (hierarchical)         | AI 필요? |
| -------- | ------------- | --------------------------- | :----: |
| 단일 검색    | O(N) = 3,002회 | O(log N) ≈ 30회              |   ❌    |
| 2-hop    | O(N²) ≈ 900만  | O(2 × [log N + 이웃수]) ≈ 100회 |   ❌    |
| 3-hop    | O(N³) 불가능     | O(3 × [log N + 이웃수]) ≈ 200회 |   ❌    |
| 검색 공간 축소 | 없음            | centroid pruning ~30%       |   ❌    |

### 현실적 판단

**지금 당장 의미 있는 것**:
- multi-hop graph search → wikilink 기반 연쇄 탐색 자동화 (현재 수동)
- 노트 작성 시 "이 주제와 2-hop 거리의 관련 노트"를 자동 발견

**스케일링 시 의미 있는 것**:
- hierarchical search → 10K+ entities에서 O(N) vs O(log N) 체감
- centroid pruning → 대규모 볼트에서 검색 공간 축소

## 관련 Task
- (아직 구현 task 없음 — 설계 단계)

## Observations

### [pattern] 조합 폭발의 알고리즘적 분해
MOOSE-Star의 O(N^k) → O(k × log N) 분해는 "동시에 k개를 찾는 문제"를 "1개씩 k번 찾는 문제"로 전환하는 것. 이 패턴은 vecsearch뿐 아니라 모든 multi-step 검색에 적용 가능. #complexity-reduction #hierarchical-search

### [method] K-means 클러스터 트리 + beam search
재귀 K-means(branching_factor=10, depth=3)로 트리 구축 → beam search(width=3)로 탐색. beam_width가 정확도/속도 트레이드오프를 조절하는 유일한 파라미터. 구현에 scikit-learn KMeans 외 의존성 없음. #clustering #beam-search

### [method] wikilink 그래프 + decay 가중치 multi-hop
기존 basic-memory relations를 그래프 엣지로 활용 → BFS + 벡터 재정렬. decay=0.7이면 2-hop에서 0.49, 3-hop에서 0.34로 자연 감쇠. AI 없이 그래프 거리 = 관련성 감쇠를 반영. #graph-traversal #multi-hop

### [fact] Motivation Planning은 centroid pruning으로 근사 가능
LLM이 "어떤 방향?" 판단하는 단계를 클러스터 centroid 유사도로 대체. 정밀도는 떨어지지만 노트 탐색 용도에서는 충분. 상위 30% 클러스터만 탐색 → 검색 공간 ~70% 절감. #search-pruning

### [fact] 현재 3,002 chunks에서는 flat search로 충분
single-hop O(N) < 1초. hierarchical search의 실질적 가치는 (1) multi-hop 자동화와 (2) 10K+ 스케일링 대비. 조기 최적화보다 multi-hop graph search 우선 구현이 ROI 높음. #pragmatic

### [tech] 기존 vecsearch.py에 2개 테이블 + 2개 함수 추가로 구현
cluster_tree 테이블(트리 구조) + graph_edges 테이블(wikilink 그래프). build_cluster_tree(), hierarchical_search(), multihop_search() 함수 추가. 기존 flat search는 --mode 플래그로 공존. 비파괴적 확장. #sqlite-vec #incremental

### [decision] 2026-03-09 구현 보류 판단

**결론: 지금은 구현하지 않음. 설계 문서는 스케일링 로드맵으로 보관.**

보류 근거:
1. **규모 불일치** — MOOSE-Star는 N≈10^7, vecsearch는 3,387 chunks. 풀려는 문제(조합 폭발)가 아직 존재하지 않음
2. **sqlite-vec ANN 중복** — `MATCH` 절이 이미 ANN 인덱스 사용. K-means cluster tree를 올리면 이중 구조
3. **모델 로딩이 병목** — 검색 자체는 <100ms, 모델 로딩이 3-5초. 검색 알고리즘 최적화로 풀리는 문제가 아님
4. **Multi-hop은 기존 워크플로우로 커버** — `vecsearch` → `build_context(depth=2)`로 시맨틱+그래프 2단계 탐색 이미 가능
5. **graph_edges 이중 관리** — basic-memory relations와 별도 테이블 동기화 부담

재검토 트리거:
- chunks 10K+ && 검색 지연 체감 → sqlite-vec IVF 옵션 먼저, 부족하면 hierarchical
- "A→B→C" 연쇄 검색 반복 필요 → CLI 래퍼(vecsearch + build_context 결합)로 경량 구현
- entities 5K+ → graph_edges 고려