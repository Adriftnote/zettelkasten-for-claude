---
title: contentPerformanceStatus
type: note
permalink: zettelkasten/05.-code/modules/content-performance-status
level: high
category: code/mot-dashboard/pages
semantic: list content performance
path: /volume1/web/mot/contentPerformanceStatus.php
tags:
- module
- php
- page
---

MOT 대시보드 콘텐츠 목록 페이지. 단일 조회일 기준 플랫폼 전체 콘텐츠 성과를 자동완성 + 엑셀 내보내기 지원하는 표로 나열.

## Observations

- [impl] 쿼리 모듈 4개(build_content_params, query_content_summary, query_content_platforms, query_content_channels) 호출로 완전 슬림화된 구조. #pattern
- [impl] 자동완성: `#schKeyword` → `jquery-ui autocomplete` → `ajax_titles.php` AJAX로 platform/channel/q 기반 필터링. minLength=1, delay=200ms. #pattern
- [impl] 엑셀 내보내기: `.btn_excel` → `XLSX.utils.table_to_book(.tb1)` → `콘텐츠성과_YYYY-MM-DD.xlsx` 다운로드. #pattern
- [impl] sticky header 강제 해제 `.content-summary-table thead th { position: static !important }` — 2줄 헤더 겹침 방지. #caveat
- [impl] limit 옵션 [0, 20, 50, 100], 0=전체(PHP_INT_MAX). `#sel_limit` 드롭다운을 `.panel_box` 아래 appendTo로 테이블 하단 배치. #pattern
- [impl] 행 클릭 → data-url 속성으로 contentPerformanceStatusView.php?platform=...&content_id=...&date=... 드릴다운 라우팅. #pattern
- [deps] config/db.php, includes/helpers.php, includes/queries/content.php #import

## Relations

- part_of [[MOT 성과분석 대시보드 (PHP)]]
- uses [[build-content-params]]
- uses [[query-content-summary]]
- uses [[query-content-platforms]]
- uses [[query-content-channels]]
- uses [[channel-label]]
- uses [[platform-label]]
- uses [[fmt-num]]
- uses [[fmt-diff]]
- uses [[diff-class]]
- uses [[h-php]]
- uses [[content-type-label]]
- depends_on [[queries-content]]
- depends_on [[helpers-php]]