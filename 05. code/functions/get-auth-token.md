---
title: get-auth-token
type: function
permalink: functions/get-auth-token
level: low
category: automation/workflow/auth
semantic: extract rgsn dttm auth token from dom
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- authentication
- flow-team
---

# getAuthToken

Flow.team 인증 토큰(RGSN_DTTM) 추출

## 시그니처

```javascript
function getAuthToken(): string | null
```

## Observations

- [impl] script 태그에서 `_RGSN_DTTM = "..."` 패턴 탐색 #algo
- [impl] fallback: `RGSN_DTTM:` 또는 `RGSN_DTTM =` 패턴 #pattern
- [impl] `-1` 값은 미인증으로 간주하여 건너뜀 #pattern
- [impl] 결과 캐싱 (`window._cachedToken`) #pattern
- [return] RGSN_DTTM 토큰 문자열 또는 null
- [note] 모든 API 호출에 RGSN_DTTM 필드로 전달됨 #caveat

## Relations

- part_of [[flow-content-script]] (소속 모듈)
- called_by [[get-auth-info]] (line 114)