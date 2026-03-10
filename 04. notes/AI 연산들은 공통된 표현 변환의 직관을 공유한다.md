---
title: AI 연산들은 공통된 표현 변환의 직관을 공유한다
type: note
tags:
- 선형대수
- AI
- representation
- derived
permalink: notes/ai-operations-share-representation-transformation-intuition
source_facts:
- 기저 변환 (Change of Basis)
- 선형결합 (Linear Combination)
- Superposition (중첩)
- SAE (Sparse Autoencoder)
- REF-092 Beyond Language Modeling
---

# AI 연산들은 공통된 표현 변환의 직관을 공유한다

AI의 학습(Training), 해석(SAE), 압축(RAE)은 "더 의미 있는 표현 공간을 찾는다"는 공통된 수학적 직관을 공유한다. 이 직관의 뿌리는 선형대수의 기저 변환이지만, 실제 AI 연산들은 비선형성·차원 변화를 포함하므로 엄밀한 기저 변환이 아니라 더 일반적인 표현 변환(representation transformation)이다.

## 도출 근거

다음 facts의 조합에서 도출됨:

1. **기저 변환** - 같은 데이터도 어떤 좌표계(기저)로 보느냐에 따라 패턴이 보이기도 하고 안 보이기도 한다
2. **선형결합** - 행렬곱 Ax = b를 열벡터의 선형결합으로 해석하면, AI의 임베딩 조회는 기저 벡터 선택이고, Attention의 가중합은 계수 조절이다
3. **Superposition** - 뉴런에 여러 특징이 중첩되는 것은 현재 표현 공간에서 의미가 뒤엉킨 상태이며, 표현을 바꾸면 분리 가능하다
4. **SAE** - overcomplete 기저에서의 희소 표현을 찾는 도구. dictionary learning의 연장으로, 이 노트에서 "기저 변환" 비유가 가장 정확하게 적용되는 사례
5. **RAE** (Beyond Language Modeling 논문) - 이미지의 픽셀 공간(196,608차원)을 의미 토큰 공간(256×1024차원)으로 비선형 압축. 차원과 구조가 바뀌므로 기저 변환이 아니라 표현 학습(representation learning)

> 따라서: **AI에서 "학습", "해석", "압축"이라 불리는 서로 다른 작업들은 "더 의미 있는 표현을 찾는다"는 공통된 직관을 공유한다. 기저 변환은 이 직관의 선형적 원형(prototype)이지, AI 연산 전체와 동일하지는 않다.**

## ⚠️ 비유와 동일성의 구분

선형대수의 기저 변환은 세 가지 조건을 갖는다: (1) 선형, (2) 가역, (3) 차원 보존. AI 연산들은 이 조건을 대부분 위반한다.

| 연산 | 선형? | 가역? | 차원 보존? | 판정 |
|------|-------|-------|-----------|------|
| SAE | ReLU 포함 | overcomplete (d→4d) | 위반 | 가장 가까움 (sparse coding) |
| Attention 가중합 | 가중합 자체는 선형 | softmax 비선형 | 보존 | 선형 부분만 해당 |
| 학습 (Training) | ReLU 등 비선형 | 비가역 | 변환 | 비유적 |
| RAE | 딥 네트워크 (비선형) | 손실 압축 | 위반 | 표현 학습이 정확 |
| MoE 라우팅 | 라우팅 자체가 이산 선택 | 비가역 | — | 범주 다름 (경로 선택) |

## Observations

- [fact] SAE는 overcomplete 기저에서의 희소 표현을 찾는 것으로, dictionary learning / sparse coding의 연장선이다 — "기저 변환" 비유가 학계에서도 사용되는 가장 방어 가능한 사례 #해석가능성
- [interpretation] AI 모델의 학습은 비선형 활성 함수를 포함하므로, 좌표계를 바꾸는 것(기저 변환)이 아니라 공간 자체를 접고 늘리는 변환이다. 각 레이어의 선형 부분(가중치 행렬곱)만 기저 변환에 해당한다 #표현학습
- [interpretation] RAE의 픽셀→의미 토큰 변환은 차원이 바뀌므로 기저 변환이 아닌 차원 축소(dimensionality reduction) 또는 표현 학습이 정확한 용어다 #압축
- [interpretation] Attention의 가중합(Σ αᵢvᵢ)은 선형결합으로 기저 변환 직관이 적용되지만, 가중치 계산(QKᵀ→softmax)은 비선형이므로 전체를 "기저 변환과 동일"이라 하면 핵심(비선형 문맥 의존성)을 빠뜨린다 #선형대수
- [method] 새로운 AI 아키텍처를 만났을 때 "이것이 어떤 공간에서 어떤 표현으로의 변환인가?"라고 질문하면 본질을 빠르게 파악할 수 있다. 단, 비선형성과 차원 변화를 확인하여 선형 직관의 적용 범위를 판단해야 한다 #사고법
- [example] 연립방정식 ax+by=c를 열벡터 시점 x·(a,b)+y·(b,c)=(c,z)로 보면, 행렬곱의 선형결합 구조가 직관적으로 드러난다 — Attention의 가중합 부분이 이 구조를 따르지만, softmax를 거친 전체 Attention은 이보다 복잡하다 #선형대수

## Relations

- derived_from [[기저 변환 (Change of Basis)]] (직관의 선형적 원형 — AI 표현 변환의 출발점이나 동일하지는 않음)
- derived_from [[선형결합 (Linear Combination)]] (Attention 가중합, 임베딩 조회 등 AI의 선형 부분이 이 구조를 따름)
- derived_from [[Superposition (중첩)]] (현재 표현에서 의미가 뒤엉킨 상태 — 더 나은 표현의 필요성)
- derived_from [[SAE (Sparse Autoencoder)]] (기저 변환 비유가 가장 정확하게 적용되는 사례)
- derived_from [[REF-092 Beyond Language Modeling — Multimodal Pretraining 설계 공간 탐색]] (RAE의 비선형 표현 학습과 MoE의 경로 분업이 선형 직관을 넘어서는 사례)

---

**도출일**: 2026-03-10
**출처**: 선형대수 기초(기저 변환, 선형결합) + AI 해석가능성(SAE, Superposition) + 멀티모달 사전학습(RAE, MoE) 개념 조합에서 도출. 초안의 과한 주장을 비선형성·차원 변화 관점에서 교정.
