---
title: nid-kpi
type: function
permalink: functions/nid-kpi
level: low
category: visualization/kpi/util
semantic: KPI name to safe ASCII node ID
path: outputs/kpi-likec4/generate_dot_v5.py
tags:
- python
- graphviz
- kpi
---

# nid-kpi

KPI 한글 이름을 Graphviz 안전한 ASCII 노드 ID(n1, n2, ...)로 변환

## 📖 시그니처

```python
def nid(name) -> str
```

## Observations

- [impl] 모듈 레벨 nid_map dict + nid_counter로 자동 증가 ID 부여 #global-state
- [impl] 동일 이름 재호출 시 캐시된 ID 반환 (멱등) #idempotent
- [return] `"n1"`, `"n2"`, ... 형태의 문자열
- [usage] `nid("순이익")` → `"n1"`, `nid("영업이익")` → `"n2"`

## Relations

- part_of [[generate-dot-v5]] (소속 모듈)