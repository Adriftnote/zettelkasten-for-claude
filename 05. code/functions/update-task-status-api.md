---
title: update-task-status-api
type: function
permalink: functions/update-task-status-api
level: low
category: automation/workflow/task-creation
semantic: set task status to completed via api
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- flow-team-api
---

# updateTaskStatusAPI

Task 상태를 완료로 변경

## 시그니처

```javascript
async function updateTaskStatusAPI(taskSrno: string, status?: string): Promise<boolean>
```

## Observations

- [impl] COLUMN_SRNO, COLUMN_TYPE, COMPLETED_ID는 `FLOW_CONFIG.STATUS` 상수에서 참조 #pattern
- [impl] `status` 파라미터는 현재 미사용 — 항상 FLOW_CONFIG 완료 상태로 변경 #note
- [return] 성공 여부 boolean
- [note] FLOW_CONFIG.STATUS는 현재 프로젝트 기준 하드코딩 (다른 프로젝트에서 다를 수 있음) #caveat

## Relations

- part_of [[flow-content-script]] (소속 모듈)
- calls [[get-auth-info]] (line 535)
- calls [[call-flow-api]] (line 547)
- called_by [[add-tasks-to-project]] (line 836)
- called_by [[create-project-with-api]] (line 646)