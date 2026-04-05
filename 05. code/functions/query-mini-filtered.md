---
title: query-mini-filtered
type: function
permalink: zettelkasten/05.-code/functions/query-mini-filtered
level: low
category: data/sns/dashboard
semantic: query filtered timeseries with custom where clause
path: projects/sns-dashboard/internal/store/overview.go
tags:
- go
- sql
- timeseries
---

# queryMiniFiltered

조건부 필터가 추가된 미니차트 시계열 반환. Meta Ads impressions 등 특정 컬럼 > 0 필터링.

## 시그니처

```go
func queryMiniFiltered(db *sql.DB, sumExpr, table, filter string) []model.TimeseriesPoint
```

## Observations

- [impl] queryMiniRaw와 동일 구조 + WHERE에 filter 조건 추가 + HAVING v > 0 #pattern
- [impl] filter는 문자열 직접 연결 — 내부 호출 전용이라 SQL injection 위험 없음 #caveat
- [return] []model.TimeseriesPoint — 필터 통과한 시계열

## Relations

- part_of [[overview]] (소속 모듈)
- called_by [[get-overview]] (line 343)
