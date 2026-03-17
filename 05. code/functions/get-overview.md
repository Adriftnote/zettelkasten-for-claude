---
title: get-overview
type: function
permalink: functions/get-overview
level: low
category: data/sns/dashboard
semantic: generate overview dashboard with multi-platform kpis alerts minichart
path: projects/sns-dashboard/internal/store/overview.go
tags:
- go
- dashboard
- overview
---

# GetOverview

6개 플랫폼 DB에서 KPI(오늘증가분·1h delta·활성게시물수)·미니차트·Alert를 조합하여 OverviewResponse를 반환하는 메인 핸들러.

## 시그니처

```go
func (ms *MultiStore) GetOverview() (*model.OverviewResponse, error)
```

## Observations

- [impl] 플랫폼 5개(YT/TT/Meta Organic/Meta Ads/Naver Blog) 동일 패턴 반복: queryTodayDiff→queryLatestValid→queryInt64→calcDiff→queryMiniCumulative #pattern
- [impl] Google Ads는 별도 처리 — 노출수/클릭수/CTR 기반, 조회수 아닌 impressions #caveat
- [impl] Meta Ads Extra — impressions/clicks/ctr를 PlatformCard.Extra map에 추가 #pattern
- [impl] Naver Blog — dashboard_today 직접 조회 (validSnapshotCTE 미사용), post_rank_daily에서 활성 게시물 수 #caveat
- [impl] Content Performance 기반 활성 게시물 수 → cards에 반영 (GetContentPerformance 호출) #pattern
- [impl] Alert 자동 생성 — abs(delta) > 5% 시 surge/drop 분류 #algo
- [impl] 최종 cards를 TotalViews 내림차순 정렬 #pattern
- [return] `*model.OverviewResponse{Cards, Alerts, Mini, Content}` — 카드 배열 + 알림 + 미니차트 맵 + 컨텐츠 테이블

## Relations

- part_of [[overview]] (소속 모듈)
- calls [[query-today-diff]] (line 229)
- calls [[query-latest-valid]] (line 230)
- calls [[query-int64]] (line 231)
- calls [[query-string]] (line 233)
- calls [[valid-snapshot-cte]] (line 233)
- calls [[query-int]] (line 235)
- calls [[calc-diff]] (line 237)
- calls [[query-mini-cumulative]] (line 238)
- calls [[query-mini-raw]] (line 284)
- calls [[calc-delta-pct]] (line 310)
- calls [[query-mini-filtered]] (line 343)
- called_by [[api-handlers]] via GET /api/overview
- data_flows_to [[load-overview]] via /api/overview (JSON)
