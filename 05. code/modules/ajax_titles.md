---
title: ajax_titles
type: note
permalink: zettelkasten/05.-code/modules/ajax-titles
level: low
category: code/mot-dashboard/api
semantic: serve autocomplete titles
path: /volume1/web/mot/ajax_titles.php
tags:
- module
- php
- api
---


# ajax_titles

콘텐츠 제목 자동완성용 경량 JSON API. `render-php`의 jQuery UI `autocomplete`가 소스로 사용.

## 개요

`$_GET`에서 `platform`/`channel`/`q` 받아 `content_daily_cache`에서 `content_title` DISTINCT 30개 반환. `query_content_titles()`와 유사하지만 `q` LIKE 필터 추가 + 별도 엔드포인트로 노출된 얇은 API 계층.

## Observations

- [impl] `content_daily_cache` DISTINCT + LIKE + LIMIT 30 — 내부 구조상 `query_content_titles()`의 단순화 버전 (동일 소스 테이블) #pattern
- [impl] `$pdo->quote()`로 직접 쿼리 문자열 조립 — prepared statement 아님 (파라미터가 whitelist 없이 GET이므로 quote에 의존) #caveat
- [impl] `application/json` + `JSON_UNESCAPED_UNICODE` 응답 헤더 고정 — 한글 깨짐 방지 #pattern
- [deps] `config/db.php` #import
- [usage] `GET /rcd/ajax_titles.php?platform=youtube&channel=쎈정보&q=MOT` → `["title1", "title2", ...]` #cli
- [note] render-php의 `#schKeyword` autocomplete source가 이 엔드포인트를 `minLength=1 delay=200ms`로 호출 #caveat

## Relations

- part_of [[MOT 성과분석 대시보드 (PHP)]]
- depends_on [[db-php]]
- called_by [[render-search-box]] (jQuery UI autocomplete source)
