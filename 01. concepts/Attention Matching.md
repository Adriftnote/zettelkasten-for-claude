---
title: Attention Matching
type: concept
permalink: knowledge/concepts/attention-matching
tags:
- kv-cache
- attention
- inference-optimization
- compression
- closed-form
category: LLM Inference
difficulty: 고급
---

# Attention Matching

KV 캐시를 압축할 때, compact KV가 원본과 **동일한 attention 출력**을 재현하도록 closed-form 해로 맞추는 기법.

## 📖 개요

Attention Matching은 긴 컨텍스트의 KV 캐시(T tokens)를 소수의 compact KV(t tokens, t ≪ T)로 압축하되, 모델이 원본을 볼 때와 동일한 attention 결과를 내도록 보장하는 방법이다. 핵심 통찰은 attention over concatenated blocks가 **attention mass로 가중된 mixture**로 분해된다는 것이며, 이를 통해 mass 매칭과 output 매칭을 분리하여 각각 closed-form으로 풀 수 있다.

## 🎭 비유

1000페이지 교과서를 20페이지 요약본으로 만드는 상황을 생각해보자. 텍스트 요약(토큰 공간 압축)은 문장을 직접 줄이는 것이고, Attention Matching은 **"시험에서 학생이 어떤 페이지를 참고하든 같은 답을 쓰게 되는"** 요약본을 만드는 것이다. 내용 자체가 아니라, 참고했을 때의 결과가 동일하도록 맞춘다.

## ✨ 특징

- **Closed-form 해**: gradient descent 없이 NNLS(mass)와 OLS(output)로 직접 풀어 초 단위 실행
- **분해 가능한 구조**: attention mass 보존 + attention output 매칭을 독립적으로 최적화
- **Key Selection + Value Fitting**: 원본 key subset을 선택한 뒤, value만 새로 fitting
- **Head별 Nonuniform Budget**: 민감한 head에 더 많은 토큰을 배분하며, 입력과 무관하게 사전 계산 가능
- **50x 압축**: 60k → 1.2k tokens 수준에서 품질 유지

## 💡 예시

### 작동 흐름

```
원본 KV 캐시 (60,000 tokens)
        │
        ▼
[1] Reference Query 수집     ← 모델이 생성할 법한 Q 벡터
        │
        ▼
[2] Key Selection (OMP)      ← 원본 K에서 t개 subset 선택
        │
        ▼
[3] β Fitting (NNLS)         ← exp(β) > 0 으로 attention mass 매칭
        │
        ▼
[4] Value Fitting (OLS)      ← C_v = (X^TX)^{-1}X^TY (closed-form)
        │
        ▼
Compact KV 캐시 (1,200 tokens)  ← 모델 입장에서 "같은 attention 출력"
```

### 기존 방법과 비교

```
                토큰 공간 요약          Cartridges           Attention Matching
────────────────────────────────────────────────────────────────────────────────
압축 공간        텍스트 → 재인코딩       latent (K,V)         latent (K,V)
최적화 방법      없음 (요약기 의존)      gradient descent     closed-form (NNLS+OLS)
소요 시간        빠름                    수시간 (GPU)         초~분 단위
품질 (50x)       낮음                    보통                 좋음
핵심 제약        요약 품질에 종속         GPU 시간             key를 원본 subset으로 제한
```

## Relations

- extends [[Attention]] (attention의 Q·K·V 구조 위에서 작동하는 압축 기법)
- extends [[kv-cache-optimization]] (KV 캐시 최적화의 구체적 방법론)
- relates_to [[Context Management Levels]] (컨텍스트 크기 관리와 직결)
- sourced_from [[REF-058 Fast KV Compaction via Attention Matching]] (Zweiger et al., MIT, 2025)