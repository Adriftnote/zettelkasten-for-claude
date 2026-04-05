---
title: Linear Representation Hypothesis - LLM 기하학
type: paper-review
permalink: sources/reference/linear-representation-hypothesis
tags:
- paper-review
- LLM
- linear-representation
- mechanistic-interpretability
- causal-inner-product
date: 2026-02-06
---

# Linear Representation Hypothesis - LLM 기하학

> **The Linear Representation Hypothesis and the Geometry of Large Language Models**
> Kiho Park, Yo Joong Choe, Victor Veitch | arXiv 2311.03658v2

LLM의 표현 공간에서 고수준 개념이 선형적으로 인코딩된다는 가설을 형식화하고, Causal Inner Product로 embedding/unembedding 공간을 통합한 논문.

## 📖 핵심 아이디어

Linear Representation Hypothesis(LRH)는 "성별", "시제", "언어" 같은 고수준 개념이 LLM 내부에서 선형 부분공간(linear subspace)으로 표현된다는 가설이다. 이 논문은 counterfactual pairs를 사용해 LRH를 세 가지 관점(Subspace, Measurement, Intervention)으로 형식화하고, 이들을 통합하는 Causal Inner Product를 제안한다. 핵심 통찰은 인과적으로 분리 가능한 개념들이 이 내적 공간에서 직교한다는 것이다.

## 🛠️ 주요 내용

| 항목 | 설명 |
|------|------|
| **모델** | LLaMA-2 (7B parameters) |
| **분석 개념** | 27개 (22개 BATS 3.0 + 4개 언어 + 1개 빈도) |
| **핵심 도구** | Counterfactual pairs |
| **이론적 기여** | Causal Inner Product, Riesz Isomorphism |

### 선형 표현의 세 가지 해석

| 해석 | 의미 | 수학적 정의 |
|------|------|------------|
| **Subspace** | 개념이 특정 방향(부분공간)에 존재 | embedding 차이가 공통 방향을 가리킴 |
| **Measurement** | 선형 probe로 개념 측정 가능 | unembedding 표현이 logit-linear하게 확률 측정 |
| **Intervention** | steering vector로 개념 제어 가능 | embedding 표현 추가로 대상 개념만 변경 |

### 핵심 정리

| 정리 | 내용 |
|------|------|
| **Theorem 2.2** | Unembedding 표현이 개념의 확률을 logit-linear하게 측정 |
| **Theorem 2.5** | Embedding 표현 추가가 대상 개념만 변경, 인과적 분리된 개념은 불변 |
| **Theorem 3.2** | Causal inner product가 Riesz isomorphism을 유도 (unembedding → embedding 매핑) |
| **Theorem 3.4** | Causal inner product의 명시적 형태: M = Cov(γ)⁻¹ |

## 🔧 작동 방식

```
Counterfactual Pairs 구축
     ↓
┌────────────────────────────────┐
│  Embedding Space (Λ ≅ ℝᵈ)     │ ←── Intervention (steering)
│  "성별 바꾸면 이 방향 이동"      │
│                                │
│     Riesz Isomorphism          │
│     (Causal Inner Product)     │
│          ↕                     │
│  Unembedding Space (Γ ≅ ℝᵈ)   │ ←── Measurement (probing)
│  "이 방향으로 투영하면 성별 측정" │
└────────────────────────────────┘
     ↓
Causal Inner Product: ⟨γ̄, γ̄'⟩_C = γ̄ᵀ Cov(γ)⁻¹ γ̄'
→ 인과적으로 분리 가능한 개념 = 직교 벡터
```

## 💡 실용적 평가

**강점**
- Probing과 steering을 통합하는 수학적 프레임워크 제공
- Causal Inner Product가 "올바른 내적"을 정의 → 개념 간 관계 분석 정밀화
- 27개 개념에 대한 실증적 검증으로 이론의 실용성 확인

**한계**
- Binary concepts로 제한 (연속적 개념 미지원)
- Causal separability 가정이 실제로 성립하는지 불확실
- Causal inner product의 D (차원 선택) 자유도 존재

**적용 가능성**
- 모델 해석: Linear probing으로 내부 표현 분석
- 모델 제어: Steering vectors로 출력 방향 조작
- 개념 간 관계 분석: 직교성으로 독립성 측정

## 🔗 관련 개념

- [[Linear Representation Hypothesis]] - 이 논문의 핵심 가설
- [[Mechanistic Interpretability]] - LLM 내부 메커니즘 해석 분야
- [[Steering Vector]] - 모델 출력 제어 기법
- [[Emergence of Linear Truth Encodings in LMs]] - 진리값의 선형 인코딩 (companion paper)

---

**작성일**: 2026-02-06
**분류**: AI/ML - Mechanistic Interpretability
**코드**: github.com/KihoPark/linear_rep_geometry