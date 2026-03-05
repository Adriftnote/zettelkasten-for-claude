---
title: REF-074 EMPO² - Exploratory Memory-Augmented On- and Off-Policy Optimization
type: paper-review
permalink: sources/reference/empo2-exploratory-memory-augmented-agent
tags:
- reinforcement-learning
- LLM-agent
- memory-augmented
- exploration
- on-policy
- off-policy
- ICLR-2026
date: 2026-03-05
---

# EMPO² — Exploratory Memory-Augmented On- and Off-Policy Optimization

ICLR 2026. 메모리 증강 탐색과 하이브리드 온/오프-정책 RL을 결합하여 LLM 에이전트의 탐색 병목을 해결하는 프레임워크.

## 📖 핵심 아이디어

RL로 훈련된 LLM 에이전트는 사전 지식에 의존해 **체계적 탐색이 부족**하고, 외부 메모리만 쓰면 성능이 빠르게 포화된다. EMPO²는 **자가 생성 메모리(self-generated tips)**를 활용한 탐색과 **온-정책 + 오프-정책 업데이트**를 결합하여, 메모리 사용 시 우수한 성능 + 메모리 없이도 강건성 + 파라미터 업데이트 없이 새 작업 적응을 달성한다.

## 🛠️ 구성 요소

| 구성 요소 | 설명 |
|-----------|------|
| **롤아웃 모드 1** | 메모리 없이 `a ~ π_θ(·|s,u)` — 확률 `1-p` |
| **롤아웃 모드 2** | 메모리 증강 `a ~ π_θ(·|s,u,tips)` — 확률 `p`, 임베딩 유사도로 최대 10개 팁 검색 |
| **온-정책 업데이트** | 롤아웃과 동일 프롬프트로 안정적 학습 |
| **오프-정책 업데이트** | 팁 제거 후 업데이트 — *보상 유도 지식 증류*, 팁 조건 궤적을 교사로 사용 |
| **자가 생성 메모리** | 에피소드 종료 시 정책이 반성적 팁 생성 → 메모리 버퍼 저장 |
| **내재적 보상** | 상태 참신성 기반 `r = 1/n` — 정책 붕괴 방지, 새 상태 탐색 장려 |
| **마스킹 메커니즘** | `π_θ(a|s,u) < δ`인 토큰의 어드밴티지 억제 → 오프-정책 훈련 안정화 |

## 🔧 작동 방식

```
┌─────────────────────────────────────────────────┐
│                  EMPO² 학습 루프                  │
├─────────────────────────────────────────────────┤
│                                                   │
│  [롤아웃]                                         │
│    ├─ (1-p) → 메모리 없음 → 직접 업데이트 (온-정책)   │
│    └─ (p)  → 메모리 증강 ─┬→ (1-q) 팁 유지 (온-정책) │
│                           └→ (q)   팁 제거 (오프-정책)│
│                                    ↑               │
│                          지식 증류: 팁→파라미터 내재화  │
│                                                   │
│  [에피소드 종료]                                    │
│    └─ 정책이 반성적 팁 생성 → 메모리 버퍼에 저장       │
│                                                   │
│  [추론 시]                                         │
│    ├─ 메모리 없이도 강건한 성능 (오프-정책 증류 효과)   │
│    └─ 새 작업에 메모리만 도입하면 few-shot 적응       │
└─────────────────────────────────────────────────┘
```

**핵심 메커니즘 — 오프-정책 지식 증류:**
메모리 증강 롤아웃(팁 있음)에서 높은 보상 궤적을 생성한 뒤, 업데이트 시 팁을 제거하고 `π_θ(·|s,u)`만으로 해당 궤적을 재현하도록 학습. 이를 통해 팁의 이점이 모델 파라미터에 내재화되어, 추론 시 메모리 없이도 팁 조건화 수준의 성능 발휘.

## 💡 실용적 평가

**성능 (Qwen2.5-7B-Instruct 기반):**

| 벤치마크 | GRPO | EMPO² | 향상 |
|----------|------|-------|------|
| ScienceWorld | 33.2 | **75.9** | +128.6% |
| WebShop (Score) | 79.3 | **88.3** | +11.3% |

**OOD 적응:** 하나의 작업으로 훈련 → 새 작업에 메모리 도입만으로 평균 136% 향상 (10스텝 이내). GRPO는 적응 불안정.

**장점:**
- 3가지 학습 모드 조합이 핵심 — 어느 하나 제거해도 성능 저하
- 추론 시 메모리 의존성 감소 (오프-정책 증류 효과)
- 오픈소스 모델(7B)로도 강력한 성능

**한계:**
- 메모리 증강 롤아웃 시 ~19% 추가 시간
- 단순 유사도 기반 검색 — 더 고급 메모리 검색으로 개선 여지
- Qwen2.5-7B 외 다른 모델 패밀리/크기 검증 필요

**Reflexion과의 핵심 차이:** Reflexion은 파라미터 업데이트 없이 언어 반성만 저장 → 단기 적응 한정. EMPO²는 메모리와 파라미터 *모두* 업데이트하여 장기 진화 + 일반화 달성.

## 🔗 관련 개념

- [[MemSkill - 자기진화 메모리 스킬]] - (EMPO²의 자가 생성 팁과 MemSkill의 메모리 스킬 진화가 유사 — 둘 다 경험에서 자율적으로 지식을 축적하되, EMPO²는 RL 파라미터 업데이트로 내재화하는 점이 차이)
- [[How to Train Your Deep Research Agent? Prompt, Reward, and Policy Optimization in Search-R1]] - (Search-R1도 LLM 에이전트의 RL 훈련을 다루며, EMPO²의 하이브리드 온/오프-정책 최적화와 보완적 관점 제공)
- [[A-Mem - LLM 에이전트를 위한 자율 메모리 시스템 (Agentic Memory)]] - (A-Mem은 비파라미터 자율 메모리, EMPO²는 메모리를 파라미터로 증류 — 메모리 활용 방식의 대조)
- [[REF-071 ALMA - Automated Meta-Learning of Memory Designs for Agentic Systems]] - (ALMA는 메모리 설계 자동화, EMPO²는 메모리 활용+증류 — 에이전트 메모리의 상보적 접근)
- [[강화학습 (Reinforcement Learning)]] - GRPO, PPO 등 기반 RL 최적화 방법론
- [[에이전트 메모리 (Agent Memory)]] - LLM 에이전트의 장기 메모리 시스템 전반

---

**저자**: Zeyuan Liu, Jeonghye Kim, Xufang Luo, Dongsheng Li, Yuqing Yang (Microsoft Research / KAIST)
**코드**: agent-lightning/empo2
**작성일**: 2026-03-05
**분류**: LLM Agent × Reinforcement Learning × Memory