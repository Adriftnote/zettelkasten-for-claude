---
title: make-mini-opts
type: function
permalink: functions/make-mini-opts
level: low
category: data/sns/dashboard
semantic: create echarts sparkline options for overview mini charts
path: /Users/ryu/AI-Projects/creator-dashboard/static/js/dashboard.js
tags:
- javascript
- echarts
- sparkline
---

# makeMiniOpts

Overview 카드 내 140px 높이 스파크라인 차트 옵션을 생성하는 함수. 최소한의 UI로 트렌드를 보여주며, endLabel로 최신값, markLine으로 평균선을 표시한다.

## 시그니처

```javascript
function makeMiniOpts(data, color)
// data: [{date, value}]
// color: string (hex)
```

## Observations

- [impl] `xAxis/yAxis show: false` — 축 숨김으로 순수 스파크라인 #chart
- [impl] `endLabel` — 차트 우측에 최신값을 `fmt(latest)` 포맷으로 표시 #chart
- [impl] `markLine: { type: 'average' }` — 점선 평균선, 라벨 숨김, `color + '44'` 투명도 #chart
- [impl] `areaStyle` — linear gradient (상단 `color + '33'` → 하단 `color + '05'`) #chart
- [impl] `grid: { top:20, right:50, bottom:20, left:8 }` — endLabel + tooltip 여백 확보 #layout
- [impl] tooltip — axis trigger, 날짜 + 볼드 수치 포맷 #tooltip
- [return] ECharts option 객체

## Relations

- part_of [[dashboard-js]] (소속 모듈)
- part_of [[크리에이터 실시간 대시보드]] (소속 프로젝트)
- called_by [[load-overview]] (line 195)
