---
title: Decision-to-Dataset Pipeline for D2D Recording
type: note
permalink: patterns/d2d-decision-dataset-pipeline-finetuning
tags:
- decision-record
- finetuning
- mcp-memory
- d2d-pipeline
extraction_status: pending
---

# Decision-to-Dataset Pipeline for D2D Recording

## Overview
Automatically record strategic judgments from Claude collaboration and transform into personalized fine-tuning datasets.

## Detection Patterns

| Pattern | Example | Storage Type |
|---------|---------|--------------|
| Technology Choice | "Use Zustand instead of Redux" | decision |
| Design Decision | "Go with this architecture" | decision |
| Code Style | "Refactor to functional approach" | pattern |
| Trade-off | "Prioritize readability over performance" | decision |
| Error Resolution | "This method solved it" | insight |

## D2D Record Schema

```json
{
  "name": "D2D_20251223_001",
  "entityType": "decision_record",
  "observations": [
    "Context: [problem situation]",
    "Thought: [alternatives considered]",
    "Decision: [final choice]",
    "Rationale: [decision reasoning]",
    "Preference: [personal style/values]"
  ]
}
```

## MCP Memory + GraphRAG Strategy

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Real-time      │     │  Post-processing│     │  Feedback Loop  │
│  Recording      │ ──> │  Analysis       │ ──> │  Refining       │
│  (MCP Memory)   │     │  (GraphRAG)     │     │  (Refining)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
     │                       │                       │
     │ Immediate storage      │ Hidden relationship   │ Logical validation
     │ Knowledge collection   │ Community detection   │ High-quality curation
```

## Fine-tuning Dataset Structure (JSONL)

```jsonl
{
  "messages": [
    {
      "role": "system",
      "content": "You are a professional assistant following [user]'s decision-making style."
    },
    {
      "role": "user",
      "content": "Context: React project needs global state management.\nAlternatives: Redux, Zustand, Jotai\n\nWhich should we choose?"
    },
    {
      "role": "assistant",
      "content": "Choose Zustand.\n\nRationale:\n- Minimal boilerplate\n- Low learning curve\n- Fits project scale"
    }
  ]
}
```

## Mapping Transformation

| D2D Field | JSONL Location |
|-----------|----------------|
| Context | user message |
| Thought/Alternatives | user message |
| Decision | assistant message |
| Rationale | assistant message |

## Operating Rules

- **Entity Naming**: `D2D_YYYYMMDD_NNN`
- **Duplicate Handling**: Add observation to existing entity on repeated decision
- **Conflict Detection**: Alert user on clash with previous decision

## DO/DON'T

### DO
- Abstract into Context-Thought-Decision-Rationale structure
- Record failure cases (for learning)
- Maintain consistent values
- Record quietly in background

### DON'T
- Store raw conversation text as-is
- Record every conversation (decisions only)
- Request recording during conversation flow

## Goal
- Collect 200-500 high-quality fine-tuning data points
- Implement personalized AI assistant

## Observations

- [pattern] Claude 협업 중 전략적 판단을 자동으로 기록하여 개인화된 fine-tuning 데이터셋으로 변환하는 파이프라인 #finetuning #automation
- [tech] Context-Thought-Decision-Rationale 구조로 추상화하여 JSONL 변환 #data-structure #llm-training
- [method] MCP Memory로 실시간 기록 → GraphRAG로 후처리 분석 → Feedback Loop로 정제하는 3단계 전략 #workflow #graphrag
- [decision] Entity 이름 규칙: D2D_YYYYMMDD_NNN 형식으로 시계열 추적 #naming-convention #time-series
- [tip] 실패 사례도 기록하여 학습 데이터로 활용, 모든 대화가 아닌 의사결정만 선별 저장 #data-quality