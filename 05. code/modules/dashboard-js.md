---
title: dashboard-js
type: module
permalink: modules/dashboard-js
level: high
category: data/sns/dashboard
semantic: frontend chart rendering and api polling
path: /Users/ryu/AI-Projects/creator-dashboard/static/js/dashboard.js
tags:
- javascript
- echarts
- polling
- charts
---

# dashboard-js

ECharts 차트 생성, API 폴링, DOM 갱신을 담당하는 프론트엔드 모듈. 5개 페이지별 로드 함수가 1분 주기로 JSON API를 호출하여 차트와 테이블을 업데이트한다.

## 개요

라이트 테마 기반 `CHART_THEME` 설정으로 일관된 차트 스타일을 적용한다. `makeLineOpts`는 endLabel(현재값 항상 표시) + markPoint(최대/최소) 기능을 포함하며, `makeMiniOpts`는 Overview 스파크라인용 경량 차트를 생성한다. 각 페이지 HTML의 인라인 스크립트에서 `loadX()` 호출 + `setInterval(loadX, 60000)` 으로 1분 폴링을 실행한다.

## Observations

- [impl] `CHART_THEME` — 라이트 테마 공통 설정 (배경 투명, 텍스트 #8b8ba3, 그리드 여백 고정) #theme
- [impl] `COLORS` — 플랫폼별 브랜드 컬러 상수 (youtube=#ff0000, tiktok=#00f2ea, meta=#1877f2, naver=#03c75a) #theme
- [impl] `makeLineOpts(title, series, dates)` — endLabel로 라인 끝에 현재값 항상 표시, markPoint로 min/max 마커 (line 53) #chart
- [impl] `makeBarOpts(data, color)` — 바 차트 옵션 생성, 현재 미사용 (line 93) #chart
- [impl] `makeMiniOpts(data, color)` — Overview 카드용 140px 스파크라인, 평균선(markLine) + gradient area (line 118) #chart
- [impl] `initChart(id)` → `charts[]` 배열에 등록 → `window.resize`에서 일괄 resize (line 110) #pattern
- [impl] `fetchJSON(url)` — fetch + json 파싱 헬퍼, 모든 load* 함수에서 사용 (line 172) #util
- [impl] `fmt(n)` (line 2) — 1M/1K 단위 약식 포맷, `fmtCurrency(n)` (line 8) — $0.00 포맷, `fmtPct(n)` (line 12) — 0.00% 포맷 #util
- [impl] `loadOverview` — todayIds 매핑으로 플랫폼별 누적 조회수 DOM 갱신 + 미니차트 + 컨텐츠 테이블 #page
- [impl] `loadYouTube` — 채널 정보 + Views/WatchTime/Subs 3개 차트 + 비디오 테이블 #page
- [impl] `loadTikTok` — 유저 정보 + Views&Reach/Engagement 2개 차트 + 아이템 테이블 #page
- [impl] `loadMeta` — 페이지 정보 + Ad Impressions 차트 + 오가닉 포스트 + 광고 테이블 #page
- [impl] `loadNaver` — TV/Blog 정보 + 재생수/방문자 2개 차트 + 클립 + 블로그 테이블 #page
- [impl] 테이블 렌더링은 `tbody.innerHTML = data.map(row => \`<tr>...\`).join('')` 패턴 #pattern
- [deps] `echarts@5` (CDN), DOM API #import
- [note] XSS 주의 — 더미 데이터이므로 현재 이스케이프 없음, 실 데이터 연동 시 필요 #caveat

## Relations

- part_of [[크리에이터 실시간 대시보드]] (소속 프로젝트)
- contains [[make-line-opts]]
- contains [[make-mini-opts]]
- contains [[load-overview]]
- contains [[load-youtube]]
- contains [[load-tiktok]]
- contains [[load-meta]]
- contains [[load-naver]]
  - [[load-overview]] calls [[make-mini-opts]] (line 195)
  - [[load-youtube]] calls [[make-line-opts]] (line 234, 243, 252)
  - [[load-tiktok]] calls [[make-line-opts]] (line 291, 301)
  - [[load-meta]] calls [[make-line-opts]] (line 342)
  - [[load-naver]] calls [[make-line-opts]] (line 401, 410)
- data_flows_from [[api-handlers]] (JSON API 폴링)
  - [[load-overview]] ← /api/overview ← [[get-overview]]
  - [[load-youtube]] ← /api/youtube/stats ← [[get-youtube]]
  - [[load-tiktok]] ← /api/tiktok/stats ← [[get-tiktok]]
  - [[load-meta]] ← /api/meta/stats ← [[get-meta]]
  - [[load-naver]] ← /api/naver/stats ← [[get-naver]]
- depends_on [[echarts]] (차트 라이브러리)
