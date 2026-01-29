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

## Observations

- [fact] Basic Memory는 문서 전체에서 패턴 매칭하므로 섹션 위치와 관계없이 파싱됨 #parsing
- [fact] `- [태그] [[링크]]` 형식은 어디서든 relation으로 인식됨 #parsing
- [fact] 검색은 SQLite FTS5 + unicode61 토크나이저 사용 #search
- [method] Observations는 `## Observations` 섹션에서만 사용 #usage
- [method] Relations는 `## Relations` 섹션에서만 사용 #usage

---

## 1. Basic Memory란?

**Basic Memory**는 AI와 인간이 함께 지식을 구축하는 **로컬 우선(local-first) 지식 관리 시스템**입니다.

### 핵심 특징

| 특징              | 설명                                        |
| --------------- | ----------------------------------------- |
| **로컬 우선**       | 모든 데이터가 마크다운 파일로 로컬에 저장                   |
| **양방향 접근**      | 사용자와 AI 모두 노트를 읽고 쓸 수 있음                  |
| **지식 그래프**      | 시맨틱 연결로 개념 간 관계 탐색 가능                     |
| **MCP 지원**      | Claude Desktop, Claude Code, Cursor 등과 통합 |
| **Obsidian 호환** | 표준 마크다운 + 위키링크 형식 사용                      |

---

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

`[category]` 마커로 구조화된 **사실 기반** 정보입니다.

> **원칙**: 의견 배제, 사실 기반만. 한 observation = 한 가지 정보.

```markdown
## Observations

- [fact] Progressive Disclosure는 정보를 단계적으로 로드한다 #optimization
- [method] 먼저 목록만 보여주고, 필요시 상세 정보 로드 #implementation
- [decision] 파일 시스템 구조가 이 패턴을 구현하도록 선택했다 #architecture
```

**표준 카테고리 (6개, 사실 기반만):**

| 카테고리 | 용도 | 예시 |
|---------|------|------|
| `[fact]` | 객관적 사실 | "UTF-8은 1-4바이트 가변 인코딩이다" |
| `[method]` | 방법, 절차 | "Pour over는 중간 분쇄도를 사용한다" |
| `[decision]` | 선택/결정 기록 | "리눅스는 GPL로 공개했다" |
| `[example]` | 구체적 사례 | "Redis는 인메모리 캐시의 예다" |
| `[reference]` | 참고자료 | "RFC 3629 - UTF-8 명세" |
| `[question]` | 미해결 질문 | "온도가 추출에 어떤 영향?" |

**❌ 제거된 카테고리** (의견 포함):
- ~~`[insight]`~~ → `[fact]`로 통합
- ~~`[tip]`~~ → 의견 포함
- ~~`[warning]`~~ → 의견 포함
- ~~`[path]`~~ → 제거

### 2.3 Relations (관계)

`- relation_type [[대상]] (context)` 형식으로 노트 간 연결을 정의합니다.

> **⚠️ 핵심**: WikiLink 뒤 `(괄호)` 안의 내용이 DB의 `context` 필드에 자동 저장됩니다!

```markdown
## Relations

- extends [[lazy-tool-loader|LazyToolLoader Pattern]] (builds on deferred loading)
- part_of [[four-bucket-optimization|Four-Bucket Optimization]] (Select 전략의 구성요소)
- mitigates [[lost-in-middle|Lost-in-Middle]] (중간 컨텍스트 문제 완화)
- relates_to [[observation-masking|Observation Masking]] (유사한 선택적 정보 표시)
- used_by [[token-optimization-strategy|Token Optimization Strategy]] (토큰 최적화에 활용)
```

**DB 저장 결과:**

| relation_type | to_name | context |
|---------------|---------|---------|
| `extends` | lazy-tool-loader | builds on deferred loading |
| `part_of` | four-bucket-optimization | Select 전략의 구성요소 |
| `mitigates` | lost-in-middle | 중간 컨텍스트 문제 완화 |

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
| `has_guide` | 가이드 보유 | A가 B 가이드를 가짐 |
| `organizes` | 조직/관리 | A가 B를 조직함 |
| `connects_to` | 연결 | A가 B와 연결됨 |
| `derived_from` | 도출 | A가 B에서 도출됨 (지식 합성) |

### 2.4 지식 도출 (Derived Knowledge)

facts 조합에서 새로운 지식이 도출되면 `derived_from` relation으로 출처를 추적합니다.

```markdown
# Context Positioning Strategy (04. notes/)

## Observations
- [method] 중요한 정보는 시작/끝에 배치한다 #positioning

## Relations
- derived_from [[Context Engineering]] (컨텍스트 윈도우 제한에서 도출)
- derived_from [[Lost-in-Middle 현상]] (중간 망각 현상에서 도출)
```

**지식 형성 흐름:**
```
[fact] A: LLM은 컨텍스트 윈도우 안에서만 본다
[fact] B: 중간 정보는 잘 잊혀진다
         ↓ (조합/추론)
[note] C: 중요한 정보는 시작/끝에 배치하라
         - derived_from [[A 출처]]
         - derived_from [[B 출처]]
```

