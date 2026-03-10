---
title: ReAct Paradigm
type: concept
tags: [ai-agent, reasoning, acting, llm, paradigm]
permalink: knowledge/concepts/react-paradigm
category: AI/ML
difficulty: 중급
created: 2026-01-22
---

# ReAct Paradigm

**"Reasoning + Acting의 결합. AI가 생각하고 행동하는 것을 번갈아 수행하는 패러다임"**

2022년 Google/Princeton 논문 "ReAct: Synergizing Reasoning and Acting in Language Models"에서 제안. LLM 에이전트 아키텍처의 기초가 되는 개념.

## 📖 핵심 구조

```
┌─────────────────────────────────────────┐
│              ReAct Loop                  │
├─────────────────────────────────────────┤
│                                          │
│   ┌──────────┐                          │
│   │ Thought  │ ← 추론/계획 (LLM 내부)    │
│   └────┬─────┘                          │
│        ↓                                │
│   ┌──────────┐                          │
│   │  Action  │ ← 도구 호출 (외부 실행)   │
│   └────┬─────┘                          │
│        ↓                                │
│   ┌──────────┐                          │
│   │Observation│ ← 결과 수신 (외부 → LLM) │
│   └────┬─────┘                          │
│        ↓                                │
│   (다음 Thought로 반복)                  │
│                                          │
└─────────────────────────────────────────┘
```

## 🎭 비유

### 탐정의 수사 과정

```
[기존 방식: Chain-of-Thought]
탐정: "범인은 A일 것이다. 왜냐하면... (추론만)"
→ 실제 증거 확인 없이 결론

[ReAct 방식]
탐정:
  Thought: "A가 의심된다. 알리바이를 확인해야겠다"
  Action:  알리바이 조회
  Observation: "A는 당시 해외에 있었음"
  Thought: "A는 아니다. B를 조사해야겠다"
  Action:  B의 동선 조회
  ...

→ 생각과 행동을 번갈아 수행
```

## 💡 왜 중요한가?

### 기존 방식의 한계

| 방식 | 문제점 |
|------|--------|
| **Chain-of-Thought** | 추론만, 외부 정보 접근 불가 |
| **Action-only** | 행동만, 계획/분석 없음 |

### ReAct의 해결

```
Chain-of-Thought: 생각 → 생각 → 생각 → 답
Action-only:      행동 → 행동 → 행동 → 답
ReAct:            생각 → 행동 → 관찰 → 생각 → 행동 → 관찰 → 답
                   ↑________________↑
                   피드백 루프로 자기 수정
```

## 📊 실제 예시

### 질문: "2024년 노벨 물리학상 수상자의 출신 대학은?"

```
[Thought 1]
2024년 노벨 물리학상 수상자를 먼저 찾아야 한다.

[Action 1]
Search("2024 Nobel Prize Physics winner")

[Observation 1]
John Hopfield와 Geoffrey Hinton이 공동 수상

[Thought 2]
두 명이구나. 각각의 출신 대학을 찾아야겠다.

[Action 2]
Search("Geoffrey Hinton education university")

[Observation 2]
Cambridge University (학부), Edinburgh University (박사)

[Action 3]
Search("John Hopfield education university")

[Observation 3]
Swarthmore College (학부), Cornell University (박사)

[Thought 3]
두 수상자의 출신 대학 정보를 모두 찾았다.

[Answer]
Geoffrey Hinton: Cambridge/Edinburgh
John Hopfield: Swarthmore/Cornell
```

## 🔧 구현 패턴

### Claude/MCP 환경에서

```
┌─────────────────────────────────────────┐
│ Claude (Thought)                        │
│   - 계획 수립                            │
│   - 결과 분석                            │
│   - 다음 행동 결정                       │
└───────────────┬─────────────────────────┘
                ↓ Action
┌───────────────┴─────────────────────────┐
│ MCP Server (Action + Observation)       │
│   - 파일 읽기/쓰기                       │
│   - 웹 검색                              │
│   - 문서 변환                            │
└─────────────────────────────────────────┘
```

### 토큰 효율성

| 단계 | 실행 주체 | 토큰 사용 |
|------|----------|----------|
| Thought | Claude (직접) | O |
| Action | MCP (외부) | X (최소) |
| Observation | MCP → Claude | 결과만 |

**효과**: 대용량 작업을 외부에 위임 → 토큰 절감

## ⚠️ 한계

| 한계 | 설명 |
|------|------|
| **도구 의존성** | 적절한 도구가 없으면 Action 불가 |
| **루프 무한반복** | 잘못된 계획 시 같은 행동 반복 가능 |
| **지연 시간** | 외부 호출마다 대기 시간 발생 |

## 🔄 발전 형태

```
ReAct (기본)
    ↓
Reflexion (자기 반성 추가)
    ↓
LATS (트리 탐색 결합)
    ↓
AutoGPT/BabyAGI (자율 에이전트)
```

## Relations

- proposed_in "ReAct: Synergizing Reasoning and Acting in Language Models" (2022, Google/Princeton)
- extends [[Chain of Thought (CoT)]] (추론에 행동 추가)
- foundation_of [[agent-architecture-guide]] (에이전트 아키텍처의 기초)
- enables [[tool-discovery-pattern]] (도구 사용 패턴)
- hub [[AI-ML 개념 (AI-ML Concepts)]] (AI/ML 개념 허브)
