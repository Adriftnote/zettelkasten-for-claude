---
title: Task 분해와 AI Attention의 관계
type: note
permalink: knowledge/concepts/task-decomposition-attention
tags:
- task-decomposition
- attention-mechanism
- LLM
- transformer
- claude-code
- concept
---

# Task 분해와 AI Attention의 관계

Task 분해 방법론과 Transformer의 Attention 메커니즘이 같은 문제를 다른 층위에서 해결하는 관계

## 📖 개요

Task 분해는 단순한 작업 관리 기법이 아니라, **AI의 attention을 효율적으로 배분하는 전략**입니다. Transformer의 O(n²) 복잡도와 "Lost in the Middle" 현상을 작업 수준에서 해결합니다.

## 🎭 비유

큰 작업 하나를 주면 AI가 여러 곳을 왔다갔다 살피느라 집중을 못하지만, 작은 작업 여러 개로 나누면 각각에 100% 집중할 수 있습니다. 마치 한 사람에게 3개 업무를 동시에 주는 것 vs 3명에게 각각 1개씩 주는 것의 차이.

## ✨ 핵심 원칙

### 분해 원칙 = Attention 전략

| 분해 원칙 | Attention 관점 |
|-----------|----------------|
| **독립성** | Attention 간섭 제거 - 각 Agent가 해당 작업에만 집중 |
| **측정 가능성** | Attention Anchor - 구체적 기준이 고정점 역할 |
| **적정 크기** | Attention 용량 - 너무 크면 희석, 너무 작으면 오버헤드 |

### 분해 패턴 = Attention 구조

| 패턴 | Attention 관점 |
|------|----------------|
| **Pipeline** | Sequential Attention - 이전 출력이 다음의 attention key |
| **Parallel** | Multi-head Attention - 독립적 관점에서 동시 처리 |
| **Swarm** | Parallel Document Scan - 같은 query로 병렬 스캔 |

## 💡 설계 원칙

1. **컨텍스트 예산 관리**: 각 Subagent에게 "attention 예산" 할당
2. **간섭 최소화**: 다른 작업이 같은 attention 공간을 두고 경쟁하지 않도록
3. **Anchor 설정**: 모든 Task에 attention 고정점이 되는 구체적 기준 포함

## Observations

- [fact] 20k 토큰 오버헤드 제약은 단순한 기술적 한계가 아니라 attention 효율의 임계점이다 #attention #claude-code
- [fact] Task 분해, RAG Chunking, 프롬프트 구조는 모두 "정보 처리 단위의 적정 크기" 문제의 변주 #attention
- [fact] "AI의 attention을 어떻게 효율적으로 배분할 것인가"가 Task 분해의 본질 #task-decomposition

## Relations

- relates_to [[Task 분해 방법론 리서치]] (실용적 적용)
- relates_to [[Task 분해 프레임워크 - 경영학 관점]] (이론적 배경)
- extends [[Attention Mechanism]] (개념 확장)
- applies_to [[RAG]] (동일 원리 적용)

---

**도출일**: 2026-01-30
**출처**: 대화 중 발견한 인사이트