### 2.5 폴더 구조

| 폴더 | 목적 | relation |
|------|------|----------|
| `01. concepts/` | 기본 개념 정의 | `extends`, `part_of` 등 |
| `02. hubs/` | 개념 조직화 | `organizes`, `connects_to` |
| `03. sources/` | 외부 자료, 가이드 | `references`, `has_guide` |
| `04. notes/` | 도출된 지식 | `derived_from` 필수 |

---

## 3. 파싱 동작 방식 (중요!)

### 3.1 핵심 원리

Basic Memory는 **문서 전체**에서 다음 패턴을 찾아 파싱합니다:

```
Observation: - [category] 내용 #tag
Relation:    - something [[target]]
```

**주의**: `## Observations`나 `## Relations` 섹션 여부와 **관계없이** 문서 어디서든 위 패턴이 발견되면 파싱됩니다.

### 3.2 잘못된 파싱 예시 (실제 테스트 결과)

**문제가 되는 작성 방식:**

```markdown
## 인덱싱 (루만식)

- [index:1] [[Category]] - 설명     ← ❌ relation_type: "[index:1]"로 파싱됨!
- [index:2] [[Types]] - 설명        ← ❌ relation_type: "[index:2]"로 파싱됨!

## 학습 경로

- [path] **Rust 실전**: [[guide]]   ← ❌ relation_type: "[path] **Rust 실전**:"로 파싱됨!

## 참고

> 🦀 실습: [[rust-guide]]           ← ❌ relation_type: "🦀"로 파싱됨!
```

**실제 DB 저장 결과:**

| relation_type | to_name |
|---------------|---------|
| `[index:1]` | Category |
| `[index:2]` | Types |
| `[path] **Rust 실전**:` | guide |
| `🦀` | rust-guide |
| `**` | some-doc |

### 3.3 올바른 작성 방식

**수정된 예시:**

```markdown
## Observations

- [fact] 학습 경로는 Quick Start → Theoretical → 실전 순서다 #learning
- [method] Rust 실전 경로: 챕터별 → 개념별 → 프로젝트 기반 #rust

## 인덱싱 (루만식)

- (1) Category - 설명               ← ✅ 괄호 사용, wikilink 없음
- (2) Types - 설명                  ← ✅ relation으로 파싱 안 됨

## 참고

> 실습 가이드: Rust Developers       ← ✅ wikilink 제거

## Relations

- has_guide [[Category]] (카테고리 개념 가이드)
- implements [[Types]] (타입 시스템 구현)
- connects_to [[rust-guide]] (Rust 가이드 연결)
```

> **핵심**: `]] (괄호)` 형식으로 context를 넣어야 DB에 저장됩니다. `]] - 설명` 형식은 context가 저장되지 않습니다!

### 3.4 피해야 할 패턴

| 패턴 | 문제 | 대안 |
|------|------|------|
| `- [index:N] [[링크]]` | `[index:N]`이 relation_type으로 파싱 | `- (N) 텍스트` 또는 `- N. 텍스트` |
| `- [태그] **볼드**: [[링크]]` | 전체가 relation_type으로 파싱 | Relations 섹션에서만 wikilink 사용 |
| `> 🦀 [[링크]]` | 이모지가 relation_type으로 파싱 | blockquote에서 wikilink 제거 |
| 테이블 안 `[[링크\|표시]]` | 예상치 못한 파싱 | 테이블에서 일반 텍스트 사용 |
| `## 아무섹션` 안에서 `- 뭔가 [[링크]]` | relation으로 인식될 수 있음 | Relations 섹션에서만 wikilink 사용 |

### 3.5 검색 관련 (FTS5 + unicode61)

Basic Memory는 SQLite FTS5를 사용하며, 기본 토크나이저는 `unicode61`입니다.

**한글 검색 특성:**

| 검색어 | 저장된 텍스트 | 결과 |
|--------|-------------|------|
| "인코딩" | "인코딩 문제" | ✅ 찾음 |
| "인코" | "인코딩 문제" | ⚠️ prefix 매칭으로 찾을 수 있음 |
| "문제" | "문제가 발생" | ⚠️ "문제"와 "문제가"는 다른 토큰 |

**참고**: 한글 형태소 분석이 없어서 조사가 붙은 단어는 별개 토큰으로 처리됩니다.

---

## 4. MCP 도구 완전 레퍼런스

### 4.1 노트 관리

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

### 4.2 검색 및 탐색

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

#### build_context (핵심 도구)
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

### 4.3 프로젝트 관리

#### list_memory_projects
사용 가능한 프로젝트 목록 조회. **세션 시작 시 호출 권장.**

#### create_memory_project / delete_project
새 프로젝트 생성/삭제.

### 4.4 시각화

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

---

## 5. 프로젝트 모드

