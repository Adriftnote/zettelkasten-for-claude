---
title: get-captured-at
type: function
permalink: 05.-code/functions/get-captured-at
level: low
category: data/sns/analytics
semantic: generate kst hourly timestamp
path: C:/claude-workspace/working/projects/playwright-test/run-posts.js
tags:
- javascript
---

# getCapturedAt

KST(한국 표준시) 기준으로 현재 시각을 시간 단위로 반올림한 ISO 문자열을 반환하는 타임스탬프 유틸.

## 시그니처

```javascript
function getCapturedAt(): string
```

## Observations

- [impl] UTC에 9시간 더해 KST 계산 후 `toISOString().slice(0,13) + ':00:00'`으로 분/초 절삭 #algo
- [return] 형식: `"2026-03-09T15:00:00"` — 동일 수집 시간대 레코드 그룹핑 키로 사용
- [usage] `const capturedAt = getCapturedAt();` — run() 시작 시 한 번 호출, 전 플랫폼 공유
- [note] new Date(Date.now() + 9h) 방식 — timezone API 미사용, 서버 timezone 무관하게 KST 보장 #caveat

## Relations

- part_of [[run-posts]] (소속 모듈)
- called_by [[run]] (line 512)