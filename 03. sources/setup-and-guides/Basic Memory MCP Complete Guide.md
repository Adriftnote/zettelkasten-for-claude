---
title: Basic Memory MCP Complete Guide
type: guide
tags:
  - mcp
  - basic-memory
  - knowledge-graph
  - setup
permalink: knowledge/guides/basic-memory-mcp-guide
category: Setup & Guides
difficulty: 중급
extraction_status: pending
---

# Basic Memory MCP Complete Guide

외부 문서 조사와 실제 테스트를 통해 정리한 Basic Memory MCP 완전 가이드입니다.

## 1. Basic Memory란?

**Basic Memory**는 AI와 인간이 함께 지식을 구축하는 **로컬 우선(local-first) 지식 관리 시스템**입니다.

### 핵심 특징

| 특징 | 설명 |
|------|------|
| **로컬 우선** | 모든 데이터가 마크다운 파일로 로컬에 저장 |
| **양방향 접근** | 사용자와 AI 모두 노트를 읽고 쓸 수 있음 |
| **지식 그래프** | 시맨틱 연결로 개념 간 관계 탐색 가능 |
| **MCP 지원** | Claude Desktop, Claude Code, Cursor 등과 통합 |
| **Obsidian 호환** | 표준 마크다운 + 위키링크 형식 사용 |

## 2. 지식 그래프 구조

Basic Memory는 세 가지 핵심 요소로 지식 그래프를 구성합니다:

### 2.1 Entities (엔티티)

파일 = 엔티티. 각 마크다운 파일이 하나의 개념/주제를 나타냅니다.

```yaml
---
title: Progressive Disclosure
type: pattern
permalink: knowledge/concepts/progressive-disclosure
tags:
  - context-engineering
  - optimization
---
```

### 2.2 Observations (관찰)

`[category]` 마커로 구조화된 사실/정보입니다.

```markdown
## Observations

- [fact] Progressive Disclosure는 정보를 단계적으로 로드합니다 #optimization
- [tip] 먼저 목록만 보여주고, 필요시 상세 정보 로드 #best-practice
- [decision] 파일 시스템 구조가 자연스럽게 이 패턴을 구현 (2026-01 결정)
```

**자주 쓰는 카테고리:**
- `[fact]` - 객관적 사실
- `[tip]` - 팁/조언
- `[decision]` - 결정 사항
- `[tech]` - 기술적 세부사항
- `[feature]` - 기능 설명
- `[requirement]` - 요구사항

### 2.3 Relations (관계)

`- relation_type [[대상]]` 형식으로 노트 간 연결을 정의합니다.

```markdown
## Relations

- extends [[lazy-tool-loader|LazyToolLoader Pattern]] - builds on deferred loading
- part_of [[four-bucket-optimization|Four-Bucket Optimization]] - Select 전략의 구성요소
- mitigates [[lost-in-middle|Lost-in-Middle]] - 중간 컨텍스트 문제 완화
- relates_to [[observation-masking|Observation Masking]] - 유사한 선택적 정보 표시
- used_by [[token-optimization-strategy|Token Optimization Strategy]] - 토큰 최적화에 활용
```

**표준 관계 타입:**

| 타입 | 의미 | 예시 |
|------|------|------|
| `relates_to` | 일반적 관련성 | A relates_to B |
| `extends` | 확장/발전 | A가 B를 확장 |
| `part_of` | 구성요소 | A는 B의 일부 |
| `implements` | 구현 | A가 B를 구현 |
| `depends_on` | 의존성 | A가 B에 의존 |
| `used_by` | 사용됨 | A가 B에서 사용됨 |
| `mitigates` | 완화/해결 | A가 B 문제를 완화 |
| `similar_to` | 유사성 | A와 B가 유사 |
| `inspired_by` | 영감 | A가 B에서 영감 |
| `contains` | 포함 | A가 B를 포함 |

## 3. MCP 도구 완전 레퍼런스

### 3.1 노트 관리

#### write_note
새 노트를 생성하거나 기존 노트를 업데이트합니다.

