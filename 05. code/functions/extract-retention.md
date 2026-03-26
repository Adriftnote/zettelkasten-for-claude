---
title: extract-retention
type: function
permalink: functions/extract-retention
tags:
- javascript
- tiktok
- retention-rate
level: low
category: data/sns/tiktok-detail
semantic: extract n-second retention from api response
path: C:/claude-workspace/working/projects/playwright-test/test-tiktok-retention.js
line: 44
---

# extract-retention

API 응답에서 특정 초(seconds)의 유지율 값을 추출하는 유틸리티 함수.

## 시그니처

```js
function extractRetention(data, seconds = 3) → number | null
```

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| data | Object | fetchRetentionRate 반환값 |
| seconds | number | 추출할 초 (기본값 3) |
| **반환** | number/null | 유지율 비율 (0~1), 데이터 없으면 null |

## Observations

- [impl] timestamp 밀리초 문자열 매칭 — seconds * 1000 → "3000" 등으로 변환하여 list에서 find #pattern
- [return] 0~1 비율 반환 (0.18 = 18%). 퍼센트 변환은 호출측 담당 #type

## Relations
- part_of [[test-tiktok-retention]] (소속 모듈)
- called_by [[extract-finish-rate]] (IIFE main에서 호출)