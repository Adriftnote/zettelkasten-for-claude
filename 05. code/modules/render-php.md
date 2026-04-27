---
title: render-php
type: note
permalink: zettelkasten/05.-code/modules/render-php
level: high
category: code/mot-dashboard/ui
semantic: render search form html
path: /volume1/web/mot/includes/render.php
tags:
- module
- php
- ui
---


# render-php

MOT 대시보드 공통 UI 렌더링 모듈. 현재 `render_search_box()` 하나만 포함.

## 개요

페이지별 검색 박스 HTML을 `ob_start/ob_get_clean` 버퍼 방식으로 조립해 문자열로 반환한다. 옵션 플래그로 `date_mode`(range/single), `view_mode`(date/time/datetime) 3-mode 드롭다운, `limit` 드롭다운 포함 여부를 제어한다. 내부에 jQuery autocomplete 연결 JS도 함께 출력.

## Observations

- [impl] `ob_start()` → HTML 템플릿 → `ob_get_clean()` 패턴으로 PHP+HTML 혼합을 문자열로 수집 #pattern
- [impl] `$show_view_mode = ($view_mode !== null)` — null이면 드롭다운 생략 (목록 페이지 vs 상세 페이지 분기) #pattern
- [impl] `$show_limit = isset($sel['limit'])` — 키 존재로 판단 (값 0도 "표시" 대상) #caveat
- [impl] 날짜 입력은 `date_mode`에 따라 `#datepicker1`+`#datepicker2` (range) 또는 `#datepicker_single` (single) #pattern
- [impl] `#schKeyword`에 jQuery UI `autocomplete` 연결, 소스는 `ajax_titles.php?platform=...&channel=...&q=...` #pattern
- [deps] `helpers.php`: `h()`, `platform_label()`, `channel_label()` #import
- [usage] `echo render_search_box(['platforms'=>..., 'channels'=>..., 'action'=>'contentPerformanceStatus.php', 'selected'=>$_GET, 'single_date'=>true])` #cli
- [note] rpg-extract는 이 파일의 PHP 함수 파싱이 HTML 내 JS 콜백 때문에 실패 — 수동 확인 필요 #caveat

## Relations

- part_of [[MOT 성과분석 대시보드 (PHP)]]
- contains [[render-search-box]]
- depends_on [[helpers-php]]
