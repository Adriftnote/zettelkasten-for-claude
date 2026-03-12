---
title: get-youtube
type: function
permalink: functions/get-youtube
level: low
category: data/sns/dashboard
semantic: generate youtube channel and video dummy data
path: /Users/ryu/AI-Projects/creator-dashboard/dummy/data.go
tags:
- go
- youtube
- dummy
---

# GetYouTube

YouTube Studio 페이지용 데이터 생성. 채널 정보 + 20개 비디오 목록 + Views/WatchTime/Subs 3종 시계열을 반환한다.

## 시그니처

```go
func GetYouTube() YouTubeData
```

## Observations

- [impl] YTChannel — subscribers 45,200 / totalViews 2,847,320 / videoCount 342 #data
- [impl] 20개 비디오 — 5번째마다 SHORT 타입, 나머지 VIDEO, 랜덤 조회수 10K~510K #data
- [impl] YTAnalytics — views/watchTime/subs 각 144포인트(24h/10min) #timeseries
- [impl] `VideoID = "vid_" + rune('A'+i)` — A~T 단일문자 ID #pattern
- [return] `YouTubeData{Channel, Videos, Analytics, UpdatedAt}`

## Relations

- part_of [[dummy-data]] (소속 모듈)
- part_of [[크리에이터 실시간 대시보드]] (소속 프로젝트)
- calls [[gen-series-10m]] (line 347-349)
- called_by [[api-handlers]] via APIYouTube (api.go:16)
- data_flows_to [[load-youtube]] via /api/youtube/stats (JSON)
