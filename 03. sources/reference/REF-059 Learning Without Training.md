---
title: REF-059 Learning Without Training
type: paper-review
permalink: sources/reference/learning-without-training
tags:
- manifold-learning
- transfer-learning
- active-learning
- approximation-theory
- classification
- signal-separation
date: 2026-02-24
---

# Learning Without Training

Ryan O'Dowd 박사논문 (Claremont Graduate University, 2026). 근사이론과 조화해석을 활용해 기존 ML의 "학습(training)" 없이 함수 근사·전이학습·분류를 수행하는 수학적 프레임워크.

## 📖 핵심 아이디어

기존 ML은 경험적 위험 최소화(ERM)로 모델을 훈련하지만, 이 논문은 근사이론(approximation theory)으로 데이터에서 직접 좋은 근사를 구성(construct)한다. "Training 없이 Learning" — 최적화 대신 수학적 구성법을 쓴다는 패러다임 전환. 세 가지 독립 프로젝트로 이 아이디어를 전개한다.

## 🛠️ 구성 요소 / 주요 내용

| 프로젝트 | 주제 | 핵심 기여 |
|----------|------|-----------|
| **Ch.2** 매니폴드 위 근사 | 미지의 저차원 매니폴드 위 함수 근사 | 매니폴드 구조를 찾지 않고 차원만으로 직접 근사 (localized kernels) |
| **Ch.3** 국소 전이학습 | 한 도메인의 모델을 다른 도메인에 전이 | 전이학습을 매니폴드 간 함수 lifting으로 정의, 역문제와 연결 |
| **Ch.4** 분류 via 신호분리 | Active learning 패러다임의 분류 | 신호분리(super-resolution)와 분류를 통합, MASC 알고리즘 제안 |

## 🔧 작동 방식 / 적용 방법

### 프로젝트 1: 매니폴드 위 직접 근사

```
기존 방식: 데이터 → 매니폴드 발견 → 매니폴드 위 근사 (2단계)
제안 방식: 데이터 → localized kernel로 직접 근사 (1단계)
  - 매니폴드 구조 불필요, 차원 q만 알면 됨
  - 구면 조화함수 + 국소 커널로 구성적(constructive) 근사
  - 오류 한계 이론적 보장
```

### 프로젝트 2: 국소 전이학습

```
Source domain (X) → Target domain (Y)
  - 전이 = 함수 lifting: f_X → f_Y
  - Joint data space에서 국소 평활성(local smoothness) 분석
  - 역 Radon 변환 등 역문제와 수학적으로 동치
```

### 프로젝트 3: MASC 알고리즘

```
입력: 비라벨 데이터 + 오라클(소수 라벨 쿼리)
  1. 데이터를 메트릭 공간에 임베딩
  2. 거리 임계값 η로 멀티스케일 그래프 클러스터링
  3. 각 클러스터의 modal point만 라벨 쿼리 (active learning)
  4. 불확실 포인트는 k-NN으로 할당
출력: 클래스 수가 자동 결정되는 분류 결과
```

## 💡 실용적 평가 / 적용

**강점**:
- 최적화 없이 구성적 근사 → 수렴 보장, local minima 문제 없음
- 매니폴드 구조 발견 불필요 → 고차원 데이터에 실용적
- MASC: 클래스 수 사전 지정 불필요, 라벨 효율적 (active learning)

**한계**:
- 매니폴드 차원 q를 알아야 함 (실전에서는 추정 필요)
- 대규모 데이터셋에서의 계산 복잡도 미검증
- MASC의 실제 성능은 합성/소규모 데이터셋에서만 검증

**우리 맥락에서의 시사점**:
- "Training 없이 Learning" 패러다임 → 임베딩 기반 검색(vecsearch)과 유사한 철학: 모델 훈련 없이 사전학습된 임베딩으로 의미 검색
- 전이학습을 함수 lifting으로 보는 관점 → 도메인 간 지식 전이 설계에 참고

## 🔗 관련 개념

- [[근사이론]] - 함수 근사의 수학적 기초
- [[매니폴드 학습]] - 고차원 데이터의 저차원 구조
- [[전이학습]] - 도메인 간 지식 전이
- [[Active Learning]] - 라벨 효율적 학습
- [[신호분리]] - super-resolution, point source 추정

---

**작성일**: 2026-02-24
**분류**: ML 이론 / 근사이론