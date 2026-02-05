---
name: note
description: concepts(facts)를 조합하여 도출된 지식(derived knowledge)을 04. notes에 생성합니다. 여러 개념에서 결론/방법론을 도출할 때 사용합니다.
---

# Note Creator (Derived Knowledge)

concepts(facts)를 조합하여 **도출된 지식**을 `04. notes`에 생성합니다.

> **핵심**: inbox 변환이 아니라, 기존 concepts에서 새로운 결론을 도출

## 사용법

```
/note [주제]
```

- 주제 지정 시: 관련 concepts 탐색 후 도출
- 대화 중 도출된 결론을 정리할 때 사용

## 실행 절차

### Step 1: 관련 concepts 탐색

```
mcp__basic-memory__search_notes
query: [주제 키워드]
```

관련 facts 검색.

### Step 2: facts 조합

검색된 concepts에서 관련 facts 추출:
- 어떤 facts가 있는지
- 어떻게 조합할 수 있는지

### Step 3: 결론 도출

facts 조합에서 새로운 지식 도출:
- "A이고, B이므로, 따라서 C다"

### Step 4: 형식 작성

```yaml
---
title: [도출된 지식 이름]
type: note
tags:
- [관련태그]
- derived
permalink: notes/[slug]
source_facts:
- [출처1]
- [출처2]
---
```

### Step 5: 본문 작성

```markdown
# [도출된 지식 이름]

[한 줄 정의 - "그래서 어떻게 해야 한다"]

## 도출 근거

다음 facts의 조합에서 도출됨:

1. **[fact 1]** - 설명
2. **[fact 2]** - 설명

→ 따라서: **[도출된 결론]**

## Observations

- [method] 도출된 방법/절차 #태그
- [fact] 도출된 사실 #태그
- [example] 구체적 적용 사례 #태그

## Relations

- derived_from [[출처노트1]] (어떤 fact에서 도출)
- derived_from [[출처노트2]] (어떤 fact에서 도출)
- mitigates [[해결하는문제]] (문제 완화)
- part_of [[상위개념]] (소속)

---

**도출일**: YYYY-MM-DD
**출처**: [facts 조합 설명]
```

### Step 6: 저장

```
mcp__basic-memory__write_note
title: [도출된 지식 이름]
folder: 04. notes
content: [변환된 내용]
```

## concepts vs notes 차이

| 구분 | 01. concepts | 04. notes |
|------|-------------|-----------|
| **목적** | 기본 개념 정의 | 도출된 지식 |
| **내용** | "X란 무엇인가" | "그래서 어떻게 해야 한다" |
| **출처** | 외부 정의/표준 | facts 조합에서 도출 |
| **relation** | `relates_to`, `extends` 등 | `derived_from` 필수 |

## 도출 과정 시각화

```
[fact] A: LLM은 컨텍스트 윈도우 안에서만 본다
[fact] B: 중간 정보는 잘 잊혀진다
         ↓ (조합/추론)
[note] C: 중요한 정보는 시작/끝에 배치하라
         ↓
    - derived_from [[A 출처]]
    - derived_from [[B 출처]]
```

## Observation 카테고리

| 카테고리 | 용도 | 예시 |
|---------|------|------|
| `[fact]` | 도출된 사실 | "이 전략은 효과가 있다" |
| `[method]` | 도출된 방법 | "시작/끝에 배치한다" |
| `[decision]` | 결정 기록 | "이 방식을 채택했다" |
| `[example]` | 적용 사례 | "시스템 프롬프트는 맨 앞" |
| `[reference]` | 참고자료 | "논문 X 참고" |
| `[question]` | 후속 질문 | "다른 경우에도 적용되나?" |

## 핵심 규칙

- **wikilink는 Relations 섹션에서만** 사용
- **`derived_from` relation 필수** - 출처 명시
- Observations에서는 `#태그` 사용
- "도출 근거" 섹션에서 추론 과정 명시
