---
title: 허브 노트 템플릿
type: template
tags:
- template
- hub
- zettelkasten
- basic-memory
permalink: hubs/hub-template
---

# 허브 노트 템플릿

이 문서는 **제텔카스텐 + Basic Memory** 방식의 허브 노트 작성 가이드입니다.

> **핵심 규칙**
> 1. `[[wikilink]]`는 **Relations 섹션에서만** 사용
> 2. 다른 곳에서 개념 언급 → 일반 텍스트 또는 `#태그` 사용
> 3. Relations에서 들여쓰기로 계층 구조 표현 → 인덱싱과 통합!

---

## 올바른 구조

```markdown
---
title: [허브 이름]
type: hub
tags: [hub, 주제태그들]
permalink: hubs/[허브-permalink]
---

# [허브 이름]

[1-2문장 설명: 이 허브가 다루는 주제]

## Observations

- [fact] 객관적 사실 1 #태그
- [fact] 객관적 사실 2 #태그
- [method] 방법이나 절차 #태그

## Relations

- organizes [[개념A]] (1. 시작점 개념)
  - extends [[개념A-1]] (1a. 파생 개념)
  - extends [[개념A-2]] (1b. 또 다른 파생)
- organizes [[개념B]] (2. 두 번째 주요 개념)
  - part_of [[개념B-1]] (2a. 하위 구성요소)
- connects_to [[다른-허브]] (연결 이유)
```

---

## Relations 계층 구조 (핵심!)

### 들여쓰기로 인덱싱 + Relations 통합

```markdown
## Relations

- organizes [[TF-IDF]] (1. 검색의 기초)
  - extends [[BM25]] (1a. TF-IDF 개선)
  - extends [[Okapi]] (1b. 문서 길이 정규화)
- organizes [[Inverted-Index]] (2. 역색인 구조)
  - part_of [[Posting-List]] (2a. 문서 ID 목록)
- connects_to [[search-hub]] (검색 허브 연결)
```

**DB 저장 결과:**

| relation_type | to_name |
|---------------|---------|
| `organizes` | TF-IDF |
| `extends` | BM25 |
| `extends` | Okapi |
| `organizes` | Inverted-Index |
| `part_of` | Posting-List |
| `connects_to` | search-hub |

→ 시각적 계층 + DB 저장 모두 OK!

---

## 계층 표현용 relation 타입

| 타입 | 의미 | 사용 |
|------|------|------|
| `organizes` | 허브가 관리함 | 최상위 개념 |
| `extends` | 확장/개선 | 하위 파생 개념 |
| `part_of` | 구성요소 | 하위 부분 |
| `contains` | 포함 | 하위 항목 |
| `implements` | 구현 | 구체적 구현체 |
| `connects_to` | 연결 | 다른 허브 |
| `has_guide` | 가이드 | 관련 가이드 문서 |

---

## ❌ 피해야 할 패턴

### ⚠️ 핵심: wikilink는 Relations에서만!

Basic Memory는 `- {뭔가} [[링크]]` 패턴을 **문서 전체에서** 파싱함.
→ Relations 섹션 외부에서 wikilink 사용 시 잘못된 relation 생성!

```markdown
# Relations 외부에서 wikilink 사용 금지!

- **[[Strategy Pattern]]**: 설명   ← ❌ "**"가 relation_type으로!
- 참고: [[가이드]]                  ← ❌ "참고:"가 relation_type으로!
- [tip] [[링크]] 설명               ← ❌ "[tip]"이 relation_type으로!

# 대신 이렇게:
- **Strategy Pattern**: 설명 #strategy-pattern   ← ✅ 태그 사용
- 참고: 가이드 문서                               ← ✅ 일반 텍스트
```

### 1. Observations 내 wikilink

```markdown
## Observations

- [fact] [[compiler]]는 미리 번역한다   ← ❌ relation으로 잘못 파싱!
- [fact] 컴파일러는 미리 번역한다 #compiler   ← ✅ 태그 사용
```

