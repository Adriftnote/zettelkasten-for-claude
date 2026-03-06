---
title: get-captured-at
type: function
permalink: functions/get-captured-at
level: low
category: automation/sns/collection
semantic: get kst timestamp rounded to hour
path: C:\claude-workspace\working\projects\playwright-test\run-posts.js
tags:
- javascript
---

# get-captured-at

KST 기준 현재 시각을 시간 단위로 반올림한 타임스탬프 반환

## 시그니처

```javascript
function getCapturedAt(): string
```

## Observations

- [impl] `Date.now() + 9 * 60 * 60 * 1000`으로 UTC→KST 변환 후 ISO 문자열 앞 13자 + ':00:00' #algo
- [return] 문자열 형식: `"2026-03-06T15:00:00"` — post_view_snapshots captured_at 컬럼에 삽입
- [usage] `const capturedAt = getCapturedAt();` — run() 시작 시 1회 호출

## Relations

- part_of [[run-posts-collector]] (소속 모듈)
- called_by [[run-main]] (line 455)