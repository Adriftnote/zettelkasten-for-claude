---
title: Steering Vector
type: concept
permalink: knowledge/concepts/steering-vector
tags:
- AI
- LLM
- interpretability
- activation-engineering
category: AI/ML
difficulty: 고급
---

# Steering Vector

모델의 내부 활성화에 방향 벡터를 더해 특정 행동을 유도하는 기법

## 📖 개요

Steering Vector(조종 벡터)는 LLM의 hidden state에 특정 방향의 벡터를 더하거나 빼서 모델 출력을 제어하는 기법입니다. 예를 들어 "정직성 방향" 벡터를 더하면 모델이 더 정직하게 응답합니다. Linear Representation Hypothesis가 성립하기 때문에 가능한 기법입니다.

## 🎭 비유

자동차 핸들과 같습니다. 엔진(모델 파라미터)을 바꾸지 않고도, 핸들(steering vector)을 돌리면 차가 가는 방향(출력)이 바뀝니다.

## ✨ 특징

- **파라미터 불변**: fine-tuning 없이 추론 시점에 개입
- **가역적**: 벡터를 빼면 원래대로 복원
- **강도 조절**: 벡터에 곱하는 계수로 효과 강도 조절
- **합성 가능**: 여러 steering vector를 동시에 적용 가능

## 💡 예시

```python
# Activation Steering 개념적 코드
truth_direction = extract_direction(model, "true" vs "false")
model.hidden_states[layer] += truth_direction * strength
# → 모델이 더 사실적으로 응답
```

## Relations

- enabled_by [[Linear Representation Hypothesis]] (선형 표현이어야 가능)
- part_of [[Mechanistic Interpretability]] (해석 도구)
- used_by [[Representation Engineering]] (응용 프레임워크)
- challenged_by [[Linear Representations Change During Conversation]] (맥락에 따라 방향 변함)