---
title: REF-119 Attention Residuals (AttnRes) — 깊이 방향 어텐션으로 잔차 연결 대체
type: paper-review
permalink: sources/reference/attention-residuals-attnres
tags:
- attention
- residual-connection
- depth-mixing
- transformer-architecture
- scaling-laws
date: 2026-03-20
---

# Attention Residuals (AttnRes)

Kimi Team(MoonshotAI)이 제안. 표준 잔차 연결의 고정 단위 가중치 합산을 소프트맥스 어텐션 기반 선택적 깊이 혼합으로 대체하여 PreNorm 희석 문제를 완화하고 다운스트림 성능을 개선.

## 📖 핵심 아이디어

표준 잔차 연결 `h_l = h_{l-1} + f_{l-1}(h_{l-1})`은 모든 이전 레이어를 균등 가중치로 합산 → 히든 상태 크기가 O(L)로 증가하고 각 레이어 기여도가 희석됨. AttnRes는 이를 `h_l = Σ α_{i→l} · v_i` (소프트맥스 어텐션 가중 합산)로 대체하여 깊이 방향 선택적·콘텐츠 인식 정보 집계를 가능하게 함.

핵심 통찰: **시간 방향 RNN → Transformer 전환과 동일한 논리를 깊이(Depth) 방향에 적용**.

## 🛠️ 구성 요소

| 항목 | 설명 |
|------|------|
| **어텐션 가중치** | `α_{i→l} = softmax(φ(q_l, k_i))`, `φ(q,k) = exp(q^T · RMSNorm(k))` |
| **쿼리 설계** | 레이어당 하나의 학습 가능한 정적 의사 쿼리 벡터 `w_l ∈ R^d` (파라미터 오버헤드 최소) |
| **초기화** | `w_l = 0` → 초기 균등 가중치 → 표준 잔차 연결과 동일하게 시작 → 훈련 안정성 |
| **Full AttnRes** | 각 레이어가 모든 이전 레이어에 어텐션. O(L²d) 연산, O(Ld) 메모리. 최고 성능 |
| **Block AttnRes** | L개 레이어를 N개 블록으로 분할, 블록 대표값에 어텐션. O(N²) 연산, O(Nd) 메모리. 실용적 |
| **최적 블록 수** | N ≈ 8 (실험적 확인). 블록 내 출력 합산 `b_n = Σ_{j∈B_n} f_j(h_j)` |

## 🔧 작동 방식

```
[표준 잔차 연결]
h_l = h_0 + f_0(h_0) + f_1(h_1) + ... + f_{l-1}(h_{l-1})
       ↑ 모두 가중치 1로 균등 합산 → 크기 O(L) 증가, 희석

[AttnRes]
h_l = α_{0→l}·h_0 + α_{1→l}·f_0(h_0) + ... + α_{l→l}·f_{l-1}(h_{l-1})
       ↑ 소프트맥스로 선택적 가중 → 유계, 콘텐츠 인식

[Block AttnRes — 실용적 변형]
Block 1: [Layer 1-6] → b_1 = Σ f_j(h_j)
Block 2: [Layer 7-12] → b_2 = Σ f_j(h_j)
  ...
h_l = Σ α_{n→l} · b_n  (블록 대표값에 어텐션)
```

### 인프라 최적화

| 단계 | 기법 | 효과 |
|------|------|------|
| **훈련** | Cross-Stage Caching — 파이프라인 병렬처리에서 이전 블록 캐시 | 통신 O(C)→O(P), 오버헤드 <4% |
| **추론** | Two-Phase Computation — 인터블록 배치 병렬 + 인트라블록 순차 + Online Softmax | 지연 오버헤드 <2% |
| **프리필** | 시퀀스 차원 TP 샤딩 | 128K 컨텍스트: 15GB→1.9GB/장치 |

## 📊 실험 결과

**모델**: Kimi Linear (MoE, 48B total / 3B activated, 1.4T tokens). Block AttnRes: 6 layers/block → 9 blocks.

### 스케일링 법칙
- 모든 스케일에서 AttnRes가 일관되게 낮은 validation loss
- Block AttnRes: Baseline 대비 **1.25× 컴퓨트 이점** (5.6 PFLOP/s-days 기준)
- 곡선: Baseline `L = 1.891 × C^{-0.057}` vs Block `L = 1.870 × C^{-0.058}`

### 다운스트림 벤치마크 (주요 개선)
| 벤치마크 | Baseline → AttnRes | 개선폭 |
|----------|---------------------|--------|
| GPQA Diamond | 36.9 → 44.4 | **+7.5** |
| Math | 53.5 → 57.1 | +3.6 |
| HumanEval | 59.1 → 62.2 | +3.1 |
| C_Eval | 79.6 → 82.5 | +2.9 |
| MMLU | 73.5 → 74.6 | +1.1 |

패턴: **복합 추론·코드 생성 태스크에서 특히 두드러진 개선** (깊이 방향 정보 흐름 개선 효과).

### 훈련 역학
- **출력 크기**: Baseline은 깊이에 따라 단조 증가(PreNorm dilution) / AttnRes는 블록 경계마다 리셋되는 유계 주기 패턴
- **기울기 분포**: Baseline은 초기 레이어 집중 / AttnRes는 소프트맥스 경쟁으로 더 균등

### Ablation 핵심
- Softmax > Sigmoid: 경쟁적 정규화가 선명한 소스 선택에 중요
- RMSNorm on keys 필수: 레이어 출력 크기 차이로 인한 어텐션 편향 방지
- Multihead 불리: 깊이 방향 혼합은 채널 전체에 균등하게 최적
- **AttnRes는 더 깊고 좁은 네트워크를 선호** (d_model/L_b 최적값: 60→45)

## 💡 실용적 평가

**강점**:
- 파라미터 오버헤드 극소 (레이어당 d차원 벡터 1개)
- Block 변형으로 대규모 분산 훈련에 실용적 (<4% 훈련, <2% 추론 오버헤드)
- 기존 아키텍처에 후속 적용 가능 (w_l=0 초기화로 점진적 학습)
- 이론적 통합 프레임워크 제공 (Depth Mixing Matrix)

**한계/고려사항**:
- Kimi Linear(MoE) 기반 실험만 — Dense 모델에서의 효과는 미검증
- 기존 모델 재훈련 필요 (추론 시 플러그인 불가)
- DenseFormer 대비 장점은 명확하나, mHC 대비는 메모리 효율(5.5d vs 34d)이 주요 차별점

**이론적 의의**: 잔차 연결 변형들을 **깊이 혼합 행렬(Depth Mixing Matrix) M ∈ R^{L×L}**로 통합 — 고정/정적/동적 가중치 분류 체계 제시. 어텐션 가중치 패턴에서 지역성 보존, 레이어 특화, 학습된 스킵 연결 출현 확인.

## 🔗 관련 개념

- [[Attention (어텐션)]] - (시퀀스 방향 어텐션을 깊이 방향으로 확장한 핵심 메커니즘)
- [[Neural Network Layer Depth]] - (깊이에 따른 표현 변화와 PreNorm dilution 문제의 배경)
- [[Residual Connection]] - (AttnRes가 대체하려는 기존 잔차 연결 메커니즘)

---

**작성일**: 2026-03-20
**분류**: Transformer Architecture / Depth Mixing
**출처**: Kimi Team (MoonshotAI), [GitHub](https://github.com/MoonshotAI/Attention-Residuals)