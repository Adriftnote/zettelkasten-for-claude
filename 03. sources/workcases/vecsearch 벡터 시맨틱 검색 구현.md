---
title: vecsearch 벡터 시맨틱 검색 구현
type: workcase
permalink: sources/workcases/vecsearch-implementation
tags:
- vector-search
- fastembed
- sqlite-vec
- basic-memory
- semantic-search
- embedding
- e5-large
- chunking
- incremental-sync
---

# vecsearch 벡터 시맨틱 검색 구현

basic-memory 지식베이스(349→504 entities)에 벡터 임베딩 기반 시맨틱 검색을 추가한 프로젝트.

**목표**: 키워드 매칭의 한계를 넘어 의미 기반 검색 활성화 → 노트 작성 전 중복 확인, 관련 컨텍스트 발견

**결과**: sqlite-vec + fastembed 조합으로 별도 벡터 DB 구축. e5-large-1024d 모델 채택(추상적 쿼리 압도적 우세). 2346→3002 chunks 인덱싱. checksum 기반 증분 동기화, Claude Code Stop hook 자동 sync, OS 레벨 watcher 구현. CLI 통합 및 3개 스킬(workcase/reference/rpg) 연동 완료.

## 전체 흐름

### 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│ basic-memory (knowledge base)                               │
│   memory.db (504 entities, text/markdown)                  │
└───────────┬─────────────────────────────────────────────────┘
            │
            │ (1) Read entities & file content
            ↓
┌─────────────────────────────────────────────────────────────┐
│ vecsearch.py (indexing pipeline)                            │
│                                                              │
│  [Chunking]                                                 │
│   - Strip frontmatter                                       │
│   - Split by ## headers                                     │
│   - Prefix: [type] title                                    │
│   - Skip Relations section                                  │
│   → 3,002 chunks                                            │
│                                                              │
│  [Embedding]                                                │
│   - fastembed TextEmbedding                                 │
│   - Model: intfloat/multilingual-e5-large                   │
│   - Dimensions: 1024                                        │
│   - Pooling: Mean (since v0.7.4)                            │
│   → vectors (serialized as bytes)                           │
│                                                              │
│  [Sync Strategy]                                            │
│   - Checksum-based change detection                         │
│   - sync_state table (entity_id → checksum)                 │
│   - Add/Update/Delete in single transaction                 │
└───────────┬─────────────────────────────────────────────────┘
            │
            │ (2) Store vectors
            ↓
┌─────────────────────────────────────────────────────────────┐
│ vectors.db (sqlite-vec)                                     │
│                                                              │
│  [chunks]                  [vec_chunks]                     │
│   - entity metadata         - rowid → chunks.id            │
│   - chunk text              - embedding (float[1024])      │
│   - section header          - MATCH operator               │
│   - checksum                                                │
│                                                              │
│  [sync_state]                                               │
│   - entity_id → checksum                                    │
│   - synced_at                                               │
└───────────┬─────────────────────────────────────────────────┘
            │
            │ (3) Query
            ↓
