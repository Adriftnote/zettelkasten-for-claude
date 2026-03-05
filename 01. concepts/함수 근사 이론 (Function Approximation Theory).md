---
title: 함수 근사 이론 (Function Approximation Theory)
type: concept
permalink: knowledge/concepts/function-approximation-theory
tags:
- approximation-theory
- machine-learning
- function-approximation
- optimization
category: 수학/ML 기초
difficulty: 중급
created: 2026-03-03
---

# 함수 근사 이론 (Function Approximation Theory)

데이터 간 관계를 설명하는 함수 f를 찾는 것 — ML의 가장 근본적인 목표

## 📖 개요

함수 근사 이론은 미지의 함수 f를 데이터로부터 추정하는 수학적 프레임워크입니다. ML의 모든 학습 과정(분류, 회귀, 생성 등)은 본질적으로 "데이터의 관계를 설명하는 함수 f를 찾는 것"으로 환원됩니다. 경사하강법으로 f를 반복 최적화하는 것이 표준 접근이지만, 최적화 없이 수학적으로 직접 구성하는 패러다임(구성적 근사)도 존재합니다.

## 🎭 비유

지도 그리기와 같습니다. 몇 개 도시의 좌표(데이터)를 알고 있을 때, 도시들 사이의 지형(함수 f)을 추정하는 것입니다. ML은 지도를 여러 번 고쳐 그리며(경사하강법) 점점 정확해지고, 구성적 근사는 수학 공식으로 한 번에 지도를 그립니다.

## ✨ 특징

- ML의 모든 학습은 함수 근사로 환원됨 (분류 = 결정 경계 함수, 회귀 = 매핑 함수, 생성 = 분포 함수)
- 표준 접근: 경험적 위험 최소화(ERM) — 손실함수를 경사하강법으로 반복 최적화
- 대안 접근: 구성적 근사 — 최적화 없이 수학적 구성법으로 직접 근사
- 근사의 질은 데이터 양, 함수 공간의 복잡도, 차원에 의존
- 신경망의 보편 근사 정리(Universal Approximation Theorem): 충분히 넓은 신경망은 임의의 연속함수를 근사 가능

## 💡 적용 사례

- **RNN/Transformer의 메모리**: 시퀀스를 읽으며 associative memory를 학습하는 과정 자체가 함수 근사. Memory Caching에서는 이 근사의 중간 상태(checkpoint)를 저장하여 과거 정보를 보존
- **LLM의 다음 토큰 예측**: P(다음 토큰 | 이전 토큰들)이라는 조건부 확률 함수를 근사하는 것
- **경사하강법의 정보 소멸**: 매 스텝 기울기는 버려지고 최종 파라미터만 남음 — 근사 과정은 사라지고 근사 결과만 존재

## Relations

- relates_to [[kv-cache-optimization|KV-Cache Optimization]] (KV-cache도 함수 근사 결과의 중간 상태를 저장하는 메커니즘)
- used_by [[REF-066 Memory Caching - RNNs with Growing Memory]] (메모리 모듈을 associative memory 학습의 최적화 checkpoint로 해석)
- used_by [[ML 훈련은 과정을 버리고 LLM은 목표 밖을 만든다]] (ML의 본질은 함수 근사라는 관점에서 도출)
- enables [[REF-059 Learning Without Training]] (근사이론으로 최적화 없이 직접 함수를 구성하는 패러다임)
