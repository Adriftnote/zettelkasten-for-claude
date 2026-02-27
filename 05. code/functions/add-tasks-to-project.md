---
title: add-tasks-to-project
type: function
permalink: functions/add-tasks-to-project
level: low
category: automation/workflow/task-creation
semantic: bulk add groups and tasks to existing project
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- flow-team-api
---

# addTasksToProject

기존 프로젝트에 그룹과 Task를 일괄 추가 (Side Panel 프로젝트 탭용)

## 시그니처

```javascript
async function addTasksToProject(data: { groups, tasks, useGroups, colaboSrno }): Promise<{ success, message, results }>
```

## Observations

- [impl] useGroups=true 시 기존 그룹 이름 매칭 후 재사용 (getGroupListAPI 선조회) #algo
- [impl] 3가지 분기: groups+useGroups, directTasks, groups+!useGroups #pattern
- [impl] 진행상황을 `chrome.runtime.sendMessage({ action: 'progress' })` 로 실시간 전송 #pattern
- [impl] 각 Task/Group 결과를 `results` 배열에 수집, 실패해도 계속 진행 #pattern
- [return] `{ success, message: "N/M개 완료!", results }`
- [usage] `chrome.runtime.onMessage` 핸들러에서 `addTasksToProject` 액션으로 호출

## Relations

- part_of [[flow-content-script]] (소속 모듈)
- calls [[get-group-list-api]] (line 787)
- calls [[create-group-api]] (line 814)
- calls [[create-task-api]] (line 829)
- calls [[create-subtask-api]] (line 832)
- calls [[update-task-status-api]] (line 836)
- calls [[get-auth-info]] (line 910)
- calls [[get-current-user-name]] (line 911)
- calls [[get-user-id]] (line 911)
- calls [[get-current-project]] (line 915)
- calls [[create-single-task]] (line 941)
- calls [[create-project-with-api]] (line 953)
- calls [[create-task-with-api]] (line 954)