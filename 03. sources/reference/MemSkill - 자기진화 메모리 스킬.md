---
title: MemSkill - 자기진화 메모리 스킬
type: paper-review
permalink: sources/reference/memskill
tags:
- LLM-agent
- memory-system
- reinforcement-learning
- skill-evolution
- ICML
date: 2026-02-09
---

# MemSkill - 자기진화 메모리 스킬

고정된 메모리 연산(add/update/delete/skip) 대신, 학습 가능하고 진화하는 "메모리 스킬"로 에이전트 메모리를 재구성하는 방법.

- **저자**: Haozhen Zhang, Quanyu Long, Jianzhu Bao, Tao Feng, Weizhi Zhang, Haodong Yue, Wenya Wang
- **학회**: ICML
- **코드**: https://github.com/ViktorAxelsen/MemSkill

## 🧭 직관적 이해

> **한 줄**: "에이전트의 기억 정리법을 자동 진화시키는 프레임워크"

### 논문이 실제로 말하는 것

논문의 95%는 구현 디테일(MLP, PPO, KMeans)이고, 핵심 아이디어는 단순하다:

```
기존: 사람이 정리법 설계 → 에이전트가 따름 (고정)
MemSkill: 에이전트가 경험으로 정리법을 스스로 만들고 개선
```

### 제텔카스텐 비유

| MemSkill 구성요소  | 지식관리 대응                  |
| -------------- | ------------------------ |
| **Skill Bank** | 노트 관리 방법론 (제텔카스텐, RPG 등) |
| **Controller** | "이 정보는 어떤 방식으로 정리할까" 판단  |
| **Executor**   | 실제로 노트를 작성/수정/삭제하는 행위    |
| **Designer**   | "이 방법론이 잘 안 먹히네, 개선하자"   |

사람은 제텔카스텐이라는 "정답"을 알고 적용하지만, MemSkill은 정답 없이 시작해서 도메인마다 다른 최적의 정리법을 자동으로 발견한다.

### 이것은 검색(읽기)이 아니라 정리(쓰기)

```
장기 기억 시스템의 두 축:
  ① 쓰기: 뭘 어떻게 저장할까?  ← MemSkill (정리 품질)
  ② 읽기: 어떻게 잘 찾을까?    ← RAG 계열 (검색 정확도)
```

도서관 비유: 검색 알고리즘을 개선하는 게 아니라, 분류 체계 자체를 개선하는 것. 정리가 잘 되면 검색은 자연스럽게 따라온다.

### 파인튜닝 아님

- LLM 가중치는 고정 (파인튜닝 ❌)
- 학습되는 것: ① 경량 MLP (스킬 선택기) ② Skill Bank 텍스트 (자연어 지침)
- 스킬이 자연어라서 모델 간 전이 가능 (LLaMA→Qwen 재학습 없이 동작)

---

## 📖 핵심 아이디어

기존 LLM 에이전트 메모리 시스템은 수작업으로 설계된 고정 연산(insert, update, delete, skip)에 의존하여, 다양한 상호작용 패턴과 긴 히스토리에서 경직되고 비효율적이다. MemSkill은 이 메모리 연산 자체를 "스킬"로 재정의하고, 세 가지 컴포넌트(Controller, Executor, Designer)의 closed-loop를 통해 스킬을 선택·실행·진화시킨다. 핵심 통찰은 **메모리 구성을 재사용 가능한 스킬 적용의 결과로 보는 것**이다.

## 🛠️ 구성 요소

| 컴포넌트 | 역할 | 구현 |
|----------|------|------|
| **Skill Bank** | 재사용 가능한 메모리 연산을 구조화된 지침으로 저장 | 초기 4개(Insert/Update/Delete/Skip) → Designer가 점진적 진화 |
| **Controller** | 현재 컨텍스트에 맞는 스킬 소수 선택 | 경량 MLP, Gumbel-Top-K 선택, PPO로 최적화 |
| **Executor** | 선택된 스킬을 조건으로 메모리 업데이트 생성 | LLM 기반, 한 번의 호출로 여러 스킬 구성 |
| **Designer** | 어려운 케이스를 분석하여 스킬 뱅크를 주기적으로 진화 | KMeans 클러스터링 → 2단계 진화(분석→편집/제안) |

## 🔧 작동 방식

