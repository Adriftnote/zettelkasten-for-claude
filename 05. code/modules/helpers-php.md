---
title: helpers-php
type: note
permalink: zettelkasten/05.-code/modules/helpers-php
level: high
category: code/mot-dashboard/utils
semantic: format and map dashboard values
path: /volume1/web/mot/includes/helpers.php
tags:
- module
- php
- utility
---


# helpers-php

MOT 대시보드 공통 유틸 모듈. 플랫폼/채널 라벨 매핑, 숫자/증감 포맷, HTML 이스케이프, WHERE 절 빌더 등 10개 함수.

## 개요

모든 PHP 페이지와 쿼리 모듈이 공통으로 참조하는 유틸리티 집합. 페이지 표시용 포맷팅(`fmt_num`, `fmt_diff`, `diff_class`, `h`), 내부 alias 규칙(`channel_label`, `channel_filter_values`), 콘텐츠 타입 분기(`is_video_content`, `content_type_label`), 그리고 쿼리 모듈이 공유하는 WHERE 빌더(`build_where_clause`)를 포함한다.

## Observations

- [impl] `channel_label()` + `channel_filter_values()`가 alias 규칙의 단일 소스 — `쎈정보/ssen_info` 매핑이 여기서 결정됨. 드롭다운 표시 = `쎈정보`, WHERE 값 = `IN ('쎈정보', 'ssen_info')` #pattern
- [impl] `diff_class()`: 양수 `cred num`, 음수 `cblue num`, 0 `num` — CSS 클래스로 증감 색상 분기 #pattern
- [impl] `is_video_content()`는 `['VIDEO', '영상']` 화이트리스트 — 상세 화면(contentPerformanceStatusView)이 영상/일반 UI 분기에 사용 #algo
- [impl] `build_where_clause()`가 content/channel 쿼리에서 공유되는 WHERE 빌더. `channel` 필터는 `channel_filter_values()`를 거쳐 단일이면 `= \:channel` placeholder, 복수면 `IN (\:channel0, \:channel1, ...)` placeholder로 분기 #algo
- [impl] `h()`는 `htmlspecialchars + ENT_QUOTES + UTF-8` 3종 고정 — XSS 방지 표준 #pattern
- [usage] `require_once __DIR__ . '/includes/helpers.php'` — 거의 모든 PHP 상단에 포함 #cli
- [note] `fmt_num(null)` / `fmt_num('')`은 `'0'` 반환 (DB null 허용) #caveat

## Relations

- part_of [[MOT 성과분석 대시보드 (PHP)]]
- contains [[platform-label]]
- contains [[fmt-num]]
- contains [[fmt-diff]]
- contains [[diff-class]]
- contains [[channel-label]]
- contains [[channel-filter-values]]
- contains [[content-type-label]]
- contains [[is-video-content]]
- contains [[h-php]]
- contains [[build-where-clause]]
