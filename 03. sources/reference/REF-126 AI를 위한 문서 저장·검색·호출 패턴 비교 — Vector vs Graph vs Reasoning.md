---
title: REF-126 AI를 위한 문서 저장·검색·호출 패턴 비교 — Vector vs Graph vs Reasoning
type: guide
permalink: sources/reference/ai-document-retrieval-patterns-comparison
tags:
- knowledge-graph
- RAG
- document-retrieval
- vector-search
- LLM-reasoning
- basic-memory
date: 2026-03-24
---

# AI를 위한 문서 저장·검색·호출 패턴 비교

"문서가 코드를 대체한다"는 전제 하에, AI가 마크다운 문서를 어떻게 저장·검색·호출할 수 있는지 3가지 패턴을 실측 비교한 가이드.

## 📖 핵심 아이디어

AI 코딩 능력이 올라가면 코드보다 스펙 문서가 중요해진다. 동일한 스펙을 주면 일관된 코드가 나오기 때문. 이때 "스펙 문서를 어떻게 저장하고, 필요한 부분을 어떻게 찾아오는가"가 핵심 문제. 현재 3가지 패턴이 존재하며 각각 다른 레이어를 담당한다.

## 🛠️ 3가지 패턴

### Pattern A: 벡터 검색 (Vector RAG)

```
문서 → 청킹 → 임베딩 → 벡터 DB → cosine similarity → top-k 반환
```

| 항목 | 내용 |
|------|------|
| 대표 도구 | Pinecone, Chroma, Qdrant, basic-memory 벡터 |
| 저장 | 벡터 DB (고차원 float 배열) |
| 검색 | 코사인 유사도 top-k |
| 강점 | 빠름, 대규모 확장, 시맨틱 매칭 |
| 약점 | 문서 구조 파괴(청킹), similarity ≠ relevance, 해석 불가 |

### Pattern B: 지식 그래프 (Knowledge Graph)

```
문서 → Entity 추출 → Relation 추출 → 그래프 DB/SQLite → 그래프 탐색
```

| 항목 | 내용 |
|------|------|
| 대표 도구 | basic-memory, Neo4j, KuzuDB, CRG, GitNexus |
| 저장 | Entity + Observation + Relation (3레이어) 또는 Node + Edge (2레이어) |
| 검색 | 그래프 탐색 (BFS/DFS, Cypher), FTS, 벡터 하이브리드 |
| 강점 | 관계 보존, 맥락 유지, 해석 가능, 횡적 연결 |
| 약점 | 구축 비용 (수동 or LLM), 관계 정의 설계 필요 |

### Pattern C: 추론 기반 (Reasoning-Based)

```
문서 → 구조 트리(JSON) → LLM에 트리+질문 → LLM이 추론으로 노드 선택
```

| 항목 | 내용 |
|------|------|
| 대표 도구 | PageIndex |
| 저장 | JSON 계층 트리 |
| 검색 | LLM 추론 (트리 탐색) |
| 강점 | 구조 보존, 해석 가능, 인프라 최소 |
| 약점 | 매 검색마다 LLM 호출 (비용/레이턴시), 문서 간 연결 불가 |

## 🔧 실측 비교 (같은 프로젝트 기준)

### 데이터 모델 비교

| | CRG (Pattern B 경량) | BM+RPG (Pattern B 풍부) | PageIndex (Pattern C) |
|---|---|---|---|
| 테이블 | 3개 (nodes, edges, metadata) | 5개 (entity, observation, relation, project, search_index) | 0개 (JSON 파일) |
| 노드 속성 | 이름, 위치, 종류 | 이름, 위치, 종류 + **Observation(사실/속성)** | 제목, 레벨, 본문, 요약 |
| 관계 종류 | 2종 (JS 실측) | 15종+ | 1종 (parent-child) |
| 인덱싱 | 자동 (AST) | 반자동 (AST + 수동 보강) | 자동 (헤더 파싱) |
| 검색 방식 | qualified name + BFS | FTS + 벡터 + 그래프 | LLM 추론 |

### 레이어 분담

```
          문서 간 연결          문서 내부 탐색         코드 구조 인덱스
          ←─────────────────→  ←──────────────→      ←───────────────→
          
Pattern B (BM+RPG)             Pattern C (PageIndex)  Pattern B (CRG/GitNexus)
  Entity ─ Observation ─ Rel     JSON Tree → LLM       Node ─ Edge (AST)
  15종+ 관계, 시맨틱 태그         계층만, 추론으로 보완    CALLS/CONTAINS 자동
```

### 적합한 질문 유형

| 질문 유형 | 최적 패턴 |
|-----------|-----------|
| "이 함수를 바꾸면 뭐가 영향받아?" | B (CRG/GitNexus) — blast radius |
| "이 스펙의 인증 관련 부분 찾아줘" | C (PageIndex) — 문서 내부 탐색 |
| "인증 모듈이 데이터 파이프라인과 어떻게 연결돼?" | B (BM+RPG) — 횡적 관계 |
| "비슷한 패턴을 쓴 다른 모듈 있어?" | A (벡터) — 시맨틱 유사도 |

## 💡 실용적 평가

### "문서 = 코드" 패러다임에서의 결론

1. **단일 패턴으로는 부족** — 각 패턴이 다른 레이어를 담당
2. **BM+RPG가 가장 범용** — Entity+Observation+Relation이 문서 간/내부 모두 커버. 다만 구축 비용 높음
3. **PageIndex의 "구조 보존" 원칙은 채택할 가치** — 마크다운 헤더가 이미 정보 조직의 메타데이터. basic-memory도 이를 활용 중 (frontmatter + 섹션 파싱)
4. **blast radius는 BM에 없는 유일한 기능** — "이 문서를 바꾸면 어떤 문서가 영향받는가"를 자동 추적하는 기능은 현재 BM에 없음. 추가하면 가치 있음

### 이상적 조합

```
[저장] BM Entity+Observation+Relation (마크다운 기반, 15종+ 관계)
  +
[문서 내 검색] 헤더 기반 트리 탐색 (PageIndex 원리, BM의 섹션 파싱으로 대체 가능)
  +
[문서 간 검색] FTS + 벡터 + 그래프 탐색 (BM 기존 기능)
  +
[변경 영향] blast radius BFS (CRG 원리, relation 기반으로 구현 가능)
```

## 🔗 관련 개념

- [[PageIndex — Vectorless Reasoning-Based RAG Framework]] - (Pattern C 상세)
- [[Code-Review-Graph — Tree-sitter 기반 코드 지식 그래프 (Claude Code 플러그인)]] - (Pattern B 경량 버전 상세)
- [[GitNexus - AST 기반 코드 지식 그래프 엔진]] - (Pattern B 풍부 버전, 코드 전용)
- [[BM25]] - (Pattern A의 키워드 검색 변종)
- [[memory-systems]] - (메모리 시스템 전반 허브)
- [[context-engineering]] - (AI 컨텍스트 관리 허브)

---

**작성일**: 2026-03-24
**분류**: knowledge-management / AI-infrastructure