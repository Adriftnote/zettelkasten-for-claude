---
title: Sequential Decomposition (순차 분해)
type: concept
permalink: knowledge/concepts/sequential-decomposition
tags:
- decomposition
- reasoning
- task-management
category: 방법론
difficulty: 초급
---

# Sequential Decomposition (순차 분해)

복잡한 문제를 선형 체인(1→2→3→...)으로 나열하여, 각 단계가 직전 단계에만 암묵적으로 의존하는 분해 방식

## 📖 개요

Sequential Decomposition은 가장 직관적인 문제 분해 방식으로, 단계들을 순서대로 나열합니다. 각 단계는 직전 단계의 결과에 의존한다고 암묵적으로 가정합니다. 그래프 이론으로 보면 path graph(경로 그래프)에 해당하며, DAG의 특수 케이스입니다. 단순하고 이해하기 쉬운 장점이 있지만, 실제로 독립적인 단계도 직렬로 묶이는 한계가 있습니다.

## 🎭 비유

한 줄 서기. 모든 사람이 앞 사람이 끝날 때까지 기다려야 함. 사실 2번과 3번은 서로 관계없는 일인데도, 2번이 끝나야 3번이 시작됨.

## ✨ 특징

- 의존성이 암묵적 (순서 = 의존성)
- 구조가 선형 체인 (path graph)
- 모든 단계가 직렬 실행 → 병렬화 불가
- 이해와 구현이 단순
- QDMR의 특수 케이스 (path graph ⊂ DAG)

## 💡 예시

질문: "해리 포터를 쓴 작가가 태어난 도시의 인구는?"

```
Q1: 해리 포터 작가는 누구?
Q2: 그 작가가 태어난 도시는?
Q3: 그 도시의 인구는?
```

```
Q1 → Q2 → Q3    (항상 직렬)
```

→ 의존성이 순서에 숨어 있고, "왜" 의존하는지 표현 안 됨

## Relations

- specializes [[QDMR (Question Decomposition Meaning Representation)]] (QDMR의 특수 케이스)
- relates_to [[Task 분해 (Task Decomposition)]] (task 분해에도 동일 패턴)
- contrasts_with [[병렬 분해 (Parallel Decomposition)]] (직렬 vs 병렬)
- modeled_as [[Path Graph (경로 그래프)]] (그래프 이론 대응)