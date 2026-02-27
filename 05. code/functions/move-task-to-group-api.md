---
title: move-task-to-group-api
type: function
permalink: functions/move-task-to-group-api
level: low
category: automation/workflow/task-creation
semantic: assign task to group section via api
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- flow-team-api
---

# moveTaskToGroupAPI

생성된 Task를 특정 그룹(섹션)으로 이동

## 시그니처

```javascript
async function moveTaskToGroupAPI(taskSrno: string, sectionSrno: string, colaboSrno: string): Promise<boolean>
```

## Observations

- [impl] Flow API 제약으로 Task 생성 시 그룹 직접 지정 불가 — 생성 후 별도 이동 필수 #caveat
- [impl] UP_TASK_SRNO: '-1' (최상위 위치), ORDER_NUM 기본값 사용 #pattern
- [return] 성공 여부 boolean (`!r.COMMON_HEAD?.ERROR`)

## Relations

- part_of [[flow-content-script]] (소속 모듈)
- calls [[get-auth-info]] (line 521)
- calls [[call-flow-api]] (line 528)
- called_by [[create-task-api]] (line 512)