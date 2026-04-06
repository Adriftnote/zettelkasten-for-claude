---
title: Deep-Thinking Ratio (DTR)
type: concept
permalink: knowledge/concepts/deep-thinking-ratio
tags:
- LLM
- reasoning
- inference-efficiency
- test-time-compute
category: AI 추론 측정
difficulty: 고급
---

# Deep-Thinking Ratio (DTR)

LLM이 토큰을 생성할 때 **깊은 레이어에 이르러서야 비로소 수렴하는 토큰의 비율**. "얼마나 오래" 대신 "얼마나 깊게" 생각하는지를 측정하는 지표

## 📖 개요

DTR은 2026년 Wei-Lin Chen et al.(UVA, Google) 논문 "Think Deep, Not Just Long"에서 제안된 메커니즘 기반 지표다. 기존에는 CoT(Chain-of-Thought)가 길수록 추론 품질이 높다고 여겨졌으나, 실제로 토큰 길이와 정확도는 음의 상관관계를 보인다. DTR은 이 문제를 해결하기 위해, 모델 내부 레이어의 수렴 패턴을 관찰하여 **모델이 실제로 열심히 계산하고 있는지**를 판별한다. 추가 학습이나 외부 주석 없이, 모델의 내부 상태만으로 추론 품질을 예측할 수 있다.

## 🎭 비유

수학 시험에서 학생 두 명을 비교해보자.

- **학생 A**: 답안지 3장을 빽빽하게 채웠지만, 대부분 같은 공식을 반복 작성 → 길지만 얕은 사고
- **학생 B**: 답안지 1장이지만, 핵심 변환 단계마다 깊이 고민한 흔적이 보임 → 짧지만 깊은 사고

DTR은 **학생 B의 "깊이 고민한 흔적"을 정량화**하는 지표다. 각 풀이 단계(토큰)가 쉬운 기계적 작성인지, 진짜 머리를 써야 하는 계산인지를 구분한다.

## ✨ 특징

- **토큰 길이보다 우수**: DTR 상관계수 0.683 vs 토큰 길이 -0.594
- **50 토큰이면 충분**: prefix 50개만으로 DTR 추정 가능 → 조기 필터링
- **모델/학습 불변**: 추가 fine-tuning 없이 어떤 reasoning 모델에든 적용 가능
- **API 모델 제한**: 중간 레이어 접근이 필요하므로, 오픈소스 모델에서만 사용 가능

## 🔧 측정 방법

```
1. 토큰 t를 생성할 때, 각 레이어 l의 은닉 상태 h_l을 추출
2. h_l을 unembedding matrix로 투영 → 레이어 l에서의 예측 분포 p_l
3. JSD(p_final ∥ p_l) 계산 (최종 레이어와 얼마나 다른지)
4. JSD ≤ 임계값 g(=0.5)이 되는 첫 레이어 = settling depth c_t
5. c_t ≥ ⌈ρ×L⌉ (ρ=0.85) 이면 → deep-thinking token
6. DTR = deep-thinking tokens 수 / 전체 tokens 수
```

## 💡 실제 패턴

| 토큰 유형 | settling depth | DTR 기여 | 해석 |
|-----------|---------------|---------|------|
| "and", "the", "is" | 얕음 (상위 15%) | 기여 안 함 | 기능어, 패턴 매칭으로 충분 |
| "therefore", "because" | 중간 | 기여 안 함 | 추론 연결어, 맥락에서 예측 가능 |
| "+" 뒤 숫자, 최종 답 | 깊음 (하위 15% 초과) | 기여함 | 실제 계산이 필요한 토큰 |

## 🚀 Think@n 전략

DTR을 활용한 test-time scaling 최적화:

```
n개 샘플 생성 시작
  → 50 토큰 prefix에서 DTR 추정
  → 상위 η%(50%) 샘플만 완성
  → majority voting으로 최종 답 선택
  → 결과: 정확도 유지 + 비용 50% 절감
```

## 🔍 해석 시 주의: DTR은 맥락에 따라 의미가 다르다

DTR은 "높을수록 좋다"가 아니다. **비교 대상**에 따라 해석이 달라진다.

| 비교 상황              | DTR 높으면                   | DTR 낮으면           |
| ------------------ | ------------------------- | ----------------- |
| **같은 모델의 여러 답안** 중 | 이 답안이 유망함 (논문의 활용법)       | 대충 쓴 답안           |
| **모델 간 비교**        | 레이어에서 끙끙댐                 | CoT로 잘 분해해서 풀고 있음 |
| **쉬운 질문**인데 높다면    | 모델이 문제를 오해하고 헤매는 신호일 수 있음 | 정상                |

**난이도 대비 이상 탐지 관점** (논문 미수록, 확장 해석): 질문 난이도가 낮은데 DTR이 비정상적으로 높다면, 모델이 질문을 잘못 이해했을 가능성이 있다. 사람도 "이 정도면 금방 끝낼 일"인데 오래 끙끙대고 있으면 보통 문제를 잘못 이해한 것이지, 깊이 생각하고 있는 게 아닌 것과 같은 원리다. 이는 DTR을 단순 필터링이 아닌 **난이도 대비 이상 감지** 도구로 확장할 수 있는 가능성을 시사한다.

## Relations

- measures [[Chain of Thought (CoT)]] (CoT의 추론 "깊이" 품질을 정량화)
- uses [[Neural Network Layer Depth]] (레이어별 수렴 패턴을 관찰하여 측정)
- relates_to [[token-optimization-strategy]] (토큰 길이가 아닌 깊이 축의 최적화)
- originated_from [[REF-075 Think Deep Not Just Long - Measuring LLM Reasoning Effort via Deep-Thinking Tokens]] (원본 논문)
