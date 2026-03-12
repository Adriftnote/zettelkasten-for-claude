---
title: api-handlers
type: module
permalink: modules/api-handlers
level: low
category: data/sns/dashboard
semantic: json api endpoint handlers
path: /Users/ryu/AI-Projects/creator-dashboard/handlers/api.go
tags:
- go
- gin
- api
- json
---

# api-handlers

5개 플랫폼별 JSON API 핸들러. dummy 패키지의 Get* 함수를 호출하여 `c.JSON(200, ...)` 으로 응답한다.

## 개요

각 핸들러는 1줄 함수로, dummy 데이터를 JSON으로 직렬화하여 반환한다. MariaDB 연동 시 dummy 호출을 DB 쿼리로 교체하면 된다.

## Observations

- [impl] 5개 핸들러 모두 동일 패턴: `c.JSON(http.StatusOK, dummy.GetX())` #pattern
- [impl] 에러 처리 없음 — 더미 데이터이므로 실패 불가, DB 연동 시 추가 필요 #caveat
- [deps] `net/http`, `creator-dashboard/dummy`, `github.com/gin-gonic/gin` #import

## 핸들러 목록

| 함수 | 경로 | 호출 | 응답 타입 |
|------|------|------|-----------|
| APIOverview | /api/overview | dummy.GetOverview() | OverviewData |
| APIYouTube | /api/youtube/stats | dummy.GetYouTube() | YouTubeData |
| APITikTok | /api/tiktok/stats | dummy.GetTikTok() | TikTokData |
| APIMeta | /api/meta/stats | dummy.GetMeta() | MetaData |
| APINaver | /api/naver/stats | dummy.GetNaver() | NaverData |

## Relations

- part_of [[크리에이터 실시간 대시보드]] (소속 프로젝트)
- depends_on [[dummy-data]] (데이터 소스)
  - APIOverview calls [[get-overview]] (api.go:12)
  - APIYouTube calls [[get-youtube]] (api.go:16)
  - APITikTok calls [[get-tiktok]] (api.go:20)
  - APIMeta calls [[get-meta]] (api.go:24)
  - APINaver calls [[get-naver]] (api.go:28)
- called_by [[dashboard-server]] (라우터 등록, main.go:27-31)
- data_flows_to [[dashboard-js]] (프론트엔드가 폴링)
  - /api/overview → [[load-overview]]
  - /api/youtube/stats → [[load-youtube]]
  - /api/tiktok/stats → [[load-tiktok]]
  - /api/meta/stats → [[load-meta]]
  - /api/naver/stats → [[load-naver]]
