---
title: RPG 구조 설계
type: note
permalink: shared/rpg-gujo-seolgye-1
tags:
- meta
- architecture
- rpg
---

# RPG 구조 설계

Repository Planning Graph의 폴더 구조와 노트 작성 규칙

## 📖 개요

RPG는 코드베이스를 그래프 구조로 관리하는 시스템입니다. 함수, 클래스, 모듈을 노드로, 의존성과 호출관계를 엣지로 표현합니다.

**핵심 목적**: 대규모 코드베이스를 LLM이 검색 가능한 형태로 구조화

## Observations

- [fact] RPG는 Repository Planning Graph의 약자 #naming
- [fact] 프로젝트 경로는 C:/claude-workspace/reference/code/ #location
- [method] 제텔카스텐의 허브노트 패턴을 코드 관리에 적용 #pattern
- [fact] 노드는 V_H(고수준/추상) + V_L(저수준/구체)로 구분 #논문
- [fact] 의미 태그는 verb-object 형식으로 정규화 #논문

## 폴더 구조

```
reference/code/
├── functions/    ← 함수 단위 노드 (V_L)
├── classes/      ← 클래스 단위 노드 (V_L)
├── modules/      ← 모듈/파일 단위 노드 (V_H or V_L)
├── projects/     ← 허브노트 (프로젝트별 코드 구성)
└── shared/       ← 메타/설정 문서
```

## 프론트매터 필드

```yaml
---
title: 함수/클래스명
type: function | class | module | project
level: high | low              # 추상화 수준 (high=추상, low=구체)
category: "area/cat/sub"       # 의미 계층 (폴더 구조와 별개)
semantic: "verb object"        # 정규화된 의미 태그 (project는 생략 가능)
path: "실제/파일/경로.py"
---
```

### level 기준

| type | level | 비고 |
|------|-------|------|
| `project` | `high` | 허브 노트 |
| `module` | `high` | 파일 단위 |
| `class` | `low` | 클래스 단위 |
| `function` | `low` | 함수 단위 |

### category 예시

```
validation/db/integrity    → 무결성 검증
validation/db/continuity   → 연속성 검증
validation/csv/report      → CSV 리포트
parsing/csv/extract        → CSV 파싱
search/file/pattern        → 파일 탐색
```

## 의미 태그 (verb-object)

코드의 의미를 **"동사 + 목적어"** 형식으로 일관되게 표현

| 코드 | semantic |
|-----|----------|
| `def load_csv()` | "load csv" |
| `class UserValidator` | "validate user" |
| `def send_email()` | "send email" |

## 연결 패턴

```
projects/my-project (허브)
    ├── modules/some-module
    │   ├── functions/func-a
    │   └── functions/func-b
    └── classes/some-class
```

## Relations 패턴

```markdown
## Relations

- contains [[하위노드]] (계층 - 부모→자식)
- depends_on [[노드]] (의존성 - import/require)
- calls [[함수]] (호출 관계)
- data_flows_to [[노드]] (데이터 흐름 - 추상적)
- implements [[인터페이스]] (구현)
- part_of [[모듈]] (소속)
```

## 노트 타입별 구조

| type | Observations | Relations | 비고 |
|------|-------------|-----------|------|
| `project` | ❌ 없음 | `contains [[module]]` | 허브 노트, 개요+코드구성만 |
| `module` | `[impl]`, `[deps]`, `[usage]` | `part_of`, `contains` | 파일 단위 |
| `function` | `[impl]`, `[return]`, `[usage]`, `[deps]`, `[note]` | `part_of`, `calls` | 함수 단위 |
| `class` | `[impl]`, `[deps]`, `[usage]`, `[note]` | `part_of`, `contains`, `implements` | 클래스 단위 |

## 코드용 Observation 카테고리

| 카테고리 | 용도 | 태그 예시 |
|---------|------|----------|
| `[impl]` | 구현 방식, 알고리즘 | `#algo`, `#pattern` |
| `[return]` | 반환값 설명 | `#type` |
| `[usage]` | 사용법, 호출 예시 | - |
| `[deps]` | 의존성 (import) | `#import` |
| `[note]` | 참고사항, 주의점 | `#context`, `#caveat` |

### 예시

```markdown
## Observations

- [impl] GROUP BY HAVING으로 중복 검출 #algo
- [return] 중복 키 리스트 (list[tuple])
- [usage] `duplicates = check_duplicates(cursor, 'table', ['key'])`
- [deps] sqlite3 #import
- [note] 대량 데이터시 성능 저하 가능 #caveat
```

## 노드 생성 기준

### 핵심 규칙

```
파일(.js, .py, .qmd) → type: module   → modules/ 폴더
함수(def, function)  → type: function → functions/ 폴더
인라인 코드          → 노트 안 만듦    → 모듈의 "주요 로직" 섹션
```

**판단 기준**: 코드가 독립된 파일인가? → module. 파일 안의 함수인가? → function.

### 인라인 코드

함수로 분리되지 않은 일회성 코드 블록은 **별도 노트를 만들지 않음**.

```
Project → Module → Function → [Inline]
                              ↑ 여기는 노드 안 만듦
```

대신 모듈 노트의 **"주요 로직"** 섹션에 텍스트로 설명:

```markdown
## 주요 로직

### CSV vs Summary 비교
｀｀｀python
차이율 = abs(CSV - DB) / CSV * 100
｀｀｀
```

### 실행 가능 문서

QMD, Jupyter Notebook 등 코드와 문서가 통합된 파일은 `type: module`로 취급:

| 확장자 | type | 비고 |
|--------|------|------|
| `.py` | module | 일반 Python 모듈 |
| `.qmd` | module | Quarto 마크다운 |
| `.ipynb` | module | Jupyter 노트북 |

## 작성 규칙

- Observations: `- [category] 내용 #태그` 형식
- Relations: `- relation_type [[대상]] (설명)` 형식
- wikilink는 Relations 섹션에서만 사용
- 테이블, blockquote에 wikilink 금지

## Relations

- based_on [[RPG (Repository Planning Graph)]] (논문 개념)
- based_on [[RPG 논문 시리즈 리뷰]] (논문 원본)
- applied_in [[_Vault Conventions]] (05. code 폴더 컨벤션으로 채택)