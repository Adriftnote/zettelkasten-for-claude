---
title: get-style-kpi
type: function
permalink: functions/get-style-kpi
level: low
category: visualization/kpi/style
semantic: KPI node style string by dept and level
path: outputs/kpi-likec4/generate_dot_v5.py
tags:
- python
- graphviz
- kpi
- style
---

# get-style-kpi

KPI의 본부/레벨에 따라 Graphviz 노드 스타일 속성 문자열 생성

## 📖 시그니처

```python
def get_style(name) -> str
```

## Observations

- [impl] all_kpi_info dict에서 dept/level 조회 후 dept_style 매핑 #lookup
- [impl] 레벨별 크기 차등: 전사(14pt, 2.0×0.6) > 본부(10pt, 1.6×0.45) > 팀(9pt, 1.3×0.35) #hierarchy
- [impl] 팀KPI는 fillcolor에 `88` 알파 추가하여 반투명 처리 #alpha
- [return] Graphviz 속성 문자열 (fontsize, fillcolor, fontcolor, color, width, height, penwidth)
- [usage] `get_style("고객만족도")` → `'fontsize=10 fillcolor="#fbbf24" ...'`

## 본부별 색상 매핑

| 본부 | fill | font | border |
|------|------|------|--------|
| CS본부 | #fbbf24 | #78350f | #d97706 |
| 경영지원실 | #c4b5fd | #3b0764 | #7c3aed |
| 마케팅본부 | #93c5fd | #1e3a5f | #2563eb |
| 영업본부 | #6ee7b7 | #064e3b | #059669 |
| 연구소 | #f9a8d4 | #831843 | #db2777 |
| 미지정 | #cbd5e1 | #1e293b | #64748b |

## Relations

- part_of [[generate-dot-v5]] (소속 모듈)