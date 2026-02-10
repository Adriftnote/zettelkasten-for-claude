---
title: Vault Conventions
type: index
permalink: index/vault-conventions
tags:
- index
- conventions
- meta
---

# Vault Conventions

이 볼트의 구조와 작성 규칙. 루만식 제텔카스텐을 기반으로 합니다.

## 볼트 철학

루만(Luhmann)의 제텔카스텐 3계층을 현대적으로 재해석:

```
Register (색인)            →  00. index     진입점. 큰 주제 영역으로 안내
     │
Strukturnoten (구조 노트)   →  02. hubs      주제 내 개념들을 조직화
     │
Zettel (개별 노트)          →  01. concepts  하나의 개념 = 하나의 노트
                               04. notes     개념들에서 도출된 지식
```

루만의 색인은 **일부러 빈약하게** 만든다 — 전체를 나열하지 않고, 주제별 진입점만 가리켜서 거기서부터 링크를 타고 탐색하게 하는 구조.

## 폴더 구조

| 폴더                      | 용도                     | 타입                        |      스킬      |
| ----------------------- | ---------------------- | ------------------------- | :----------: |
| `00. index`             | 색인 (최상위 진입점) + 볼트 메타   | `index`                   |      -       |
| `01. concepts`          | 개념 노트 (원자적 지식 단위)      | `concept`                 |  `/concept`  |
| `02. hubs`              | 허브 노트 (개념 조직화)         | `hub`                     |    `/hub`    |
| `03. sources/reference` | 외부 출처 (논문, 공식문서)       | `reference`               | `/reference` |
| `03. sources/workcases` | 업무 사례 (트러블슈팅, 학습)      | `workcase`                |  /workcase   |
| `04. notes`             | 도출된 지식 (facts 조합 → 결론) | `note`                    |   `/note`    |
| `05. code`              | 코드 구조 분석 (RPG)         | function, module, project |     /rpg     |

## 파일명 규칙

```
한글 이름 (English Name).md
```

**예시:**
- 인덱스: `일반 CS 개념 (General CS).md`
- 허브: `웹 기초 (Web Fundamentals).md`
- 컨셉: `ORM (Object-Relational Mapping).md`

Obsidian은 **파일명**으로 wikilink를 해석하므로 파일명 = 링크 대상.

## 노트 타입별 형식

### Index (색인)

```yaml
---
title: [색인 이름]
type: index
permalink: index/[slug]
tags:
- index
- [주제]
---
```

- **역할**: 큰 주제 영역의 진입점. 허브들을 연결하는 상위 구조
- **본문**: 전체 지도(ASCII) + Relations
- **Relations 대상**: 허브 노트 (`connects_to`)
- **원칙**: 직접 개념을 담지 않고, 허브로의 경로만 제공. Observation 없음 — 지식은 허브에

### Hub (허브)

```yaml
---
title: [허브 이름]
type: hub
permalink: hubs/[slug]
tags:
- hub
- [주제]
---
```

- **역할**: 주제 영역 내 개념들을 조직화하는 구조 노트
- **본문**: Observations + Relations (계층 구조)
- **Relations 대상**: 개념 노트 (`organizes`, `extends`) + 다른 허브 (`connects_to`)

### Concept (개념)

```yaml
---
title: [개념 이름]
type: concept
permalink: knowledge/concepts/[slug]
tags:
- [카테고리]
category: [분류]
difficulty: 초급 | 중급 | 고급
---
```

- **역할**: 하나의 개념 = 하나의 노트 (원자적 단위)
- **필수 섹션**:
  1. `# 제목` — 한 줄 정의
  2. `📖 개요` — 2-3문장 상세 설명
  3. `🎭 비유` — 일상적 비유 (선택)
  4. `✨ 특징` — 불릿 리스트
  5. `💡 예시` — 코드나 구체적 사례 (선택)
  6. `Relations` — 관계 링크

### Note (도출 지식)

```yaml
---
title: [도출된 지식 이름]
type: note
permalink: notes/[slug]
tags:
- [관련태그]
- derived
source_facts:
- [출처1]
- [출처2]
---
```

- **역할**: 여러 concept의 fact를 조합해 도출된 결론
- **필수**: `derived_from` relation, `도출 근거` 섹션
- **본문**: # 제목 → 도출 근거 (추론 과정) → Observations → Relations
- **핵심 질문**: "A이고, B이므로, 따라서 C다"

### Reference (외부 출처)

```yaml
---
title: [출처 이름]
type: reference
permalink: sources/reference/[slug]
tags:
- reference
- [주제]
---
```

- **역할**: 논문, 공식문서, 가이드 등 외부 지식 정리

## 05. code — RPG (Repository Planning Graph)

`05. code`는 제텔카스텐과 **다른 컨벤션**을 따른다. 같은 볼트에 두는 이유는 형식 통일이 아니라 **링크 연결** — 개념 노트와 실제 코드 사이를 wikilink로 오갈 수 있게 하기 위함.

### 구조

```
05. code/
├── projects/    ← 프로젝트 허브 (high level)
├── modules/     ← 파일/모듈 단위
├── functions/   ← 함수 단위 (atomic)
├── classes/     ← 클래스 정의
└── shared/      ← RPG 메타 문서
```

