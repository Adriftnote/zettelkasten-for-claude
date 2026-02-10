---
name: rpg
description: 소스 코드를 분석하여 RPG (Repository Planning Graph) 문서를 생성합니다. project, module, function, class 노드를 자동 생성하고 양방향 Relations로 트리 연결.
---

# RPG Document Creator

소스 코드를 분석하여 zettelkasten 프로젝트(basic-memory)에 코드 문서를 생성합니다.

> **목적**: 코드베이스를 그래프 구조(project→module→function/class)로 관리하여 LLM이 검색 가능한 형태로 구조화

## 사용법

```
/rpg [파일경로 | 폴더경로 | 모듈명]
```

### 예시

```
/rpg C:\path\to\script.py              → 단일 파일 문서화
/rpg C:\path\to\project\               → 폴더 전체 문서화
/rpg vecsearch                         → 기존 모듈 업데이트
/rpg                                   → 대화 내용에서 생성
```

## 실행 절차

### Step 1: 입력 판단

| 입력 | 처리 |
|------|------|
| 파일 경로 (.py, .js 등) | 해당 파일 Read → 분석 |
| 폴더 경로 | 폴더 내 소스 파일 Glob → 각 파일 분석 |
| 기존 모듈명 | RPG에서 read_note → 소스 파일 Read → 업데이트 |
| 인자 없음 | 대화에서 논의된 코드 기반 생성 |

### Step 2: 소스 코드 분석

파일을 Read하고 구조를 파악:

1. **모듈 수준**: 파일의 목적, 전역 변수/상수, 의존성
2. **함수 목록**: 모든 `def`/`function` 추출 (시그니처, 로직, 반환값)
3. **클래스 목록**: 모든 `class` 추출 (메서드, 속성)
4. **호출 관계**: 함수 간 calls, data_flows_to 파악

### Step 3: 소속 프로젝트 확인

기존 프로젝트에 속하는지 확인:

```
mcp__basic-memory__list_directory
dir_name: /projects
project: zettelkasten
```

- 기존 프로젝트에 속하면 → 해당 프로젝트에 연결
- 새 프로젝트면 → 사용자에게 프로젝트 생성 여부 확인

### Step 4: 문서 생성 (계층순: project → module → function/class)

---

#### 4-1. Project (허브 노트)

**프론트매터:**

```yaml
---
title: [프로젝트명]
type: project
level: high
category: "[area/category]"
permalink: projects/[slug]
path: "[실제 경로]"
tags:
- [태그들]
---
```

**본문:**

```markdown
# [프로젝트명]

[한 줄 설명]

## 개요

[프로젝트 설명 2-3문장]

## 코드 구성

**모듈**
- [모듈명]: [설명]

**함수 ([그룹명])**
- [함수명]: [설명]

**함수 ([다른 그룹명])**
- [함수명]: [설명]

## Relations

- contains [[모듈A]] (설명)
- contains [[모듈B]] (설명)
- extends/depends_on [[외부]] (설명)
```

**규칙:**
- Observations 없음
- 코드 구성 섹션에서 모듈/함수를 그룹별로 나열 (텍스트, wikilink 아님)
- Relations에서 contains로 모듈만 연결

---

#### 4-2. Module (파일 단위)

**프론트매터:**

```yaml
---
title: [모듈명]
type: module
level: high
category: "[area/category/sub]"
semantic: "[verb object phrase]"
permalink: modules/[slug]
path: "[실제 파일 경로]"
tags:
- [언어]
- [기술태그]
---
```

**본문:**

```markdown
# [모듈명]

[한 줄 설명]

## 개요

[모듈 설명]

## Observations

- [impl] 구현 방식 #태그
- [deps] 의존성 목록 #import
- [usage] `사용 예시`
- [note] 참고사항 #context

## [자유 섹션 - 아키텍처, 스키마, 동작 흐름 등]

## Relations

- part_of [[프로젝트명]] (소속 프로젝트)
- contains [[함수명A]] (설명)
- contains [[함수명B]] (설명)
- contains [[클래스명]] (설명)
- depends_on/uses/extends [[외부 의존성]] (설명)
```

**규칙:**
- **contains 필수** - 모든 하위 함수/클래스를 나열
- **part_of 필수** - 소속 프로젝트 연결
- 자유 섹션으로 아키텍처, DB 스키마, 동작 흐름 등 추가 가능

---

#### 4-3. Function (함수 단위)

**프론트매터:**

```yaml
---
title: [함수명-kebab-case]
type: function
level: low
category: "[area/category/sub]"
semantic: "[verb object]"
permalink: functions/[slug]
path: "[실제 파일 경로]"
tags:
- [언어]
---
```

**본문:**

```markdown
# [함수명]

[한 줄 설명]

## 시그니처

｀｀｀python
def function_name(param: Type, param2: Type) -> ReturnType
｀｀｀

## Observations

- [impl] 구현 방식/알고리즘 #algo
- [impl] 세부 로직 #pattern
- [return] 반환값 설명
- [usage] `사용 예시`
- [deps] 의존성 #import
- [note] 주의사항 #caveat

## [선택 섹션 - SQL 쿼리, 데이터 흐름 등]

## Relations

- part_of [[모듈명]] (소속 모듈)
- calls [[다른함수]] (호출)
- data_flows_to [[다른함수]] (데이터 흐름)
```

