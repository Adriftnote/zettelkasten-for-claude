---
title: get-current-project
type: function
permalink: functions/get-current-project
level: low
category: automation/workflow/auth
semantic: extract current project id from url
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- flow-team
---

# getCurrentProject

현재 페이지 URL에서 Flow.team 프로젝트 ID(colaboSrno) 파싱

## 시그니처

```javascript
function getCurrentProject(): { colaboSrno: string } | null
```

## Observations

- [impl] URL에서 `/project/{id}`, `/colabo/{id}`, `COLABO_SRNO={id}`, `colaboSrno={id}` 패턴 순차 탐색 #algo
- [impl] URL 실패 시 script 태그에서 `COLABO_SRNO` 탐색 #pattern
- [impl] 최후 fallback: `[data-colabo-srno]` 속성 요소 탐색 #pattern
- [return] `{ colaboSrno: string }` 또는 null (Flow 프로젝트 페이지가 아닌 경우)
- [note] Content Script 메시지 핸들러에서 호출 — 프로젝트 페이지 여부 판별용 #context

## Relations

- part_of [[flow-content-script]] (소속 모듈)
- called_by [[add-tasks-to-project]] (line 915)