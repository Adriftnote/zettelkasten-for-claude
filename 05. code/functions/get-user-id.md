---
title: get-user-id
type: function
permalink: functions/get-user-id
level: low
category: automation/workflow/auth
semantic: extract user id from dom
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- authentication
- flow-team
---

# getUserId

Flow.team 페이지의 script 태그 또는 localStorage에서 사용자 ID 추출

## 시그니처

```javascript
function getUserId(): string | null
```

## Observations

- [impl] script 태그에서 `_USER_ID = "..."` 정규식 패턴으로 추출 #algo
- [impl] 실패 시 localStorage `N_ONLY_USER_SETTING.USER_ID` fallback #pattern
- [impl] 결과 캐싱 (`window._cachedUserId`) — 중복 DOM 탐색 방지 #pattern
- [return] 사용자 ID 문자열 또는 null

## Relations

- part_of [[flow-content-script]] (소속 모듈)
- called_by [[get-auth-info]] (line 114)
- called_by [[add-tasks-to-project]] (line 911)