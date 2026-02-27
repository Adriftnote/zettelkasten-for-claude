---
title: "How to Train Your Deep Research Agent? Prompt, Reward, and Policy Optimization in Search-R1"
type: paper-review
permalink: sources/reference/search-r1-deep-research-agent-rl
tags:
- reinforcement-learning
- deep-research
- search-agent
- reward-shaping
- policy-optimization
date: 2026-02-27
---

# Search-R1++: Deep Research Agent의 RL 훈련 방법론 체계적 연구

Deep Research Agent(다중 라운드 검색 + 의사결정 지향 생성)의 RL 훈련을 프롬프트 템플릿, 보상 함수, 정책 최적화 3축으로 분리 실험하여 각 구성요소의 독립적 영향을 규명한 논문.

## 📖 핵심 아이디어

기존 Deep Research RL 훈련 방법들이 파편화되어 어떤 구성요소가 실제 성능 향상을 가져오는지 불명확했다. 이 논문은 3가지 독립 차원을 체계적으로 실험하여, **Fast Thinking + F1+ 보상 + REINFORCE** 조합(Search-R1++)이 최적임을 밝혔다. 특히 "더 단순한 알고리즘이 복잡한 최신 방법보다 우수할 수 있다"는 반직관적 결론이 핵심.

## 🛠️ 3가지 실험 축과 발견

### 1. 프롬프트 템플릿: Fast Thinking > Slow Thinking

| 항목 | Fast Thinking | Slow Thinking |
|------|--------------|---------------|
| 추론 방식 | 검색→답변 직접 출력 | `<think>` 태그로 명시적 추론 후 검색 |
| 안정성 | 안정적 | 훈련 붕괴(collapse) 취약 |
| 정확도 (7B) | **0.422** | 0.403 |
| 문제점 | - | `<think>` 빈도↑ = 보상↑ 잘못된 상관관계 학습 (r=0.431) |

**핵심**: 명시적 추론이 길수록 정확도와 안정성이 **낮아짐**. 추론을 제한하여 핵심 의사결정에 집중시키는 것이 효과적.

### 2. 보상 함수: F1+ (행동 패널티 추가) 최적

| 보상 | 7B 정확도 | 문제점 |
|------|----------|--------|
| EM | 0.422 | 기준선 |
| F1 | 0.391 | 답변 회피(answer avoidance) 발생 — 정답률은 유지되나 답변률 급감 |
| **F1+** | **0.429** | EM 초과 달성 |

F1+ 공식: `R_F1+ = R_F1 - α·I[검색횟수=0] - β·I[답변횟수=0]` (α=β=0.1)

결과 기반 감독만으로는 의사결정 과정에 충분한 제약이 없어, 정책이 틀린 답변보다 답변 회피를 선호하게 됨. **행동 수준 패널티**로 해결.

### 3. 정책 최적화: REINFORCE > GRPO > PPO

| 알고리즘 | 정확도 | 평균 검색 횟수 | 특징 |
|---------|--------|--------------|------|
| **REINFORCE** | **0.437** | **1.35** | 가장 효율적 검색-답변 경로 학습 |
| GRPO | 0.433 | 1.44 | Multi-Hop에서 PPO보다 우수하나 훈련 붕괴 빈발 |
| PPO | 0.422 | 1.97 | 안정 수렴하나 검색 횟수 과다, 작업 난이도 적응 실패 |

REINFORCE가 우수한 이유: 외부 기준선 없이 직접 누적 수익으로 최적화 → 그룹 샘플링 노이즈(GRPO)와 가치함수 추정 편향(PPO) 회피.

## 🔧 Search-R1++ 최종 구성 및 성능

```
Search-R1++ = Fast Thinking + F1+ 보상 + REINFORCE
```

| 모델 | 기준선 | Search-R1++ | 개선율 |
|------|--------|-------------|--------|
| Qwen2.5-7B | 0.403 | **0.442** | +9.7% |
| Qwen2.5-3B | 0.289 | **0.331** | +14.5% |

실험 환경: 8×A100, 600 step, batch 512, Qwen2.5 기반, E5 임베딩 + 2018 Wikipedia 검색

## 💡 실용적 평가

**시사점**:
- 의도적인 구성요소 설계 > 새로운 알고리즘/도구 통합
- 명시적 CoT가 항상 유익하지 않음 — 작업에 따라 추론을 제한해야
- 단순한 알고리즘(REINFORCE)이 복잡한 최신 방법(PPO, GRPO)을 능가할 수 있음
- 보상 함수에 행동 수준 제약을 추가하면 답변 회피 같은 퇴화 방지 가능

**한계**:
- 7B 규모까지만 실험 (더 큰 모델에서의 일반화 미검증)
- 검색 시스템이 Wikipedia 기반 고정 (실시간 웹 검색과 차이 가능)

## 🔗 관련 개념

- [[Paper Review - LongCat-Flash-Thinking-2601]] - (LLM 추론 방식과 RL 훈련 안정성 관점에서 유사한 문제 다룸)
- [[Dep-Search- Dependency-Aware Reasoning with Persistent Memory]] - (다중 라운드 검색 에이전트의 추론 구조 설계라는 공통 관심사)
- [[강화학습 (Reinforcement Learning)]] - (REINFORCE, PPO, GRPO 정책 최적화 비교의 기초 개념)

---

**작성일**: 2026-02-27
**분류**: Deep Research, RL Training, Search Agent
**저자**: Yinuo Xu et al. (CASIA, UCAS, Meituan)