┌─────────────────────────────────────────────────────────────┐
│ Search Interface                                            │
│                                                              │
│  CLI: vecsearch search "query" --top 5 --unique             │
│  → Embed query                                              │
│  → vec_chunks MATCH (cosine distance)                       │
│  → Filter by type/project                                   │
│  → Return: distance, title, section, preview               │
│                                                              │
│  Skills Integration:                                        │
│   - workcase.md: Step 2 중복 방지                           │
│   - reference.md: 기존 참고자료 검색                        │
│   - rpg.md: 모듈/함수 관련 패턴 발견                        │
│                                                              │
│  Auto-sync:                                                 │
│   - Claude Code Stop hook → vecsearch sync                  │
│   - vec-watcher.py → memory.db 변경 감지 (5s debounce)     │
└─────────────────────────────────────────────────────────────┘
```

### 구현 타임라인

| Task | 단계 | 주요 작업 |
|------|------|----------|
| **task-20260210-005** | POC 구축 | sqlite-vec 초기화, 모델 비교(MiniLM vs e5-large), 청킹 전략, sync 로직, Stop hook 설정, CLI 스킬 등록 |
| **task-20260210-014** | 인덱스 재빌드 | fastembed 0.7.4 pooling 변경(CLS→Mean) 대응, 전체 재인덱싱(15분, 504 entities / 3,002 chunks) |
| **task-20260210-015** | CLI 래퍼 정비 | bash 래퍼 생성 (~/.local/bin/vecsearch), chmod +x, 테스트 |
| **task-20260210-016** | 스킬 연동 | workcase/reference/rpg 스킬에 Step 2 추가, distance 기준 중복 판단, MAGMA Relations |

## 핵심 개념

### 1. 임베딩 모델 선택

**비교 대상**:
- `sentence-transformers/all-MiniLM-L6-v2` (384차원)
- `intfloat/multilingual-e5-large` (1024차원)

**평가 쿼리**:
```
"개발 과정에서 배운 교훈과 실패 경험을 정리한 글"
```

**결과**:
- **MiniLM**: 키워드 매칭에 의존 ("교훈", "실패" 토큰)
- **e5-large**: 의미 이해 ("[workcase]" 타입, "학습정리" 패턴 상위 랭크)

**결정**: e5-large 채택 — 추상적 개념 쿼리에서 압도적 차이, 차원 증가(384→1024) 대비 검색 품질 개선이 더 중요

### 2. 청킹 전략

**목표**: 섹션 단위 검색 가능, 노이즈 제거, 엔티티 맥락 보존

**로직**:
1. Frontmatter 제거 (YAML 메타데이터)
2. `## ` 헤더로 분할 (Markdown H2 기준)
3. 각 chunk에 prefix 추가: `[entity_type] entity_title\n\n`
4. **Relations 섹션 제외** (wikilink만 있어 의미 없음)
5. 최소 길이 필터 (MIN_CHUNK_CHARS = 30)

**예시**:
```python
# 원본 노트
---
title: vecsearch
type: module
---

basic-memory 지식베이스의 벡터 시맨틱 검색 도구

## Usage

vecsearch search "query" --top 5

## Architecture

sqlite-vec + fastembed 조합...

## Relations
- [[fastembed]]
- [[sqlite-vec]]

# 청킹 결과
chunk[0]: "[module] vecsearch\n\nbasic-memory 지식베이스의 벡터 시맨틱 검색 도구"
chunk[1]: "[module] vecsearch\n\n## Usage\n\nvecsearch search \"query\" --top 5"
chunk[2]: "[module] vecsearch\n\n## Architecture\n\nsqlite-vec + fastembed 조합..."
# Relations 섹션은 스킵됨
```

**통계**: 504 entities → 3,002 chunks (평균 ~6 chunks/entity)

### 3. 증분 동기화 (Incremental Sync)

**문제**: 매번 전체 재인덱싱은 비효율 (15분 소요)

**해결**: checksum 기반 변경 감지

**로직**:
```python
# sync_state 테이블: entity_id → checksum 매핑
synced = {entity_id: checksum}

for entity in memory.db:
    if entity.id not in synced:
        # 신규 추가
        index_entity(entity)
        added += 1
    elif synced[entity.id] != entity.checksum:
        # 업데이트: 기존 chunks 삭제 후 재인덱싱
        delete_entity_chunks(entity.id)
        index_entity(entity)
        updated += 1

# 삭제된 entity 처리
for entity_id in synced.keys() - current_entity_ids:
    delete_entity_chunks(entity_id)
    deleted += 1
```

**성능**: 변경 없으면 1초 이내, 수십 개 변경 시 수초~수십 초

### 4. 자동 Sync 메커니즘

**방법 1: Claude Code Stop Hook** (채택)
```json
// environments/claude-code/settings.json
"hooks": {
  "stop": "python \"C:/claude-workspace/_system/vector-search/vecsearch.py\" sync"
}
```
→ 세션 종료 시 자동 sync 실행 (백그라운드)

