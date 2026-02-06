---
title: Mechanistic Interpretability
type: concept
permalink: knowledge/concepts/mechanistic-interpretability
tags:
- AI
- LLM
- interpretability
- AI안전성
category: AI/ML
difficulty: 고급
---

# Mechanistic Interpretability

신경망 내부 메커니즘을 역공학하여 모델이 "어떻게" 작동하는지 이해하는 연구 분야

## 📖 개요

Mechanistic Interpretability(기계적 해석 가능성)는 신경망을 블랙박스로 취급하지 않고, 내부 뉴런·회로·표현을 분석하여 모델의 의사결정 과정을 역공학하는 연구 분야입니다. "왜 이런 출력을 냈는가?"를 넘어 "내부에서 어떤 계산이 일어났는가?"를 밝히는 것이 목표입니다.

## 🎭 비유

시계가 고장났을 때, 겉에서 바늘만 보는 게 아니라 뒷판을 열어서 톱니바퀴 하나하나를 검사하는 것과 같습니다. 어떤 톱니가 어떤 톱니를 돌리는지 파악해야 진짜 수리할 수 있습니다.

## ✨ 특징

- **회로 분석**: 특정 행동을 담당하는 뉴런/헤드 조합 식별
- **특징 시각화**: 각 뉴런이 반응하는 패턴 분석
- **인과적 개입**: activation 수정으로 가설 검증
- **스케일 문제**: 모델이 커질수록 분석 어려워짐

## 💡 주요 방법론

- **Probing**: 선형 분류기로 내부 표현 읽기
- **Activation Patching**: 특정 activation 교체로 인과 관계 파악
- **SAE (Sparse Autoencoder)**: 중첩된 특징 분리
- **Steering Vectors**: 방향 벡터로 모델 행동 조종

## Relations

- enables [[Linear Representation Hypothesis]] (이론적 기반 제공)
- uses [[SAE (Sparse Autoencoder)]] (핵심 도구)
- uses [[Steering Vector]] (개입 방법)
- uses [[CCS (Contrast Consistent Search)]] (진실성 탐지)
- motivated_by [[AI 안전성]] (안전한 AI를 위해)
- challenged_by [[Linear Representations Change During Conversation]] (동적 변화에 취약)