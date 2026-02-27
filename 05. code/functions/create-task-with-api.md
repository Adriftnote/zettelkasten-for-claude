---
title: create-task-with-api
type: function
permalink: functions/create-task-with-api
level: low
category: automation/workflow/task-creation
semantic: create task with subtasks wrapper
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- flow-team-api
---

# createTaskWithAPI

Task와 하위 Subtask를 함께 생성하는 래퍼 함수

## 시그니처

```javascript
async function createTaskWithAPI(taskData: object, colaboSrno: string): Promise<{ success, commtSrno, taskSrno }>
```

## Observations

- [impl] `createTaskAPI` 호출 후 `taskData.subtasks` 있으면 순차 `createSubtaskAPI` 호출 #algo
- [impl] 에러 catch 후 `{ success: false, message }` 반환 (예외 미전파) #pattern
- [return] `{ success, commtSrno, taskSrno }` 또는 `{ success: false, message }`

## Relations

- part_of [[flow-content-script]] (소속 모듈)
- calls [[create-task-api]] (line 714)
- calls [[create-subtask-api]] (line 715)
- called_by [[add-tasks-to-project]] (line 954)