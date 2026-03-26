---
title: AttnRes에서 시작해 노트 시스템의 선택 메커니즘 부재를 발견
type: changelog
permalink: logs/attnres-to-selection-mechanism-gap
tags:
- depth-mixing
- meta-learning
- knowledge-management
- selection-mechanism
date: 2026-03-20
---

# AttnRes에서 시작해 노트 시스템의 선택 메커니즘 부재를 발견

> REF-119 "이게 뭔소리야?"에서 시작해, 세 논문의 구조적 공통점을 발견하고, 내 노트 시스템에 동일한 문제가 있음을 인식한 세션.

## 흐름

```
REF-119 AttnRes — "이게 뭔소리야?"
  → 트랜스포머/신경망 개념 설명
  → 허브노트 생성: 트랜스포머 깊이 혼합 (Transformer Depth Mixing)
  → AI-ML 개념 허브와 연결
  │
REF-120 System A-B-M — "그냥 방향 제안서야?"
  → ㅇㅇ position paper
  → "내 노트 시스템도 System A만 작동, B·M 미작동" 발견
  │
REF-121 RLCF — "이거 뭐야?"
  → 커뮤니티 피드백으로 판별력 학습
  → System M의 구체적 힌트: 자연 발생 신호로 판단력 학습 가능
  │
도출 노트 작성
  → "지식 축적은 선택적 조합 메커니즘 없이는 생산으로 전환되지 않는다"
  → SAE/Superposition 연결: "축적하면 방향은 생기지만 꺼내는 도구가 필요"
  → 3원칙 서술 검증: SAE→노트 일반화는 비유이지 실증 아님 → 수정
  │
선택 = Attention 동일 구조 인식
  → Attention, AttnRes, SAE, System M, RLCF Judge, 노트 선택 전부 같은 문제
  → "전체에서 중요한 것을 골라내는 것"
```

## 산출물

| 유형 | 파일 | 내용 |
|------|------|------|
| 허브 | 트랜스포머 깊이 혼합 (Transformer Depth Mixing) | REF-119 중심, Attention·Layer Depth·MoE·DTR 연결 |
| 허브 수정 | AI-ML 개념 (AI-ML Concepts) | Attention → 깊이 혼합 허브 연결 추가 |
| 도출 노트 | 지식 축적은 선택적 조합 메커니즘 없이는 생산으로 전환되지 않는다 | REF-119·120·121 + SAE/Superposition에서 도출 |

## 열린 질문

- **노트 시스템의 System M을 어떤 형태로 만들 것인가?**
  - 노트 쌓을 때 자동 유사 노트 서제스트?
  - 주간 조합 후보 리포트?
  - 형태 미정, 고민 중
- 선택 메커니즘 = Attention이라는 인식은 있으나 구체적 설계는 아직

## 메모

- 오늘 세션은 System A(읽기) 중에 자연스럽게 System B(도출 노트 작성)가 작동한 사례
- 트리거: "내 문제랑 겹치네" → 개인 맥락과의 연결이 System A→B 전환을 유발
- 이 관찰 자체가 System M 설계의 힌트일 수 있음: **개인 맥락과의 관련성이 높은 노트를 서페이싱하면 자연스럽게 B가 작동할 가능성**
