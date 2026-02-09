---
title: DAG (Directed Acyclic Graph)
type: concept
permalink: knowledge/concepts/dag
tags:
- graph-theory
- data-structure
- dependency-modeling
category: 컴퓨터과학
difficulty: 초급
---

# DAG (Directed Acyclic Graph, 방향 비순환 그래프)

노드(점)와 방향이 있는 엣지(화살표)로 구성되며, 화살표를 따라가도 절대 출발점으로 돌아오지 않는 그래프 구조

## 📖 개요

DAG는 세 가지 성질을 동시에 만족하는 그래프입니다. Directed(방향) — 엣지에 방향이 있고, Acyclic(비순환) — 어떤 경로를 따라가도 출발점으로 돌아올 수 없으며, Graph — 노드와 엣지로 구성됩니다. 이 구조 덕분에 위상 정렬(topological sort)이 가능하여, 의존성을 지키면서 최적 실행 순서를 자동으로 구할 수 있습니다.

## 🎭 비유

대학교 수강 선수과목 체계. "미적분"을 들으려면 "수학1"을 먼저 들어야 하고(방향), "수학1"을 듣기 위해 "미적분"이 필요하지는 않으며(비순환), "수학1"과 "영어1"은 동시에 수강 가능합니다(독립 노드 = 병렬).

## ✨ 특징

- 방향(Directed): A→B와 B→A는 다름
- 비순환(Acyclic): 어떤 경로든 출발점으로 돌아오지 않음 → 무한루프 불가, 반드시 종료
- 위상 정렬 가능: 의존성을 만족하는 실행 순서를 자동 도출
- 독립 노드는 병렬 실행, 의존 노드는 순차 실행
- 선형 체인(path graph)은 DAG의 특수 케이스

## 💡 예시

```
✅ DAG

  A ──→ C ──→ E
  B ──→ C
  B ──→ D ──→ E

위상 정렬: [A, B] → [C, D] → [E]
→ A와 B는 병렬, C와 D도 병렬, E는 마지막


❌ DAG 아님 (순환 존재)

  A ──→ B ──→ C
  ^              │
  └──────────────┘
```

## Relations

- used_by [[QDMR (Question Decomposition Meaning Representation)]] (의존성 구조로 사용)
- used_by [[Task Decomposition]] (task 간 의존성 표현)
- subsumes [[Path Graph (경로 그래프)]] (선형 체인은 DAG의 특수 케이스)
- enables [[위상 정렬 (Topological Sort)]] (실행 순서 자동 도출)
- relates_to [[의존성 (Dependency)]] (의존 관계를 구조화)