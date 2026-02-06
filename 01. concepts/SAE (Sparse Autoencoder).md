---
title: SAE (Sparse Autoencoder)
type: concept
permalink: knowledge/concepts/sae
tags:
- AI
- LLM
- interpretability
- autoencoder
category: AI/ML
difficulty: 고급
---

# SAE (Sparse Autoencoder)

LLM 내부 활성화에서 중첩된 특징들을 희소한 개별 특징으로 분리하는 해석 도구

## 📖 개요

Sparse Autoencoder(SAE)는 LLM의 hidden states를 입력받아 더 높은 차원의 희소(sparse) 표현으로 변환하는 비지도 학습 모델입니다. 하나의 뉴런이 여러 개념을 동시에 인코딩하는 "superposition" 문제를 해결하기 위해 사용됩니다. Anthropic, OpenAI 등에서 모델 해석에 핵심 도구로 활용 중입니다.

## 🎭 비유

여러 악기가 동시에 연주하는 오케스트라 녹음에서, 각 악기의 소리를 개별적으로 분리해내는 믹싱 보드와 같습니다. 뉴런 하나가 여러 개념을 섞어서 담고 있는 것을 개별 "특징"으로 풀어냅니다.

## ✨ 특징

- **희소성**: 한 번에 소수의 특징만 활성화
- **해석 가능**: 분리된 각 특징이 특정 개념에 대응
- **비지도**: 레이블 없이 특징 발견
- **스케일링**: 수백만 개 특징까지 확장 가능

## 💡 구조

```
Hidden State (d차원)
      ↓
   Encoder: h → ReLU(Wh + b)
      ↓
Sparse Features (n차원, n >> d)
      ↓
   Decoder: f → W'f + b'
      ↓
Reconstructed (d차원)

Loss = reconstruction + λ * sparsity
```

## ⚠️ 한계

- 정적 분석에 최적화 → 대화 중 동적 변화에 취약
- 어떤 특징이 "의미 있는지" 판단 기준 모호
- 대규모 모델에서 학습 비용 높음

## Relations

- part_of [[Mechanistic Interpretability]] (핵심 도구)
- addresses [[Superposition]] (중첩 문제 해결)
- challenged_by [[Linear Representations Change During Conversation]] (동적 변화 대응 어려움)
- relates_to [[Linear Representation Hypothesis]] (선형 표현 가정 위에 동작)