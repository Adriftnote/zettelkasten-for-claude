---
title: fetch-retention-rate
type: function
permalink: functions/fetch-retention-rate
tags:
- javascript
- tiktok
- api
- retention-rate
level: medium
category: data/sns/tiktok-detail
semantic: fetch tiktok video retention via insight api
path: C:/claude-workspace/working/projects/playwright-test/test-tiktok-retention.js
line: 14
---

# fetch-retention-rate

TikTok `/aweme/v2/data/insight/` API를 호출하여 영상별 유지율 커브와 완시율을 가져오는 함수.

## 시그니처

```js
async function fetchRetentionRate(page, awemeId) → Object
```

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| page | Playwright.Page | 로그인된 TikTok 세션의 Playwright 페이지 |
| awemeId | string | TikTok 영상 ID |
| **반환** | Object | API 응답 전체 (video_retention_rate_realtime, video_finish_rate_realtime 포함) |

## Observations

- [impl] page.evaluate 내에서 fetch(credentials:'include')로 호출 — Playwright 컨텍스트의 쿠키를 활용 #pattern
- [impl] type_requests에 video_retention_rate_realtime + video_finish_rate_realtime 2개를 동시 요청 #pattern
- [return] API 응답 JSON 전체 반환 — 호출측에서 extractRetention/extractFinishRate로 파싱 #type

## Relations
- part_of [[test-tiktok-retention]] (소속 모듈)
- called_by [[extract-finish-rate]] (IIFE main에서 호출)