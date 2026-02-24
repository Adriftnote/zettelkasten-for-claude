---
title: GitNexus - AST 기반 코드 지식 그래프 엔진
type: doc-summary
permalink: sources/reference/gitnexus-code-knowledge-graph
tags:
- code-analysis
- AST
- tree-sitter
- graph-database
- KuzuDB
- MCP
- code-intelligence
date: 2026-02-23
---

# GitNexus - AST 기반 코드 지식 그래프 엔진

코드베이스를 Tree-sitter로 AST 파싱한 뒤 KuzuDB(그래프 DB)에 저장하여, AI 에이전트가 코드 구조를 완전히 이해할 수 있게 만드는 코드 분석 엔진.

## 📖 핵심 아이디어

전통적 Graph RAG는 LLM에 원본 코드를 주고 탐색을 기대하지만, GitNexus는 **인덱싱 단계에서 구조를 사전 계산**하여 한 번의 쿼리로 완전한 컨텍스트를 반환한다. CLI+MCP 모드(로컬, Claude Code/Cursor 통합)와 웹 UI(브라우저 내 그래프 탐색) 두 가지 방식 지원.

## 🛠️ 8단계 인덱싱 파이프라인

```
소스코드
  │
  ▼
① Extract ─── 파일 스캔, 내용 수집
  ▼
② Structure ── 폴더/파일 계층 → 그래프 노드
  ▼
③ Parse ────── Tree-sitter AST 파싱 (워커 풀 병렬)
  │             → 함수, 클래스, 메서드 등 심볼 추출
  ▼
④ Imports ──── import문 해석 → IMPORTS 관계
  ▼
⑤ Calls ────── 함수 호출 추적 → CALLS 관계
  ▼
⑥ Heritage ─── 상속/구현 → EXTENDS, IMPLEMENTS 관계
  ▼
⑦ Communities ─ Leiden 알고리즘으로 모듈 자동 클러스터링
  ▼
⑧ Processes ── 실행 흐름 감지 → 호출 체인을 프로세스로 추상화
  ▼
KuzuDB (그래프 DB)
```

## 🔧 그래프 스키마

### 노드 (24개 타입)

| 카테고리 | 노드 타입 | 주요 속성 |
|---------|-----------|----------|
| 구조 | File, Folder | id, name, filePath |
| 코드 심볼 | Function, Class, Method, Interface | id, name, filePath, startLine, endLine, isExported, content |
| 다언어 | Struct, Enum, Trait, Impl, Union, Namespace, Template 등 | 언어별 특화 |
| 추상화 | Community (자동 클러스터) | label, keywords, description, cohesion, symbolCount |
| 실행 흐름 | Process | label, processType, stepCount, entryPointId |

### 엣지 (관계)

| 관계 | 의미 | 예시 |
|------|------|------|
| CONTAINS | 포함 | Folder→File, File→Function |
| CALLS | 호출 | Function→Function |
| IMPORTS | 임포트 | File→File |
| EXTENDS | 상속 | Class→Class |
| IMPLEMENTS | 구현 | Class→Interface |
| MEMBER_OF | 클러스터 소속 | Function→Community |
| STEP_IN_PROCESS | 실행 순서 | Function→Process |

각 엣지에 **confidence**(0~1 확신도)와 **reason**(`import-resolved`, `same-file`, `fuzzy-global`)이 붙음.

### 벡터 임베딩

- CodeEmbedding 테이블: 384차원 FLOAT 벡터
- HNSW 인덱스 (코사인 유사도)
- BM25 + 벡터 하이브리드 검색 (RRF 결합)

## 🔧 MCP 도구 (7개)

| 도구 | 용도 |
|------|------|
| `query()` | BM25 + semantic + RRF 하이브리드 검색 |
| `context()` | 360도 심볼 뷰 (incoming/outgoing refs) |
| `impact()` | 영향 범위 분석 (depth grouping) |
| `detect_changes()` | Git diff → affected processes 매핑 |
| `rename()` | graph + text search 조합 안전 리네이밍 |
| `trace()` | 실행 흐름 추적 |
| `cypher()` | 원시 Cypher 쿼리 |

## 💡 실용적 평가 / 적용

### 설계 포인트 (참고할 만한 것)

1. **Tree-sitter + 그래프 DB 조합** — AST로 심볼 추출 → 관계를 엣지로 저장 → Cypher 쿼리로 영향 범위 분석. 이 패턴 자체는 라이선스 무관하게 참고 가능
2. **Leiden 클러스터링** — 수동 모듈 분류 없이 관계 밀도로 자동 Community 생성. 대규모 코드베이스에서 유용
3. **confidence + reason 메타데이터** — 엣지에 확신도를 붙여 fuzzy match와 확실한 import를 구분. 분석 신뢰도 제어에 좋은 패턴
4. **defer_loading 패턴** — MCP 도구 스텁만 노출, 필요 시 전체 로드 (프롬프트 캐싱 최적화와도 연결)

### RPG와의 비교

| | RPG (우리) | GitNexus |
|---|---|---|
| 저장 | 마크다운 (제텔카스텐) | 그래프 DB (KuzuDB) |
| 파싱 | 사람이 읽고 정리 | Tree-sitter AST 자동 |
| 관계 | wikilink 수동 연결 | 코드에서 자동 추출 |
| 강점 | 의도·설계 판단 기록 | 정확한 의존성·영향 범위 |
| 약점 | 코드 변경 시 문서 수동 갱신 | "왜 이렇게 만들었는지"는 모름 |

레이어가 다름: GitNexus = 구조적 사실(X-ray), RPG = 의미·맥락(설명서). 상호보완 가능.

### 한계

- **PolyForm Noncommercial 라이선스** — 회사 업무용 직접 사용 불가
- 정적 분석 한계 — 동적 호출(리플렉션, eval 등)은 추적 못함
- 언어 9개만 지원 (TypeScript, JS, Python, Java, C, C++, C#, Go, Rust)

## 🔗 관련 개념

- [[data-structure]] - 그래프 자료구조, AST 트리 구조
- [[architectures]] - 코드 아키텍처 분석 도구
- [[mcp-tool-patterns]] - MCP 도구 설계 패턴 (defer_loading)

---

**작성일**: 2026-02-23
**분류**: code-analysis / architecture
**출처**: https://github.com/abhigyanpatwari/GitNexus