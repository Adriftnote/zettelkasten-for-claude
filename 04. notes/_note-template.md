---
title: 노트 템플릿 (Derived Knowledge)
type: template
tags:
- template
- note
- derived
- basic-memory
permalink: notes/note-template
---

# 노트 템플릿 (Derived Knowledge)

이 문서는 **도출된 지식(derived knowledge)** 노트 작성 가이드입니다.

> **04. notes의 목적**
> - facts 조합에서 나온 새로운 지식
> - `derived_from` relation으로 출처 명시
> - 추론 경로 추적 가능

---

## 올바른 구조

```markdown
---
title: [도출된 지식 이름]
type: note
tags:
- [관련태그]
- derived
permalink: notes/[permalink]
source_facts:
- [출처1]
- [출처2]
---

# [도출된 지식 이름]

[한 줄 정의]

## 도출 근거

다음 facts의 조합에서 도출됨:

1. **[fact 1]** - 설명
2. **[fact 2]** - 설명

→ 따라서: **[도출된 결론]**

## Observations

- [method] 도출된 방법/절차 #tag
- [fact] 도출된 사실 #tag
- [example] 구체적 적용 사례 #tag

## Relations

- derived_from [[출처노트1]] (어떤 fact에서 도출)
- derived_from [[출처노트2]] (어떤 fact에서 도출)
- mitigates [[해결하는문제]] (문제 완화)
- part_of [[상위개념]] (소속)

---

**도출일**: YYYY-MM-DD
**출처**: [facts 조합 설명]
```

---

## concepts vs notes 차이

| 구분 | 01. concepts | 04. notes |
|------|-------------|-----------|
| **목적** | 기본 개념 정의 | 도출된 지식 |
| **내용** | "X란 무엇인가" | "그래서 어떻게 해야 한다" |
| **출처** | 외부 정의/표준 | facts 조합에서 도출 |
| **relation** | `relates_to`, `extends` 등 | `derived_from` 필수 |

---

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

---

## Observation 카테고리 (6개, 사실 기반만)

| 카테고리 | 용도 | 예시 |
|---------|------|------|
| `[fact]` | 도출된 사실 | "이 전략은 효과가 있다" |
| `[method]` | 도출된 방법 | "시작/끝에 배치한다" |
| `[decision]` | 결정 기록 | "이 방식을 채택했다" |
| `[example]` | 적용 사례 | "시스템 프롬프트는 맨 앞" |
| `[reference]` | 참고자료 | "논문 X 참고" |
| `[question]` | 후속 질문 | "다른 경우에도 적용되나?" |

---

## Relations 작성법

### 필수: derived_from

```markdown
- derived_from [[출처노트]] (어떤 fact에서 도출되었는지)
```

### 선택: 추가 관계

| 타입 | 의미 | 예시 |
|------|------|------|
| `mitigates` | 문제 완화 | 이 지식이 해결하는 문제 |
| `part_of` | 소속 | 상위 개념/허브 |
| `extends` | 확장 | 기존 지식 발전 |
| `applies_to` | 적용 대상 | 어디에 적용되는지 |

---

## 체크리스트

노트 작성 시:

- [ ] `type: note` frontmatter 설정
- [ ] `derived` 태그 포함
- [ ] **도출 근거 섹션** - facts 나열
- [ ] **Observations** - 사실 기반 category만
- [ ] **`derived_from` relation 필수** - 출처 명시
- [ ] context에 "어떤 fact에서 도출"인지 설명

---

**생성일**: 2026-01-29
**버전**: 1.0