```
Parameters:
- title (필수): 노트 제목
- content (필수): 마크다운 내용
- folder (필수): 저장 폴더 경로
- tags (선택): 태그 배열 또는 문자열
- project (필수*): 프로젝트 이름
```

**테스트 결과:**
- Observations와 Relations가 자동으로 파싱되어 지식 그래프에 추가됨
- Unresolved relations는 대상 노트 생성 시 자동 연결됨
- tags는 배열 `["tag1", "tag2"]` 형식 권장

#### read_note
노트 내용과 관련 지식을 읽습니다.

```
Parameters:
- identifier (필수): 제목, permalink, 또는 memory:// URL
- project (필수*)
- page, page_size: 페이지네이션
```

#### edit_note
기존 노트를 수정합니다.

```
Parameters:
- identifier (필수): 노트 식별자
- operation (필수): append | prepend | find_replace | replace_section
- content (필수): 추가/교체할 내용
- find_text: find_replace 시 찾을 텍스트
- section: replace_section 시 섹션명
- project (필수*)
```

**테스트 결과:**
- `append`: 노트 끝에 내용 추가 ✅
- `prepend`: 노트 시작(frontmatter 이후)에 추가
- `find_replace`: 특정 텍스트 교체
- `replace_section`: `## 섹션명` 전체 교체

#### move_note / delete_note
노트 이동 및 삭제. 링크와 인덱스 자동 업데이트.

### 3.2 검색 및 탐색

#### search_notes
지식 베이스 전체 검색.

```
Parameters:
- query (필수): 검색어
- project (필수*)
- search_type: "text" (기본) | "semantic"
- entity_types: 필터링할 엔티티 타입 배열
- page, page_size: 페이지네이션
- after_date: 날짜 이후 필터
```

#### build_context ⭐ 핵심 도구
memory:// URL로 관련 컨텍스트를 구축합니다.

```
Parameters:
- url (필수): memory:// URL
- depth: 관계 탐색 깊이 (1, 2, 3...)
- max_related: 최대 관련 항목 수
- timeframe: "today", "7d", "last week" 등
- project (필수*)
```

**memory:// URL 형식:**

| 형식 | 예시 | 설명 |
|------|------|------|
| 제목으로 | `memory://Progressive Disclosure` | 제목 직접 참조 |
| Permalink로 | `memory://knowledge/concepts/progressive-disclosure` | 고유 경로 |
| 경로로 | `memory://knowledge/_concepts/*` | 폴더 전체 |
| 와일드카드 | `memory://auth*` | 패턴 매칭 |

**테스트 결과:**
- depth=1: 직접 연결된 관계만
- depth=2: 2단계까지 탐색 (관계의 관계)
- 와일드카드 `*` 패턴 지원 확인 ✅

#### recent_activity
최근 활동 조회.

```
Parameters:
- timeframe: "today", "yesterday", "last week", "7d", "30d"
- project (선택): 생략 시 전체 프로젝트
- type: 필터링할 타입
- depth: 관계 탐색 깊이
```

**테스트 결과:**
- 자연어 timeframe 지원: "today", "2 days ago", "last week" ✅
- project 생략 시 크로스 프로젝트 뷰 제공

#### list_directory
폴더 구조 탐색.

```
Parameters:
- dir_name: 폴더 경로 (기본: "/")
- depth: 탐색 깊이
- file_name_glob: 파일명 필터 ("*.md")
- project (필수*)
```

### 3.3 프로젝트 관리

#### list_memory_projects
사용 가능한 프로젝트 목록 조회. **세션 시작 시 호출 권장.**

#### create_memory_project / delete_project
새 프로젝트 생성/삭제.

### 3.4 시각화

#### canvas
Obsidian 캔버스 파일 생성.

```
Parameters:
- title (필수): 캔버스 제목
- folder (필수): 저장 폴더
- nodes (필수): 노드 배열 [{id, type, text, x, y, width, height}]
- edges (필수): 연결 배열 [{id, fromNode, toNode, label}]
- project (필수*)
```

