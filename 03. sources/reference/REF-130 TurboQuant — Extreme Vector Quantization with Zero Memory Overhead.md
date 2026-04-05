---
title: REF-130 TurboQuant — Extreme Vector Quantization with Zero Memory Overhead
type: paper-review
permalink: sources/reference/turboquant-extreme-vector-quantization
tags:
- quantization
- kv-cache
- inference-optimization
- llm
- vector-compression
date: 2026-03-27
---

# TurboQuant — Extreme Vector Quantization with Zero Memory Overhead

Amir Zandieh, Vahab Mirrokni (Google Research) 외 — 3-bit KV 캐시 양자화로 메모리 6x 절감하면서 downstream 품질 무손실. 핵심은 양자화 상수(normalization) 오버헤드를 0으로 만드는 2단계 파이프라인.

## 📖 핵심 아이디어

기존 양자화는 블록별 normalization 상수를 full precision으로 저장해야 해서 1-2bit의 메모리 오버헤드가 발생한다. TurboQuant는 이 오버헤드를 제거하는 2단계 접근법을 제안한다:

1. **PolarQuant** — 직교좌표→극좌표 변환 후 각도의 집중 분포를 이용해 normalization 상수 없이 양자화
2. **QJL** — 1-bit 잔차 보정으로 양자화 오차를 추가 메모리 오버헤드 없이 보상

두 기법 모두 학습/파인튜닝 불필요하며, 런타임 오버헤드가 무시할 수 있는 수준.

## 🛠️ 구성 요소

| 구성 요소 | 방법 | 설명 |
|-----------|------|------|
| **PolarQuant** | Cartesian→Polar 변환 | 각도 분포가 예측 가능하여 normalization 불필요. "nearly loss-less" |
| **QJL** | Johnson-Lindenstrauss Transform | 벡터를 sign bit(+1/-1)로 축소. zero memory overhead |
| **2-Stage Pipeline** | PolarQuant + QJL residual | Stage 1에서 양자화, Stage 2에서 잔차를 1-bit로 보정 |
| **Random Rotation** | 사전 랜덤 회전 | 양자화 전 벡터 회전으로 성분별 독립 양자화 가능하게 함 |

## 🔧 작동 방식

```
[원본 벡터 (32-bit)]
        │
        ▼
┌─────────────────────────┐
│ 1. Random Rotation       │  벡터 성분 독립화
└─────────┬───────────────┘
          ▼
┌─────────────────────────┐
│ 2. PolarQuant            │  직교→극좌표 변환
│    (x,y,z) → (r, θ₁..θₙ)│  각도 분포 집중 → 상수 불필요
│    ≈ "nearly loss-less"  │
└─────────┬───────────────┘
          ▼
┌─────────────────────────┐
│ 3. QJL Residual          │  양자화 오차를 1-bit sign으로 보정
│    residual → {+1, -1}   │  JL Transform으로 거리 보존
│    zero memory overhead  │
└─────────┬───────────────┘
          ▼
[3-bit Quantized Vector — 6x 메모리 절감]
```

**극좌표 변환 핵심 직관**: "3블록 동쪽, 4블록 북쪽" → "5블록, 37도 방향". 반복 변환으로 최종 하나의 반지름 + 각도 집합으로 정제. 각도 패턴이 예측 가능하므로 정규화 그리드가 고정됨.

## 💡 실용적 평가

**벤치마크 결과**:

| 벤치마크 | 결과 |
|----------|------|
| LongBench | KV 메모리 6x+ 절감, downstream 무손실 |
| Needle-in-Haystack | 모든 벤치마크에서 perfect results |
| ZeroSCROLLS / RULER / L-Eval | 동일 |
| H100 Attention 속도 | 4-bit에서 32-bit 대비 **8x 속도 향상** |
| GloVe 벡터 검색 | PQ/RabbiQ보다 우수한 recall (codebook/튜닝 없이) |

**테스트 모델**: Gemma, Mistral, Llama-3.1-8B-Instruct

**장점**:
- 3-bit에서 품질 무손실 (학습/파인튜닝 없이)
- 양자화 상수 오버헤드 0 — 기존 방식의 1-2bit 추가 비용 제거
- H100에서 attention 연산 8x 가속
- KV 캐시 외에 벡터 검색에도 적용 가능
- 런타임 오버헤드 무시 수준

**한계/관찰**:
- ICLR 2026 발표 예정 — 아직 community 검증 초기 단계
- 실제 production 적용 사례는 미공개
- KV 캐시 compaction(REF-058)과는 직교적 — 결합 가능성 있음

**논문**:
- TurboQuant: arxiv.org/abs/2504.19874 (ICLR 2026)
- QJL: arxiv.org/abs/2406.03482
- PolarQuant: arxiv.org/abs/2502.02617 (AISTATS 2026)

## 🔗 관련 개념

- [[REF-058 Fast KV Compaction via Attention Matching]] - (KV 캐시 메모리 절감의 다른 축: compaction은 토큰 수 줄이고, TurboQuant는 토큰당 비트 수 줄임 — 결합 시 200x+ 압축 가능)
- [[kv-cache-optimization|KV-Cache Optimization]] - (Transformer KV 캐시 최적화 상위 개념)

---

**작성일**: 2026-03-27
**원본**: Zandieh & Mirrokni (Google Research), research.google/blog/turboquant
**분류**: LLM Inference Optimization