**방법 2: OS 레벨 Watcher** (보조)
```python
# vec-watcher.py
# memory.db 파일 변경 감지 (watchfiles)
# 5초 debounce 후 vecsearch sync 실행
```
→ basic-memory 쓰기 완료 후 자동 반영 (실시간)

**Trade-off**:
- Hook: 세션 종료까지 지연, 백그라운드 실행으로 사용자 방해 없음
- Watcher: 즉시 반영, 백그라운드 프로세스 유지 필요

**현재**: Hook만 사용 (watcher는 필요 시 수동 실행)

### 5. Distance 기준 중복 판단

**용도**: 스킬(workcase/reference/rpg)에서 노트 작성 전 유사 노트 검색 → 중복 방지, 연결 강화

**기준** (경험 기반):
| Distance | 의미 | 조치 |
|----------|------|------|
| < 14 | 거의 동일 주제 | 기존 노트 **업데이트** (내용 추가/보완) |
| 14~17 | 관련 주제 | 새 노트 생성 + Observations에 기존 노트 언급 |
| > 17 | 무관 | 그대로 새 노트 생성 |

**예시**:
```bash
vecsearch search "vecsearch 벡터 검색 구현" --top 5 --unique
# #1  [module] vecsearch  Distance: 14.0129
# → 14 근처: 모듈 문서는 이미 있으므로 workcase는 별도 생성 (관련 주제)
```

## 실제 적용

### CLI 사용법

```bash
# 전체 재인덱싱 (초기 또는 스키마 변경 시)
vecsearch index

# 증분 동기화 (일반적 사용)
vecsearch sync

# 검색
vecsearch search "쿼리 텍스트" --top 5 --unique
  --type workcase          # 특정 entity_type 필터
  --project zettelkasten   # 특정 프로젝트 필터
  --unique                 # entity당 1개 결과 (중복 제거)

# 통계
vecsearch stats
```

**출력 예시**:
```
============================================================
Query: 개발 과정에서 배운 교훈과 실패 경험을 정리한 글
============================================================

#1  [workcase] 데이터 수집 자동화 Flow 설계
    Distance: 12.3456  |  Project: zettelkasten
    File: 03. sources/workcases/data-collection-flow.md
    [workcase] 데이터 수집 자동화 Flow 설계 ## Observations ### Learnings - n8n Webhook는 ...

#2  [pattern] 학습정리
    Distance: 13.7890  |  Project: zettelkasten
    File: 02. maps/patterns/학습정리.md
    ...
```

### 스킬 연동 패턴

**workcase.md / reference.md / rpg.md 공통 Step 2**:

```bash
# Step 2: 벡터 검색 (중복 방지)
vecsearch search "{주제 설명}" --top 5 --unique
```

**판단 로직**:
1. distance < 14 → 기존 노트 read → 내용 추가/보완 → edit_note
2. distance 14~17 → 새 노트 생성 + Observations ## Related 섹션에 기존 노트 wikilink
3. distance > 17 → 그대로 새 노트 생성

**효과**:
- 중복 노트 생성 방지 (동일 주제 반복 방지)
- 관련 노트 간 연결 강화 (Observations에 명시)
- 맥락 확장 (기존 관련 내용 참조)

### RPG Relations 확장 (MAGMA 인과관계)

기존: related, references, referenced_by, uses, used_by, implements, implemented_by

**추가**:
- `causes`: A가 B를 유발 (인과관계 정방향)
- `caused_by`: B가 A에 의해 유발됨 (역방향)

**적용 예시**:
```markdown
## Relations
- related: [[sqlite-vec]], [[fastembed]]
- causes: [[workcase-skill-integration]] ← vecsearch 구현이 스킬 연동을 유발
- uses: [[get-embedder]], [[init-vector-db]]
```

## 산출물