**테스트 결과:**
- type: "text" | "file" | "link" | "group"
- 생성된 .canvas 파일은 Obsidian에서 바로 열림 ✅

## 4. 프로젝트 모드

| 모드                     | 설명                       | 사용         |
| ---------------------- | ------------------------ | ---------- |
| **Multi-Project** (기본) | 매 호출마다 project 지정        | 여러 KB 관리 시 |
| **Default Project**    | 설정에서 기본 프로젝트 지정          | 단일 KB 사용 시 |
| **Single Project**     | `--project name`으로 세션 고정 | CLI 사용 시   |

## 5. Best Practices

### 5.1 노트 작성

```markdown
---
title: 개념 이름
type: concept | pattern | architecture | guide
tags:
  - category1
  - category2
permalink: custom/path/if-needed
---

# 개념 이름

한 줄 정의.

## 📖 개요

상세 설명.

## Observations

- [category] 관찰 내용 #tag (컨텍스트)
- [category] 또 다른 관찰 #tag

## Relations

- relation_type [[대상노트|표시이름]] - 관계 설명
- relation_type [[대상노트]] - 설명
```

### 5.2 관계 작성 팁

1. **명시적 관계 타입 사용**: `relates_to`보다 `extends`, `implements` 등 구체적 타입 선호
2. **양방향 고려**: A extends B면, B 노트에도 `extended_by A` 고려
3. **관계 설명 추가**: `- extends [[A]] - 이유나 맥락`
4. **Forward Reference 활용**: 아직 없는 노트도 참조 가능 (나중에 자동 연결)

### 5.3 검색 워크플로우

```
1. search_notes로 관련 노트 찾기
2. read_note로 내용 확인
3. build_context로 관계 탐색
4. write_note로 새 지식 추가
```

### 5.4 컨텍스트 구축

```
# 특정 개념의 관계망 탐색
build_context(url="memory://Progressive Disclosure", depth=2)

# 폴더 전체 최근 활동
build_context(url="memory://knowledge/_concepts/*", timeframe="7d")

# 패턴으로 여러 노트 탐색
build_context(url="memory://context-*", depth=1)
```

## 6. 흔한 오류와 해결

| 오류 | 원인 | 해결 |
|------|------|------|
| `Project required` | Multi-project 모드에서 project 누락 | `project="프로젝트명"` 추가 |
| `Unresolved relations` | 대상 노트가 아직 없음 | 정상 - 나중에 자동 연결됨 |
| `Note not found` | 식별자 오류 | 제목, permalink, 파일경로 중 하나 시도 |
| `Operation failed` | edit_note operation 오타 | append, prepend, find_replace, replace_section 확인 |

## 7. 실제 테스트 결과 요약

| 도구 | 테스트 | 결과 |
|------|--------|------|
| write_note | 노트 생성 + observations/relations | ✅ 정상 파싱 |
| edit_note | append operation | ✅ 끝에 추가됨 |
| recent_activity | timeframe="today" | ✅ 자연어 지원 |
| build_context | 와일드카드 + depth=2 | ✅ 관계 탐색 |
| canvas | 노드+엣지 생성 | ✅ Obsidian 호환 |
| list_directory | glob 필터 | ✅ 파일 목록 |
| delete_note | 노트 삭제 | ✅ DB+파일 삭제 |

## Relations

- relates_to [[claude-memory-tools|Claude Memory Tools]] - Claude 메모리 시스템 관련
- relates_to [[knowledge-capture-heuristics|Knowledge Capture Heuristics]] - 지식화 기준
- implements [[knowledge-refinement-pipeline|Knowledge Refinement Pipeline]] - 지식 정제 파이프라인
- used_by [[progressive-disclosure|Progressive Disclosure]] - 점진적 정보 공개 패턴

---

**난이도**: 중급
**카테고리**: Setup & Guides
**마지막 업데이트**: 2026년 1월
**출처**: docs.basicmemory.com + 실제 테스트
