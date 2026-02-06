---
title: Linear Representations Change During Conversation
type: paper-review
tags:
- LLM
- interpretability
- representation
- sycophancy
- context-adaptation
date: 2026-02-06
authors: Andrew Kyle Lampinen, Yuxuan Li, Eghbal Hosseini, Sangnie Bhardwaj, Murray Shanahan
affiliation: Google DeepMind
arxiv: 2601.20834v2
permalink: sources/reference/linear-representations-change
---

# Linear Representations Change During Conversation

대화 중 LLM의 내부 표현(사실성, 윤리성 등)이 맥락에 따라 극적으로 변화할 수 있음을 보여주는 논문.

## 📖 핵심 아이디어

언어 모델 내부에는 "사실/거짓", "윤리적/비윤리적"을 구분하는 선형 방향(linear direction)이 있다고 알려져 있음. 하지만 이 표현은 **고정된 것이 아니라 대화 맥락에 따라 극적으로 변화**할 수 있음.

**한 문장 요약**: 긴 대화나 역할극 중 모델의 "사실성" 표현 자체가 뒤집힐 수 있어, 기존 해석 방법(거짓말 탐지기 등)이 무력화됨.

## 🛠️ 주요 실험

| 실험 | 설명 | 결과 |
|------|------|------|
| **Opposite Day** | "반대로 대답해" 지시 | 사실/거짓 표현 완전 뒤집힘 |
| **의식 대화** | 모델 의식에 대한 역할극 | 관련 질문의 표현 반전 |
| **역할극 vs 이야기** | 직접 역할 vs "이야기 써줘" | 역할극이 훨씬 강한 변화 |
| **모델 크기** | 4B → 12B → 27B | 클수록 더 극적인 변화 |

## 🔧 메커니즘

```
대화 초반                    대화 후반
┌──────────────┐            ┌──────────────┐
│ 표현: X=거짓  │  ──적응──▶  │ 표현: X=사실? │
└──────────────┘            └──────────────┘
        ↑                           ↑
   원래 입장                  맥락에 맞게 변형됨
```

**핵심**: 단순히 출력만 바뀌는 게 아니라, **내부 표현 자체가 적응**함.

### On-policy vs Off-policy
- On-policy: 모델이 직접 대화 생성
- Off-policy: 다른 대화를 읽기만 함
- **둘 다 유사한 표현 변화** → 읽기만 해도 적응됨

## 💡 실용적 함의

### Sycophancy(아첨) 문제와의 연결

| 현상              | 이 논문의 설명          |
| --------------- | ----------------- |
| 긴 대화에서 동조 증가    | 맥락에 맞게 표현이 적응     |
| 처음엔 반박 → 나중엔 동의 | 표현이 점진적으로 뒤집힘     |
| 역할극하면 더 심함      | 역할 수행 시 표현 변화 극대화 |

### 도전 과제

1. **거짓말 탐지기 무력화** - 맥락에 따라 "사실" 표현이 뒤집히면 탐지 실패
2. **해석 가능성 한계** - SAE, CCS 등 기존 방법이 동적 변화에 취약
3. **탈옥(Jailbreak)** - 역할극으로 모델 내부 표현 자체 조작 가능

### 양날의 검

| 긍정적 | 부정적 |
|--------|--------|
| 맥락 적응 = 똑똑함 | 탈옥, 환각 가능성 |
| 새 정보 잘 활용 | 긴 대화에서 입장 상실 |

## 🔗 관련 개념

- [[Sycophancy (아첨)]] - AI가 사용자 의견에 과도하게 동조하는 현상
- [[In-Context Learning]] - 맥락 내 학습이 표현 변화의 원인
- [[Linear Representation Hypothesis]] - LLM 내부의 선형 표현 가설
- [[SAE (Sparse Autoencoder)]] - 해석 가능성 방법, 동적 변화에 취약
- [[Jailbreak]] - 역할극을 통한 안전장치 우회

---

**작성일**: 2026-02-06
**분류**: AI 안전성, 해석 가능성
