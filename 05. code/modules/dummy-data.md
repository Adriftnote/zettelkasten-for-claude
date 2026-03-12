---
title: dummy-data
type: module
permalink: modules/dummy-data
level: high
category: data/sns/dashboard
semantic: generate dummy platform data and type definitions
path: /Users/ryu/AI-Projects/creator-dashboard/dummy/data.go
tags:
- go
- dummy
- data-model
- youtube
- tiktok
- meta
- naver
---

# dummy-data

4개 플랫폼(YouTube, TikTok, Meta, Naver)의 데이터 타입 정의와 더미 데이터 생성 모듈. 이후 MariaDB 연동 시 이 모듈을 실제 DB 쿼리 모듈로 교체한다.

## 개요

플랫폼별 데이터 구조체(Channel, Video, User, Item, Page, Post, Ad 등)와 공통 시계열 구조체(TimeSeriesPoint)를 정의한다. 각 `Get*()` 함수는 하드코딩된 메타 + 랜덤 시계열로 더미 응답을 생성하며, 시계열은 10분 간격 144포인트(24시간)를 기본으로 한다.

## Observations

- [impl] `now()` — RFC3339 현재 시간 문자열 (line 226) #helper
- [impl] `dateAgo(days)` — N일 전 "2006-01-02" 문자열 (line 230) #helper
- [impl] `minutesAgo(minutes)` — N분 전 "MM/DD HH:mm" 문자열 (line 234) #helper
- [impl] `genSeries10m(count, base, variance)` — 10분 간격 시계열 생성, `minutesAgo`로 라벨 (line 240) #algo
- [impl] `genSeries(days, base, variance)` — 일별 시계열 생성, 현재 미사용 (line 251) #algo
- [impl] 144포인트 = 10분 × 144 = 24시간 — 실시간 모니터링 해상도 #design
- [impl] `math/rand/v2` 사용 — Go 1.22+ 신규 rand API (`Int64N` 등) #go-modern
- [impl] ContentRow에서 Total은 4채널 합산으로 서버에서 계산 #pattern
- [impl] MetaPost.EntityType은 "FB" 또는 "IG" — 오가닉 포스트의 플랫폼 구분 #data-model
- [impl] MetaAd.QualityRanking은 "ABOVE_AVERAGE", "AVERAGE", "BELOW_AVERAGE" 3단계 #enum
- [deps] `math/rand/v2`, `time` (Go 표준 라이브러리) #import
- [note] MariaDB 연동 시 Get* 함수를 DB 쿼리로 교체, 구조체는 유지 #migration-plan

## 타입 구조

| 타입 | 용도 | 주요 필드 |
|------|------|-----------|
| Platform | Overview KPI | Name, TodayViews, TotalViews, Followers |
| ContentRow | Overview 컨텐츠 테이블 | Title, YouTube/TikTok/Meta/Naver/Total |
| TimeSeriesPoint | 공통 시계열 | Date, Value |
| YTChannel / YTVideo / YTAnalytics | YouTube | channelId, videoId, views/watchTime/subs |
| TTUser / TTItem / TTInsight | TikTok | userId, itemId, views/likes/comments/shares/reached |
| MetaPage / MetaPost / MetaAd | Meta | pageId, entityType(FB/IG), impressions/reach/spend |
| NaverTVChannel / NaverTVClip | NaverTV | channelId, clipNo, playCount |
| NaverBlog / NaverBlogPost | Naver Blog | blogId, views, visitors |
| Video | 미사용 (향후 통합용) | id, title, views, platform |

## Relations

- part_of [[크리에이터 실시간 대시보드]] (소속 프로젝트)
- contains [[gen-series-10m]]
- contains [[get-overview]]
- contains [[get-youtube]]
- contains [[get-tiktok]]
- contains [[get-meta]]
- contains [[get-naver]]
  - [[get-overview]] calls [[gen-series-10m]] (line 272-275)
  - [[get-youtube]] calls [[gen-series-10m]] (line 347-349)
  - [[get-tiktok]] calls [[gen-series-10m]] (line 396-401)
  - [[get-meta]] calls [[gen-series-10m]] (line 442)
  - [[get-naver]] calls [[gen-series-10m]] (line 510-513)
- referenced_by [[api-handlers]] (API 핸들러가 Get* 호출)
  - APIOverview calls [[get-overview]] (api.go:12)
  - APIYouTube calls [[get-youtube]] (api.go:16)
  - APITikTok calls [[get-tiktok]] (api.go:20)
  - APIMeta calls [[get-meta]] (api.go:24)
  - APINaver calls [[get-naver]] (api.go:28)
- related_to [[SNS 크리에이터 스튜디오 API ERD]] (실제 스키마 참조)
