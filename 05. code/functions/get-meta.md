---
title: get-meta
type: function
permalink: functions/get-meta
level: low
category: data/sns/dashboard
semantic: generate meta page organic posts and ad performance dummy data
path: /Users/ryu/AI-Projects/creator-dashboard/dummy/data.go
tags:
- go
- meta
- facebook
- instagram
- ads
- dummy
---

# GetMeta

Meta Business Suite 페이지용 데이터 생성. 페이지 정보 + 10개 오가닉 포스트(FB/IG) + 5개 광고 성과 + Ad Impressions 시계열을 반환한다.

## 시그니처

```go
func GetMeta() MetaData
```

## Observations

- [impl] MetaPage — followers 32,100 / engagement 67,890 / category "미디어/뉴스" #data
- [impl] 10개 오가닉 포스트 — EntityType "FB" 또는 "IG" 교대, views/reach/engagement/reactions/comments/shares #data
- [impl] 5개 광고 — QualityRanking 3단계(ABOVE_AVERAGE, AVERAGE, BELOW_AVERAGE), Spend $890~$3,120 #data
- [impl] MetaAd에 CPM/CPC/CTR 사전 계산값 포함 — 프론트에서 재계산 불필요 #pattern
- [return] `MetaData{Page, Posts, Ads, AdTrend, UpdatedAt}`

## Relations

- part_of [[dummy-data]] (소속 모듈)
- part_of [[크리에이터 실시간 대시보드]] (소속 프로젝트)
- calls [[gen-series-10m]] (line 442)
- called_by [[api-handlers]] via APIMeta (api.go:24)
- data_flows_to [[load-meta]] via /api/meta/stats (JSON)