| 파일 | 경로 | 설명 |
|------|------|------|
| **vecsearch.py** | `C:\claude-workspace\_system\vector-search\vecsearch.py` | 메인 CLI (index/sync/search/stats) |
| **vec-watcher.py** | `C:\claude-workspace\_system\vector-search\vec-watcher.py` | memory.db 파일 변경 감지 + 자동 sync |
| **vecsearch (bash)** | `C:\Users\RL\.local\bin\vecsearch` | CLI 래퍼 (Git Bash에서 직접 호출) |
| **vectors.db** | `C:\claude-workspace\_system\vector-search\vectors.db` | sqlite-vec 벡터 DB |
| **cli-guide.md** | `.claude\skills\cli-guide.md` | vecsearch 사용법 등록 |
| **MEMORY.md** | `environments\claude-code\projects\C--claude-workspace\memory\MEMORY.md` | vecsearch 포인터 추가 |
| **vecsearch.md** | `reference\code\05. code\modules\vecsearch.md` | RPG 모듈 문서 (basic-memory) |
| **vec-watcher.md** | `reference\code\05. code\modules\vec-watcher.md` | RPG 모듈 문서 |

## Observations

### [fact] 벡터 검색 vs 키워드 검색
e5-large 모델은 추상적 개념("배운 교훈", "설계 원칙")을 토큰 매칭이 아닌 의미로 이해. MiniLM-384d 대비 고차원(1024d)이지만 검색 품질이 월등히 개선됨.

### [pattern] Checksum 기반 증분 동기화
Git처럼 변경 감지에 checksum 활용 → 전체 스캔 없이 효율적 sync. `sync_state` 테이블로 이전 상태 추적, 신규/업데이트/삭제 3가지 케이스만 처리.

### [method] Distance 기준 중복 판단
경험적으로 distance < 14는 거의 동일 주제, 14~17은 관련 주제, > 17은 무관. 스킬에서 이 기준으로 기존 노트 업데이트 vs 신규 생성 판단.

### [tech] sqlite-vec MATCH 연산자
`vec_chunks.embedding MATCH ?` 구문으로 cosine distance 기반 KNN 검색. WHERE 절에 entity_type/project_id 필터 추가 가능. 속도: 3,002 chunks 대상 < 1초.

### [pattern] Prefix로 엔티티 맥락 보존
각 chunk에 `[entity_type] entity_title` prefix 추가 → 섹션만 보고도 어떤 노트인지 파악 가능. 검색 결과 명확성 향상.

### [method] Claude Code Stop Hook 자동화
세션 종료 시 `settings.json` hooks.stop 실행 → 사용자 개입 없이 자동 sync. 백그라운드 실행으로 종료 지연 없음.

### [limitation] 커스텀 에이전트 MCP 접근 불가
`.claude/agents/` 커스텀 에이전트는 MCP 서버 연결이 전파되지 않는 버그 → vecsearch는 빌트인 에이전트(Explore, general-purpose)에서만 사용 가능.

### [pattern] 스킬 통합 전략
기존 workcase/reference/rpg 3개 스킬에 Step 2 벡터 검색 단계 추가 → 모든 노트 작성 워크플로우에서 자동으로 중복 확인 및 관련 노트 발견.

### [fact] Pooling 방식 변경 (fastembed 0.7.4)
e5-large 모델이 CLS 토큰 → Mean pooling으로 변경 경고. 기존 vectors.db 삭제 후 전체 재인덱싱 필요 (약 15분).

### [method] Relations 섹션 스킵
wikilink만 있는 Relations 섹션은 벡터 임베딩에 의미 없음 → 청킹 시 제외하여 노이즈 감소.

## Relations
- related: [[sqlite-vec]], [[fastembed]], [[basic-memory]]
- uses: [[get-embedder]], [[init-vector-db]], [[chunk-markdown]], [[embed-texts]]
- causes: [[workcase-skill-integration]], [[reference-skill-integration]], [[rpg-skill-integration]]
- references: [[task-20260210-005]], [[task-20260210-014]], [[task-20260210-015]], [[task-20260210-016]]