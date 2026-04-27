---
title: common-js
type: note
permalink: zettelkasten/05.-code/modules/common-js
level: low
category: code/mot-dashboard/frontend
semantic: format numbers and handle row click
path: /volume1/web/mot/js/common.js
tags:
- module
- javascript
- frontend
---


# common-js

MOT 대시보드 페이지 공통 JS. 숫자 콤마 포맷 + 표 행 클릭 팝업 오픈 2가지 동작을 모든 페이지에 주입.

## 개요

`head.php`가 `?v=filemtime` cache-bust 쿼리로 로드하는 공통 스크립트. (1) jQuery `$(function () {...})`에서 `.tb1 tbody td.num`의 텍스트를 `toLocaleString('ko-KR')`로 재포맷 — 서버측 `fmt_num()` 이후 클라이언트측 보강. (2) `DOMContentLoaded`에서 `.click_row` 행 클릭 시 `window.open`으로 새 팝업 오픈.

## Observations

- [impl] 숫자 포맷: `parseInt(text.replace(/,/g, ''))` 후 `toLocaleString('ko-KR')` — 이미 콤마 찍힌 값도 재포맷, `+` 접두사 유지 #pattern
- [impl] 행 클릭 팝업: `'popup_' + Date.now() + '_' + Math.random()` 형태로 **팝업 이름 매번 난수화** → 같은 행 여러 번 눌러도 새 창 오픈 (기존 고정 이름 `'channelPopup'` 재사용 문제 해결, item #22 이력) #pattern
- [impl] 팝업 크기: `1200x900`, `scrollbars=yes,resizable=yes` #pattern
- [impl] jQuery ready(`$(function)`) + `DOMContentLoaded` 두 진입점 혼용 — 전자는 jQuery 로드 후, 후자는 바닐라 JS #caveat
- [deps] jQuery 3.7.1 (head.php에서 로드) #import
- [usage] `head.php`가 `<script src="js/common.js?v={mtime}">`로 자동 포함, 페이지가 별도 호출 불필요 #cli
- [note] 팝업 이름 난수화는 item #22에서 네이버 브라우저 캐시 문제와 함께 다룸. cache-bust 쿼리는 `head.php`쪽에서 보장 #caveat

## Relations

- part_of [[MOT 성과분석 대시보드 (PHP)]]
- called_by [[head-php]] (script 태그로 포함)
- uses [[jquery]] (3.7.1)
