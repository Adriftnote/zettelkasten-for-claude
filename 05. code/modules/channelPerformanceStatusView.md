---
title: channelPerformanceStatusView
type: note
permalink: zettelkasten/05.-code/modules/channel-performance-status-view
level: high
category: code/mot-dashboard/pages
semantic: drill down channel detail
path: /volume1/web/mot/channelPerformanceStatusView.php
tags:
- module
- php
- page
---


# channelPerformanceStatusView

MOT 대시보드 채널 상세 페이지. `view_mode` 3-mode(date/time/datetime)로 단일 채널의 시계열 성과를 보여준다.

## 개요

`channelPerformanceStatusView.php`는 목록 페이지에서 행 클릭으로 진입. `build_channel_params($pdo)`로 파라미터 빌드 → `view_mode`에 따라 3종 SQL 분기. date=기간 집계, time=`HOUR()` GROUP BY, datetime=일자+시간 서브쿼리 + `LAG()` 증감. 상단에 채널 메타 카드(노출매체/채널명) 2열 그리드.

## Observations

- [impl] view_mode 3-mode SQL: `date` = `v_channel_follower_summary` + `content_daily_cache` JOIN / `time` = `channel_daily` × `m_channels` + `content_daily_cache` GROUP BY `HOUR()` / `datetime` = 일자+시간 서브쿼리 + LAG 증감 #algo
- [impl] alias 3분기 WHERE 변수: `$pl_sql_f` (f prefix), `$pl_sql_alias` (c/m prefix), `$ch_sql_f`, `$ch_sql_alias` — 3-mode 각 SQL의 테이블 alias가 달라 ambiguous column 방지 #algo
- [impl] `channel_filter_values()`로 쎈정보↔ssen_info alias 상세 쿼리에도 확장 #pattern
- [impl] 드릴다운: date 모드 row 클릭 → 해당 `snap_date`의 datetime 모드 / datetime 모드 row → date 모드 복귀 (`row_nav` class JS 분기) #pattern
- [impl] datetime 모드는 "일자" 컬럼에 `rowspan` — 하루 블록으로 시각적 묶음 #pattern
- [impl] 조회 결과 0건 or 채널/키워드 비면 `channelPerformanceStatus.php`로 JS redirect #caveat
- [impl] `render_search_box()`로 검색박스 렌더 (view_mode 드롭다운 + limit 드롭다운 포함) #pattern
- [deps] `config/db.php`, `includes/helpers.php`, `includes/render.php`, `includes/queries/channel.php` #import
- [usage] `http://192.168.0.9/rcd/channelPerformanceStatusView.php?platform=youtube&channel=쎈정보&date=2026-04-20` #cli

## Relations

- part_of [[MOT 성과분석 대시보드 (PHP)]]
- uses [[build-channel-params]]
- uses [[query-channel-platforms]]
- uses [[query-channel-list]]
- uses [[channel-filter-values]]
- uses [[channel-label]]
- uses [[platform-label]]
- uses [[render-search-box]]
- uses [[fmt-num]]
- uses [[fmt-diff]]
- uses [[diff-class]]
- uses [[h-php]]
- depends_on [[queries-channel]]
- depends_on [[helpers-php]]
- depends_on [[render-php]]
