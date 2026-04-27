---
title: head-php
type: note
permalink: zettelkasten/05.-code/modules/head-php
level: low
category: code/mot-dashboard/shared
semantic: render common html head
path: /volume1/web/mot/includes/head.php
tags:
- module
- php
- shared
---


# head-php

모든 페이지 공통 `<!DOCTYPE>` + `<head>` 조각. CSS/JS 링크 + `<body>` 여는 태그까지 포함.

## 개요

PHP 함수 없음 — HTML 스니펫. 각 페이지가 `$page_title` 변수 세팅 후 `include __DIR__ . '/includes/head.php'`로 포함한다. jQuery 3.7.1 + jQuery UI + `css/comm.css` + `css/media.css` + `css/jquery-ui.css` 로드. `common.js`에는 파일 mtime 기반 cache-bust 쿼리(`?v=filemtime`) 부착.

## Observations

- [impl] `common.js?v=<?= filemtime() ?>` cache-bust — 2026-04-17에 팝업 JS 변경이 브라우저 캐시로 안 보이던 문제 해결 (item #22 이력) #pattern
- [impl] `$page_title ?? 'MOT 성과분석 대시보드'` 폴백으로 include 직전 세팅 없어도 동작 #pattern
- [impl] jQuery UI `autocomplete` 스타일을 여기서 인라인 `<style>`로 오버라이드 — 흰 배경, 220px 최대 높이, 그림자 #pattern
- [deps] `css/comm.css`, `css/media.css`, `css/jquery-ui.css`, `js/jquery-3.7.1.min.js`, `js/jquery-ui.min.js`, `js/common.js` #import
- [usage] 페이지 PHP 상단: `$page_title = '콘텐츠 조회수 현황'; include __DIR__ . '/includes/head.php';` #cli
- [note] `<body>`만 열고 닫지 않음 — 호출 페이지에서 닫아야 함 #caveat

## Relations

- part_of [[MOT 성과분석 대시보드 (PHP)]]
- uses [[common-js]]
- uses [[h-php]]
