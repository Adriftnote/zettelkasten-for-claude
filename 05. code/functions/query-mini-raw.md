---
title: query-mini-raw
type: function
permalink: zettelkasten/05.-code/functions/query-mini-raw
level: low
category: data/sns/dashboard
semantic: query raw cumulative timeseries for single-record platforms
path: projects/sns-dashboard/internal/store/overview.go
tags:
- go
- sql
- timeseries
---

# queryMiniRaw

오늘 09~18시 누적값 시계열 반환 (Naver Blog 등 단일 레코드 플랫폼용). validSnapshotCTE 미사용.

## 시그니처

```go
func queryMiniRaw(db *sql.DB, sumExpr, table string) []model.TimeseriesPoint
```

## Observations

- [impl] CTE 필터 없이 직접 GROUP BY captured_at — 단일 레코드 플랫폼은 불량 스냅샷 개념 없음 #pattern
- [impl] LIMIT 72 — 09~18시 10분간격 최대 54포인트 + 여유 #caveat
- [return] []model.TimeseriesPoint — 누적값 그대로 (diff 아님)

## Relations

- part_of [[overview]] (소속 모듈)
- called_by [[get-overview]] (line 284)
