---
title: get-current-user-name
type: function
permalink: functions/get-current-user-name
level: low
category: automation/workflow/auth
semantic: extract current user name from dom
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- authentication
- flow-team
---

# getCurrentUserName

Flow.team 페이지의 프로필 요소에서 현재 로그인 사용자 이름 추출

## 시그니처

```javascript
function getCurrentUserName(): string | null
```

## Observations

- [impl] `.dashboard-profile-name` 요소 텍스트에서 `^(.+?)님` 패턴으로 이름 추출 #algo
- [return] 이름 문자열(님 제외) 또는 null

## Relations

- part_of [[flow-content-script]] (소속 모듈)
- called_by [[get-auth-info]] (line 114)
- called_by [[add-tasks-to-project]] (line 911)