---
title: make-line-opts
type: function
permalink: functions/make-line-opts
level: low
category: data/sns/dashboard
semantic: create echarts line chart options with endlabel and markpoint
path: /Users/ryu/AI-Projects/creator-dashboard/static/js/dashboard.js
tags:
- javascript
- echarts
- chart
---

# makeLineOpts

ECharts 라인차트 옵션을 생성하는 함수. CHART_THEME 기반으로 smooth line + endLabel(현재값 항상 표시) + markPoint(최대/최소 마커)를 적용한다.

## 시그니처

```javascript
function makeLineOpts(title, series, dates)
// series: [{name, data, color}]
// dates: string[]
```

## Observations

- [impl] `endLabel.show: true` — 라인 끝에 현재값을 `fmt(value)` 포맷으로 항상 표시, 마우스 호버 불필요 #chart
- [impl] `markPoint` — 최대(max)/최소(min) 포인트에 원형 마커 + 수치 라벨, symbolSize: 8 #chart
- [impl] `areaStyle: { opacity: 0.08 }` — 반투명 fill로 시각적 볼륨감 #chart
- [impl] `smooth: true, symbol: 'none'` — 곡선 보간, 기본 심볼 숨김 #chart
- [impl] `grid.right: 80` — endLabel 잘림 방지를 위해 우측 여백 확보 #layout
- [return] ECharts option 객체 (spread된 CHART_THEME + legend + xAxis + yAxis + series)

## Relations

- part_of [[dashboard-js]] (소속 모듈)
- part_of [[크리에이터 실시간 대시보드]] (소속 프로젝트)
- called_by [[load-youtube]] (line 234, 243, 252)
- called_by [[load-tiktok]] (line 291, 301)
- called_by [[load-meta]] (line 342)
- called_by [[load-naver]] (line 401, 410)
