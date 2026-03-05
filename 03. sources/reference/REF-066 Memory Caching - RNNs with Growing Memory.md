---
title: REF-066 Memory Caching - RNNs with Growing Memory
type: paper-review
permalink: sources/reference/memory-caching-rnns-growing-memory
tags:
- RNN
- memory-caching
- sequence-modeling
- linear-attention
- Titans
date: 2026-03-03
---

# Memory Caching: RNNs with Growing Memory

RNN의 고정 메모리 한계를 극복하기 위해, 메모리 상태의 중간 checkpoint를 캐싱하여 효과적 메모리 용량이 시퀀스 길이에 따라 성장하도록 하는 기법 (Google Research, NeurIPS).

## 📖 핵심 아이디어

Transformer는 성장하는 메모리(KV-cache)로 강력하지만 O(L²) 비용이 들고, RNN은 O(L)이지만 고정 메모리가 recall 병목이 된다. **Memory Caching(MC)**은 시퀀스를 세그먼트로 나누고 각 세그먼트의 압축된 메모리 상태를 캐싱하여, O(NL) 복잡도로 두 극단 사이의 유연한 trade-off를 제공한다.

핵심 수식: `y_t = Agg({M_L^(1)(·), ..., M_L^(s-1)(·)}; M_t^(s)(·); q_t)` — 모든 캐시된 메모리 + 현재 온라인 메모리로 출력 계산.

## 🛠️ 4가지 Aggregation 변형

| 변형                                 | 핵심 메커니즘                                    | 특성                                  |
| ---------------------------------- | ------------------------------------------ | ----------------------------------- |
| **Residual Memory**                | 캐시된 메모리 출력의 단순 합산                          | Linear memory에서는 고정 메모리로 축약됨        |
| **Gated Residual Memory (GRM)**    | 입력 의존적 gating (γ = ⟨u_t, MeanPool(S^(i))⟩) | 선택적 검색, Linear에서도 축약 안 됨. **최고 성능** |
| **Memory Soup**                    | 캐시된 메모리의 파라미터를 보간                          | Linear에서 GRM과 동일, deep memory에서 구별됨 |
| **Sparse Selective Caching (SSC)** | MoE 스타일 라우터로 top-k 캐시만 선택                  | 메모리 오버헤드 최소, **효율성 최고**             |

## 🔧 작동 방식

```
시퀀스: [토큰1 ... 토큰256 | 토큰257 ... 토큰512 | ...]
         세그먼트 1          세그먼트 2
         → M_256^(1) 캐싱    → M_512^(2) 캐싱    → ...

검색 시:
  쿼리 q_t → 현재 온라인 메모리 M_t^(s)(q_t)
           + 캐시된 메모리들 γ^(1)·M^(1)(q_t) + γ^(2)·M^(2)(q_t) + ...
           (γ = context-aware gating weights)
```

**세그먼트 전략 비교:**
- 등분할 (C=L/N): O(L²/C) — Transformer보다 효율적, recall 우수
- 로그 분할 (2의 거듭제곱): O(L log L) — 계산 효율적이나 긴 과거 해상도 낮음

**두 가지 설계 관점:**
- Optimization View: 이전 세그먼트 상태에서 이어서 시작 (망각 방지)
- Compression View: 독립적 메모리 모듈 (세그먼트 간 간섭 방지)

## 📊 실험 결과

| 모델 (760M) | Wikitext PPL↓ | Avg Acc↑ | NIAH-1 (16K) | Retrieval Avg |
|-------------|---------------|----------|--------------|---------------|
| Transformer++ | 20.53 | 50.24% | 100% | 41.00% |
| Titans (base) | 19.91 | 51.76% | 74.2% | 30.55% |
| **Titans + GRM** | **19.14** | **52.55%** | **100%** | **40.50%** |
| Titans + SSC | 19.25 | 52.13% | 99.8% | 39.80% |

1.3B 모델에서 Titans+GRM: PPL 15.37, Avg 58.33% (Transformer++ 53.19% 대비 +5%)

**핵심 발견:**
- GRM이 모든 작업에서 가장 우수, SSC는 효율성-성능 최적
- MC-enhanced RNN이 NIAH에서 base RNN 대비 극적 향상 (74% → 100%)
- In-context retrieval에서 Transformer와 거의 동등 (40.5% vs 41.0%)
- Post-training에도 적용 가능 (학습 가능 가중치 없이 이동평균만으로 길이 외삽 향상)

## 💡 실용적 평가

**강점:**
- 모든 RNN 아키텍처에 범용 적용 가능 (Linear Attention, Titans, DLA 등)
- Transformer-RNN 사이 유연한 trade-off (세그먼트 크기로 조절)
- Post-training 적용으로 기존 모델 즉시 개선 가능
- SSC 변형은 최소 오버헤드로 실용적

**한계:**
- In-context recall에서 여전히 Transformer가 최강
- 로그 세그먼트는 recall-intensive 작업에서 제한적
- 캐시 메모리 수 증가 시 검색 비용 O(N) 선형 증가

**이론적 의의:**
- 세그먼트 크기 1로 설정 시 gated global softmax attention과 동등 → Transformer와 RNN의 통합 프레임워크
- Deep memory에서 토큰이 상수 벡터가 아닌 텐서로 표현 → novel architecture class

## 🔗 관련 개념

- [[Dep-Search- Dependency-Aware Reasoning with Persistent Memory]] - (둘 다 메모리 확장으로 long-context 성능을 향상시키는 접근, MC는 캐싱 기반 / Dep-Search는 persistent memory 기반)
- [[kv-cache-optimization|KV-Cache Optimization (KV-캐시 최적화)]] - (MC의 캐싱이 KV-cache의 대안적 접근 — Transformer는 토큰별 KV 캐싱, MC는 세그먼트별 메모리 상태 캐싱)
- [[함수 근사 이론 (Function Approximation Theory)]] - (MC의 메모리 모듈을 associative memory 학습의 최적화 checkpoint로 해석하는 관점)

---

**작성일**: 2026-03-03
**분류**: Sequence Modeling / Memory Architecture
**저자**: Ali Behrouz, Zeman Li, Yuan Deng, Peilin Zhong, Meisam Razaviyayn, Vahab Mirrokni (Google Research)
**학회**: NeurIPS