### Frontmatter (코드 전용)

```yaml
---
title: node-name
type: function | module | project | class
level: high | low
category: "area/category/sub"
semantic: "verb-object"
permalink: folder/slug
path: "actual/file/path.ext"
tags:
- [language]
---
```

제텔카스텐에 없는 고유 필드: `level`, `path`, `semantic`, `category` (3단 경로)

### Observation 카테고리 (코드 전용)

| 카테고리 | 용도 |
|---------|------|
| `[impl]` | 구현 세부사항, 알고리즘 |
| `[return]` | 반환값 설명 |
| `[deps]` | 의존성, import |
| `[usage]` | 사용 예시, 호출 패턴 |
| `[note]` | 주의사항, 맥락 |

### Relation 타입 (코드 전용)

| 타입 | 의미 |
|------|------|
| `contains` | 상위 → 하위 포함 |
| `part_of` | 하위 → 상위 소속 |
| `calls` | 함수 호출 관계 |
| `depends_on` | import/require 의존 |
| `data_flows_to` | 데이터 흐름 |
| `implements` | 인터페이스 구현 |

### 교차 링크 (제텔카스텐 ↔ 코드)

코드 노트에서 개념 노트로, 또는 그 반대로 연결 가능:

```markdown
# 코드 → 개념
- based_on [[ORM (Object-Relational Mapping)]] (이 모듈이 사용하는 개념)

# 개념 → 코드
- used_by [[call-graphql-x]] (실제 구현 사례)
```

---

## Observation 카테고리

| 카테고리 | 용도 | 예시 |
|---------|------|------|
| `[fact]` | 객관적 사실 | `[fact] LLM은 컨텍스트 윈도우 안에서만 본다 #context` |
| `[method]` | 방법, 절차 | `[method] TDD는 테스트 먼저 작성 #dev` |
| `[decision]` | 선택, 결정 | `[decision] TypeScript 도입 결정 #tech` |
| `[example]` | 구체적 사례 | `[example] React 컴포넌트 예시 #frontend` |
| `[reference]` | 참고자료 | `[reference] 공식문서 링크 #docs` |
| `[question]` | 미해결 질문 | `[question] 성능 최적화 방안? #todo` |

확장 카테고리: `[insight]` (통찰), `[pattern]` (반복 패턴), `[caution]` (주의사항)

## Relations 규칙

### Wikilink 원칙

- **Relations 섹션에서만** wikilink `[[ ]]` 사용
- 본문에서 개념 언급 시 `#태그` 또는 일반 텍스트
- 테이블, blockquote에 wikilink 금지

### 기본 형식

```markdown
## Relations

- relation_type [[대상 노트 (English Name)]] (설명)
```

### 계층 표현 (허브/인덱스)

```markdown
- organizes [[A]] (1. 설명)
  - extends [[B]] (1a. 파생)
    - part_of [[C]] (1a1. 세부)
- organizes [[D]] (2. 설명)
- connects_to [[다른 허브]] (허브 간 연결)
```

들여쓰기 2칸, 번호 매기기는 루만식 (1, 1a, 1a1).

### 주요 relation_type

| 타입 | 의미 | 주 사용처 |
|------|------|----------|
| `organizes` | 하위 개념 조직화 | hub |
| `extends` | 파생, 확장 | hub, concept |
| `connects_to` | 허브/인덱스 간 연결 | index, hub |
| `relates_to` | 관련 개념 | concept |
| `part_of` | 상위에 소속 | concept, hub |
| `similar_to` | 유사 개념 | concept |
| `different_from` | 대조 개념 | concept |
| `derived_from` | 도출 출처 (note 필수) | note |
| `enables` | ~를 가능케 함 | concept |
| `used_by` | 사용처 | concept |

## Permalink 규칙

| 타입 | Prefix | 예시 |
|------|--------|------|
| index | `index/` | `index/general-cs` |
| hub | `hubs/` | `hubs/web-fundamentals` |
| concept | `knowledge/concepts/` | `knowledge/concepts/orm` |
| note | `notes/` | `notes/abstraction-repeats` |
| reference | `sources/reference/` | `sources/reference/react-docs` |

slug는 영문 소문자, 하이픈 구분.

## Observations

- [fact] 루만 제텔카스텐의 3계층: Register(색인) → Strukturnoten(구조) → Zettel(개별) #zettelkasten
- [decision] 색인 노트를 00. index로 분리하여 계층 명확화 #architecture
- [decision] 파일명은 한글 (English) 형식으로 통일 #naming
- [decision] wikilink는 Relations 섹션에서만 사용 #convention
- [decision] Observation 표준 6개 카테고리 + 확장 3개 #convention
- [decision] 05. code를 같은 볼트에 통합 — 형식은 다르되 링크로 연결 #architecture

## Relations

- organizes [[일반 CS 개념 (General CS)]] (CS 영역 색인)
- organizes [[AI와 LLM (AI and LLM)]] (AI/LLM 영역 색인)
- based_on [[Obsidian 제텔카스텐 폴더 구조 리서치]] (제텔카스텐 폴더 구조 원본)
- based_on [[RPG 구조 설계]] (05. code 컨벤션 원본)
