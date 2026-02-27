---
title: create-subtask-api
type: function
permalink: functions/create-subtask-api
level: low
category: automation/workflow/task-creation
semantic: create subtask linked to parent task via api
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- flow-team-api
---

# createSubtaskAPI

Flow.team에 Subtask 생성 후 부모 Task와 계층 관계 설정

## 시그니처

```javascript
async function createSubtaskAPI(
  subtask: string | { title, content },
  parentSrno: string,
  colaboSrno: string,
  parentDates?: { startDate, endDate }
): Promise<{ success, commtSrno, taskSrno }>
```

## Observations

- [impl] subtask 파라미터가 문자열이면 title만, 객체이면 title+content 지원 #pattern
- [impl] 날짜는 parentDates에서 상속, 담당자는 현재 로그인 사용자 자동 설정 #pattern
- [impl] Task 생성 후 `setTaskDepthAPI`로 부모-자식 관계 별도 설정 #algo
- [return] `{ success: true, commtSrno, taskSrno }` 또는 예외 throw
- [deps] contentToHtml, getAuthInfo, callFlowAPI, setTaskDepthAPI #import

## Relations

- part_of [[flow-content-script]] (소속 모듈)
- calls [[content-to-html]] (line 555)
- calls [[get-auth-info]] (line 558)
- calls [[call-flow-api]] (line 572)
- calls [[set-task-depth-api]] (line 574)
- called_by [[add-tasks-to-project]] (line 832)
- called_by [[create-project-with-api]] (line 642)
- called_by [[create-single-task]] (line 739)
- called_by [[create-task-with-api]] (line 715)