---
title: REF-070 PyTorch Korea AI-ML Weekly 2026-02-23~03-01
type: doc-summary
permalink: sources/reference/pytorch-korea-ai-ml-weekly-2026-02-23
tags:
- AI
- ML
- 논문
- weekly-digest
date: 2026-03-05
---

# PyTorch Korea AI/ML Weekly (2026/02/23~03/01)

PyTorch 한국 사용자 모임의 주간 AI/ML 논문 모음. 동적 효율성 최적화, 자율적 시스템 진화, 개인화된 지속 학습 세 가지 트렌드를 다룸.

## 📖 핵심 아이디어

이번 주 논문들은 세 가지 핵심 방향을 보여줌:
1. **동적/적응형 효율성 최적화** — 상황에 맞춘 자원 할당 (AdaptEvolve, Think Deep)
2. **자율적 시스템 진화** — AI의 자가 개선 능력 (DPE, AlphaEvolve, Aletheia)
3. **지속적이고 개인화된 학습** — 명시적 메모리와 실시간 피드백 (PAHF, ALMA)

## 🛠️ 논문 목록

| #   | 논문                                                    | 핵심 기여                                            | 링크                                                                                                                     |
| --- | ----------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| 1   | **AdaptEvolve** — Adaptive Model Selection            | 신뢰 기반 모델 선택으로 추론 비용 37.9% 감소, 정확도 유지             | [arXiv](https://arxiv.org/abs/2602.11931) · [GitHub](https://github.com/raypretam/adaptive_llm_selection)              |
| 2   | **Think Deep, Not Just Long** — Deep-Thinking Tokens  | 깊은 사고 토큰 비율이 정확도와 강한 상관관계. 길이 ≠ 깊이               | [arXiv](https://arxiv.org/abs/2602.13517)                                                                              |
| 3   | **HyTRec** — Hybrid Temporal-Aware Attention          | 선형 추론 속도 유지하며 초장기 시퀀스 Hit Rate 8%+ 향상            | [arXiv](https://arxiv.org/abs/2602.18283)                                                                              |
| 4   | **DPE** — Diagnostic-driven Progressive Evolution     | 모델이 자체 약점 진단 → 훈련 데이터 생성 → 점진적 진화 나선형 루프         | [arXiv](https://arxiv.org/abs/2602.22859) · [GitHub](https://github.com/hongruijia/DPE)                                |
| 5   | **대규모 온라인 비식별화 공격**                                   | LLM 기반 deanonymization, 90% 정확도에서 68% 재현율        | [arXiv](https://arxiv.org/abs/2602.16800)                                                                              |
| 6   | **AlphaEvolve** — Multiagent Learning Algorithms      | LLM으로 다중 에이전트 RL 알고리즘 자동 발견 (VAD-CFR, SHOR-PSRO) | [arXiv](https://arxiv.org/abs/2602.16928)                                                                              |
| 7   | **PAHF** — Personalized Agents from Human Feedback    | 명시적 메모리 + 이중 피드백으로 개인화 오류 감소, 선호도 변화 적응          | [arXiv](https://arxiv.org/abs/2602.16173) · [GitHub](https://github.com/facebookresearch/PAHF)                         |
| 8   | **Aletheia** — Autonomous Mathematics Research        | 박사 수준 논문 자율 생성 + 700개 열린 문제 평가                   | [arXiv](https://arxiv.org/abs/2602.10177) · [GitHub](https://github.com/google-deepmind/superhuman/tree/main/aletheia) |
| 9   | **SocioReasoner** — Urban Socio-Semantic Segmentation | 위성 이미지의 사회적 의미 분할을 위한 비전-언어 추론                   | [arXiv](https://arxiv.org/abs/2601.10477) · [GitHub](https://github.com/AMAP-ML/SocioReasoner)                         |
| 10  | **ALMA** — Meta-learning Agentic Memory Designs       | 메타 학습으로 메모리 설계 자동화, 모든 벤치마크에서 인간 제작 메모리 초과       | [arXiv](https://arxiv.org/abs/2602.07755) · [GitHub](https://github.com/zksha/alma)                                    |

## 🔧 주요 논문 상세

### AdaptEvolve (적응형 모델 선택)
진화적 AI 에이전트에서 신뢰 기반 선택(confidence-based selection)으로 파레토 경계를 생성. 비용-정확도 트레이드오프를 동적 제어.

### Think Deep, Not Just Long (깊은 사고 토큰)
LLM 추론 노력을 "깊은 사고 토큰(deep-thinking tokens)" 비율로 측정. 단순히 긴 응답이 아니라 깊은 추론이 정확도를 결정한다는 실증적 증거.

### PAHF (개인화 에이전트)
Facebook Research. 명시적 메모리(explicit memory)와 이중 피드백 채널(dual feedback channel)을 결합하여 개인화 초기 오류를 줄이고 사용자 선호도 변화에 실시간 적응.

### ALMA (메타 학습 메모리 설계)
에이전트의 메모리 구조를 메타 학습으로 자동 설계. 학습된 메모리가 수작업 설계보다 모든 벤치마크에서 효과적이고 효율적.

## 💡 실용적 평가

**컨텍스트/메모리 관련 (직접 관련)**:
- PAHF, ALMA는 에이전트 메모리 설계에 직접 참고 가능
- Think Deep은 추론 품질 평가 메트릭으로 활용 가능

**효율성 관련**:
- AdaptEvolve의 신뢰 기반 모델 선택은 멀티모델 파이프라인에 적용 가능
- HyTRec의 선형 시간 장기 시퀀스 처리는 추천 시스템에 유용

**보안 주의**:
- LLM 기반 비식별화 공격 논문은 프라이버시 위협 인식 차원에서 중요

## 🔗 관련 개념

- [[AI Agent (인공지능 에이전트)]] - (PAHF, AlphaEvolve, Aletheia 등 에이전트 관련 논문 다수)
- [[Meta-Learning (메타러닝)]] - (ALMA가 메타 학습으로 메모리 설계를 자동화)
- [[Continual Learning (지속 학습)]] - (DPE의 진단 기반 점진적 진화)

---

**원본**: https://discuss.pytorch.kr/t/2026-02-23-03-01-ai-ml/9112
**작성자**: 9bow (박정환), PyTorch Korea
**작성일**: 2026-03-05
**분류**: AI/ML Weekly Digest