**규칙:**
- **part_of 필수** - 소속 모듈 연결
- 시그니처 섹션에 함수 선언부 코드 블록
- main 함수는 `main-[모듈명]`으로 네이밍

---

#### 4-4. Class (클래스 단위)

**프론트매터:**

```yaml
---
title: [클래스명-kebab-case]
type: class
level: low
category: "[area/category/sub]"
semantic: "[verb object]"
permalink: classes/[slug]
path: "[실제 파일 경로]"
tags:
- [언어]
---
```

**본문:**

```markdown
# [클래스명]

[한 줄 설명]

## 인터페이스

｀｀｀python
class ClassName:
    def __init__(self, ...): ...
    def method_a(self, ...): ...
｀｀｀

## Observations

- [impl] 구현 패턴 #pattern
- [deps] 의존성 #import
- [usage] `사용 예시`
- [note] 주의사항 #caveat

## Relations

- part_of [[모듈명]] (소속 모듈)
- contains [[메서드명]] (포함된 메서드)
- implements [[인터페이스]] (구현)
```

---

### Step 5: 저장

각 문서를 basic-memory RPG 프로젝트에 저장:

```
mcp__basic-memory__write_note
title: [제목]
folder: projects | modules | functions | classes
project: zettelkasten
content: [작성된 내용]
```

기존 문서 업데이트 시:

```
mcp__basic-memory__edit_note
identifier: [permalink]
project: zettelkasten
operation: replace_section
section: Relations
content: [수정된 Relations]
```

### Step 6: 트리 검증

생성 후 build_context로 연결 확인:

```
mcp__basic-memory__build_context
url: [프로젝트 또는 모듈 permalink]
project: zettelkasten
depth: 2
```

project에서 depth 2로 탐색 시 module→function까지 트리가 보여야 정상.

## 네이밍 규칙

| 항목 | 변환 규칙 | 예시 |
|------|----------|------|
| 함수명 | snake_case → kebab-case | `check_duplicates` → `check-duplicates` |
| 클래스명 | PascalCase → kebab-case | `UserValidator` → `user-validator` |
| 모듈명 | 파일명 그대로 (확장자 제거) | `vecsearch.py` → `vecsearch` |
| main 함수 | `main-[모듈명]` | main() in vecsearch.py → `main-vecsearch` |
| JS 메서드 | camelCase → kebab-case | `handleClick` → `handle-click` |

## Observation 카테고리

| 카테고리 | 용도 | 태그 예시 |
|---------|------|----------|
| `[impl]` | 구현 방식, 알고리즘 | `#algo`, `#pattern`, `#regex` |
| `[return]` | 반환값 설명 | `#type` |
| `[usage]` | 사용법, 호출 예시 | `#cli` |
| `[deps]` | 의존성 (import) | `#import` |
| `[note]` | 참고사항, 주의점 | `#context`, `#caveat`, `#performance` |

## Relations 패턴

| relation | 방향 | 용도 | 예시 |
|----------|------|------|------|
| `contains` | 부모→자식 | 계층 | project→module, module→function |
| `part_of` | 자식→부모 | 소속 | function→module, module→project |
| `calls` | A→B | 함수 호출 | func-a calls func-b |
| `data_flows_to` | A→B | 데이터 흐름 | parser → validator |
| `depends_on` | A→B | 외부 의존성 | module depends_on library |
| `extends` | A→B | 기능 확장 | vecsearch extends basic-memory |
| `implements` | A→B | 인터페이스 구현 | class implements interface |
| `uses` | A→B | 라이브러리 사용 | module uses sqlite-vec |
| `watches` | A→B | 감시 | watcher watches db |

## 타입별 필수 체크리스트

### project
- [ ] Observations 없음
- [ ] 코드 구성 섹션에 모듈/함수 그룹별 나열
- [ ] Relations: contains로 모든 모듈 연결

### module
- [ ] Observations: [impl], [deps] 최소 포함
- [ ] Relations: part_of [[프로젝트]] 있음
- [ ] Relations: contains로 **모든** 함수/클래스 연결
- [ ] 자유 섹션 (아키텍처, 스키마 등) 필요 시 추가

### function
- [ ] 시그니처 섹션에 함수 선언부 코드 블록
- [ ] Observations: [impl], [return] 최소 포함
- [ ] Relations: part_of [[모듈]] 있음
- [ ] 다른 함수 호출 시 calls 연결

### class
- [ ] 인터페이스 섹션에 클래스 구조 코드 블록
- [ ] Observations: [impl] 최소 포함
- [ ] Relations: part_of [[모듈]] 있음
- [ ] 메서드가 별도 함수 노드면 contains 연결

## 핵심 규칙

1. **양방향 Relations 필수** - contains↔part_of 반드시 쌍으로 작성
2. **모든 함수/클래스 문서화** - 유틸리티 함수도 포함 (인라인 코드만 제외)
3. **인라인 코드는 노드 안 만듦** - 모듈의 "주요 로직" 섹션에 텍스트로 설명
4. **semantic은 verb-object** - 일관된 의미 표현 ("load csv", "validate user")
5. **category는 area/cat/sub** - 의미 계층으로 분류 (폴더 구조와 별개)
6. **wikilink는 Relations에서만** - 테이블, blockquote에 wikilink 금지
7. **build_context로 검증** - 생성 후 반드시 depth 2 트리 확인
8. **기존 프로젝트 업데이트 시** - 프로젝트의 코드 구성 + Relations도 함께 업데이트
