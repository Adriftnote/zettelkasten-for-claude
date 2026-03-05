---
title: ML 훈련은 과정을 버리고 LLM은 목표 밖을 만든다
type: note
tags:
- machine-learning
- LLM
- gradient-descent
- emergence
- reasoning
- derived
permalink: notes/ml-training-llm-emergence
source_facts:
- 경사하강법의 기울기 소멸
- LLM 다음 토큰 예측 훈련
- 창발 현상
- 함수 근사 이론
---

# ML 훈련은 과정을 버리고 LLM은 목표 밖을 만든다

ML 훈련은 중간 과정을 전부 소멸시키고 최종 파라미터만 남기며, LLM은 그 파라미터에서 훈련 목표에 없던 능력을 창발시킨다.

## 도출 근거

다음 facts의 조합에서 도출됨:

1. **ML 훈련은 "틀린 정도 → 방향 → 수정"의 반복이다** - 경사하강법에서 매 스텝 기울기는 버려지고 최종 파라미터만 남음. 사람의 시행착오와 달리 과정 자체가 보존되지 않음
2. **ML의 본질은 함수 근사이다** - 데이터 관계를 설명하는 함수 f를 찾는 것. 구성적 근사(Learning Without Training)라는 정반대 패러다임도 존재
3. **LLM은 "다음 토큰 예측"만 훈련한다** - 수조 개 텍스트로 토큰 확률 분포 예측을 반복. 훈련 목표는 이것 하나뿐
4. **충분한 규모에서 훈련 목표에 없던 능력이 나타난다** - 추론, 코딩, 번역 등. 이것이 창발(emergence)

→ 따라서: **ML 훈련의 정보 소멸(기울기 버림)과 LLM의 창발(목표 밖 능력)이 합쳐져서, "모델이 왜 이걸 할 수 있는지" 역추적하기 어려운 구조가 만들어진다. "추론인가 패턴 매칭인가" 논쟁이 어려운 이유 중 하나는 판단할 내부 정보가 소멸되어 있기 때문이다. 다만, 이 논쟁 자체는 "추론"의 정의라는 철학적 문제이기도 하다.**

## Observations

- [fact] 경사하강법에서 중간 기울기는 매 스텝 버려지고 최종 파라미터만 남는다 #gradient-descent
- [fact] ML의 본질은 데이터 관계를 설명하는 함수 f를 찾는 함수 근사이다 #function-approximation
- [fact] LLM은 "다음 토큰 예측"이라는 단일 목표로만 훈련된다 #LLM-training
- [fact] LLM은 훈련 데이터에 없는 조합도 처리하며 단순 암기 이상의 일반화를 보인다 #generalization
- [fact] 충분한 규모에서 훈련 목표에 없던 추론·코딩·번역 능력이 창발한다 #emergence
- [method] 구성적 근사는 최적화 대신 수학 공식으로 답을 직접 구성한다 (Learning Without Training) #alternative
- [question] LLM의 창발 능력은 왜 나타나는가 #open
- [question] 패턴 매칭과 추론의 경계는 어디인가 — "추론"의 정의 문제 #open
- [question] 인간의 "이해"도 결국 패턴 매칭인가 #open

## Relations

- derived_from [[REF-059 Learning Without Training]] (함수 근사의 본질과 구성적 근사 대안)
- derived_from [[창발 (Emergence)]] (규모에서 나타나는 비환원적 속성 출현 구조)
- relates_to [[심볼릭 AI vs 커넥셔니스트 AI 역사]] ("추론 vs 패턴 매칭" 논쟁의 역사적 뿌리)
- relates_to [[In-Context Learning]] (창발 능력의 구체적 사례)
- enables [[AI 블랙박스 (AI Black Box)]] (훈련의 정보 소멸 + 창발이 블랙박스의 원인)
- hub [[창발과 AI 해석 불가능성 (Emergence & AI Opacity)]] (정보 손실 → 해석 불가능성 인과 사슬)
- relates_to [[REF-066 Memory Caching - RNNs with Growing Memory]] (훈련 과정의 소멸과 대비 — MC는 추론 시 읽은 내용의 기억 소멸을 해결하는 기법으로, 학습 과정 보존과는 별개)

---

**도출일**: 2026-02-24
**출처**: ML 훈련 메커니즘 + LLM 창발 현상 + 추론 논쟁 종합
