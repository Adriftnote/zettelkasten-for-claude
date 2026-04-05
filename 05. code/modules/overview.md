---
title: overview
type: module
permalink: zettelkasten/05.-code/modules/overview
level: high
category: data/sns/dashboard
semantic: query multi-platform sns metrics for overview dashboard
path: projects/sns-dashboard/internal/store/overview.go
tags:
- go
- dashboard
- sql
- sns
---

# overview

SNS 대시보드 Overview 페이지용 데이터 레이어. 6개 플랫폼(YouTube, TikTok, Meta Organic, Meta Ads, Naver Blog, Google Ads) DB에서 KPI·미니차트·알림을 조합하여 반환한다.

## 개요

MultiStore의 각 플랫폼별 *sql.DB를 통해 개별 SQLite에 쿼리. 불량 스냅샷 필터(validSnapshotCTE) 기반으로 정합성 보장. 오늘 09~18시 범위의 누적 증가분·1시간 전 대비 delta·미니 시계열을 계산.

## 아키텍처

- **헬퍼 3종** — queryInt64/queryInt/queryString: 단일 값 쿼리 래퍼 (NULL-safe)
- **계산 2종** — calcDeltaPct/calcDiff: 변화율·절대차
- **CTE 빌더** — validSnapshotCTE: 부분 수집 스냅샷 필터 (최다 rows 50% 기준)
- **시계열 3종** — queryMiniCumulative/queryMiniRaw/queryMiniFiltered: 미니차트 데이터
- **스냅샷 조회** — queryLatestValid/queryTodayDiff: 최신·9시 기준 diff
- **메인** — GetOverview: 전체 조합 + 정렬 + Alert 생성

## Observations

- [impl] 플랫폼별 DB 분리 — MultiStore가 6개 *sql.DB 보유, 각각 독립 SQLite #pattern
- [impl] validSnapshotCTE — 부분 수집(불량) 스냅샷을 max_count*0.5 기준으로 필터 #algo
- [impl] 누적 미니차트 — 9시 첫 스냅샷 baseline 대비 증가분으로 우상향 시계열 생성 #timeseries
- [impl] Alert — delta > 5% 시 surge/drop 알림 자동 생성 #pattern
- [deps] database/sql, math, sort, sns-dashboard/internal/model #import
- [note] Naver Blog는 validSnapshotCTE 미사용 — dashboard_today 테이블이 이미 일별 집계 #caveat

## Relations

- part_of [[크리에이터 실시간 대시보드]] (소속 프로젝트)
- part_of [[SNS 게시물별 조회수 추적]] (소속 프로젝트)
- contains [[query-int64]]
- contains [[query-int]]
- contains [[query-string]]
- contains [[calc-delta-pct]]
- contains [[calc-diff]]
- contains [[valid-snapshot-cte]]
- contains [[query-mini-cumulative]]
- contains [[query-latest-valid]]
- contains [[query-today-diff]]
- contains [[query-mini-raw]]
- contains [[query-mini-filtered]]
- contains [[get-overview]]
  - get-overview calls [[query-today-diff]] (line 229)
  - get-overview calls [[query-latest-valid]] (line 230)
  - get-overview calls [[query-int64]] (line 231)
  - get-overview calls [[query-string]] (line 233)
  - get-overview calls [[valid-snapshot-cte]] (line 233)
  - get-overview calls [[query-int]] (line 235)
  - get-overview calls [[calc-diff]] (line 237)
  - get-overview calls [[query-mini-cumulative]] (line 238)
  - get-overview calls [[query-mini-raw]] (line 284)
  - get-overview calls [[calc-delta-pct]] (line 310)
  - get-overview calls [[query-mini-filtered]] (line 343)
  - query-latest-valid calls [[valid-snapshot-cte]] (line 122)
  - query-latest-valid calls [[query-string]] (line 124)
  - query-mini-cumulative calls [[valid-snapshot-cte]] (line 71)
  - query-today-diff calls [[valid-snapshot-cte]] (line 139)
  - query-today-diff calls [[query-int64]] (line 147)
- depends_on [[multi-store]] (MultiStore 구조체 — 플랫폼별 DB 핸들)
- depends_on [[model-types]] (model.OverviewResponse, PlatformCard, Alert, TimeseriesPoint)
- data_flows_to [[api-handlers]] via GET /api/overview (JSON)
