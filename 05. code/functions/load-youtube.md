---
title: load-youtube
type: function
permalink: functions/load-youtube
level: low
category: data/sns/dashboard
semantic: fetch youtube api and render channel charts video table
path: /Users/ryu/AI-Projects/creator-dashboard/static/js/dashboard.js
tags:
- javascript
- youtube
- api
- dom
---

# loadYouTube

YouTube Studio 페이지 데이터를 API에서 가져와 DOM을 갱신하는 함수. 채널 정보 + Views/WatchTime/Subs 3개 차트 + 비디오 테이블을 렌더링한다.

## 시그니처

```javascript
async function loadYouTube()
```

## Observations

- [impl] 채널 정보 — name, handle, subs(`fmt`), totalViews(`fmt`), videoCount 5개 필드 갱신 #dom
- [impl] 3개 라인차트 — Views(red), WatchTime(orange), Subs(purple) 각 10분 간격 #chart
- [impl] `date.slice(5)` — "MM/DD HH:mm" → "DD HH:mm" xAxis 라벨 간소화 #format
- [impl] 비디오 테이블 — SHORT이면 emoji 구분, contentType/views/likes/comments/privacy/publishedAt #table
- [usage] `loadYouTube(); setInterval(loadYouTube, 60000);`

## Relations

- part_of [[dashboard-js]] (소속 모듈)
- part_of [[크리에이터 실시간 대시보드]] (소속 프로젝트)
- calls [[make-line-opts]] (line 234, 243, 252)
- data_flows_from [[get-youtube]] via /api/youtube/stats → [[api-handlers]].APIYouTube
