---
title: query-mini-cumulative
type: function
permalink: zettelkasten/05.-code/functions/query-mini-cumulative
level: low
category: data/sns/dashboard
semantic: query cumulative increase timeseries from morning baseline
path: projects/sns-dashboard/internal/store/overview.go
tags:
- go
- sql
- timeseries
---

# queryMiniCumulative

오늘 09:00 기준 누적 증가분 시계열 반환 (미니차트용, 우상향). 각 포인트 = 해당 시점 SUM - 9시 첫 스냅샷 SUM.

## 시그니처

```go
func queryMiniCumulative(db *sql.DB, sumExpr, table string) []model.TimeseriesPoint
```

## Observations

- [impl] validSnapshotCTE로 불량 스냅샷 필터 후 09~18시 범위 쿼리 #pattern
- [impl] baseline = raws[0].value (9시 이후 첫 스냅샷) — 이후 포인트에서 baseline 차감 #algo
- [impl] 음수 보정 — cumulative < 0이면 0으로 클램프 #caveat
- [return] []model.TimeseriesPoint — Date+Value 배열 (nil if empty)

## Relations

- part_of [[overview]] (소속 모듈)
- calls [[valid-snapshot-cte]] (line 71)
- called_by [[get-overview]] (line 238)
