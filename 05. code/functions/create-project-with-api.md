---
title: create-project-with-api
type: function
permalink: functions/create-project-with-api
level: low
category: automation/workflow/crud
semantic: create project with tasks
path: working/worker/from-code/flow-task-creator/content.js
tags:
- javascript
- flow-team-api
---

# create-project-with-api

프로젝트 + 그룹 + Task + Subtask 일괄 생성

## 시그니처

```javascript
async function createProjectWithAPI(data: {
  name, description, groups?, tasks?, useGroups?
}): Promise<{ success, colaboSrno, results }>
```

## Observations

- [impl] 프로젝트 → 그룹 → Task → Subtask 순차 생성 #algo
- [impl] 진행상황을 chrome.runtime.sendMessage로 Side Panel에 전송 #pattern
- [impl] groups 구조와 tasks 구조 둘 다 지원 #pattern
- [impl] task.status === 'completed'면 완료 상태로 변경 #pattern
- [return] { success, colaboSrno, results[] }
- [deps] createProjectAPI, createGroupAPI, createTaskAPI, createSubtaskAPI #import

## 생성 순서

```
1. createProjectAPI() → colaboSrno
2. for each group:
   2a. createGroupAPI() → sectionSrno
   2b. for each task:
       - createTaskAPI()
       - for each subtask: createSubtaskAPI()
       - if completed: updateTaskStatusAPI()
3. return results
```

## Relations

- part_of [[flow-content-script]] (소속 모듈)
- calls [[create-task-api]] (Task 생성)
- data_flows_to [[flow-sidepanel]] (진행상황 메시지)