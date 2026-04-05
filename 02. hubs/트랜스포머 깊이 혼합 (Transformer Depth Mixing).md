---
title: 트랜스포머 깊이 혼합 (Transformer Depth Mixing)
type: hub
tags:
- hub
- transformer
- residual-connection
- attention
- depth-mixing
- architecture
permalink: hubs/transformer-depth-mixing
---

# 트랜스포머 깊이 혼합 (Transformer Depth Mixing)

트랜스포머 아키텍처에서 **레이어 간 정보 전달 방식**을 다루는 개념들을 조직화합니다. 기존 잔차 연결의 한계부터 어텐션 기반 깊이 혼합까지, "깊이 방향의 정보 흐름을 어떻게 설계할 것인가"라는 질문을 중심으로 연결합니다.

## Observations

- [fact] 표준 잔차 연결은 모든 이전 레이어를 균등 가중치(=1)로 합산하므로, 깊은 네트워크에서 히든 상태 크기가 O(L)로 증가하고 개별 레이어 기여가 희석된다 (PreNorm dilution) #residual-connection #prenorm
- [fact] 시퀀스 방향 RNN→Transformer 전환 논리(고정 순차 → 어텐션 선택)를 깊이(Depth) 방향에도 동일하게 적용할 수 있다 #attention #depth-mixing
- [fact] 어텐션 기반 깊이 혼합(AttnRes)은 레이어당 d차원 벡터 1개만 추가하여 파라미터 오버헤드를 최소화한다 #efficiency
- [fact] Block AttnRes(N≈8 블록)로 대규모 분산 훈련에서도 실용적 적용이 가능하다 — 훈련 오버헤드 <4%, 추론 오버헤드 <2% #scalability
- [fact] 깊이 혼합 개선은 복합 추론(GPQA +7.5)·코드 생성(HumanEval +3.1) 태스크에서 특히 두드러진 효과를 보인다 #benchmark
- [method] 잔차 연결 변형들을 깊이 혼합 행렬(Depth Mixing Matrix) M ∈ R^{L×L}로 통합 분류 가능 — 고정/정적/동적(콘텐츠 인식) 가중치 체계 #framework
- [question] Dense 모델에서의 AttnRes 효과는 아직 미검증 — MoE 외 아키텍처로의 일반화 가능성은? #open-question

## Relations

- organizes [[Residual Connection (잔차 연결)]] (1. 기존 방식: 레이어 출력을 균등 가중치로 누적 합산하는 정보 전달 메커니즘)
  - extends [[Attention]] (1a. 깊이 방향 확장: 시퀀스 어텐션과 동일한 QKV 메커니즘을 레이어 간 정보 선택에 적용)
  - extends [[Depth Mixing Matrix (깊이 혼합 행렬)]] (1b. 이론적 통합: 잔차 연결 변형들을 M ∈ R^{L×L} 행렬로 분류하는 프레임워크)
- organizes [[Neural Network Layer Depth]] (2. 깊이에 따른 표현 변화 — 얕은 층의 표면 패턴부터 깊은 층의 고차 추론까지)
  - relates_to [[Deep-Thinking Ratio (DTR)]] (2a. 레이어별 수렴 패턴 측정 — 깊이 혼합이 수렴 역학에 미치는 영향)
- organizes [[Scaling Laws (스케일링 법칙)]] (3. AttnRes의 스케일링 이점 — Baseline 대비 1.25× 컴퓨트 효율)
- organizes [[MoE (Mixture of Experts)]] (4. Kimi Linear(48B/3B MoE)에서 AttnRes 검증 — 시퀀스 방향 희소성(MoE) + 깊이 방향 선택성(AttnRes) 결합)
- connects_to [[AI-ML 개념 (AI-ML Concepts)]] (어텐션 메커니즘의 확장 적용)
- connects_to [[AI 연산들은 공통된 표현 변환의 직관을 공유한다]] (깊이 혼합도 "어떤 표현을 선택적으로 조합할 것인가"라는 표현 변환의 한 형태)
- source [[REF-119 Attention Residuals (AttnRes) — 깊이 방향 어텐션으로 잔차 연결 대체]] (핵심 참조 논문)

---

## 개념 간 관계도

```
[1] Residual Connection (기존 방식)
    │  h_l = h_{l-1} + f(h_{l-1})  ← 균등 합산, 희석 문제
    │
    ├─ [1a] Attention (깊이 방향 확장)
    │        h_l = Σ α_i · v_i  ← 소프트맥스 선택적 합산
    │        ├─ Full AttnRes: 모든 레이어에 어텐션 (최고 성능)
    │        └─ Block AttnRes: N≈8 블록 근사 (실용적)
    │
    └─ [1b] Depth Mixing Matrix (이론적 통합)
             고정(Identity) → 정적(학습 가중치) → 동적(AttnRes)

[2] Neural Network Layer Depth
    └─ [2a] DTR: 레이어별 수렴으로 추론 깊이 측정

[3] Scaling Laws: AttnRes의 1.25× 컴퓨트 이점

[4] MoE: 시퀀스 희소성 + 깊이 선택성 결합
```

---

## 핵심 질문

| 질문 | 상태 | 관련 개념 |
|------|------|-----------|
| 균등 합산 외에 레이어 정보를 전달하는 더 나은 방법은? | ✅ AttnRes로 답변 | [1], [1a] |
| 깊이 혼합이 추론 능력에 미치는 영향은? | ✅ GPQA +7.5 등 검증 | [2], [3] |
| Dense 모델에서도 동일한 효과를 보이는가? | ❓ 미검증 | [4] |
| DTR 수렴 패턴이 AttnRes로 어떻게 변하는가? | ❓ 탐구 가능 | [2a] |
