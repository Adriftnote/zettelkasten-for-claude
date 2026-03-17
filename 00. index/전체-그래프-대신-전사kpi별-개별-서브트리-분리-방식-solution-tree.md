---
title: 전체 그래프 대신 전사KPI별 개별 서브트리 분리 방식 #solution #tree
type: note
permalink: synthesized/전체-그래프-대신-전사kpi별-개별-서브트리-분리-방식-solution-tree
tags: ["mental_model", "synthesized"]
evidence_count: 5
generated: 2026-03-17T09:02:24Z
sources:
  - "modules/generate-dot-v5"
  - "modules/generate-dot-v5"
  - "modules/generate-dot-v5"
  - "functions/collect-subtree"
  - "functions/get-style-kpi"
---

## 통찰

- 복잡한 전사 KPI를 효과적으로 관리하기 위해, 트리 구조를 분해하여 각 수준별 분석을 용이하게 하는 것이 중요하다.
- BFS 탐색을 역방향 인접 리스트 순회 방식으로 활용하여, 상위 KPI의 영향을 하류 KPI에 정확하게 반영하는 것이 핵심이다.
- 각 KPI 그룹을 시각적으로 구분하기 위해 컬러 코딩을 적용하여, 정보의 직관적인 이해와 관리 효율성을 높이는 것이 효과적이다.
- 역방향 인접 리스트(reverse_adj) 순회를 BFS 탐색 방식으로 활용하여 전사 KPI에서 팀 KPI까지의 영향을 정확하게 분석하는 것이 핵심임을 확인했습니다.
- 팀 KPI의 시각적 표현에 반투명 처리(fillcolor에 88 알파 추가)를 적용하여 정보의 직관적인 이해를 높이는 것이 효과적입니다.

## 근거

- modules/generate-dot-v5
- modules/generate-dot-v5
- modules/generate-dot-v5
- functions/collect-subtree
- functions/get-style-kpi