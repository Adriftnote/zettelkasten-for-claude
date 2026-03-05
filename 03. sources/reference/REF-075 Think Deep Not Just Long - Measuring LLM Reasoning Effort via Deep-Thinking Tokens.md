---
title: REF-075 Think Deep Not Just Long - Measuring LLM Reasoning Effort via Deep-Thinking
  Tokens
type: paper-review
permalink: sources/reference/think-deep-not-just-long-dtr
tags:
- LLM
- reasoning
- Chain-of-Thought
- inference-efficiency
- test-time-compute
date: 2026-02-12
---

# Think Deep, Not Just Long: Measuring LLM Reasoning Effort via Deep-Thinking Tokens

긴 CoT가 아닌 **레이어 깊이에서의 수렴 패턴**으로 추론 노력을 측정하는 Deep-Thinking Ratio(DTR) 제안. 토큰 50개 prefix만으로 유망한 생성을 선별해 추론 비용 50% 절감.

## 📖 핵심 아이디어

기존에는 긴 Chain-of-Thought가 추론 품질을 높인다고 여겨졌으나, 토큰 길이는 정확도와 **음의 상관관계**(r=-0.594)를 보인다. DTR은 중간 레이어 은닉 상태를 어휘 공간으로 투영하여, 각 토큰이 **깊은 레이어까지 예측이 수렴하지 않는 비율**을 측정한다. "얼마나 오래 생각하는가"가 아닌 "얼마나 깊게 생각하는가"를 포착하는 메커니즘 기반 지표.

## 🛠️ 구성 요소

| 항목                                  | 설명                                                      |
| ----------------------------------- | ------------------------------------------------------- |
| **DTR (Deep-Thinking Ratio)**       | deep-thinking tokens 비율. 깊은 레이어에서야 예측이 수렴하는 토큰의 비율      |
| **Settling depth**                  | 분포가 임계값(g) 이하로 떨어지는 첫 레이어. 조기 수렴 = 적은 계산 노력             |
| **JSD (Jensen-Shannon Divergence)** | 중간 레이어 vs 최종 레이어 예측 분포 비교에 사용. KLD/Cosine보다 안정적         |
| **Think@n**                         | DTR 기반 test-time scaling 전략. 상위 50% 샘플만 majority voting |

## 🔧 작동 방식

```
Input → LLM 생성 (n개 샘플)
  │
  ├── 각 토큰마다:
  │     중간 레이어 은닉상태 → unembedding matrix 투영
  │     → JSD(p_final ∥ p_layer) 계산
  │     → settling depth c_t 결정 (JSD ≤ g 되는 첫 레이어)
  │
  ├── Deep-thinking regime: l ≥ ⌈ρ×L⌉ (ρ=0.85)
  │     DTR = deep-thinking tokens / 전체 tokens
  │
  └── Think@n:
        50 토큰 prefix로 DTR 추정
        → 상위 η% (50%) 샘플만 완성
        → majority voting → 정확도 유지 + 비용 50%↓
```

**최적 하이퍼파라미터**: (g, ρ) = (0.5, 0.85)

## 💡 실용적 평가

**강점**:
- DTR 평균 상관계수 0.683 (32개 모델-벤치마크 조합 중 30개에서 양의 상관관계)
- 기존 지표 대비: Token Count(-0.594), Self-Certainty(0.605), Log Prob(0.527) 모두 능가
- 50 토큰 prefix만으로 유효한 DTR 추정 → 조기 종료 가능
- 추가 학습이나 외부 주석 불필요

**핵심 발견**:
- 기능적/템플릿 단어("and", "is")는 얕은 레이어에서 수렴 (쉬운 예측)
- 연산자 뒤 완성("+", "=")과 답 토큰은 깊은 레이어까지 수렴하지 않음 (어려운 예측)
- 높은 추론 레벨에서는 DTR이 낮아지고 정확도는 높아짐 → 계산이 깊이에서 시퀀스 길이로 재분배

**한계**:
- 중간 레이어 접근이 필요 (API-only 모델에서는 사용 불가)
- 추론 레벨이 높을수록 DTR이 낮아지는 역설적 패턴 → 추가 연구 필요

**실험 모델**: GPT-OSS-20B/120B, DeepSeek-R1-70B, Qwen3-30B-Thinking
**벤치마크**: AIME 2024/2025, HMMT 2025, GPQA-Diamond

## 🔗 관련 개념

- [[Token Optimization Strategy]] - (DTR은 토큰 길이 대신 깊이로 최적화하는 새로운 축 제시)
- [[Chain-of-Thought (CoT)]] - (CoT 길이 vs 품질의 역스케일링 문제를 DTR로 해결)
- [[Dep-Search- Dependency-Aware Reasoning with Persistent Memory]] - (추론 과정의 구조적 분석이라는 공통 관심사)

---

**작성일**: 2026-03-05
**분류**: LLM 추론 효율성
**저자**: Wei-Lin Chen et al. (UVA, Google)