### 2. 테이블/blockquote 내 wikilink

```markdown
| 도구 | [[parser]] |   ← ❌
> 참고: [[가이드]]     ← ❌
```

---

## ✅ 올바른 패턴

### Observations (wikilink 없이)

```markdown
## Observations

- [fact] 모든 코드는 결국 기계어가 된다 #compilation
- [fact] 컴파일러는 미리 번역, 인터프리터는 실행하면서 번역 #execution
- [method] 소스코드 → 컴파일러/인터프리터 → 런타임 → 실행 #flow
```

### Relations (계층 구조 포함)

```markdown
## Relations

- organizes [[source-code]] (1. 프로그래밍의 시작점)
  - extends [[script]] (1a. 인터프리터용 코드)
  - extends [[program]] (1b. 독립 실행 소프트웨어)
  - extends [[binary]] (1c. 컴파일된 실행 파일)
- organizes [[compiler]] (2. 소스를 미리 기계어로 변환)
  - part_of [[linker]] (2a. 오브젝트 파일 연결)
- organizes [[interpreter]] (3. 실행하면서 변환)
  - part_of [[runtime]] (3a. 실행 환경)
- connects_to [[programming-languages]] (언어별 비교)
- connects_to [[web-fundamentals]] (웹 개발 연결)
```

---

## 인덱싱 번호 체계 (루만식)

설명 끝에 `(번호)` 형식으로 포함:

```
(1)     ← 첫 번째 주요 개념
(1a)    ← 1에서 파생된 첫 번째
(1a1)   ← 1a에서 파생된 첫 번째
(1b)    ← 1에서 파생된 두 번째
(2)     ← 두 번째 주요 개념
```

### 들여쓰기 규칙

```markdown
- organizes [[A]] (1. 설명)       ← 레벨 0 (공백 없음)
  - extends [[B]] (1a. 설명)      ← 레벨 1 (공백 2칸)
    - part_of [[C]] (1a1. 설명)   ← 레벨 2 (공백 4칸)
  - extends [[D]] (1b. 설명)      ← 레벨 1
- organizes [[E]] (2. 설명)       ← 레벨 0
```

---

## Observation 카테고리 (6개, 사실 기반만)

| 카테고리 | 용도 | 예시 |
|---------|------|------|
| `[fact]` | 객관적 사실 | `[fact] UTF-8은 1-4바이트 가변 인코딩이다 #encoding` |
| `[method]` | 방법, 절차 | `[method] Pour over는 중간 분쇄도를 사용한다 #coffee` |
| `[decision]` | 선택/결정 기록 | `[decision] 리눅스는 GPL로 공개했다 #open-source` |
| `[example]` | 구체적 사례 | `[example] Redis는 인메모리 캐시의 예다 #cache` |
| `[reference]` | 참고자료 | `[reference] RFC 3629 - UTF-8 명세 #spec` |
| `[question]` | 미해결 질문 | `[question] 온도가 추출에 어떤 영향을 미치는가? #research` |

> **원칙**: 의견 배제, 사실 기반만. 한 observation = 한 가지 정보.

---

## 체크리스트

허브 노트 작성 시:

- [ ] `type: hub` frontmatter 설정
- [ ] 1-2문장 설명 작성
- [ ] **⚠️ wikilink는 Relations 섹션에서만 사용!**
- [ ] Observations에서 개념 언급 시 `#태그` 사용
- [ ] Observations는 사실 기반 category만 (`fact`, `method`, `decision`, `example`, `reference`, `question`)
- [ ] **Relations에서 들여쓰기로 계층 표현**
- [ ] 루만식 번호는 설명에 `(1)`, `(1a)` 형식으로
- [ ] `organizes` - 최상위 개념
- [ ] `extends`/`part_of` - 하위 개념 (들여쓰기)
- [ ] `connects_to` - 관련 허브 연결

---

**생성일**: 2026-01-22
**수정일**: 2026-01-29
**버전**: 3.0 (인덱싱 + Relations 통합)
