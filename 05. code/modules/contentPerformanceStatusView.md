---
title: contentPerformanceStatusView
type: note
permalink: zettelkasten/05.-code/modules/content-performance-status-view
level: high
category: code/mot-dashboard/pages
semantic: drill down content detail
path: /volume1/web/mot/contentPerformanceStatusView.php
tags:
- module
- php
- page
---

MOT 대시보드 콘텐츠 상세 페이지. `is_video_content()` 런타임 분기로 영상/일반 콘텐츠 UI 자동 전환 + view_mode 3-mode(date/time/datetime) 다차원 분석.

## Observations

- [impl] `$first_type = $rows[0]['content_type']` + `is_video_content($first_type)` 판정으로 타이틀 전환 및 "저장(saves)" 컬럼 표시 여부 제어. #algo
- [impl] view_mode 3-mode: date=기간 집계, time=HOUR() 시간대 집계, datetime=LAG 증감값 포함. `query_content_by_mode()`가 분기 수행. #algo
- [impl] 콘텐츠 메타 카드(상단): 제목 + URL 있으면 `<a target="_blank">` 래핑. `#` 포함 시 정규식으로 태그 분리(보조 텍스트). #pattern
- [impl] 드릴다운: date row 클릭 → 해당 날짜 datetime 모드 / datetime row → date 모드 복귀를 `.row_nav` class JS로 구현. #pattern
- [impl] content_id 없이 플랫폼/채널/키워드만 바뀌면 contentPerformanceStatus.php로 자동 redirect. #caveat
- [impl] datetime 모드에서 rowspan 계산: $date_counts 배열로 같은 날짜 행 수 계산, 각 행마다 rowspan 재계산. #algo
- [deps] config/db.php, includes/helpers.php, includes/render.php, includes/queries/content.php #import

## Relations

- part_of [[MOT 성과분석 대시보드 (PHP)]]
- uses [[build-content-params]]
- uses [[query-content-by-mode]]
- uses [[query-content-url]]
- uses [[query-content-platforms]]
- uses [[query-content-channels]]
- uses [[is-video-content]]
- uses [[content-type-label]]
- uses [[channel-label]]
- uses [[platform-label]]
- uses [[render-search-box]]
- uses [[fmt-num]]
- uses [[fmt-diff]]
- uses [[diff-class]]
- uses [[h-php]]
- depends_on [[queries-content]]
- depends_on [[helpers-php]]
- depends_on [[render-php]]