```
┌─────────────────── Closed-Loop Optimization ───────────────────┐
│                                                                 │
│  Phase 1: Controller 학습 (현재 Skill Bank 사용)                │
│    text span → Controller(MLP) → Top-K 스킬 선택               │
│                    ↓                                            │
│    span + memories + skills → Executor(LLM) → 메모리 업데이트   │
│                    ↓                                            │
│    downstream task performance → PPO reward                     │
│                                                                 │
│  Phase 2: Designer가 Skill Bank 업데이트                        │
│    hard case buffer → KMeans 클러스터링 → 대표 케이스 선정      │
│                    ↓                                            │
│    Stage 1: 누락/오지정된 메모리 동작 식별 (LLM 분석)           │
│    Stage 2: 기존 스킬 편집 + 새 스킬 제안                       │
│                                                                 │
│  Phase 3: 업데이트된 Skill Bank로 Controller 학습 재개          │
│    (새 스킬에 exploration boost 부여)                           │
│                                                                 │
│  → 반복 사이클로 스킬 사용 + 스킬 뱅크 모두 점진적 개선        │
└─────────────────────────────────────────────────────────────────┘
```

### Controller 상세

- **처리 단위**: span-level (상호작용을 연속 텍스트 스팬으로 분할, span_size=512)
- **상태 표현**: `h_t = f_ctx(x_t, M_t)` (현재 스팬 + 검색된 메모리)
- **스킬 표현**: `u_i = f_skill(desc(s_i))` (스킬 설명의 임베딩)
- **스코어링**: `z_t,i = h_t^T · u_i` → softmax → Gumbel-Top-K 선택
- **최적화**: PPO, downstream task 성능을 보상으로

### Designer 안전장치

- 성능 저하 시 snapshot rollback
- 반복적 개선 실패 시 early stopping
- 새 스킬에 exploration boost 부여

## 💡 실용적 평가

### 실험 결과

| 벤치마크 | 유형 | 핵심 결과 |
|----------|------|-----------|
| LoCoMo | 장문 대화 | F1 38.78, L-J 50.96 (MemoryOS 44.59, A-MEM 46.34 대비 우수) |
| LongMemEval | 초장문 대화 | LoCoMo에서 학습한 스킬로 전이 → 최고 성능 |
| ALFWorld | 체화된 작업 | Seen/Unseen 모두 최고 성공률 (Qwen: 60-64%) |
| HotpotQA | 분포 이동 | 대화→문서 전이에서도 일관된 우위 |

### 일반화 능력 (핵심 강점)

- **모델 간 전이**: LLaMA로 학습 → Qwen으로 직접 전이 (재학습 없이 성능 유지)
- **데이터셋 간 전이**: LoCoMo → LongMemEval 전이 시 최고 결과
- **분포 이동**: 대화 데이터 → 문서 스타일로 전이해도 성능 유지

### Ablation 핵심

- Designer 제거 시 **가장 큰 성능 저하** (특히 Qwen에서 52.07→34.71)
- Controller 제거(무작위 선택) 시에도 명확한 저하
- 새 스킬 추가 없이 개선만으로도 정적 스킬보다 우수하지만, 추가가 더 이점

### 진화된 스킬의 도메인 특화

- **대화 도메인**: 시간적 컨텍스트, 활동 세부사항 포착 (who, what, where, when)
- **ALFWorld**: 행동 제약, 객체 위치 추적 (실행 가능한 세계 상태 요약)
- 수작업 설계가 아닌 **데이터로부터 자연스럽게 출현**

### 한계와 고려사항

- Controller 학습에 PPO 필요 (학습 비용)
- Designer 트리거 주기(100 training steps)의 적절성은 도메인마다 다를 수 있음
- 장기 사용 시 스킬 뱅크 크기 관리 필요

## 🔗 관련 개념

- [[에이전트 메모리 (Agent Memory)]] - LLM 에이전트의 장기 메모리 시스템 전반
- [[강화학습 (Reinforcement Learning)]] - Controller 최적화에 PPO 사용
- [[자기진화 에이전트 (Self-Evolving Agent)]] - ExpeL, EvolveR 등 경험 기반 개선 계열
- [[메모리 뱅크 (Memory Bank)]] - 기존 정적 메모리 접근법 (MemoryBank, A-MEM, Mem0)
- [[스킬 발견 (Skill Discovery)]] - SkillWeaver 등 재사용 가능한 스킬 자동 발견

---

**작성일**: 2026-02-09
**분류**: AI/LLM Agent Memory
