---
title: generic-query
type: note
permalink: zettelkasten/05.-code/modules/generic-query
semantic: module
category: code/modules
path: internal/store/generic_query.go
tags:
- module
- go
- sql
- query-builder
---

## 역할
QueryMode별 제네릭 쿼리 빌더 — 플랫폼 하드코딩 제거의 핵심

## 경로
`internal/store/generic_query.go`

## 함수 (11개, 9개 내부 호출)
- `TodayDiff` — 오늘 09:00 baseline 대비 최신 스냅샷 차이
- `SnapshotDiff` — 스냅샷 차분 계산 (TodayDiff 내부)
- `PreAggregatedTotal` — 사전 집계 테이블 합계 (TodayDiff 내부)
- `TopPosts` — 상위 게시물 조회 (모드별 분기)
- `TopPostsSnapshot` — 스냅샷 기반 상위 게시물
- `TopPostsPreAgg` — 사전 집계 기반 상위 게시물
- `CampaignBreakdown` — 광고 캠페인별 분해
- `AllMetrics` — 전체 지표 조회 (모드별 분기)
- `AllMetricsSnapshot` — 스냅샷 기반 전체 지표
- `AllMetricsPreAgg` — 사전 집계 기반 전체 지표
- `BuildTitleJoin` — TitleSource 설정 기반 JOIN SQL 생성

## Call Graph
```
TodayDiff → SnapshotDiff
TodayDiff → PreAggregatedTotal
TopPosts → TopPostsSnapshot
TopPosts → TopPostsPreAgg
AllMetrics → AllMetricsSnapshot
AllMetrics → AllMetricsPreAgg
CampaignBreakdown → BuildTitleJoin
```

## Relations
- part_of [[MOT 실시간 대시보드]]
- depends_on [[config]]
- contains [[today-diff]]
- contains [[snapshot-diff]]
- contains [[pre-aggregated-total]]
- contains [[top-posts]]
- contains [[top-posts-snapshot]]
- contains [[top-posts-pre-agg]]
- contains [[campaign-breakdown]]
- contains [[all-metrics]]
- contains [[all-metrics-snapshot]]
- contains [[all-metrics-pre-agg]]
- contains [[build-title-join]]

## Observations
- [impl] TodayDiff: 오늘 09:00 baseline과 최신 스냅샷의 SUM 차이 계산 #algo
- [impl] build-title-join: TitleSource 설정에 따라 LEFT JOIN SQL 자동 생성 #pattern
- [impl] pre_aggregated 모드는 diff=0 반환 (일별 1회 집계 테이블) #pattern
- [note] MariaDB 전용 SQL (CURDATE(), DATE() 등) — SQLite 비호환 #caveat