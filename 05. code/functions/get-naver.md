---
title: get-naver
type: function
permalink: functions/get-naver
level: low
category: data/sns/dashboard
semantic: generate naver tv and blog dummy data
path: /Users/ryu/AI-Projects/creator-dashboard/dummy/data.go
tags:
- go
- naver
- navertv
- blog
- dummy
---

# GetNaver

Naver 페이지용 데이터 생성. NaverTV 채널 + 10개 클립 + Blog 정보 + 10개 블로그 포스트 + TV재생수/Blog방문자 2종 시계열을 반환한다.

## 시그니처

```go
func GetNaver() NaverData
```

## Observations

- [impl] NaverTVChannel — subscribers 8,200, 10개 클립 10개 카테고리(라이프/요리/일상/인테리어 등) #data
- [impl] NaverBlog — visitors 4,200(일일), 10개 블로그 포스트 #data
- [impl] TV와 Blog 각각 독립 시계열 — tvTrend(base 200) / blogTrend(base 150) #timeseries
- [return] `NaverData{TV, TVClips, TVTrend, Blog, BlogPosts, BlogTrend, UpdatedAt}`

## Relations

- part_of [[dummy-data]] (소속 모듈)
- part_of [[크리에이터 실시간 대시보드]] (소속 프로젝트)
- calls [[gen-series-10m]] (line 510-513)
- called_by [[api-handlers]] via APINaver (api.go:28)
- data_flows_to [[load-naver]] via /api/naver/stats (JSON)
