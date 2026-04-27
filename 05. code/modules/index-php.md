---
title: index-php
type: note
permalink: zettelkasten/05.-code/modules/index-php
level: high
category: code/mot-dashboard/pages
semantic: render main dashboard
path: /volume1/web/mot/index.php
tags:
- module
- php
- page
---


# index-php

MOT 대시보드 메인 페이지. 단일 조회일 기준으로 좌측 채널 TOP 20 + 우측 콘텐츠 TOP 20을 함께 보여주는 랜딩 화면.

## 개요

`index.php`는 접속 시 기본 화면. 조회일을 `$_GET['date']` 또는 `channel_daily`의 `MAX(DATE(captured_at))`에서 결정하고, 좌측에는 `v_channel_follower_summary` + `content_daily_cache` LEFT JOIN으로 구독자 + 게시물수 3컬럼씩을, 우측에는 `query_content_summary($pdo, ['date_to'=>snap_date, 'limit'=>20])` 호출로 콘텐츠 TOP 20을 렌더한다.

## Observations

- [impl] 좌측 채널 TOP 20: `v_channel_follower_summary f` + `content_daily_cache` 2개 서브쿼리(curr/prev day) LEFT JOIN으로 게시물수 3컬럼. `COLLATE utf8mb4_unicode_ci <=>`로 null-safe join #algo
- [impl] 좌측 정렬: `follower_diff DESC, curr_follower_count DESC` — 증가분 우선 #pattern
- [impl] 우측 콘텐츠 TOP 20: `query_content_summary()` 호출 1줄로 이관 완료 (이전 인라인 SQL 50줄 제거) — naver_blog 보정 로직이 단일 소스로 수렴 #pattern
- [impl] 헤더 inline nav CSS가 `<style>` 블록으로 이 파일 내부에 고정 — `comm.css` 수정 회피 (다른 페이지 영향 방지) #pattern
- [impl] `setTimeout(location.reload, 600000)` — 10분 자동 리로드 #pattern
- [deps] `config/db.php`, `includes/helpers.php`, `includes/queries/content.php`, `includes/queries/channel.php` #import
- [usage] `http://192.168.0.9/rcd/index.php?date=2026-04-20` #cli
- [note] `/mot/` 경로 접근 시 500 반환 — `/rcd/` 경로 필수 (nginx vhost 설정) #caveat

## Relations

- part_of [[MOT 성과분석 대시보드 (PHP)]]
- uses [[query-content-summary]]
- uses [[channel-label]]
- uses [[platform-label]]
- uses [[fmt-num]]
- uses [[fmt-diff]]
- uses [[diff-class]]
- uses [[h-php]]
- depends_on [[queries-content]]
- depends_on [[queries-channel]]
- depends_on [[helpers-php]]
