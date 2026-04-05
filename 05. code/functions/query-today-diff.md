---
title: query-today-diff
type: function
permalink: zettelkasten/05.-code/functions/query-today-diff
level: low
category: data/sns/dashboard
semantic: calculate today increase since 9am baseline
path: projects/sns-dashboard/internal/store/overview.go
tags:
- go
- sql
- kpi
---

# queryTodayDiff

오늘 09:00 기준 스냅샷 대비 최신 정상 스냅샷의 diff (= 9시 이후 증가분). KPI 카드의 "오늘 증가분" 값.

## 시그니처

```go
func queryTodayDiff(db *sql.DB, sumExpr, table string) int64
```

## Observations

- [impl] base = 오늘 09:00 이후 첫 정상 스냅샷의 SUM, last = 오늘 최신 정상 스냅샷의 SUM #algo
- [impl] base=0이면 0 반환, diff<0이면 0 클램프 #caveat
- [return] int64 — 오늘 9시 이후 순증가분

## Relations

- part_of [[overview]] (소속 모듈)
- calls [[valid-snapshot-cte]] (line 139)
- calls [[query-int64]] (line 147)
- called_by [[get-overview]] (line 229)
