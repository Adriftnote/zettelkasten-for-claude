---
title: REF-123 Reasoning Models Can Be Effective Without Thinking — NoThinking이 Thinking보다
  효율적
type: paper-review
permalink: sources/reference/reasoning-models-effective-without-thinking
tags:
- reasoning
- chain-of-thought
- test-time-scaling
- NoThinking
- parallel-scaling
date: 2026-03-20
---

# Reasoning Models Can Be Effective Without Thinking

UC Berkeley + AI2. 추론 모델의 긴 Thinking 과정(CoT, 반성, 역추적, 자기검증)이 정말 필수적인가? **NoThinking** — Thinking 박스를 비워두는 단순 프롬프팅 — 만으로도 2~5배 적은 토큰으로 유사하거나 더 나은 성능 달성. 병렬 스케일링 결합 시 9배 낮은 지연시간.

## 📖 핵심 아이디어

DeepSeek-R1-Distill-Qwen-32B에서 Thinking 박스를 빈 상태로 프리필하면(`<|beginning_of_thinking|> Okay, I think I have finished thinking. <|end_of_thinking|>`), 추가 학습 없이 추론 성능이 크게 유지됨. **동일 토큰 예산에서 NoThinking이 Thinking을 일관되게 능가** (특히 저예산 환경).

핵심 통찰: 추론 모델의 능력은 Thinking 과정이 아닌 **사전학습/증류로 내재화된 파라메트릭 지식**에 있음. Thinking은 이를 끌어내는 한 가지 방법일 뿐, 유일한 방법이 아님.

## 🛠️ 방법론

| 방법 | 설명 | 토큰 사용량 |
|------|------|-------------|
| **Thinking** | 기본 — CoT + 반성 + 역추적 + 자기검증 순차 생성 | 기준 (1x) |
| **NoThinking** | Thinking 박스 프리필로 비활성화 → 바로 풀이+답변 | **0.2~0.5x** |
| **Budget Forcing** | max_tokens로 Thinking/NoThinking 토큰 예산 동일 제어 | 통제 |
| **NoThinking + Best-of-N** | N개 병렬 생성 → 검증기/투표/신뢰도로 최적 선택 | N × 0.2~0.5x |

### 집계 방법 (Best-of-N)

```
검증기 있음 (정리 증명 등):
  → 자동 검증 (Lean 컴파일러) → 정답 선택

검증기 없음:
  → Majority Voting (cons@k): 다수결
  → Confidence (Self-certainty): KL-divergence 기반 신뢰도
  → Borda Voting: 신뢰도 순위 투표
```

## 📊 실험 결과

### 예산 비제어 시 (자유 생성)

| 벤치마크 | NoThinking 토큰 절감 | 성능 비교 |
|----------|---------------------|-----------|
| MiniF2F / ProofNet | **3.3~3.7배** 절감 | 모든 k에서 동등 |
| AIME / AMC / OlympiadBench | **2.0~5.1배** 절감 | k=1에서 뒤처지나 k↑ 시 추월 |
| LiveCodeBench | 절감 효과 미미 | NoThinking 약세 (신뢰도 선택 한계) |

### 예산 동일 제어 시 (Budget Forcing)

**NoThinking이 Pareto frontier를 지배**:
- 저예산 (~3,000 토큰): 모든 k에서 NoThinking 일관 우수
  - AMC23, 700 토큰: NoThinking **51.3** vs Thinking 28.9
- 고예산 (~3,500 토큰): pass@1에서만 Thinking 우위, k≥2 이상 NoThinking 추월

### 병렬 스케일링 (NoThinking + Best-of-N)

| 조건 | 지연시간 감소 | 토큰 감소 | 정확도 |
|------|-------------|-----------|--------|
| 완벽한 검증기 (MiniF2F) | **7배** | **4배** | Thinking 동등~초과 |
| 검증기 없음 (AMC23) | **9배** | — | Thinking 초과 (55.8 vs 54.1) |

## 💡 실용적 평가

**왜 NoThinking이 작동하는가**:
- 추론 능력은 Thinking 과정이 아닌 **RL/증류로 학습된 파라메트릭 지식**에 내재
- NoThinking이 더 균등한 답변 다양성(낮은 엔트로피 분산)을 보임 → k↑ 시 pass@k 개선에 유리
- Thinking의 순차적 토큰은 낭비 요소 포함 (불필요한 반성, 역추적 루프)

**실용적 시사점**:
- **서비스 제공자**: 병렬 NoThinking으로 동일 품질 + 9배 낮은 지연시간 가능
- **저예산 환경**: NoThinking이 명확히 우수한 선택
- **코딩 태스크**: 예외 — exact match 없어 투표 불가, 신뢰도 선택도 부정확

**REF-109(Thinking to Recall)와의 대비**:
- REF-109: "추론(Thinking)이 파라메트릭 지식 회상을 확장한다" — Thinking의 가치 주장
- REF-123: "Thinking 없이도 파라메트릭 지식이 충분히 작동한다" — Thinking의 불필요성 주장
- 양립 가능한 해석: Thinking은 회상을 돕지만, 충분한 병렬 샘플링이 같은 역할을 대체할 수 있음

**한계**:
- 폐쇄형 모델(GPT-4o, Claude 등) 검증 불가 (프리필 불가)
- MiniF2F/ProofNet에서 NoThinking 강세 이유 미해명
- 코딩 태스크에서 효과 제한적

## 🔗 관련 개념

- [[Chain of Thought (CoT)]] - (NoThinking이 우회하는 대상 — CoT의 필수성에 대한 반례)
- [[Deep-Thinking Ratio (DTR)]] - (DTR은 Thinking 깊이를 측정, NoThinking은 깊이=0에서도 유효함을 보임)
- [[REF-109 Thinking to Recall — 추론이 LLM 파라메트릭 지식 회상을 확장하는 메커니즘]] - (Thinking의 가치(회상 확장) vs NoThinking의 효율성(병렬 대체) — 상보적 관점)

---

**작성일**: 2026-03-20
**분류**: LLM Reasoning / Test-Time Scaling
**출처**: UC Berkeley, AI2 (Preprint, Under Review)