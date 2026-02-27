---
title: create-single-task
type: function
permalink: functions/create-single-task
level: low
category: automation/workflow/task-creation
semantic: create single task with subtasks for task creation tab
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- flow-team-api
---

# createSingleTask

Side Panel의 "Task 생성" 탭에서 단일 Task 생성 처리

## 시그니처

```javascript
async function createSingleTask(data: { title, startDate, endDate, assignee, subtasks, sectionSrno, colaboSrno, content }): Promise<{ success, message, taskSrno }>
```

## Observations

- [impl] `colaboSrno` 없으면 즉시 실패 반환 — Flow 프로젝트 페이지에서만 동작 #pattern
- [impl] Task 생성 후 `subtasks` 배열 있으면 순차 `createSubtaskAPI` 호출, 부모 날짜 상속 #algo
- [return] `{ success: true, message: "Task 'X' 생성 완료! N개 하위 Task 포함", taskSrno }` 또는 `{ success: false, message }`
- [usage] `chrome.runtime.onMessage` 핸들러에서 `createTask` 액션으로 호출

## Relations

- part_of [[flow-content-script]] (소속 모듈)
- calls [[create-task-api]] (line 733)
- calls [[create-subtask-api]] (line 739)
- called_by [[add-tasks-to-project]] (line 941)