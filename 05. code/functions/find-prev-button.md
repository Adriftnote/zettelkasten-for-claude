---
title: find-prev-button
type: function
permalink: functions/find-prev-button
level: low
category: data/sns/channel-summary
semantic: find naver blog previous date button
path: C:/claude-workspace/working/projects/playwright-test/collect-channels.js
tags:
- javascript
- playwright
- naver-blog
---

# find-prev-button

Naver Blog 통계 iframe 내에서 이전 날짜로 이동하는 버튼을 탐색하여 반환하는 함수.

## 시그니처

```js
async function findPrevButton(frame)
```

## Observations

- [impl] iframe `frame` 컨텍스트에서 DOM 탐색 — blog.stat.naver.com 통계 페이지 #pattern
- [return] 이전 날짜 버튼 Locator 또는 null

## Relations

- part_of [[collect-channels]] (소속 모듈)
- called_by [[extract-current-day]] (line 303)