---
title: create-task-api
type: function
permalink: functions/create-task-api
level: low
category: automation/workflow/crud
semantic: create task via api
path: working/worker/from-code/flow-task-creator/content.js
tags:
- javascript
- flow-team-api
---

# create-task-api

Flow.team 내부 API로 Task 생성

## 시그니처

```javascript
async function createTaskAPI(
  data: { title, startDate, endDate, assignee, content },
  colaboSrno: string,
  sectionSrno: string = '0'
): Promise<{ success, commtSrno, taskSrno }>
```

## Observations

- [impl] COLABO2_COMMT_C101.jct 엔드포인트 호출 #algo
- [impl] content는 contentToHtml()로 HTML 변환 후 인코딩 #pattern
- [impl] 그룹 할당은 생성 후 moveTaskToGroupAPI()로 처리 #pattern
- [return] { success, commtSrno, taskSrno, startDate, endDate }
- [deps] callFlowAPI, getAuthInfo, contentToHtml #import

## 코드

```javascript
async function createTaskAPI(data, colaboSrno, sectionSrno = '0') {
  const { title, startDate, endDate, assignee, content } = data;
  const auth = getAuthInfo();
  const htmlContent = contentToHtml(content);
  
  const payload = {
    USER_ID: auth.userId,
    RGSN_DTTM: auth.token,
    COLABO_SRNO: colaboSrno,
    COMMT_TTL: title,
    HTML_CNTN: encodeURIComponent(htmlContent),
    TASK_REC: [{ TASK_NM: title, START_DT: fmt(startDate), END_DT: fmt(endDate), ... }]
  };
  
  const r = await callFlowAPI('COLABO2_COMMT_C101.jct', payload);
  
  // 그룹 지정 시 별도 API 호출
  if (sectionSrno !== '0') {
    await moveTaskToGroupAPI(r.TASK_SRNO, sectionSrno, colaboSrno);
  }
  
  return { success: true, taskSrno: r.TASK_SRNO };
}
```

## Relations
- part_of [[flow-content-script]] (소속 모듈)
- calls [[get-auth-info]] (line 489)
- calls [[content-to-html]] (line 491)
- calls [[call-flow-api]] (line 508)
- calls [[move-task-to-group-api]] (line 512)
- called_by [[add-tasks-to-project]] (line 829)
- called_by [[create-project-with-api]] (line 639)
- called_by [[create-single-task]] (line 733)
- called_by [[create-task-with-api]] (line 714)
