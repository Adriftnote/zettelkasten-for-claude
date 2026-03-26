---
title: REF-122 Perception Encoder — 중간 레이어에 숨겨진 최적 비전 임베딩
type: paper-review
permalink: sources/reference/perception-encoder-intermediate-layer-embeddings
tags:
- vision-encoder
- contrastive-learning
- intermediate-layer
- multimodal
- CLIP
date: 2026-03-20
---

# Perception Encoder (PE)

Meta FAIR. 단순한 대조적 비전-언어 사전학습(CLIP 스타일)만으로 분류·언어 모델링·밀집 예측 등 모든 비전 태스크에서 SOTA를 달성하는 통합 비전 인코더 패밀리. 핵심 발견: **최적 임베딩은 네트워크 출력이 아닌 중간 레이어에 숨겨져 있으며, 정렬 튜닝으로 끌어올릴 수 있다**.

## 📖 핵심 아이디어

기존 비전 인코더는 태스크별로 다른 사전학습이 필요했음 (AIMv2=분류/언어, DINOv2=공간). PE는 CLIP 학습만으로도 **중간 레이어에서 모든 태스크에 강력한 특징을 동시에 보유**함을 최초로 체계적으로 증명. 마지막 레이어에서 성능이 급락하는 이유: layer 33부터 'global token'이 등장하여 공간적 국소성이 감소.

해법: 두 가지 정렬(alignment)로 중간 레이어 특징을 출력으로 끌어올림 — (1) 언어 정렬(PE_lang), (2) 공간 정렬(PE_spatial).

## 🛠️ PE 모델 패밀리

| 모델 | 역할 | 핵심 구조 | 파라미터 |
|------|------|-----------|----------|
| **PE_core** | 통합 이미지+비디오 대조 인코더 | ViT-G, 5.4B 이미지-텍스트 쌍, 3단계 학습 | 1.88B |
| **PE_lang** | MLLM용 언어 정렬 인코더 | PE_coreG layer 47 출력 + Llama 3.2 3B 정렬 | 1.7B |
| **PE_spatial** | 탐지/추적/깊이용 공간 정렬 인코더 | Self-distill + SAM 2.1 마스크 로짓 증류 | 1.88B |

### PE_core 학습 파이프라인

```
Stage 1: 이미지 사전학습
  5.4B 이미지-텍스트 쌍 (MetaCLIP), 86B 샘플, 98→448px 점진적 해상도

Stage 2: 이미지+비디오 파인튜닝
  이미지 50M + 비디오 22M (재캡셔닝), 8프레임 균일 샘플링→평균 풀링

Stage 3: 소형 모델 증류
  PE_coreG(2B) → B, L 스케일로 KL-divergence 증류
```

### 중간 레이어 분석 (핵심 발견)

```
Layer:  1 ─── 32 ─── 33 ─── 40 ─── 47 ─── 50
        │      │      │      │      │      │
        │   추적 최적  │  탐지/깊이  │   언어 최적  │
        │      │   global    최적     │      │
        │      │   token     │      │   성능 급락
        │      │   등장!     │      │      │
```

- **Layer 32**: 추적 최적 (global token 등장 직전)
- **Layer ~40**: 탐지/깊이 최적
- **Layer 47**: 언어 태스크 최적 (PE_lang 출력층)
- **Layer 50(출력)**: 성능 급락 — CLIP 손실에 최적화되었지만 일반 특징은 손실

### PE_lang 정렬

PE_coreG layer 47 + Llama 3.2 3B(unfrozen) + 2-layer MLP projector. 70M 샘플 SFT. 마지막 3레이어 제거(1.9B→1.7B)로 오히려 성능 향상. Regularization(LayerScale + DropPath)이 +1.8점 기여.

### PE_spatial 정렬 (이중 증류)

1. **Self-distillation**: PE_coreG frozen layer 41 → 코사인 유사도 손실
2. **SAM 2.1 마스크 로짓 증류**: SAM의 마스크 로짓(32×32 그리드)을 쌍별 코사인 유사도 행렬로 변환 후 MSE — SAM 피처 직접 증류 대신 마스크 로짓 사용으로 global token 문제 우회

## 📊 성능

| 태스크 | PE 모델 | 성능 | 비고 |
|--------|---------|------|------|
| Zero-shot ImageNet | PE_coreG | **85.4%** | JFT-3B/WebLI 없이 독점 모델 최초 능가 |
| Robustness 평균 | PE_coreG | **86.6%** | 6개 벤치마크 |
| Zero-shot Kinetics-400 | PE_coreG | **76.9%** | 22M 비디오로 InternVideo2(102M) 동등/능가 |
| kNN/Linear/Attn Probing | PE_coreG | **86.8/89.5/89.8** | 오픈 인코더 전체 최고 |
| DocVQA | PE_langG | **94.6** | MLLM 평균 +3.5점 |
| COCO box mAP | PE_spatialG | **66.0** | 탐지 정렬 데이터 없이 DETR로 SOTA |
| DAVIS 추적 | PE_spatialG | **61.5** | |

### PE Video Dataset (PVD)

100만 다양한 비디오 + 12만 인간 정제 캡션. 3단계 데이터 엔진: PLM 캡셔너 구축 → 인간 정제(265K) → LLM 합성 캡션(22M). 품질 필터링: 모션 특징 + DINOv2/SigLIP + LLaVA 26개 질문 → Random Forest 점수 예측.

## 💡 실용적 평가

**강점**:
- 단일 사전학습(CLIP)으로 모든 태스크 커버 — 태스크별 별도 모델 불필요
- 중간 레이어 활용이라는 간단하지만 강력한 통찰
- 코드·모델·데이터셋 모두 공개 (GitHub, Meta AI)
- Progressive Resolution으로 학습 FLOPs 절반 절감

**AttnRes(REF-119)와의 연결**:
- AttnRes: 깊이 방향에서 어떤 레이어를 선택적으로 참조할지 → 학습된 선택
- PE: 어떤 레이어의 출력이 최적인지 → 수동 분석 + 정렬 튜닝
- 공통 통찰: **네트워크의 모든 레이어가 동등하지 않으며, 최적 표현은 특정 깊이에 있다**

**한계**:
- G 스케일(2B) 인코더가 실용적 배포에는 무거울 수 있음 (증류로 B/L 제공)
- 비디오 인코딩이 8프레임 평균 풀링으로 단순 — 긴 비디오나 시간적 추론에는 한계
- 정렬 튜닝에 Llama 3.2 / SAM 2.1 등 추가 모델 필요

## 🔗 관련 개념

- [[REF-092 Beyond Language Modeling — Multimodal Pretraining 설계 공간 탐색]] - (둘 다 비전-언어 통합 사전학습의 설계 공간을 탐색하지만, REF-092는 RAE+MoE 아키텍처 관점, PE는 대조학습+중간 레이어 관점)
- [[REF-119 Attention Residuals (AttnRes) — 깊이 방향 어텐션으로 잔차 연결 대체]] - (PE의 "최적 임베딩은 중간 레이어에"와 AttnRes의 "깊이 방향 선택적 참조"가 같은 문제 — 네트워크 깊이에 따른 최적 표현 위치)

---

**작성일**: 2026-03-20
**분류**: Vision Foundation Model / Multimodal Learning
**출처**: Meta FAIR, [GitHub](https://github.com/facebookresearch/perception_models), [PVD Dataset](https://ai.meta.com/datasets/pe-video/)