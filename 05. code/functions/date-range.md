---
title: date-range
type: function
permalink: functions/date-range
level: low
category: data/sns/validation
semantic: generate date range array
path: C:/claude-workspace/working/projects/playwright-test/verify-integrity.js
tags:
- javascript
---

# date-range

시작일과 종료일 사이의 날짜 배열을 생성하는 헬퍼 함수.

## 시그니처

```js
function dateRange(from, to)
```

## Observations

- [impl] `new Date()` 반복 증가로 날짜 배열 생성, ISO 형식 앞 10자리(`YYYY-MM-DD`)만 추출 #pattern
- [return] `string[]` — `["YYYY-MM-DD", ...]` 형식의 날짜 배열

## Relations

- part_of [[verify-integrity]] (소속 모듈)
- called_by [[run]] (line 179)