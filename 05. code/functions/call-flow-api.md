---
title: call-flow-api
type: function
permalink: functions/call-flow-api
level: low
category: automation/workflow/task-creation
semantic: post request to flow internal api endpoint
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- flow-team-api
- fetch
---

# callFlowAPI

Flow.team 내부 API 엔드포인트 POST 호출

## 시그니처

```javascript
async function callFlowAPI(endpoint: string, payload: object): Promise<object>
```

## Observations

- [impl] payload를 JSON 직렬화 후 이중 URL 인코딩: `_JSON_=encodeURIComponent(encodeURIComponent(json))` #algo
- [impl] Content-Type: `application/x-www-form-urlencoded; charset=UTF-8`, credentials: `include` #pattern
- [return] 파싱된 JSON 응답 객체 — 에러 여부는 `COMMON_HEAD.ERROR` 필드로 판별
- [note] 모든 API 함수가 이 함수를 통해 Flow API 호출 (단일 진입점) #context

## Relations

- part_of [[flow-content-script]] (소속 모듈)
- called_by [[create-group-api]] (line 274)
- called_by [[create-project-api]] (line 260)
- called_by [[create-subtask-api]] (line 572)
- called_by [[create-task-api]] (line 508)
- called_by [[get-group-list-api]] (line 220)
- called_by [[move-task-to-group-api]] (line 528)
- called_by [[set-task-depth-api]] (line 586)
- called_by [[update-task-status-api]] (line 547)