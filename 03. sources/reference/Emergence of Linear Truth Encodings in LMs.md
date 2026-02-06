---
title: Emergence of Linear Truth Encodings in LMs
type: paper-review
permalink: sources/reference/emergence-linear-truth-encodings
tags:
- paper-review
- LLM
- truth-encoding
- mechanistic-interpretability
- layer-normalization
date: 2026-02-06
---

# Emergence of Linear Truth Encodings in LMs

> **Emergence of Linear Truth Encodings in Language Models**
> Shauli Ravfogel, Gilad Yehudai, Tal Linzen, Joan Bruna, Alberto Bietti | NYU, Flatiron Institute | arXiv 2510.15804v1

단층 transformer toy model로 "진리값"의 선형 인코딩이 왜, 어떻게 출현하는지를 재현하고, Truth Co-occurrence Hypothesis(TCH)를 제안한 논문.

## 📖 핵심 아이디어

LLM이 참/거짓을 선형적으로 구분하는 "truth direction"을 학습하는 현상이 관찰되어 왔다. 이 논문은 그 현상의 원인을 규명한다. 핵심 가설(TCH)은 "사실 진술은 다른 사실 진술과 함께, 거짓은 거짓끼리 등장한다"는 것이며, 이 통계적 패턴이 모델에게 latent truth bit을 추적하도록 유도한다. Toy model 분석으로 두 단계 학습 dynamics(빠른 암기 → 느린 선형 분리)를 발견하고, layer normalization이 선형 분리의 핵심 메커니즘임을 증명했다.

## 🛠️ 주요 내용

| 항목 | 설명 |
|------|------|
| **Toy Model** | Single-layer transformer, 1 attention head + normalization |
| **데이터 형식** | 4-token: x y x' y' (subject, attribute, subject, attribute) |
| **실험 모델** | Toy transformer, Small transformers (d=256), LLAMA3-8B |
| **핵심 가설** | Truth Co-occurrence Hypothesis (TCH) |

### Two-Phase Learning Dynamics

| 단계 | 시점 | 현상 |
|------|------|------|
| **Phase 1: Memorization** | ~1000 batches | 개별 factual associations 암기 |
| **Phase 2: Linear Separation** | ~7500 batches 후 | 참/거짓을 선형으로 분리하는 능력 출현 |

### Truth Circuit 메커니즘

| 구성요소               | 역할                                               |
| ------------------ | ------------------------------------------------ |
| **Attention head** | x와 y의 embeddings 평균 계산                           |
| **Embedding 구조**   | e_x ≈ -e_g(x) (첫 번째 PC에서)                        |
| **RMSNorm**        | 적용 전 선형 분리 불가 → 적용 후 가능                          |
| **원리**             | TRUE class가 원점 중심, FALSE보다 큰 분산 → norm이 선형 분리 유도 |

### 핵심 정리

| 정리 | 내용 |
|------|------|
| **Theorem 1** | 모델 구조 + layer-norm이 truthful context에서 confidence를 높이는 메커니즘 |
| **Theorem 2** | Layer-norm 포함 시 선형 separator 존재, 없으면 불가능 |
| **Theorem 3** | Gradient dynamics가 블록 구조로 빠르게 수렴 (layer-norm이 핵심) |

## 🔧 작동 방식

```
Training Data (truth rate ρ)
  "사실 문장들은 함께 등장" (TCH)
     ↓
Phase 1: Memorization (~1000 batches)
  각 (subject, attribute) 쌍을 key-value로 암기
  W matrix에 associative memory 형성
     ↓
Phase 2: Linear Separation (~7500 batches)
  ┌──────────────────────────────┐
  │  Attention: avg(e_x, e_y)   │
  │       ↓                     │
  │  TRUE:  e_x + e_g(x) ≈ 0   │ → 원점 근처, 작은 norm
  │  FALSE: e_x + e_rand  ≠ 0   │ → 원점에서 멀어짐, 큰 norm
  │       ↓                     │
  │  RMSNorm: v → v/||v||       │
  │       ↓                     │
  │  Norm 차이가 선형 분리 유도   │
  └──────────────────────────────┘
     ↓
LLAMA3-8B 검증:
  거짓 문장 2개 선행 시 정답 확률 4.55배 감소
  Truth steering vector로 복원 가능
```

## 💡 실용적 평가

**강점**
- "왜 선형 인코딩이 나타나는가?"에 대한 최초의 end-to-end 설명
- Toy model에서 발견한 메커니즘이 LLAMA3-8B에서도 검증됨
- Layer normalization의 역할을 명시적으로 규명

**한계**
- Toy model이 단순함 (single relation, uniform corruption)
- 실제 데이터의 복잡한 논리적 의존성 미반영
- Pretrained LLM에는 다양한 메커니즘이 공존

**적용 가능성**
- Hallucination 완화: truth direction을 활용한 steering
- 모델 신뢰도 측정: truth probe로 모델의 "확신도" 추정
- 학습 과정 이해: phase transition 관점에서 모델 성숙도 판단

### TCH의 LLAMA3-8B 검증

| 조건 | 결과 |
|------|------|
| 사실 문장 2개 선행 | 정답 확률 기준선 |
| 거짓 문장 2개 선행 | 정답 확률 **4.55배 감소** |
| 거짓 선행 + truth steering | 정답 확률 **복원** |

## 🔗 관련 개념

- [[선형 표현 가설 (Linear Representation Hypothesis)]] - 상위 가설
- [[Layer Normalization]] - truth direction 출현의 핵심 메커니즘
- [[Linear Representation Hypothesis - LLM 기하학]] - companion paper (causal inner product 관점)
- [[Hallucination]] - truth encoding 활용한 완화 가능성
- [[Mechanistic Interpretability]] - LLM 내부 메커니즘 해석 분야

---

**작성일**: 2026-02-06
**분류**: AI/ML - Mechanistic Interpretability
**데이터셋**: CounterFact, MAVEN-FACT