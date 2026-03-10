---
title: Superposition (중첩)
type: concept
permalink: knowledge/concepts/superposition
tags:
- AI
- LLM
- interpretability
- representation
category: AI/ML
difficulty: 고급
---

# Superposition (중첩)

신경망의 하나의 뉴런(또는 차원)이 여러 개념을 동시에 인코딩하는 현상

## 📖 개요

Superposition은 신경망이 표현해야 할 특징(feature)의 수가 사용 가능한 뉴런(차원) 수보다 많을 때, 여러 특징을 하나의 뉴런에 중첩시켜 저장하는 현상입니다. 이로 인해 개별 뉴런을 관찰해도 "이 뉴런이 무엇을 담당하는지" 해석하기 어려워집니다. Toy Models of Superposition (Elman et al., Anthropic 2022) 논문에서 체계적으로 분석되었습니다.

## 🎭 비유

여러 악기가 동시에 연주하는 오케스트라 녹음과 같습니다. 마이크 하나(뉴런)에 바이올린, 플루트, 드럼 소리가 섞여 있어서, 녹음만 들어서는 각 악기 소리를 분리하기 어렵습니다. 악기 수(특징)가 마이크 수(뉴런)보다 많기 때문에 발생하는 문제입니다.

## ✨ 특징

- **과잉 표현**: 특징 수 >> 뉴런 수일 때 발생 (모델이 효율적으로 압축)
- **희소성 의존**: 자주 쓰이지 않는 특징일수록 더 많이 중첩됨
- **간섭(Interference)**: 중첩된 특징들이 서로 간섭하여 노이즈 발생
- **해석 불가**: 개별 뉴런 단위로는 의미 파악이 어려움

## 💡 예시

### 왜 발생하는가

```
모델이 표현해야 할 특징: 100개 (고양이, 개, 색상, 감정, 문법, ...)
사용 가능한 뉴런:         10개

→ 뉴런 하나에 ~10개 특징을 중첩시켜야 함

뉴런 #7의 활성화 = 0.82
  이것이 "고양이" 때문인지, "긍정 감정" 때문인지,
  아니면 둘 다 조금씩인지 알 수 없음
```

### 기저 변환 관점으로 보면

```
현재 기저 (뉴런 기저):
  뉴런1 = 0.3×고양이 + 0.5×행복 + 0.2×빨강    ← 뒤엉김
  뉴런2 = 0.7×개     + 0.1×슬픔 + 0.2×파랑    ← 뒤엉김

SAE로 기저 변환 후:
  특징1 = 고양이 (단독)    ← 분리됨!
  특징2 = 개 (단독)        ← 분리됨!
  특징3 = 행복 (단독)      ← 분리됨!
```

## 🔬 핵심 연구

| 논문 | 핵심 내용 |
|------|----------|
| Toy Models of Superposition (Anthropic, 2022) | 중첩이 발생하는 조건을 체계적으로 분석 |
| Scaling Monosemanticity (Anthropic, 2024) | SAE로 Claude Sonnet에서 수백만 특징 분리 |
| Towards Monosemanticity (Anthropic, 2023) | 단일 의미 뉴런(monosemantic) 추출 시도 |

## ⚠️ MoE와의 관계

MoE(Mixture of Experts)는 중첩 문제를 아키텍처 수준에서 완화합니다. 전문가(Expert)가 특정 모달리티/도메인에 특화되면서 각 전문가 내부의 중첩 부담이 줄어듭니다. 이는 사후 분석(SAE)이 아닌 학습 과정에서의 해결 방식입니다.

## Relations

- addressed_by [[SAE (Sparse Autoencoder)]] (중첩을 희소 특징으로 분리하여 해결)
- relates_to [[기저 변환 (Change of Basis)]] (중첩 = 현재 기저에서 의미가 뒤엉킨 상태)
- relates_to [[Linear Representation Hypothesis]] (선형 표현이 중첩되어 있어도 방향으로 추출 가능)
- relates_to [[Mechanistic Interpretability]] (중첩 해소가 해석 가능성의 핵심 과제)
