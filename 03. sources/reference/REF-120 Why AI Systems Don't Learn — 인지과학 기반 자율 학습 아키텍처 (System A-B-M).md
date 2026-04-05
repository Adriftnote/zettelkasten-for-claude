---
title: REF-120 Why AI Systems Don't Learn — 인지과학 기반 자율 학습 아키텍처 (System A-B-M)
type: paper-review
permalink: sources/reference/why-ai-systems-dont-learn-autonomous-learning
tags:
- autonomous-learning
- cognitive-science
- meta-learning
- reinforcement-learning
- self-supervised-learning
date: 2026-03-20
---

# Why AI Systems Don't Learn

Dupoux, LeCun, Malik (FAIR/META). 현재 AI 모델이 배포 후 학습하지 않으며 학습 파이프라인 전체가 인간 MLOps에 의존하는 문제를 비판적으로 검토하고, 인간·동물 인지에서 영감을 받은 System A-B-M 통합 아키텍처를 제안.

## 📖 핵심 아이디어

AI 자율 학습의 **세 가지 장애물**: (1) 학습 모드의 개념적 파편화 — SSL·RL·SL이 분리된 패러다임, (2) 학습의 외부화 — 데이터 수집·필터링·학습 레시피가 모두 인간 의존, (3) 대규모 구축 방법론 부재.

해법: **관찰 학습(System A)** + **행동 학습(System B)** + **메타 컨트롤(System M)**을 통합하는 인지 아키텍처. 진화-발달 이중 레벨 최적화로 부트스트래핑.

## 🛠️ System A-B-M 아키텍처

| 시스템 | 역할 | 인지 비유 | AI 대응 |
|--------|------|-----------|---------|
| **System A** | 관찰 학습 — 수동적 감각 입력으로 세계의 통계적·예측적 모델 구축 | 영아의 얼굴/음소 지각 학습 | SSL (GPT, DINO, I-JEPA) |
| **System B** | 행동 학습 — 환경 상호작용으로 목표 달성 정책 최적화 | 아기의 보행·발성 탐색 | RL, 모델 기반 RL, 계획 |
| **System M** | 메타 컨트롤 — A와 B 간 데이터 라우팅·학습 레시피 자동 조율 | 전전두엽(PFC) | SDN Control Plane |

### System M의 세 가지 기능

```
┌─────────────────────────────────────────┐
│              System M (Meta-Control)     │
│                                         │
│  1. Input Selection                     │
│     - 유용한 데이터 선택                  │
│     - Active Learning, PER              │
│                                         │
│  2. Loss/Reward Modulation              │
│     - 학습 목표 동적 조정                 │
│     - Intrinsic Motivation, Auto-Curric │
│                                         │
│  3. Mode of Operation Control           │
│     - 학습/추론 모드 전환                 │
│     - Hierarchical RL, inference scaling│
└──────────┬──────────────┬───────────────┘
           │              │
     ┌─────▼─────┐  ┌────▼──────┐
     │ System A  │◄►│ System B  │
     │ (관찰)    │  │ (행동)    │
     └───────────┘  └───────────┘
```

### A ↔ B 상호작용

| 방향 | 메커니즘 |
|------|----------|
| **A→B** | 압축된 상태·행동 표현(CURL, ACT), 예측적 월드 모델(Dreamer, MuZero), 내재적 보상(호기심, 예측 오류) |
| **B→A** | 능동적 SSL — 행동으로 유익한 데이터 적극 수집. 목표 지향 SSL — 태스크 관련 궤적 데이터 제공 |

### 메타 상태 신호 (System M 입력)

- **Epistemic**: 예측 오류, 불확실성 (학습 필요성 감지)
- **Species-specific**: 진화적 탐지기 (얼굴, 생물학적 운동)
- **Somatic**: 에너지 수준, 통증 (자원 제약 감지)

## 🔧 진화-발달 이중 레벨 최적화

```
외부 루프 (Evolution): φ_{t+1} = argmin L(A₀:A_K, B₀:B_K)
  ↓ 아키텍처·초기 가중치 φ 최적화
내부 루프 (Development): 환경 상호작용으로 A, B 업데이트
  ↓ 생애주기 내 학습
```

- 외부 루프 = 연구 커뮤니티(현재), 향후 자동화 목표
- 내부 루프 = ML 알고리즘 (배포 후 자율 학습)
- 도전: 수백만 시뮬레이션 생애주기 필요, 환경 다양성·비정상성 설계

## 💡 실용적 평가

**현재 AI에 결여된 핵심 능력**:
1. **Active Learning** — 자체 훈련 데이터 선택
2. **Meta-Control** — 학습 모드 간 유연한 전환
3. **Meta-Cognition** — 자체 성능 감지 및 학습 필요성 판단

**강점**:
- SSL·RL·SL 파편화를 하나의 프레임워크로 통합하는 개념적 기여
- 생물학적 대응 관계가 체계적으로 정리됨 (인지과학 ↔ AI 매핑)
- System M이 현재 LLM 에이전트의 메타 제어 (tool selection, planning) 논의와 직접 연결

**한계/고려사항**:
- Position paper — 구체적 구현이나 실험 결과 없음 (블루프린트 수준)
- "완전 자율 학습은 수십 년 연구 필요"라고 저자 스스로 인정
- 윤리적 우려: 적응성 vs 통제 가능성 트레이드오프, 정렬 해킹 위험, 소마틱 신호의 도덕적 지위

**에이전트 메모리와의 연결**: System M의 Input Selection + Mode Control은 에이전트 메모리 시스템의 retain/recall/reflect와 구조적으로 유사 — "무엇을 기억할지 선택"(retain) + "언제 어떻게 회상할지"(recall) + "경험에서 패턴 추출"(reflect).

## 🔗 관련 개념

- [[Fast-Slow 인지 패턴 Hub]] - (System A=느린 관찰 학습, System B=빠른 행동 학습이라는 이중 처리 구조가 Fast-Slow 인지 패턴과 대응)
- [[REF-071 ALMA - Automated Meta-Learning of Memory Designs for Agentic Systems]] - (ALMA는 System M의 구체적 구현 사례 — 메모리 설계를 메타학습으로 자동 발견)
- [[REF-074 EMPO² - Exploratory Memory-Augmented On- and Off-Policy Optimization]] - (EMPO²는 System A(메모리 증강)와 System B(RL 최적화)의 통합 시도)

---

**작성일**: 2026-03-20
**분류**: Autonomous Learning / Cognitive Architecture
**출처**: Dupoux, LeCun, Malik — FAIR at META, EHESS, NYU, UC Berkeley