---
title: REF-129 Memento-Skills — Let Agents Design Agents (Skill 기반 자기진화)
type: paper-review
permalink: sources/reference/memento-skills-let-agents-design-agents
tags:
- skill-learning
- self-improving-AI
- reflective-learning
- agent-architecture
- skill-routing
date: 2026-03-26
---

# Memento-Skills — Let Agents Design Agents (Skill 기반 자기진화)

Frozen LLM의 파라미터를 변경하지 않고, 실행 가능한 Skill Folder(SKILL.md + 코드 + 프롬프트)를 메모리 단위로 자율 생성·개선하여 지속 학습을 실현하는 에이전트 시스템.

## 📖 핵심 아이디어

배포 후 고정된 LLM은 파라미터 학습이 불가능하므로, 모든 적응은 **입력(프롬프트·컨텍스트·메모리)을 통해** 이루어져야 한다. Memento-Skills는 이 통찰을 **Read-Write Reflective Learning (R²RL)**로 구현한다: 태스크 실행 후 피드백을 받아 실패 원인을 귀인(attribution)하고, 해당 skill 파일을 직접 rewrite하거나 새 skill을 합성한다. 단순 trajectory 로그가 아닌 **선언적 명세·프롬프트·실행 코드를 캡슐화한 Skill Folder**가 메모리 단위이므로, 도메인 간 재사용이 가능하다.

## 🛠️ 구성 요소

| 항목 | 설명 |
|------|------|
| **Skill Folder** | SKILL.md(선언적 명세) + Helper Scripts + Prompts — 재사용 가능한 메모리 단위 |
| **R²RL 루프** | Observe → Read(Skill 검색) → Act(LLM 실행) → Feedback(Judge) → Write(Reflective 업데이트) |
| **Write 연산** | utility 갱신, tip memory 누적, failure attribution → skill rewriting, skill discovery + unit test gate |
| **Memento-Qwen Router** | Qwen3-Embedding-0.6B 기반, offline RL(KL-regularised Boltzmann policy)로 훈련 — semantic이 아닌 behavioral utility 최적화 |
| **SRDP** | Stateful Reflective Decision Process — 상태를 (s_t, M_t)로 확장하여 Markov 회복 |

## 🔧 작동 방식

```
┌─────────────────────────────────────────────────────┐
│              R²RL (Read-Write Reflective Loop)       │
│                                                       │
│  ① Observe: 태스크 관찰                               │
│  ② Read: Memento-Qwen Router → 최적 skill 검색       │
│     (BM25 sparse + Dense + RRF fusion)                │
│  ③ Act: Frozen LLM + skill 기반 실행                  │
│  ④ Feedback: Judge가 성공/실패 판정                    │
│  ⑤ Write:                                             │
│     ├─ 성공 → utility 갱신                            │
│     └─ 실패 → failure attribution                     │
│              → skill rewriting (guardrail 추가)       │
│              → skill discovery (새 skill 합성)        │
│              → unit test gate (실패 시 롤백)          │
└─────────────────────────────────────────────────────┘

수렴 보장: |V*(s) - V_M(s)| ≤ (2R_max/(1-γ)²) · (ε_LLM + δ_M)
  - ε_LLM: LLM 일반화 오차, δ_M: 라우터 검색 오류
  - Lever: LLM 능력↑, Skill 라이브러리 확장, Router 품질↑
```

## 📊 주요 결과

| 벤치마크 | Memento-Skills | Read-Write Baseline | 향상 | 비고 |
|----------|---------------|-------------------|------|------|
| GAIA (범용 AI) | 66.0% | 52.3% | +13.7pp (+26.2%) | 5→41 skill, cross-task 전이 제한적 |
| HLE (전문가 학술) | 38.7% | 17.9% | +20.8pp (+116.2%) | 5→235 skill, 도메인 정렬 시 강한 전이 |

**Router 성능 (Recall@1)**: BM25 0.32 → Qwen3 0.54 → Memento-Qwen 0.60

**Ablation**: skill 최적화 제거 시 ~-8%p, Memento-Qwen 제거 시 검색 collapse

**시스템 피크**: 93.5% 정확도, p99 latency 195ms, **Zero gradient updates**

### Skill 라이브러리 분석

HLE 훈련 후 235개 skill의 t-SNE 클러스터:
- Search/Web (48), Quantum/Physics (47), Math/Chemistry (44), Code/Text (38), Download/Verify (28), Clinical/Excel (27), Chess/Game (20), Python/Script (19)
- 라이브러리 밀집 → memory coverage radius 감소 → 수익 체감

## 💡 실용적 평가

**강점**:
- **Zero gradient** — 모델 재훈련 없이 skill 축적만으로 지속 학습. 배포 비용 최소
- **Skill Folder = SKILL.md + 코드** — 인간이 읽고 수정 가능한 구조. Claude Code의 skill 시스템과 직접 대응
- **Failure attribution + unit test gate** — 무분별한 skill 변경 방지, 롤백 안전망
- **Behavioral router** — semantic 유사도와 실행 유용성의 괴리 문제를 offline RL로 해결

**한계**:
- GAIA처럼 다양성 높은 도메인에서는 cross-task transfer 제한적 — 도메인 정렬이 핵심 전제
- 100만 케이스 스케일에서 Parzen kernel 확장성 미검증
- Sandbox 안전성 평가 미포함
- 수렴 속도 정량화 미완성 (O(n^{-1/d}) 증명 미개발)

**기존 접근과의 차이**:
- vs 단순 prompt 최적화: 실행 가능한 multi-artefact skill 학습
- vs episodic 로그: trajectory 대신 선언적 명세·코드 캡슐화
- vs semantic router (BM25/dense): behavioral utility 직접 최적화
- vs parametric learning: 외부 skill 라이브러리에 지식 축적 (non-parametric intelligence layer)

**논문 정보**: Memento-Team (UCL, Jilin Univ, HKUST-GZ), Advisor: Jun Wang
**코드**: https://github.com/Memento-Teams/Memento-Skills
**Skill 마켓**: https://skills.memento.run/market/

## 🔗 관련 개념

- [[REF-128 HyperAgents — Metacognitive Self-Modification으로 도메인 일반 자기개선 달성]] - (HyperAgents는 메타 에이전트 코드 자체를 진화적으로 수정, Memento-Skills는 skill 파일을 reflective write로 개선 — 자기개선의 두 경로: 진화 vs 반성적 학습)
- [[REF-090 SkillNet - Create, Evaluate, and Connect AI Skills]] - (SkillNet은 스킬 간 연결·평가 그래프, Memento-Skills는 스킬 자율 생성·진화·라우팅 — 스킬 관리의 정적 vs 동적 접근)
- [[REF-071 ALMA - Automated Meta-Learning of Memory Designs for Agentic Systems]] - (ALMA는 메모리 설계 자동 학습, Memento-Skills는 skill을 메모리 단위로 정의 — 에이전트 메모리 설계의 상호보완적 관점)
- [[REF-107 Claude Skills — 177개 프로덕션 스킬 컬렉션 (Multi-Agent 호환)]] - (Claude Skills의 SKILL.md 포맷과 Memento-Skills의 Skill Folder 구조가 거의 동일 — 실무 스킬 시스템의 학술적 정당화)
- [[REF-118 Online Experiential Learning for Language Models]] - (온라인 경험 학습과 Memento의 R²RL이 동일 문제를 다른 메모리 단위로 접근 — trajectory vs skill folder)

---

**작성일**: 2026-03-26
**분류**: AI 자기개선 / 에이전트 스킬 학습