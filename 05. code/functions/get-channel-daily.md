---
title: get-channel-daily
type: function
permalink: functions/get-channel-daily
level: low
category: data/sns/validation
semantic: query channel daily views
path: C:/claude-workspace/working/projects/playwright-test/verify-integrity.js
tags:
- javascript
- sqlite
---

# get-channel-daily

`daily_channel_summary` 테이블에서 특정 플랫폼/날짜의 일별 조회수를 조회하는 함수.

## 시그니처

```js
function getChannelDaily(platform, date)
```

## Observations

- [impl] `better-sqlite3` `db.prepare().get()` — 읽기 전용 동기 쿼리 #pattern
- [return] `number | null` — 레코드 없으면 null 반환

## Relations

- part_of [[verify-integrity]] (소속 모듈)
- called_by [[verify-naver-blog]] (line 81)
- called_by [[verify-cumulative]] (line 158)