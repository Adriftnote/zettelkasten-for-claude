---
title: render-search-box
type: note
permalink: zettelkasten/05.-code/functions/render-search-box
level: low
category: code/mot-dashboard/ui
semantic: render search form html
path: /volume1/web/mot/includes/render.php
tags:
- function
- php
- ui
---

# render-search-box

MOT 대시보드 페이지의 공통 검색 박스 HTML을 문자열로 반환하는 함수. 날짜범위/단일, 플랫폼, 채널, 검색어, 뷰 모드(date/time/datetime), 조회 제한(limit) 등의 필터를 제공한다.

## 시그니처

```php
function render_search_box(array $opts): string
```

## 파라미터

- `$opts['platforms']` (array): 플랫폼 목록
- `$opts['channels']` (array): 채널 목록
- `$opts['action']` (string): form submit 대상 URL
- `$opts['selected']` (array): 현재 선택값 (`date_from`, `date_to`, `platform`, `channel`, `view_mode`, `keyword`, `limit`, `content_id`)
- `$opts['date_mode']` (string, 'range'|'single'): 날짜 입력 모드
- `$opts['single_date']` (bool, 레거시 호환): true면 'single' 모드로 동작

## Observations

- [impl] `ob_start()` + PHP 템플릿 출력 후 `ob_get_clean()`으로 HTML 버퍼링. 선택값은 embedded string으로 datepicker/selects에 초기화 (#pattern-buffer-and-embed).
- [impl] 플랫폼/채널 드롭다운 변경 시 keyword 자동완성 닫기; view_mode 변경 시 즉시 조회 트리거 (#pattern-debounce).
- [impl] `#schKeyword` 자동완성(autocomplete)은 `ajax_titles.php`로 플랫폼+채널 기반 타이틀 동적 로드, minLength=1 delay=200ms.
- [return] 전체 검색박스 HTML 문자열.
- [usage] `echo render_search_box(['platforms'=>[...], 'channels'=>[...], 'action'=>'index.php', 'selected'=>[...], 'date_mode'=>'range'])`.
- [note] date_mode='range' 시 datepicker1/2 (from/to), 'single' 시 datepicker_single (to 만 사용). #caveat-date-field.
- [note] limit 표시는 `show_limit = isset($sel['limit'])` 조건이므로 limit 키 **미포함** 시 셀렉트 숨김.

## Relations

- part_of [[render-php]] (소속 모듈)