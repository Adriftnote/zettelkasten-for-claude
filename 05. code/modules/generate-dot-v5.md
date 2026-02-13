---
title: generate-dot-v5
type: module
permalink: modules/generate-dot-v5
level: high
category: visualization/kpi
semantic: 전사KPI별 개별 서브트리 DOT 파일 생성기 (최종판)
path: outputs/kpi-likec4/generate_dot_v5.py
tags:
- python
- graphviz
- dot
- kpi
- visualization
- tree
---

# generate-dot-v5

전사KPI별 개별 서브트리 DOT 파일 생성기 (최종판).

## 📖 개요

v1~v4에서 전체 그래프 크기 문제 해결을 위해, 각 전사KPI를 루트로 하는 개별 서브트리를 BFS로 추출하여 별도 DOT 파일로 생성. 10개 전사KPI에 대해 각각 독립적인 트리 다이어그램 생성.

## Observations

- [strategy] 전체 그래프 대신 전사KPI별 개별 서브트리 분리 방식 #solution #tree
- [impl] BFS 탐색으로 역방향 인접 리스트 순회 (전사KPI → 본부KPI → 팀KPI 방향) #graph #bfs
- [style] 본부별 컬러 코딩: CS(황색), 경영지원(보라), 마케팅(파랑), 영업(녹색), 연구소(핑크) #color
- [size] 레벨별 크기 차등: 전사(14pt, 2.0×0.6) > 본부(10pt, 1.6×0.45) > 팀(9pt, 1.3×0.35) #hierarchy
- [output] trees/ 폴더에 각 전사KPI별 .dot 파일 생성 (n1.dot, n2.dot, ...) #batch
- [usage] Graphviz로 PNG/SVG 변환: `dot -Tpng n1.dot -o n1.png` #pipeline

## 동작 흐름

```
입력: kpi_relations.json, kpi_master.json
  ↓
역방향 인접 리스트 구축: target → [sources]
  ↓
전사KPI 목록 추출 (10개)
  ↓
각 전사KPI별 BFS 서브트리 수집
  ↓
개별 DOT 파일 생성 (trees/{nid}.dot)
  ↓
출력: 10개 DOT 파일
```

## 핵심 함수 구조

| 함수 | 역할 |
|------|------|
| collect_subtree(root) | BFS로 root부터 도달 가능한 모든 노드와 엣지 수집 |
| get_style(name) | KPI 레벨/본부에 따른 노드 스타일 속성 문자열 생성 |
| nid(name) | KPI 이름 → 안전한 ASCII ID 변환 (n1, n2, ...) |

## 데이터 구조

**reverse_adj**: dict[to_kpi] → [from_kpi] (역방향 인접 리스트)
**edge_types**: tuple(to_kpi, from_kpi) → relation_type (drives/reduces)
**company_kpis**: 본부 없는 전사KPI 리스트 (sorted)

## DOT 출력 구조

```dot
digraph "순이익" {
  graph [rankdir=TB fontname="Malgun Gothic" bgcolor=white ...]
  node [fontname="Malgun Gothic" shape=box style="filled,rounded"]
  edge [penwidth=0.8 arrowsize=0.6]

  n1 [label=<<B>순이익</B>> fontsize=14 fillcolor="#fbbf24" ...]
  n2 [label="영업이익" fontsize=10 fillcolor="#fbbf24" ...]
  
  n1 -> n2 [color="#059669"]
  n1 -> n3 [color="#ef4444" style=dashed]
}
```

## 스타일 규칙

**본부별 색상**:
- CS본부: #fbbf24 (황색)
- 경영지원실: #c4b5fd (보라)
- 마케팅본부: #93c5fd (파랑)
- 영업본부: #6ee7b7 (녹색)
- 연구소: #f9a8d4 (핑크)
- 미지정: #cbd5e1 (회색)

**관계 색상**:
- drives: #059669 (녹색 실선)
- reduces: #ef4444 (빨강 점선)

## v1~v4 대비 개선점

- v1: LR 레이아웃 → 세로로 너무 김
- v2: TB + curved splines → 여전히 김
- v3: rank=same 가로 배치 → 가로 25215px로 폭발
- v4: rank 제약 제거 → 여전히 넓음
- **v5**: 전사KPI별 개별 서브트리 분리 → 각 트리가 독립적이라 크기 문제 해결

## Relations

- part_of [[KPI 관계도 시각화 도구]]
- contains [[collect-subtree]] (BFS 서브트리 수집)
- contains [[get-style-kpi]] (본부/레벨별 노드 스타일)
- contains [[nid-kpi]] (한글 이름 → ASCII ID 변환)