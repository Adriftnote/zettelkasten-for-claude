---
title: verify-cumulative
type: function
permalink: functions/verify-cumulative
level: low
category: data/sns/validation
semantic: verify cumulative platform view count
path: C:/claude-workspace/working/projects/playwright-test/verify-integrity.js
tags:
- javascript
- sqlite
- tiktok
- meta
---

# verify-cumulative

누적 조회수를 수집하는 플랫폼(TikTok, Meta)의 게시물별 증분을 계산하여 채널 일별 요약과 비교하는 정합성 검증 함수.

## 시그니처

```js
function verifyCumulative(platform, channelPlatforms, date, prevDate)
```

## Observations

- [impl] 당일/전일 마지막 스냅샷 시각 조회 → 각 게시물별 조회수 차분(증분) 합산 #algo
- [impl] 신규 게시물(전일 스냅샷 없음): 당일 전체 조회수를 증분으로 간주 #algo
- [impl] `channelPlatforms` 배열로 여러 채널 플랫폼 합산 지원 — Meta(facebook+instagram) 분리 수집 대응 #pattern
- [impl] `matchRate = min(totalDiff, channelViews) / max(totalDiff, channelViews)` #algo
- [return] `{ date, postSum, channelViews, lastSnapshot, prevSnapshot, matchedPosts, newPosts, diff, matchRate } | null`

## Relations

- part_of [[verify-integrity]] (소속 모듈)
- calls [[get-channel-daily]] (line 158)
- called_by [[run]] (line 206)