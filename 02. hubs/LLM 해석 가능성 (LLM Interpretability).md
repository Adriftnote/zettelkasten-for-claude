---
title: LLM 해석 가능성 Hub
type: hub
permalink: hubs/llm-interpretability
tags:
- hub
- AI
- LLM
- interpretability
- AI안전성
---

# LLM 해석 가능성 Hub

LLM 내부 표현의 구조, 해석 방법, 그리고 그 한계에 관한 지식을 조직화합니다.

## Observations

- [fact] LLM 내부에 개념을 인코딩하는 선형 방향(linear direction)이 존재함 #경험적발견
- [fact] 선형 표현은 고정이 아니라 대화 맥락에 따라 변할 수 있음 #최신발견
- [fact] Layer Normalization이 truth direction 출현의 핵심 메커니즘 #메커니즘
- [method] 대조 쌍(contrastive pairs)으로 내부 표현의 방향 벡터 추출 #방법론
- [method] Steering vector로 파라미터 변경 없이 모델 행동 조종 가능 #개입방법
- [decision] 정적 해석만으로는 불충분 — 동적 맥락 변화 고려 필수 #연구방향
- [question] 맥락에 강건한(context-robust) truth probe는 가능한가? #미해결

## Relations

### 핵심 가설
- organizes [[Linear Representation Hypothesis]] (1. 선형 표현 가설)
  - extends [[In-Context Learning]] (1a. 표현 변화의 원인)

### 해석 도구
- organizes [[Mechanistic Interpretability]] (2. 상위 연구 분야)
  - extends [[SAE (Sparse Autoencoder)]] (2a. 특징 분리 도구)
  - extends [[CCS (Contrast Consistent Search)]] (2b. 진실 방향 추출)
  - extends [[Steering Vector]] (2c. 행동 조종 기법)

### 문제와 한계
- organizes [[Sycophancy (아첨)]] (3. 실용적 문제)

### 근거 논문
- references [[Linear Representation Hypothesis - LLM 기하학]] (수학적 형식화)
- references [[Emergence of Linear Truth Encodings in LMs]] (출현 메커니즘)
- references [[Linear Representations Change During Conversation]] (맥락 의존성)

### 연구 흐름
- connects_to [[AI 안전성]] (상위 목표)