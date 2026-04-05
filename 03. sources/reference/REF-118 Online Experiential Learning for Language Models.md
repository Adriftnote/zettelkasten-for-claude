---
title: REF-118 Online Experiential Learning for Language Models
type: paper-review
permalink: sources/reference/online-experiential-learning-language-models
tags:
- online-learning
- experiential-learning
- context-distillation
- on-policy
- LLM-training
- knowledge-extraction
- Microsoft-Research
date: 2026-03-20
---

# OEL — Online Experiential Learning for Language Models

Microsoft Research (Dong et al.). 배포 중 축적되는 상호작용 경험을 "경험 지식"으로 변환하여 모델 파라미터에 내재화하는 온라인 학습 프레임워크. 보상 함수·인간 어노테이션·사용자 환경 접근 없이 작동.

## 📖 핵심 아이디어

기존 LLM 개선은 정적 오프라인 학습(SFT, RL)에 의존하며 배포 후 경험을 활용하지 못한다. OEL은 두 단계 루프로 이를 해결한다: (1) 사용자 상호작용 궤적에서 전이 가능한 경험 지식 추출, (2) on-policy context distillation으로 모델 가중치에 통합. 이 선순환이 반복되면 모델 개선 → 더 좋은 궤적 → 더 풍부한 지식 → 더 나은 모델로 이어진다.

핵심 발견: **자기 궤적에서 추출한 지식(on-policy)이 더 큰 모델의 지식(off-policy)보다 효과적**이다 (self 23.8% vs. 4B teacher 18.0%).

## 🛠️ 구성 요소

| 구성 요소 | 설명 |
|-----------|------|
| **Stage 1: Extract** | 궤적 τ_i에서 π_extract(동일 모델)로 경험 지식 e_i 추출·누적. ground-truth 불필요 |
| **Stage 2: Consolidate** | Reverse KL divergence로 teacher π(·\|e,x)의 지식을 student π_θ(·\|x)에 증류 |
| **Online Loop** | 두 단계 반복 → 선순환 (virtuous cycle) |
| **학습 신호** | 토큰 레벨 dense 신호 (단일 턴 롤아웃 기반) |

## 🔧 작동 방식

```
[배포 환경]                          [서버]
  사용자 상호작용                    
  → 궤적 τ₁, τ₂, ...  ─────────→  Stage 1: Knowledge Extraction
                                      π_extract(·|τ_i, e_{i-1})
                                      → 경험 지식 e_i (누적)
                                    
                                    Stage 2: Consolidation
                                      L(θ) = E[D_KL(π_θ(·|x) ∥ π_teacher(·|e,x))]
                                      → 모델 가중치 θ 업데이트
                                    
  ← 개선된 모델 π_θ  ←─────────   (루프 반복)
```

**핵심 속성**:
- Reward-free: 보상 함수 설계 불필요
- No human annotation: 자동 지식 추출
- Server-side only: 사용자 환경 접근 불필요
- On-policy: 자기 모델의 궤적 사용이 핵심

## 💡 실용적 평가

**실험 결과** (Frozen Lake 3×3, Sokoban 6×6):
- 반복할수록 pass rate 점진적 향상 (온라인 학습 작동 확인)
- 토큰 효율성: 평균 응답 길이 3회차에 초기 대비 ~70%로 감소
- Catastrophic forgetting 완화: on-policy가 off-policy 대비 OOD(IF-Eval) 성능 보존
- 모델 크기 ↑ → OEL 효과 ↑
- Raw trajectory(10.9%) < Knowledge(18.2%) < Knowledge+Consolidation(21.4%)

**한계/고려사항**:
- 텍스트 기반 게임 환경에서만 검증 (실제 복잡한 태스크 미검증)
- 경험 지식 추출 품질이 모델 자체 능력에 의존
- 누적 지식의 스케일링 한계 미탐구

**적용 관점**:
- 에이전트 시스템에서 "배포 = 학습의 끝"이 아닌 "지속적 개선의 시작"이라는 패러다임
- episodic memory → parametric knowledge 전환 메커니즘으로 해석 가능
- 우리 episodic-memory 시스템이 "추출"에 해당, 모델 가중치 업데이트 없이 컨텍스트 주입으로 유사 효과 달성

## 🔗 관련 개념

- [[REF-074 EMPO² - Exploratory Memory-Augmented On- and Off-Policy Optimization]] - (둘 다 on-policy RL 기반 LLM 에이전트 학습이나, EMPO²는 메모리 증강 탐색, OEL은 경험→파라미터 내재화에 초점)
- [[REF-108 Agentic Critical Training (ACT) — RL로 에이전트에게 자율 비판적 추론 훈련]] - (RL 기반 에이전트 훈련이라는 공통점, ACT는 비판적 추론, OEL은 경험 지식 증류)
- [[REF-110 Hindsight — 생체모방 에이전트 장기 기억 시스템]] - (경험 활용이라는 공통 주제, Hindsight는 외부 메모리 시스템, OEL은 파라미터 내재화)
- [[context-engineering]] - (경험 지식을 컨텍스트로 주입하는 Stage 2가 context distillation의 응용)

---

**작성일**: 2026-03-20
**분류**: 논문 리뷰 — 온라인 학습, 경험 지식
**코드**: https://aka.ms/oel-code
**모델**: Qwen3-1.7B/4B/8B (thinking mode)
**기반 방법**: On-Policy Context Distillation (Ye et al., 2026)