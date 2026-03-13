---
title: load-naver
type: function
permalink: functions/load-naver
level: low
category: data/sns/dashboard
semantic: fetch naver api and render tv blog charts tables
path: /Users/ryu/AI-Projects/creator-dashboard/static/js/dashboard.js
tags:
- javascript
- naver
- navertv
- blog
- api
- dom
---

# loadNaver

Naver 페이지 데이터를 API에서 가져와 DOM을 갱신하는 함수. TV/Blog 채널 정보 + 재생수/방문자 2개 차트 + 클립 테이블 + 블로그 포스트 테이블을 렌더링한다.

## 시그니처

```javascript
async function loadNaver()
```

## Observations

- [impl] TV 정보 — name, subscribers(`fmt`) / Blog 정보 — name, visitors(`fmt`) #dom
- [impl] NaverTV Play Count 차트 — naver 그린(#03c75a) 단일 시리즈 #chart
- [impl] Blog Views 차트 — accent 보라(#6366f1) 단일 시리즈 #chart
- [impl] TV 클립 테이블 — title/category/playCount/likeCount/comments/createdAt #table
- [impl] 블로그 포스트 테이블 — title/views/likes/comments/createdAt #table
- [usage] `loadNaver(); setInterval(loadNaver, 60000);`

## Relations

- part_of [[dashboard-js]] (소속 모듈)
- part_of [[크리에이터 실시간 대시보드]] (소속 프로젝트)
- calls [[make-line-opts]] (line 401, 410)
- data_flows_from [[get-naver]] via /api/naver/stats → [[api-handlers]].APINaver
