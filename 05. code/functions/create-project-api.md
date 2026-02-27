---
title: create-project-api
type: function
permalink: functions/create-project-api
level: low
category: automation/workflow/task-creation
semantic: create flow project via api
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- flow-team-api
---

# createProjectAPI

Flow.team 프로젝트 생성 API 호출

## 시그니처

```javascript
async function createProjectAPI(data: { name, description }): Promise<{ success, colaboSrno }>
```

## Observations

- [impl] OPEN_YN='N', EDIT_AUTH_TYPE='MNGRMYSELF' 고정값으로 비공개 프로젝트 생성 #pattern
- [impl] `COMMON_HEAD.ERROR` 없으면 성공, `COLABO_SRNO` 반환 #algo
- [return] `{ success: true, colaboSrno }` 또는 예외 throw
- [deps] getAuthInfo, callFlowAPI #import

## Relations

- part_of [[flow-content-script]] (소속 모듈)
- calls [[get-auth-info]] (line 252)
- calls [[call-flow-api]] (line 260)
- called_by [[create-project-with-api]] (line 613)