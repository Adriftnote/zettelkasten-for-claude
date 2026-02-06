---
title: Linear Representation Hypothesis
type: concept
permalink: knowledge/concepts/linear-representation-hypothesis
tags:
- AI
- LLM
- interpretability
- representation
category: AI/ML
difficulty: 고급
---

# Linear Representation Hypothesis

LLM 내부에서 개념들이 선형 방향(linear direction)으로 표현된다는 가설

## 📖 개요

Linear Representation Hypothesis는 대규모 언어 모델의 활성화 공간에서 "사실/거짓", "긍정/부정", "윤리적/비윤리적" 같은 개념들이 특정 방향 벡터로 인코딩된다는 가설입니다. 여러 실험에서 일관되게 관찰되어 경험적으로 신뢰받지만, 완전한 이론적 증명은 아직 없습니다.

## 🎭 비유

나침반의 N극처럼, 모델 내부에 "진실 방향"이 있다고 상상해보세요. 어떤 문장이 참이면 그 방향으로, 거짓이면 반대 방향으로 활성화가 기울어집니다. 이 방향만 알면 모델이 "진짜로 믿는 것"을 읽어낼 수 있습니다.

## ✨ 특징

- **선형 분리**: 단순 내적으로 개념 분류 가능
- **조종 가능**: 방향 벡터 더하기/빼기로 모델 행동 변경
- **직교성**: 서로 다른 개념들이 거의 직교하는 방향
- **레이어 의존**: 중간~후반 레이어에서 더 명확

## 🔬 근거 논문

### 초기 연구 (2022-2023)

| 논문 | 저자 | 핵심 발견 |
|------|------|----------|
| Discovering Latent Knowledge (CCS) | Burns et al. 2022 | 레이블 없이 truth direction 추출 |
| Representation Engineering | Zou et al. 2023 | 정직성, 감정 등 다양한 방향 벡터 |
| Inference-Time Intervention | Li et al. 2023 | truthfulness direction으로 개입 |

### 최신 연구 (2024-2025)

| 논문 | 저자 | 핵심 발견 |
|------|------|----------|
| [The Linear Representation Hypothesis and the Geometry of LLMs](https://arxiv.org/abs/2311.03658) | Park et al. 2024 | 수학적 정립, causal inner product 개념 |
| [Truth-value judgment: context sensitive](https://openreview.net/forum?id=2H85485yAb) | 2025 | truth direction이 맥락에 민감함 |
| [Emergence of Linear Truth Encodings](https://arxiv.org/html/2510.15804v1) | 2025 | truth subspace 존재 확인 |
| [Linear Representations of Political Perspective](https://openreview.net/forum?id=rwqShzb9li) | ICLR 2025 | 정치 성향도 선형 방향으로 표현 |

### 연구 흐름

```
2022-2023: "선형 방향 있다!" (CCS, RepE)
    ↓
2024: "수학적으로 정립하자" (Park et al.)
    ↓
2025: "근데 맥락에 따라 변한다" (Context Sensitivity 연구들)
```

## ⚠️ 한계

- **맥락 불변 아님**: 대화 중 방향이 변할 수 있음 (Linear Representations Change 논문)
- **모든 개념이 선형?**: 복잡한 개념은 비선형일 수도
- **모델/레이어 의존**: 일관성이 완전하지 않음

## 💡 응용

```
# Activation Steering 예시
honest_direction = extract_direction("honest" vs "dishonest")
model.activations += honest_direction * strength
→ 모델이 더 정직하게 응답
```

## Relations

- enables [[Representation Engineering]] (기반 이론)
- enables [[CCS (Contrast Consistent Search)]] (응용 방법)
- challenged_by [[Linear Representations Change During Conversation]] (맥락 의존성 발견)
- relates_to [[Mechanistic Interpretability]] (상위 분야)
- relates_to [[SAE (Sparse Autoencoder)]] (관련 기법)