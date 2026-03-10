---
title: verify-naver-blog
type: function
permalink: functions/verify-naver-blog
level: low
category: data/sns/validation
semantic: verify naver blog view count
path: C:/claude-workspace/working/projects/playwright-test/verify-integrity.js
tags:
- javascript
- sqlite
- naver-blog
---

# verify-naver-blog

Naver Blog 플랫폼의 게시물별 스냅샷 합산값과 채널 일별 요약 조회수를 비교하여 정합성을 검증하는 함수.

## 시그니처

```js
function verifyNaverBlog(date)
```

## Observations

- [impl] `post_view_snapshots`에서 해당 날짜의 마지막 스냅샷 시각 조회 후, 해당 시각의 조회수 합산 #algo
- [impl] `오늘 전체 조회수` 특수 행이 있으면 합산 대신 해당 값 우선 사용 — 더 정확한 집계 #caveat
- [impl] `matchRate = min(postSum, channelViews) / max(postSum, channelViews)` — 90% 이상 PASS #algo
- [return] `{ date, postSum, channelViews, lastSnapshot, diff, matchRate } | null`

## Relations

- part_of [[verify-integrity]] (소속 모듈)
- calls [[get-channel-daily]] (line 81)
- called_by [[run]] (line 198)