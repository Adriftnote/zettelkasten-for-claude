---
title: load-meta
type: function
permalink: functions/load-meta
level: low
category: data/sns/dashboard
semantic: fetch meta api and render page charts posts ads tables
path: /Users/ryu/AI-Projects/creator-dashboard/static/js/dashboard.js
tags:
- javascript
- meta
- facebook
- instagram
- ads
- api
- dom
---

# loadMeta

Meta Business Suite 페이지 데이터를 API에서 가져와 DOM을 갱신하는 함수. 페이지 정보 + Ad Impressions 차트 + 오가닉 포스트 테이블 + 광고 성과 테이블을 렌더링한다.

## 시그니처

```javascript
async function loadMeta()
```

## Observations

- [impl] 페이지 정보 — name, category, followers(`fmt`), engagement(`fmt`) 4개 필드 갱신 #dom
- [impl] Ad Impressions 차트 — meta 블루(#1877f2) 단일 시리즈 #chart
- [impl] 오가닉 포스트 테이블 — `entity-badge` span으로 FB/IG 구분 (CSS 색상 분리) #table
- [impl] 광고 테이블 — spend/cpm/cpc는 `fmtCurrency`, ctr은 `fmtPct`, quality는 `quality-badge` #table
- [impl] `quality-badge` 클래스 — ABOVE_AVERAGE→above(green), AVERAGE→average(yellow), BELOW_AVERAGE→below(red) #ui
- [impl] `a.quality_ranking.replace(/_/g, ' ')` — 언더스코어를 공백으로 표시 #format
- [usage] `loadMeta(); setInterval(loadMeta, 60000);`

## Relations

- part_of [[dashboard-js]] (소속 모듈)
- part_of [[크리에이터 실시간 대시보드]] (소속 프로젝트)
- calls [[make-line-opts]] (line 342)
- data_flows_from [[get-meta]] via /api/meta/stats → [[api-handlers]].APIMeta
