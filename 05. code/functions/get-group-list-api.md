---
title: get-group-list-api
type: function
permalink: functions/get-group-list-api
level: low
category: automation/workflow/task-creation
semantic: fetch group list with dom api fallback
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- flow-team-api
---

# getGroupListAPI

프로젝트 그룹(섹션) 목록 조회 — DOM 우선, API fallback

## 시그니처

```javascript
async function getGroupListAPI(colaboSrno: string): Promise<{ success, groups, projectName }>
```

## Observations

- [impl] DOM 탐색 우선 → 빈 결과 시 API 호출 전략 (DOM이 더 신뢰성 높음) #algo
- [impl] API 응답에서 `SECTION_REC` 또는 `SECTION_LIST` 배열로 그룹 추출 #pattern
- [impl] 인증 토큰 없으면 API 호출 생략, 빈 그룹 반환 #pattern
- [return] `{ success: true, groups: [{sectionSrno, name, orderNum}], projectName }`
- [deps] getAuthInfo, getGroupListFromDOM, callFlowAPI #import

## Relations

- part_of [[flow-content-script]] (소속 모듈)
- calls [[get-auth-info]] (line 195)
- calls [[get-group-list-from-dom]] (line 198)
- calls [[call-flow-api]] (line 220)
- called_by [[add-tasks-to-project]] (line 787)