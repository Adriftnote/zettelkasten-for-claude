---
title: RAE (Representation Autoencoder)
type: concept
permalink: knowledge/concepts/rae
tags:
- AI
- multimodal
- autoencoder
- vision
category: AI/ML
difficulty: 고급
---

# RAE (Representation Autoencoder)

사전학습된 비전 인코더(SigLIP 2)의 의미 표현을 이산 토큰으로 변환하여, 이미지의 이해와 생성을 단일 표현으로 통합하는 오토인코더

## 📖 개요

RAE는 Meta FAIR의 Beyond Language Modeling(2026) 논문에서 제안된 시각 토크나이저입니다. SigLIP 2 인코더가 추출한 의미 표현(semantic representation)을 입력받아 이산 토큰으로 압축하고, 디코더로 복원합니다. 기존 VAE(Variational Autoencoder)가 픽셀 수준 재구성에 최적화되어 이미지 생성에는 강하지만 이해(VQA 등)에 약했던 반면, RAE는 의미 수준에서 압축하므로 이해와 생성을 하나의 토큰 표현으로 모두 처리할 수 있습니다.

## 🎭 비유

VAE가 사진을 "점 하나하나 기억해서 다시 그리는" 복사기라면, RAE는 사진을 보고 "여자가 미소 짓고, 배경은 풍경"이라고 요약한 뒤 그 요약으로 다시 그리는 화가입니다. 요약이 의미 중심이라서, "이 사진에 뭐가 있어?"라는 질문(이해)에도 잘 답하고, "다시 그려줘"(생성)도 잘 합니다.

## ✨ 특징

- **의미 기반 압축**: 픽셀이 아닌 SigLIP 2의 의미 표현을 입력으로 사용
- **이해+생성 통합**: 단일 토큰 표현으로 VQA(이해)와 이미지 생성 모두 수행
- **텍스트 토큰과 동일 형식**: 출력이 고정 차원 벡터 시퀀스 → 트랜스포머에 직접 입력 가능
- **예측 목표**: RAE는 x-prediction, VAE는 v-prediction이 최적 (Beyond LM 논문 실험 결과)

## 💡 예시

### 구조

```
이미지 (256×256)
    ↓
[SigLIP 2 인코더]  ← 사전학습된 비전 모델 (고정)
    ↓
의미 표현 (고차원 연속 벡터)
    ↓
[RAE 인코더: 압축]
    ↓
이산 토큰 (256개 × 1024차원)  ← 이것이 트랜스포머에 들어감
    ↓
[RAE 디코더: 복원]
    ↓
의미 표현 복원 → 이미지 생성 (Flow matching)
```

### VAE vs RAE 비교

| | VAE | RAE |
|--|-----|-----|
| 입력 | 원시 픽셀 | SigLIP 2 의미 표현 |
| 압축 대상 | 시각적 외관 (색상, 텍스처) | 의미 (객체, 관계, 장면) |
| 이미지 이해 (VQA) | △ 약함 | ○ 강함 |
| 이미지 생성 | ○ 강함 | ○ 강함 |
| 별도 인코더 필요? | 이해용 CLIP 등 추가 필요 | 불필요 (단일 표현) |

### Transfusion에서의 역할

```
텍스트: "이 사진 속 동물은" → 텍스트 토크나이저 → [토큰, 토큰, ...]
이미지: 🐱 고양이 사진      → RAE 인코더        → [토큰, 토큰, ...]
                                                    ↑ 형식 동일!
→ 이어붙여서 하나의 시퀀스로 트랜스포머에 입력
→ 텍스트는 CE loss, 이미지는 Flow matching loss로 학습
```

## ⚠️ 한계

- SigLIP 2 인코더에 의존 — 인코더의 표현 품질이 RAE의 상한을 결정
- 원시 픽셀 직접 학습이 아니므로, 인코더가 놓치는 시각 정보는 손실
- 현재 논문 기준 최대 13.5B 규모에서만 검증 — 더 큰 모델에서의 성능은 미확인

## Relations

- different_from [[SAE (Sparse Autoencoder)]] (SAE는 해석 도구, RAE는 멀티모달 토크나이저. 둘 다 오토인코더이나 목적이 다름)
- relates_to [[Token (토큰)]] (RAE의 출력이 이미지 토큰 — 텍스트 토큰과 동일 형식으로 변환)
- relates_to [[MoE (Mixture of Experts)]] (Beyond LM 논문에서 RAE + MoE 조합이 최적 성능 달성)
- used_by [[REF-092 Beyond Language Modeling — Multimodal Pretraining 설계 공간 탐색]] (이 논문의 핵심 구성요소)