| 모드                     | 설명                       | 사용         |
| ---------------------- | ------------------------ | ---------- |
| **Multi-Project** (기본) | 매 호출마다 project 지정        | 여러 KB 관리 시 |
| **Default Project**    | 설정에서 기본 프로젝트 지정          | 단일 KB 사용 시 |
| **Single Project**     | `--project name`으로 세션 고정 | CLI 사용 시   |

---

## 6. Best Practices

### 6.1 노트 템플릿

```markdown
---
title: 개념 이름
type: concept | pattern | architecture | guide | hub
tags:
  - category1
  - category2
permalink: custom/path/if-needed
---

# 개념 이름

한 줄 정의.

## 개요

상세 설명.

## Observations

- [fact] 객관적 사실 #tag
- [method] 방법이나 절차 #tag
- [decision] 선택/결정 기록 #tag
- [example] 구체적 사례 #tag

## 본문 내용

여기서는 wikilink 없이 일반 텍스트로 작성.
인덱싱이나 목록은 (1), (2) 형식 사용.

## Relations

- relation_type [[대상노트]] (관계 설명/맥락)
- relation_type [[대상노트|표시이름]] (관계 설명/맥락)
```

### 6.2 관계 작성 팁

1. **명시적 관계 타입 사용**: `relates_to`보다 `extends`, `implements` 등 구체적 타입 선호
2. **양방향 고려**: A extends B면, B 노트에도 `extended_by A` 고려
3. **⚠️ Context는 괄호로**: `- extends [[A]] (이유나 맥락)` ← 괄호 필수!
4. **Forward Reference 활용**: 아직 없는 노트도 참조 가능 (나중에 자동 연결)
5. **Relations 섹션에서만 wikilink 사용**: 다른 섹션에서는 일반 텍스트로

> **중요**: `]] - 설명` 형식은 context가 DB에 저장되지 않습니다. 반드시 `]] (설명)` 형식을 사용하세요!

### 6.3 검색 워크플로우

```
1. search_notes로 관련 노트 찾기
2. read_note로 내용 확인
3. build_context로 관계 탐색
4. write_note로 새 지식 추가
```

### 6.4 컨텍스트 구축

```
# 특정 개념의 관계망 탐색
build_context(url="memory://Progressive Disclosure", depth=2)

# 폴더 전체 최근 활동
build_context(url="memory://knowledge/_concepts/*", timeframe="7d")

# 패턴으로 여러 노트 탐색
build_context(url="memory://context-*", depth=1)
```

---

## 7. 흔한 오류와 해결

| 오류 | 원인 | 해결 |
|------|------|------|
| `Project required` | Multi-project 모드에서 project 누락 | `project="프로젝트명"` 추가 |
| `Unresolved relations` | 대상 노트가 아직 없음 | 정상 - 나중에 자동 연결됨 |
| `Note not found` | 식별자 오류 | 제목, permalink, 파일경로 중 하나 시도 |
| `Operation failed` | edit_note operation 오타 | append, prepend, find_replace, replace_section 확인 |
| 이상한 relation_type 저장 | 본문에서 `- [태그] [[링크]]` 사용 | Relations 섹션에서만 wikilink 사용 |
| 검색 결과 누락 | 한글 조사 차이 | 다양한 형태로 검색 시도 |

---

## 8. 실제 테스트 결과 요약

| 도구 | 테스트 | 결과 |
|------|--------|------|
| write_note | 노트 생성 + observations/relations | ✅ 정상 파싱 |
| edit_note | append operation | ✅ 끝에 추가됨 |
| recent_activity | timeframe="today" | ✅ 자연어 지원 |
| build_context | 와일드카드 + depth=2 | ✅ 관계 탐색 |
| canvas | 노드+엣지 생성 | ✅ Obsidian 호환 |
| list_directory | glob 필터 | ✅ 파일 목록 |
| delete_note | 노트 삭제 | ✅ DB+파일 삭제 |
| 파싱 테스트 | `[index:N] [[링크]]` 형식 | ❌ 잘못된 relation 생성 |
| 파싱 테스트 | Relations 섹션만 사용 | ✅ 정상 파싱 |
| **context 테스트** | `]] - 설명` 형식 | ❌ context 저장 안됨 |
| **context 테스트** | `]] (설명)` 형식 | ✅ context 정상 저장 |

### Context 파싱 핵심 (2026-01-29 테스트)

```markdown
# ❌ Context 저장 안됨
- extends [[A]] - 설명

# ✅ Context 정상 저장
- extends [[A]] (설명)
```

**DB 확인 결과**: `(괄호)` 형식만 relation 테이블의 `context` 필드에 저장됨

---

## Relations

- relates_to [[claude-memory-tools]] (Claude 메모리 시스템 관련)
- relates_to [[knowledge-capture-heuristics]] (지식화 기준)
- implements [[knowledge-refinement-pipeline]] (지식 정제 파이프라인)
- used_by [[progressive-disclosure]] (점진적 정보 공개 패턴)

---

**난이도**: 중급
**카테고리**: Setup & Guides
**마지막 업데이트**: 2026년 1월
**출처**: docs.basicmemory.com + 실제 테스트 (2026-01-29 context 파싱 규칙 업데이트)
