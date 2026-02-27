---
title: create-group-api
type: function
permalink: functions/create-group-api
level: low
category: automation/workflow/task-creation
semantic: create flow project group section via api
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- flow-team-api
---

# createGroupAPI

Flow.team 프로젝트에 그룹(섹션) 생성

## 시그니처

```javascript
async function createGroupAPI(groupName: string, colaboSrno: string): Promise<{ success, sectionSrno }>
```

## Observations

- [impl] USE_INTT_ID(companySn) 필수 전달 — 없으면 API 에러 #caveat
- [impl] ORDER_NUM은 빈 문자열로 전달 (자동 정렬) #pattern
- [return] `{ success: true, sectionSrno }` 또는 예외 throw
- [deps] getAuthInfo, callFlowAPI #import

## Relations

- part_of [[flow-content-script]] (소속 모듈)
- calls [[get-auth-info]] (line 266)
- calls [[call-flow-api]] (line 274)
- called_by [[add-tasks-to-project]] (line 814)
- called_by [[create-project-with-api]] (line 626)