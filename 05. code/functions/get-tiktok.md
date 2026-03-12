---
title: get-tiktok
type: function
permalink: functions/get-tiktok
level: low
category: data/sns/dashboard
semantic: generate tiktok user and item dummy data
path: /Users/ryu/AI-Projects/creator-dashboard/dummy/data.go
tags:
- go
- tiktok
- dummy
---

# GetTikTok

TikTok Creator Center 페이지용 데이터 생성. 유저 정보 + 15개 아이템 + Views/Likes/Comments/Shares/Followers/Reached 6종 인사이트 시계열을 반환한다.

## 시그니처

```go
func GetTikTok() TikTokData
```

## Observations

- [impl] TTUser — followers 89,300 / likes 1,234,567 / region "KR" #data
- [impl] 15개 아이템 — 랜덤 playCount 50K~1.05M, duration 5~60초 #data
- [impl] TTInsight 6종 시계열 — views, likes, comments, shares, followers, reached 각 144포인트 #timeseries
- [return] `TikTokData{User, Items, Insight, UpdatedAt}`

## Relations

- part_of [[dummy-data]] (소속 모듈)
- part_of [[크리에이터 실시간 대시보드]] (소속 프로젝트)
- calls [[gen-series-10m]] (line 396-401)
- called_by [[api-handlers]] via APITikTok (api.go:20)
- data_flows_to [[load-tiktok]] via /api/tiktok/stats (JSON)
