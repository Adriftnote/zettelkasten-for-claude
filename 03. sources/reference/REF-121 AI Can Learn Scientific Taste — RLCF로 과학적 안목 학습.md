---
title: REF-121 AI Can Learn Scientific Taste — RLCF로 과학적 안목 학습
type: paper-review
permalink: sources/reference/ai-can-learn-scientific-taste-rlcf
tags:
- reinforcement-learning
- RLCF
- scientific-discovery
- preference-learning
- GRPO
date: 2026-03-20
---

# AI Can Learn Scientific Taste

Fudan University / OpenMOSS Team. 과학적 안목(scientific taste) — 고임팩트 연구 아이디어를 판단하고 제안하는 능력 — 을 AI가 학습할 수 있음을 실증. 커뮤니티 피드백(인용 수)을 대규모 감독 신호로 활용하는 **RLCF(Reinforcement Learning from Community Feedback)** 패러다임 제안.

## 📖 핵심 아이디어

RLHF는 인간 어노테이션 비용 문제, RLVR은 검증 가능한 태스크만 적용 가능 → **오픈엔드 태스크에 자연 발생적 커뮤니티 피드백(인용 수)을 RL 감독 신호로 활용**. 두 모델을 훈련:

- **SCIENTIFIC JUDGE**: 논문 쌍의 누적 인용 임팩트를 비교 판단 (Generative Reward Model)
- **SCIENTIFIC THINKER**: 고임팩트 후속 연구 아이디어를 생성 (Policy Model, Judge를 보상 모델로 사용)

철학적 기반: Hume의 "자격 있는 판단자들의 공동 판결" + Kant의 sensus communis(공통 감각).

## 🛠️ RLCF 3단계 파이프라인

| 단계 | 이름 | 내용 |
|------|------|------|
| **Stage 1** | Community Preference 구축 | 인용 수로 동일 분야·시기 논문 쌍 선호 데이터 → SciJudgeBench (70만 쌍) |
| **Stage 2** | Preference Modeling | SCIENTIFIC JUDGE를 GRPO로 훈련 — 어떤 논문이 더 높은 인용 임팩트? |
| **Stage 3** | Preference Alignment | Judge를 보상 모델로 → SCIENTIFIC THINKER를 Comparison-Based GRPO로 훈련 |

### SciJudgeBench 데이터셋

- arXiv 2.1M 논문 → 139만 편, **69.7만 쌍** (CS 16만, Math 10만, Physics 39만, Others 3.8만)
- 쌍 생성 기준: `c_hi - c_lo ≥ 8` AND `(c_hi - c_lo) / c_hi ≥ 0.3` + 동일 서브카테고리 + 유사 발행 시기
- 4개 테스트셋: Main(728), Temporal OOD(514, 2025년), Metric OOD(611, ICLR peer-review), Biology OOD(160, bioRxiv)

### Comparison-Based GRPO (Thinker 훈련)

```
그룹 내 라운드로빈 토너먼트:
  G개 아이디어 생성 → 모든 쌍에 대해 Judge가 승패 판정
  r_i = (1/(G-1)) Σ_{j≠i} s(o_i, o_j)   (s ∈ {0,1})
  → 승률이 곧 보상
```

## 📊 실험 결과

### SCIENTIFIC JUDGE 성능

| 모델 | In-domain | 향상폭 |
|------|-----------|--------|
| Qwen2.5-1.5B | 72.1% | **+65.1p** (7.0→72.1) |
| Qwen2.5-32B | **83.7%** | 최고 성능 |
| Qwen3-30B | 80.6% | GPT-5.2(72.7), Gemini 3 Pro(75.7) 능가 |

**3축 일반화 확인**:
- **시간**: 2025년 논문에 대한 Temporal OOD 일반화 (+55.1p)
- **분야**: CS 데이터만으로 Math/Physics/Biology OOD 전이 성공
- **평가 기준**: 인용 수 훈련 → ICLR 동료 심사 점수 예측 전이 (+72.0p)

스케일링: 데이터·모델 크기에 대해 **log-linear 성능 향상**.

### SCIENTIFIC THINKER 성능

| 모델 | vs Base (In-domain) | vs Base (OOD) | vs SOTA 평균 |
|------|---------------------|---------------|-------------|
| SciTHINKER-30B | **81.5%** | **83.0%** | 54.2% |
| SciTHINKER-4B | 76.5% | 76.0% | — |

SciJUDGE를 보상 모델로 사용 시 baseline Qwen3-4B-Instruct 대비 +8.5p 개선 → Judge의 보상 모델 효과 검증.

## 💡 실용적 평가

**RLCF 패러다임의 의의**:
- RLHF의 비용 문제와 RLVR의 검증 불가 문제를 동시 해결
- 핵심 통찰: **자연 발생적 커뮤니티 신호**(인용 수, 좋아요, 다운로드 등)가 오픈엔드 태스크의 대규모 감독 신호가 될 수 있음
- 과학 외 적용 가능성: 코드 품질(GitHub stars), 디자인(사용자 선호), 글쓰기(독자 반응) 등

**한계**:
- 인용 수의 불완전성 — 지연 임팩트(초기 저인용 but 후속 영향력 큰) 논문 포착 어려움
- 제목+초록만 사용 — 더 풍부한 맥락(관련 연구 섹션 등) 미활용
- 아이디어 평가가 LLM 의존 — 실제 실험적 검증 없음
- 악용 위험: 저품질 아이디어 대규모 생성, 학문 부정행위 촉진 가능

**Position bias 해결**: 논문 순서 A↔B 교환 후 양방향 일관 예측만 정답 인정 — LLM-as-Judge의 일반적 문제를 깔끔하게 처리.

## 🔗 관련 개념

- [[REF-108 Agentic Critical Training (ACT) — RL로 에이전트에게 자율 비판적 추론 훈련]] - (둘 다 RL로 LLM의 판단 능력을 강화하지만, ACT는 에이전트 행동 판단, RLCF는 과학적 임팩트 판단)
- [[REF-120 Why AI Systems Don't Learn — 인지과학 기반 자율 학습 아키텍처 (System A-B-M)]] - (RLCF의 커뮤니티 피드백은 System M의 메타 신호에 해당 — 외부 피드백으로 학습 방향 조율)

---

**작성일**: 2026-03-20
**분류**: AI for Science / Preference Learning
**출처**: Fudan University, OpenMOSS Team, [GitHub](https://github.com/tongjingqi/AI-Can-Learn-Scientific-Taste)