---
title: REF-108 Agentic Critical Training (ACT) — RL로 에이전트에게 자율 비판적 추론 훈련
type: note
permalink: zettelkasten/03.-sources/reference/ref-108-agentic-critical-training-act-rlro-eijeonteuege-jayul-bipanjeog-curon-hunryeon
date: '2026-03-13'
tags:
- reinforcement-learning
- agent-training
- ACT
- GRPO
- imitation-learning
- critical-reasoning
---

# Agentic Critical Training (ACT) — RL로 에이전트에게 자율 비판적 추론 훈련

> IL은 "무엇을 할지"만 가르치고 "왜"를 모른다. ACT는 대안 행동 간 비교 판단을 RL로 훈련하여 자율적 비판 추론을 발현시킨다.

## 📖 핵심 아이디어

Imitation Learning(IL)은 전문가 행동을 모방하지만 행동 품질에 대한 인식이 없다. ACT는 전문가 행동과 모델 자체 생성 대안 행동을 쌍으로 제시하고, "어느 쪽이 더 나은가?"를 GRPO로 훈련한다. 핵심 차이는 반성 텍스트를 모방(Early Experience)하는 게 아니라, 올바른 판단에만 보상을 줘서 모델이 자율적으로 chain-of-thought 추론을 발견하도록 한다는 것. 결과적으로 IL+ACT는 IL 대비 +5.07pp, RL+ACT는 RL 대비 +4.62pp 향상.

## 🛠️ 구성 요소 / 주요 내용

| 항목 | 설명 |
|------|------|
| 프레임워크 | POMDP (부분 관찰 마르코프 결정 과정) |
| 데이터 구성 | 전문가 행동 + 모델 생성 대안 행동 → 선호 쌍 |
| Stage 1 (ACT) | 두 행동 중 더 나은 것 식별하도록 GRPO 훈련 → 자율 추론 발현 |
| Stage 2 (RL Action) | 직접 행동 생성 능력 강화 (정확도+적법성+포맷 보상) |
| 알고리즘 | GRPO (Group Relative Policy Optimization) |
| 베이스 모델 | Qwen3-8B |
| 구현 | OpenRLHF + DeepSpeed ZeRO-3 |

## 🔧 작동 방식 / 적용 방법

```
           전문가 궤적 (Expert Trajectory)
                    ↓
    ┌───────────────┼───────────────┐
    │ 전문가 행동 (a_expert)     모델 생성 대안 (a_model)
    │               ↓               ↓
    │          선호 쌍 구성: (a_expert, a_model)
    │                    ↓
    │   Stage 1: ACT — "어느 쪽이 더 나은 행동?"
    │   (GRPO, 판단 정확도에만 보상)
    │       → 자율적 CoT 추론 발현
    │                    ↓
    │   Stage 2: RL Action — 직접 행동 생성 강화
    │   (GRPO, 행동 정확도+적법성+포맷 보상)
    │                    ↓
    └──────→ 최종 에이전트 (비판적 추론 + 행동 능력)
```

**IL vs ACT 행동 차이 (ALFWorld 예시):**
- IL: 실패 행동("Nothing happens") → 같은 행동 30+회 반복 → 종료
- ACT: 실패 감지 → 자기 비판 → 원인 진단(위치 오류) → 수정 행동 실행

## 💡 실용적 평가 / 적용

**핵심 결과 (Qwen3-8B 기준):**

| 벤치마크 | IL | IL+ACT | RL | RL+ACT |
|---------|-----|--------|-----|--------|
| ALFWorld ID | 85.71 | 91.43 | 90.71 | **92.86** |
| ALFWorld OOD | 82.84 | 87.31 | 84.33 | **88.06** |
| WebShop | 28.0 | 31.6 | 29.4 | **33.8** |
| ScienceWorld | 42.8 | 48.69 | 43.04 | **50.34** |

**주목할 점:**
- OOD 일반화에서 ACT 효과가 더 큼 (ALFWorld: OOD +3.73pp vs ID +2.15pp) — 과적합 아닌 진짜 추론
- MATH-500, GPQA-Diamond 등 범용 추론 벤치마크에서도 향상 (도메인 특화 데이터 없이)
- IL은 범용 추론을 저하시키지만 ACT는 향상 → "진짜 추론 vs 모방 추론" 차이
- ACT 데이터는 모델 크기 간 전이 가능 (8B→4B) → 데이터 수집 비용 분산

**한계:**
- 대안 행동 수집에 비용 발생 (cross-size 전이로 완화)
- 2단계 훈련 파이프라인의 복잡성

## 🔗 관련 개념

- [[REF-064 Search-R1++ Deep Research Agent RL Training]] - (동일하게 에이전트 RL 훈련이나 Search-R1은 검색 에이전트 특화, ACT는 범용 행동 판단 훈련)
- [[REF-074 EMPO² - Exploratory Memory-Augmented On- and Off-Policy Optimization]] - (RL 에이전트 최적화 방법론 — EMPO²는 메모리 기반 탐색, ACT는 비판적 판단 기반)
- [[ReAct Paradigm]] - (ACT의 자기 비판 패턴이 ReAct의 Reasoning+Acting 루프를 RL로 내재화한 형태)

---

**작성일**: 2026-03-13
**분류**: Agent Training, Reinforcement Learning, LLM
**출처**: https://attention-is-all-i-need.github.io/ACT/ (Weize Liu et al.)