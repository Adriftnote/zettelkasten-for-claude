---
title: collect-subtree
type: function
permalink: functions/collect-subtree
level: low
category: visualization/kpi/graph
semantic: BFS subtree extraction from root KPI
path: outputs/kpi-likec4/generate_dot_v5.py
tags:
- python
- bfs
- graph
- kpi
---

# collect-subtree

전사KPI를 루트로 역방향 BFS 탐색하여 서브트리(노드+엣지) 수집

## 📖 시그니처

```python
def collect_subtree(root) -> tuple[set, list]
```

## Observations

- [impl] 역방향 인접 리스트(reverse_adj) 순회: 전사KPI → 본부KPI → 팀KPI 방향 #bfs
- [impl] visited set으로 노드 중복 방문 방지, 엣지는 중복 허용 (seen 필터는 호출측) #dedup
- [impl] queue.pop(0) 기반 BFS (deque 미사용) #simple
- [return] (visited: set of node names, edges: list of (parent, child, relation_type))
- [usage] `nodes, edges = collect_subtree("순이익")` → 순이익 트리의 모든 KPI와 관계

## Relations

- part_of [[generate-dot-v5]] (소속 모듈)