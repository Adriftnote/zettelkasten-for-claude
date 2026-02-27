---
title: set-task-depth-api
type: function
permalink: functions/set-task-depth-api
level: low
category: automation/workflow/task-creation
semantic: set parent child task hierarchy via api
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- flow-team-api
---

# setTaskDepthAPI

Task 간 부모-자식 계층 관계 설정 (TASK_MOVE 엔드포인트 사용)

## 시그니처

```javascript
async function setTaskDepthAPI(parentSrno: string, childSrno: string, colaboSrno: string): Promise<{ success }>
```

## Observations

- [impl] UP_TASK_SRNO에 부모 ID를 전달하여 계층 관계 설정 — 그룹 이동 API(TASK_MOVE)와 동일 엔드포인트 #algo
- [impl] SECTION_SRNO와 ORDER_NUM은 FLOW_CONFIG 기본값 사용 #pattern
- [return] `{ success: true/false }`

## Relations

- part_of [[flow-content-script]] (소속 모듈)
- calls [[get-auth-info]] (line 581)
- calls [[call-flow-api]] (line 586)
- called_by [[create-subtask-api]] (line 574)