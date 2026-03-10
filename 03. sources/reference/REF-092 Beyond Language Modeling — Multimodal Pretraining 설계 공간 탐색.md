---
title: REF-092 Beyond Language Modeling — Multimodal Pretraining 설계 공간 탐색
type: paper-review
permalink: sources/reference/beyond-language-modeling-multimodal-pretraining
tags:
- multimodal
- pretraining
- MoE
- world-model
- RAE
- diffusion
- paper-review
date: 2026-03-10
---

# Beyond Language Modeling — Multimodal Pretraining 설계 공간 탐색

Meta FAIR + NYU의 멀티모달 사전학습 설계 공간 체계적 분석. 단일 RAE 시각 표현 + MoE 아키텍처로 언어·비전·월드 모델링을 통합하고, 모달리티 경쟁이 설계 선택의 문제임을 실증.

## 📖 핵심 아이디어

언어 전용 모델의 물리적 세계 이해 부족과 텍스트 데이터 고갈 문제에 대응하여, 비전과 언어를 통합하는 멀티모달 사전학습의 설계 공간을 체계적으로 분석한다. 핵심 결론: (1) 단일 RAE(Representation Autoencoder)로 이해+생성 모두 가능, (2) MoE가 모달리티 간 스케일링 비대칭을 해결, (3) 월드 모델링 능력이 사전학습에서 자연 출현.

## 🛠️ 구성 요소 / 주요 내용

### 4가지 핵심 발견

| #   | 주제     | 발견                                                      |
| --- | ------ | ------------------------------------------------------- |
| 1   | 시각 표현  | RAE(SigLIP 2 기반)가 이해+생성 모두 최적 — VAE 대비 VQA·이미지 생성 모두 우수 |
| 2   | 데이터 영향 | 시각+언어 데이터는 상호보완적. 비디오는 언어 성능 저하 없이 호환                   |
| 3   | 월드 모델링 | 1% 도메인 데이터만으로 물리적 예측 능력 출현. 액션을 텍스트 토큰으로 표현             |
| 4   | 아키텍처   | MoE(G=16 세분화)가 최적. 모달리티 특화 전문가가 자연 형성                   |

### Transfusion 프레임워크

| 모달리티 | 학습 방법 | 마스킹 |
|----------|-----------|--------|
| 언어 | Next-token prediction (CE loss) | Causal |
| 비전 | Frame-wise flow matching (Diffusion) | Block-wise causal |
| 손실 가중치 | λ_LM = 1.0, λ_flow = 3.0 | Hybrid attention |

## 🔧 작동 방식 / 적용 방법

### 아키텍처

```
텍스트 토큰 ──┐
              ├──→ Decoder-only Transformer (MoE) ──→ 텍스트 출력
시각 토큰 ────┘     │                                   │
  (RAE 인코딩)      └── Modality-specific FFN ──────→ 이미지 생성
                                                    (Flow matching)
```

- 백본: Decoder-only Transformer (2.3B, 활성 1.5B)
- 시각 인코더: SigLIP 2 So400M → RAE로 이산화
- 토크나이저: LLaMA-3 BPE

### 스케일링 법칙 (Dense vs MoE)

| | Dense 언어 | Dense 비전 | MoE 언어 | MoE 비전 |
|--|-----------|-----------|---------|---------|
| 파라미터 α | 0.47 | 0.37 | 0.41 | 0.36 |
| 데이터 β | 0.53 | 0.63 | 0.59 | 0.64 |

비전은 언어보다 데이터 집약적. MoE가 파라미터 스케일링 격차를 0.10→0.05로 절반 감소.

### MoE 전문가 특화 패턴

- 텍스트 전문가: 대부분 텍스트 특화
- 비전 전문가: 범용 작동, 이해+생성이 동일 전문가 활용
- 예측 목표: RAE→x-pred, VAE→v-pred 최적

## 💡 실용적 평가 / 적용

**의의**
- 모달리티 경쟁은 근본적 결함이 아니라 설계 선택의 문제 — 데이터 분포 변화와 아키텍처 선택이 주요 원인
- 단일 RAE로 이해+생성 통합 → 별도 인코더 불필요
- 1% 도메인 데이터로 월드 모델링 출현 → 범용 사전학습의 가능성

**한계/향후 방향**
- 최대 13.5B 규모 — 더 큰 모델에서의 검증 필요
- 멀티모달 강화학습(RL) 미탐색
- 원시 픽셀 직접 학습 방향 모색 중

**실험 규모**: 최대 1T 토큰 (520B 텍스트 + 520B 멀티모달), 1.5B~13.5B 파라미터, 최대 1008개 MoE 전문가

## 🔗 관련 개념

- [[SAE (Sparse Autoencoder)]] - (Autoencoder 계열 희소 표현 학습이라는 구조적 유사성, RAE도 고차원 의미 표현 분리)

---

**작성일**: 2026-03-10
**분류**: AI / Multimodal Learning
**저자**: Shengbang Tong, Yann LeCun, Saining Xie 외 (FAIR Meta, NYU)
**발표**: 2026-03-03
**원본**: https://beyond-llms.github.io/