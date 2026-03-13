---
title: load-overview
type: function
permalink: functions/load-overview
level: low
category: data/sns/dashboard
semantic: fetch overview api and render today views mini charts content table
path: /Users/ryu/AI-Projects/creator-dashboard/static/js/dashboard.js
tags:
- javascript
- api
- dom
---

# loadOverview

Overview 페이지 데이터를 API에서 가져와 DOM을 갱신하는 함수. 4채널 오늘 누적 조회수 + 미니 스파크라인 차트 + 컨텐츠별 채널 조회수 테이블을 렌더링한다.

## 시그니처

```javascript
async function loadOverview()
```

## Observations

- [impl] `todayIds` 매핑 — `{youtube:'yt-today', tiktok:'tt-today', meta:'mt-today', naver:'nv-today'}` #pattern
- [impl] `p.today_views.toLocaleString()` — 천단위 콤마 포맷으로 큰 숫자 표시 #format
- [impl] 플랫폼별 미니차트 — `initChart('mini-${name}')` → `makeMiniOpts(series, COLORS[name])` #chart
- [impl] 컨텐츠 테이블 — `.sort((a,b) => b.total - a.total)` Total 내림차순 → `tbody.innerHTML` #table
- [impl] `updated-at` — `new Date(data.updated_at).toLocaleTimeString()` 으로 갱신 시간 표시 #ui
- [usage] `loadOverview(); setInterval(loadOverview, 60000);` — 즉시 1회 + 1분 폴링

## Relations

- part_of [[dashboard-js]] (소속 모듈)
- part_of [[크리에이터 실시간 대시보드]] (소속 프로젝트)
- calls [[make-mini-opts]] (line 195)
- data_flows_from [[get-overview]] via /api/overview → [[api-handlers]].APIOverview
