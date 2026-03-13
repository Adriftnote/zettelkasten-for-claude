---
title: gen-series-10m
type: function
permalink: functions/gen-series-10m
level: low
category: data/sns/dashboard
semantic: generate 10-minute interval time series data
path: /Users/ryu/AI-Projects/creator-dashboard/dummy/data.go
tags:
- go
- timeseries
- dummy
---

# genSeries10m

10분 간격 시계열 데이터를 생성하는 함수. base값 + 랜덤 분산으로 포인트를 생성하며, 144포인트(24시간)를 기본으로 사용한다.

## 시그니처

```go
func genSeries10m(count int, base, variance int64) []TimeSeriesPoint
```

## Observations

- [impl] `minutesAgo((count-1-i) * 10)` — 가장 오래된 포인트부터 현재까지 시간순 생성, 라벨 "MM/DD HH:mm" #algo
- [impl] `base + rand.Int64N(variance)` — 기저값 + [0, variance) 범위 랜덤 #algo
- [return] `[]TimeSeriesPoint` — Date(string) + Value(int64) 배열
- [usage] `genSeries10m(144, 800, 500)` → 24시간, 800~1300 범위의 YouTube 조회수
- [note] 실 데이터 연동 시 이 함수를 DB 쿼리(GROUP BY 10분)로 교체 #migration-plan

## Relations

- part_of [[dummy-data]] (소속 모듈)
- part_of [[크리에이터 실시간 대시보드]] (소속 프로젝트)
- called_by [[get-overview]] (data.go:272-275)
- called_by [[get-youtube]] (data.go:347-349)
- called_by [[get-tiktok]] (data.go:396-401)
- called_by [[get-meta]] (data.go:442)
- called_by [[get-naver]] (data.go:510-513)
