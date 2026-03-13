---
title: get-overview
type: function
permalink: functions/get-overview
level: low
category: data/sns/dashboard
semantic: generate overview dashboard data with platform kpis and content table
path: /Users/ryu/AI-Projects/creator-dashboard/dummy/data.go
tags:
- go
- overview
- kpi
---

# GetOverview

Overview 페이지용 데이터 생성. 4채널 오늘 누적 조회수 + 10분 간격 트렌드 + 15개 컨텐츠별 채널 조회수 테이블을 반환한다.

## 시그니처

```go
func GetOverview() OverviewData
```

## Observations

- [impl] `Platform.TodayViews` — 오늘의 누적 조회수 (YouTube 124,350 / TikTok 287,600 / Meta 45,230 / Naver 31,780) #data
- [impl] `PlatformTimeSeries` 4건 — 각 플랫폼 144포인트(24시간) 10분 간격 #timeseries
- [impl] `ContentRow` 15건 — 한국어 컨텐츠 제목, 4채널별 조회수 + Total 합산 #data
- [impl] `contents[i].Total = YouTube + TikTok + Meta + Naver` — 서버에서 합산 계산 #pattern
- [return] `OverviewData{Platforms, Trends, Contents, UpdatedAt}` — JSON 직렬화용 구조체

## Relations

- part_of [[dummy-data]] (소속 모듈)
- part_of [[크리에이터 실시간 대시보드]] (소속 프로젝트)
- calls [[gen-series-10m]] (line 272-275)
- called_by [[api-handlers]] via APIOverview (api.go:12)
- data_flows_to [[load-overview]] via /api/overview (JSON)
