---
title: extract-current-day
type: function
permalink: functions/extract-current-day
level: low
category: data/sns/channel-summary
semantic: extract naver blog daily stats
path: C:/claude-workspace/working/projects/playwright-test/collect-channels.js
tags:
- javascript
- playwright
- naver-blog
---

# extract-current-day

Naver Blog 통계 페이지의 iframe에서 최근 7일치 일별 통계를 추출하는 함수. prev 버튼 7회 클릭으로 날짜를 순회하며 DOM에서 수치를 파싱한다.

## 시그니처

```js
async function extractCurrentDay(page)
```

## Observations

- [impl] `admin.blog.naver.com/stat/today` 접속 → iframe 탐색 → prev 버튼 7회 반복 클릭 #algo
- [impl] 각 날짜마다 DOM에서 views/likes/comments/neighbors 수치 파싱 → `normalizeForWebhook` 호출 #algo
- [impl] 확정 데이터만 수집 (당일 미집계 제외) — prev 버튼으로 이전 날짜로 이동 #pattern
- [return] `Array<{ date, platform, views, interactions, followers_diff }>` 7개 레코드

## Relations

- part_of [[collect-channels]] (소속 모듈)
- calls [[find-prev-button]] (line 303)
- calls [[normalize-for-webhook]] (line 346)
- calls [[send-to-webhook]] (line 347)
- calls [[run]] (line 359)