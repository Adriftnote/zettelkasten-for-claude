---
title: channelPerformanceStatus
type: note
permalink: zettelkasten/05.-code/modules/channel-performance-status
level: high
category: code/mot-dashboard/pages
semantic: list channel performance
path: /volume1/web/mot/channelPerformanceStatus.php
tags:
- module
- php
- page
---


# channelPerformanceStatus

MOT 대시보드 채널 목록 페이지. 단일 조회일 기준으로 플랫폼 전체 채널 성과(구독자 + 게시물수)를 표 형태로 나열.

## 개요

`channelPerformanceStatus.php`는 채널 드릴다운 진입점. 조회일/플랫폼/채널/검색어/limit 필터로 `v_channel_follower_summary` + `content_daily_cache` 2개 서브쿼리 LEFT JOIN을 실행해 9컬럼(순위/노출매체/채널/구독자 3컬럼/게시물수 3컬럼) 출력. 행 클릭 시 `channelPerformanceStatusView.php`로 드릴다운.

## Observations

- [impl] SQL 쿼리는 index.php 좌측 블록과 동일한 구조(`v_channel_follower_summary f` + `content_daily_cache` curr/prev JOIN) — 여기서는 인라인 SQL로 처리 (쿼리 모듈 호출 아님) #pattern
- [impl] `channel_filter_values()`로 쎈정보↔ssen_info alias 확장 — 단일이면 `= \:channel` placeholder, 복수면 `IN (\:channel0, ...)` placeholder #algo
- [impl] limit 체계: `[0, 20, 50, 100]`, 기본 0(전체 = PHP_INT_MAX) #pattern
- [impl] 정렬: `follower_diff DESC, curr_follower_count DESC` — 증가분 우선 #pattern
- [impl] 드롭다운 채널 목록은 `query_channel_list()` 경유 (label 기준 중복 제거) #pattern
- [impl] 행 클릭 → `channelPerformanceStatusView.php?platform=...&channel=...&date=...&limit=20` #pattern
- [deps] `config/db.php`, `includes/helpers.php`, `includes/queries/channel.php` #import
- [usage] `http://192.168.0.9/rcd/channelPerformanceStatus.php?date=2026-04-20&limit=0` #cli
- [note] bak 파일 `*.bak-20260417-postcount` = 게시물수 3컬럼 추가 직전 버전 (item #38 이력) #caveat

## Relations

- part_of [[MOT 성과분석 대시보드 (PHP)]]
- uses [[query-channel-list]]
- uses [[channel-filter-values]]
- uses [[channel-label]]
- uses [[platform-label]]
- uses [[fmt-num]]
- uses [[fmt-diff]]
- uses [[diff-class]]
- uses [[h-php]]
- depends_on [[queries-channel]]
- depends_on [[helpers-php]]
