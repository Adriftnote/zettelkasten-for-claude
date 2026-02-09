---
title: QDMR (Question Decomposition Meaning Representation)
type: concept
permalink: knowledge/concepts/qdmr
tags:
- nlp
- decomposition
- dependency-modeling
- multi-hop-qa
category: AI/NLP
difficulty: 중급
---

# QDMR (Question Decomposition Meaning Representation)

복잡한 질문을 원자적 단계로 분해하면서, 단계 간 의존성을 `#N` 참조로 명시하여 DAG 구조를 형성하는 형식 표현

## 📖 개요

QDMR은 Tomer Wolfson 등(2020)이 제안한 질문 분해 표현 방식입니다. 각 단계가 이전 단계를 `#1`, `#2`처럼 명시적으로 참조할 수 있어, 단순한 순차 나열이 아닌 방향 비순환 그래프(DAG) 구조로 의존성을 표현합니다. Sequential 분해의 일반형(generalization)으로, Sequential은 QDMR에서 DAG가 선형 체인으로 퇴화한 특수 케이스입니다.

## 🎭 비유

요리 레시피 비유: Sequential은 "1번 → 2번 → 3번 순서대로 하세요"이고, QDMR은 "소스(#1)와 면(#2)을 각각 준비한 뒤, #1을 #2에 붓세요(#3)"처럼 각 단계가 어떤 결과를 참조하는지 명시하는 것.

## ✨ 특징

- `#N` 참조로 의존성을 명시적으로 표현 (암묵적 순서 의존 X)
- DAG 구조 → 독립 노드는 병렬 실행 가능
- Sequential 분해의 일반형 (path graph ⊂ DAG)
- 위상 정렬(topological sort)로 최적 실행 순서 결정
- BREAK 데이터셋(약 10,000개 질문)으로 어노테이션 제공

## 💡 예시

질문: "한국과 일본의 GDP를 비교하면?"

```
#1: 한국의 GDP는?              → (독립)
#2: 일본의 GDP는?              → (독립)
#3: #1과 #2를 비교             → (의존: #1, #2)
```

```
#1 ──┐
     ├──→ #3
#2 ──┘
```

→ #1과 #2는 병렬 실행 가능, #3만 둘 다 기다리면 됨

## Relations

- generalizes [[Sequential Decomposition (순차 분해)]] (순차 분해의 일반형)
- relates_to [[DAG (Directed Acyclic Graph)]] (의존성 구조)
- used_by [[Dep-Search- Dependency-Aware Reasoning with Persistent Memory]] (decompose 토큰에 활용)
- enables [[병렬 실행 최적화]] (독립 노드 식별 가능)
- origin [[Break It Down - A Question Understanding Benchmark]] (Wolfson et al., TACL 2020)