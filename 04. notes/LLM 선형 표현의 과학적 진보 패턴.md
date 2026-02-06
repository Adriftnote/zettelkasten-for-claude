---
title: LLM 선형 표현의 과학적 진보 패턴
type: note
permalink: notes/lrh-scientific-progress-pattern
tags:
- AI
- interpretability
- 과학철학
- derived
source_facts:
- Linear Representation Hypothesis
- Linear Representation Hypothesis - LLM 기하학
- Emergence of Linear Truth Encodings in LMs
- Linear Representations Change During Conversation
---

# LLM 선형 표현의 과학적 진보 패턴

LRH 연구는 "존재 발견 → 형식화 → 메커니즘 규명 → 한계 발견 → 가설 수정"의 전형적인 과학적 진보 패턴을 따르고 있으며, 가설의 핵심은 강화되고 부가 조건이 수정되는 구조이다.

## 도출 근거

다음 facts의 조합에서 도출됨:

1. **CCS, RepE 등이 선형 방향의 존재를 경험적으로 발견** (2022-2023)
2. **Park et al.이 Causal Inner Product로 형식화하고 27개 개념에서 검증** — 예측(직교성)이 맞을 때마다 가설이 강화됨
3. **Ravfogel et al.이 Layer Norm + TCH로 "왜 생기는가" 메커니즘을 규명** — 출현 원인 설명
4. **Lampinen et al.이 "맥락에 따라 변한다"는 한계를 발견** — "고정적"이라는 암묵적 가정 반증

→ 따라서: **가설의 핵심("선형 방향 존재")은 반증 기회를 견뎌내며 점점 강화되었고, 부가 조건("고정적")만 수정된 전형적 과학적 진보 구조**

## 과학적 강화 메커니즘

```
가설: "개념이 선형으로 인코딩된다"
  ↓
예측: "독립 개념은 직교해야 한다"
  ↓
검증: 27개 개념에서 대부분 직교 확인
  ↓
가설 강화 (반증 가능성을 견뎌냄)
```

매 검증 성공마다 "우연일 확률"이 줄어들고, 가설 신뢰도가 누적 상승.

## 진보의 3단계

```
[존재]   "있다!"      → CCS, RepE (경험적 발견)
[구조]   "이렇게 생겼다" → Park (수학적 형식화)
[동역학] "이렇게 움직인다" → Ravfogel (출현) + Lampinen (변화)
```

## Observations

- [fact] LRH의 핵심 주장(선형 존재)은 다수의 반증 기회를 견뎌냄 #과학철학
- [fact] "고정적"이라는 부가 가정은 Lampinen에 의해 반증됨 #한계
- [method] 형식화(Park)가 "예측 → 검증" 순환을 가능하게 만듦 — 형식화 전에는 사후 관찰만 가능 #방법론
- [fact] Ravfogel의 TCH 메커니즘이 Lampinen의 "표현 역전" 현상을 정확히 설명함 #이론통합
- [question] 맥락 변화를 포함한 "동적 LRH"로 확장 가능한가? #미해결

## Relations

- derived_from [[Linear Representation Hypothesis]] (핵심 가설)
- derived_from [[Linear Representation Hypothesis - LLM 기하학]] (형식화가 예측을 가능하게 함)
- derived_from [[Emergence of Linear Truth Encodings in LMs]] (출현 메커니즘)
- derived_from [[Linear Representations Change During Conversation]] (한계 발견 / 가설 수정)
- relates_to [[Mechanistic Interpretability]] (상위 연구 분야)

---

**도출일**: 2026-02-06
**출처**: LRH 관련 3개 논문 + 컨셉노트 교차 분석