---
title: MOT 성과분석 대시보드 (PHP)
type: note
permalink: zettelkasten/05.-code/projects/mot-seonggwabunseog-daesibodeu-php
level: high
category: code/mot-dashboard/php
semantic: serve mot dashboard ui
path: /volume1/web/mot/ (NAS 정본), C:/claude-workspace/outputs/26.2Q/mot/ (스냅샷)
tags:
- project
- dashboard
- php
- mariadb
- nas
---


# MOT 성과분석 대시보드 (PHP)

MOT(쎈정보 그룹) 채널의 SNS 성과 지표를 PHP + MariaDB로 서비스하는 NAS 배포형 대시보드.

## 개요

Synology NAS(`/volume1/web/mot/`)에 배포된 PHP 대시보드로, 수집 파이프라인(`sns-collection/collect-*.js` Playwright)이 MariaDB `mot_dashboard` DB에 적재한 지표를 조회/필터링해 화면으로 제공한다. nginx vhost `/rcd/` 경로로 서비스되며, 쿼리 레이어를 `includes/queries/`에 분리하고 페이지 PHP는 조합자 역할만 수행하는 모듈화 구조.

## 스택

- Frontend: PHP 8.x (nginx + PHP-FPM), jQuery 3.7.1 + jQuery UI (autocomplete/datepicker), ECharts 미사용 (표 중심)
- Database: MariaDB 10.11 (NAS Synology), 대시보드는 TCP `localhost:3306`, 수집기는 Unix socket
- 테이블: `content_daily_cache`(물리 캐시), `v_channel_follower_summary`/`v_content_daily_perf`/`v_content_snapshots_raw`(뷰)
- 배포 경로: `/volume1/web/mot/` (nginx alias `/rcd/`)

## 핵심 설계

- **쿼리 레이어 분리**: `includes/queries/content.php`, `includes/queries/channel.php`로 공통 쿼리 함수 집중 → 페이지 PHP는 파라미터 빌더 호출 + 결과 렌더링만
- **view_mode 3-mode**: 상세 화면이 `date / time / datetime` 3가지 조회 모드 지원. `date`는 `content_daily_cache` 물리 테이블, `time`/`datetime`은 `v_content_snapshots_raw` 뷰에서 집계
- **쎈정보/ssen_info alias**: 채널명 혼선을 `channel_filter_values()`로 흡수 — 드롭다운은 `쎈정보`로 표시, WHERE는 `IN ('쎈정보', 'ssen_info')`
- **Naver Blog raw+cumulative 쌍 스키마**: creator-advisor content-summary API가 당일 증분만 반환하므로 수집기(naver-blog.js)가 prev+today를 계산해 `cumulative_views/cumulative_likes/cumulative_comments` 컬럼에 누적 저장. 뷰(`v_content_snapshots_raw`, `v_content_latest_daily`)는 naver_blog 브랜치에서 cumulative_* 를 likes/comments로 노출 → PHP 쿼리에 플랫폼별 분기 없음
- **물리 테이블 우선**: `v_content_daily_perf`(LAG window 포함)는 DISTINCT조차 2.5s → 화면 경로에서는 `content_daily_cache` 직접 조회 (500~3000배 단축)

## 코드 구성

**쿼리/유틸 모듈 (4)**
- queries-content: 콘텐츠 관련 쿼리 (파라미터 빌더, 3-mode 쿼리, 메타 조회)
- queries-channel: 채널 관련 쿼리 (파라미터 빌더, 채널 목록/일별)
- helpers-php: 공통 포맷팅/WHERE 빌더 유틸, 플랫폼/채널 라벨 매핑
- render-php: UI 렌더링 함수 (공통 검색박스)

**페이지 모듈 (5, 조합자)**
- index-php: 메인 대시보드 (좌측 채널 TOP 20 + 우측 콘텐츠 TOP 20)
- channelPerformanceStatus: 채널 목록 (단일 조회일, 게시물수 3컬럼)
- channelPerformanceStatusView: 채널 상세 (3-mode 뷰)
- contentPerformanceStatus: 콘텐츠 목록 (자동완성 + 엑셀)
- contentPerformanceStatusView: 콘텐츠 상세 (영상/일반 `is_video_content` 자동 분기, 3-mode)

**인프라/공유 모듈 (4)**
- head-php: 공통 `<head>` HTML 조각 + `common.js` cache-bust
- ajax_titles: 자동완성용 JSON API
- db-php: 싱글톤 PDO 연결(`getDB()`)
- common-js: 공통 프런트 JS (숫자 포맷, 팝업 난수화)

## 운영 특이사항

- nginx: `/mot/` 경로는 PHP 전부 500 반환 (기본 vhost) → **스모크는 `/rcd/` 사용 필수**
- 배포: `ssh admin123@192.168.0.9 "cat > target" < local` 방식 (scp 차단)
- 백업 관례: `*.bak-YYYYMMDD-<intent>` (postcount, navmove, watchtime 등)
- 정본 스냅샷: `C:/claude-workspace/outputs/26.2Q/mot/` ↔ NAS md5 일치 확인 (2026-04-20)

## Relations

- contains [[queries-content]]
- contains [[queries-channel]]
- contains [[helpers-php]]
- contains [[render-php]]
- contains [[index-php]]
- contains [[channelPerformanceStatus]]
- contains [[channelPerformanceStatusView]]
- contains [[contentPerformanceStatus]]
- contains [[contentPerformanceStatusView]]
- contains [[head-php]]
- contains [[ajax_titles]]
- contains [[db-php]]
- contains [[common-js]]
- depends_on [[SNS 기초 데이터 수집 자동화]] (mot_dashboard 테이블 적재)
