---
title: queries-channel
type: note
permalink: zettelkasten/05.-code/modules/queries-channel
level: high
category: code/mot-dashboard/queries
semantic: query channel dashboard data
path: /volume1/web/mot/includes/queries/channel.php
tags:
- module
- php
- mariadb
- sql
---


# queries-channel

MOT 대시보드 채널 쿼리 레이어. 채널 목록/일별 지표 + 드롭다운용 메타 조회 함수 6개.

## 개요

`$_GET` 파싱(`build_channel_params`), 채널 요약/일별 쿼리(`v_channel_follower_summary` 기반), 플랫폼/채널 목록(중복 제거) 함수를 제공한다. `channelPerformanceStatus.php`, `channelPerformanceStatusView.php`가 사용.

## Observations

- [impl] `v_channel_follower_summary`는 LAG window가 없어 직접 조회해도 빠름 (콘텐츠 쪽과 달리 물리 캐시 불필요) #pattern
- [impl] `build_channel_params()`의 기본 `date_from`은 `date_to -6d` (주간 범위 선호). 콘텐츠(`-29d`)와 다름 #caveat
- [impl] `limit=0`은 전체 (PHP_INT_MAX 변환). 화이트리스트 `[0,20,50,100]` #pattern
- [impl] `query_channel_list()` / `query_channel_names()`는 `channel_label()` 기준 중복 제거 — `쎈정보/ssen_info`가 한 항목으로 노출 #pattern
- [deps] `helpers.php`: `platform_label()`, `channel_label()`, `build_where_clause()` #import
- [usage] `require_once __DIR__ . '/includes/queries/channel.php'` 후 `build_channel_params($pdo)` → `query_channel_summary($pdo, $params)` #cli
- [note] `query_channel_names()`는 `query_channel_list()`에 완전 위임 (동명 wrapper) #caveat

## Relations

- part_of [[MOT 성과분석 대시보드 (PHP)]]
- contains [[build-channel-params]]
- contains [[query-channel-summary]]
- contains [[query-channel-daily]]
- contains [[query-channel-platforms]]
- contains [[query-channel-list]]
- contains [[query-channel-names]]
- depends_on [[helpers-php]] (platform_label, channel_label, build_where_clause)
