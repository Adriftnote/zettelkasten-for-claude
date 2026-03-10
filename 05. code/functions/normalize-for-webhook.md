---
title: normalize-for-webhook
type: function
permalink: functions/normalize-for-webhook
level: low
category: data/sns/channel-summary
semantic: normalize platform data for webhook
path: C:/claude-workspace/working/projects/playwright-test/collect-channels.js
tags:
- javascript
- normalization
---

# normalize-for-webhook

플랫폼별 raw 수집 데이터를 webhook 공통 스키마 `{date, platform, views, interactions, followers_diff}`로 정규화하는 함수.

## 시그니처

```js
function normalizeForWebhook(platform, rawData)
```

## Observations

- [impl] Facebook: `rawData.views/interactions/followers` 배열을 `start_time` 날짜 기준으로 dateMap에 병합 #algo
- [impl] X: `rawData[].metrics.{Impressions, Engagements, Follows}` → views/interactions/followers_diff 매핑 #algo
- [impl] Naver: `rawData[].{views, likes, comments, neighbors}` → views=(views), interactions=(likes+comments), followers_diff=(neighbors) #algo
- [impl] Extension `popup.js`의 sendToN8n 매핑과 동일한 스키마 유지 — DB 호환성 #pattern
- [return] `Array<{ date, platform, views, interactions, followers_diff }>`

## Relations

- part_of [[collect-channels]] (소속 모듈)
- called_by [[extract-current-day]] (line 346)