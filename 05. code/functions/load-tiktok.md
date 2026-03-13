---
title: load-tiktok
type: function
permalink: functions/load-tiktok
level: low
category: data/sns/dashboard
semantic: fetch tiktok api and render user charts items table
path: /Users/ryu/AI-Projects/creator-dashboard/static/js/dashboard.js
tags:
- javascript
- tiktok
- api
- dom
---

# loadTikTok

TikTok Creator Center 페이지 데이터를 API에서 가져와 DOM을 갱신하는 함수. 유저 정보 + Views&Reach/Engagement 2개 차트 + 아이템 테이블을 렌더링한다.

## 시그니처

```javascript
async function loadTikTok()
```

## Observations

- [impl] 유저 정보 — nickname, '@'+uniqId, followers/likes/following 5개 필드 갱신 #dom
- [impl] Views&Reach 차트 — Views(teal) + Reached(purple) 2시리즈 #chart
- [impl] Engagement 차트 — Likes(pink) + Comments(orange) + Shares(accent) 3시리즈 #chart
- [impl] 아이템 테이블 — desc/playCount/likeCount/comments/shares/favorites/duration/createdAt #table
- [usage] `loadTikTok(); setInterval(loadTikTok, 60000);`

## Relations

- part_of [[dashboard-js]] (소속 모듈)
- part_of [[크리에이터 실시간 대시보드]] (소속 프로젝트)
- calls [[make-line-opts]] (line 291, 301)
- data_flows_from [[get-tiktok]] via /api/tiktok/stats → [[api-handlers]].APITikTok
