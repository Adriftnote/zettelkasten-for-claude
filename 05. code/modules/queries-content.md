---
title: queries-content
type: note
permalink: zettelkasten/05.-code/modules/queries-content
level: high
category: code/mot-dashboard/queries
semantic: query content dashboard data
path: /volume1/web/mot/includes/queries/content.php
tags:
- module
- php
- mariadb
- sql
---


# queries-content

MOT 대시보드 콘텐츠 쿼리 레이어. 페이지 PHP가 호출하는 콘텐츠 관련 모든 SQL을 집중시킨 모듈.

## 개요

`$_GET` 파라미터 파싱, view_mode 3-mode(date/time/datetime) SQL 분기, 단일 조회일 요약, 플랫폼/채널/타이틀/URL 메타 조회 함수 7개를 제공한다. `index.php`, `contentPerformanceStatus.php`, `contentPerformanceStatusView.php`가 공통으로 사용.

## Observations

- [impl] 성능 핵심: `date` 모드는 `content_daily_cache` 물리 테이블 (PK `snap_date/platform/content_id`) 직접 조회. 뷰(`v_content_daily_perf`)는 LAG window로 2.5s → 물리 테이블로 500~3000배 단축 #algo
- [impl] `time`/`datetime` 모드만 `v_content_snapshots_raw` 사용 (시간 단위 분해 필요) #pattern
- [impl] `query_content_summary()`는 `content_daily_cache` 단일 테이블 직접 조회 — 플랫폼별 분기 없음. 이전 naver_blog 좋아요/댓글 CASE WHEN 보정은 수집기가 `cumulative_likes/cumulative_comments` 컬럼을 저장하면서 제거됨 (2026-04-20) #algo
- [impl] `build_content_params()`의 화이트리스트: `limit ∈ [0,20,50,100]`, `view_mode ∈ [date,time,datetime]`. 0=전체는 PHP_INT_MAX로 변환 #pattern
- [deps] `helpers.php`: `channel_filter_values()`, `platform_label()`, `channel_label()`, `build_where_clause()` #import
- [usage] `require_once __DIR__ . '/includes/queries/content.php'` 후 `build_content_params($pdo)` → `query_content_summary($pdo, $params)` #cli
- [note] `query_content_url()`는 플랫폼별 마스터 테이블(yt_m_videos/tt_m_items/meta_m_posts/ntv_m_clips/nb_m_contents) 컬럼 매핑. `meta_fb`/`meta_ig`는 `url` 컬럼 비어 있음 (permalink 미수집) #caveat
- [note] `naver_blog`는 `nb_m_contents.uri`에서 `http://` → `https://` 정규화 #caveat

## 코드 구성

7 함수. 관계: 독립 실행 (내부 호출 없음). 외부 의존: `helpers.php`.

## Relations

- part_of [[MOT 성과분석 대시보드 (PHP)]]
- contains [[build-content-params]]
- contains [[query-content-by-mode]]
- contains [[query-content-summary]]
- contains [[query-content-platforms]]
- contains [[query-content-channels]]
- contains [[query-content-titles]]
- contains [[query-content-url]]
- depends_on [[helpers-php]] (channel_filter_values, build_where_clause, platform_label, channel_label)
