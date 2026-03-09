---
title: flow-content-script
type: module
permalink: 05.-code/modules/flow-content-script
level: high
category: automation/workflow/task-creation
semantic: create task via flow api
path: working/projects/flow-task-creator/flow-task-creator/content.js
tags:
- javascript
- content-script
- flow-team-api
---

# flow-content-script

Flow.team 내부 API로 Task/Subtask/Project/Group을 생성하는 Content Script (970줄, 27개 함수)

## 개요
Chrome Extension의 Content Script로 flow.team 페이지에 주입되어 DOM 조작과 내부 API 호출을 담당. Side Panel(sidepanel.js)로부터 메시지를 받아 프로젝트/그룹/Task를 일괄 생성하고 진행상황을 역방향 메시지로 전송.

마크다운 → Flow 네이티브 HTML 변환 파이프라인 포함: 코드블록/테이블은 `editor-table-wrap` 1칸 테이블 포맷으로 출력해 Flow 에디터 수정 후에도 구조가 유지됨.

## Observations

- [impl] Flow.team 내부 API 직접 호출 — script 태그 및 localStorage에서 인증 토큰 추출 #algo
- [impl] 인증값 캐싱 (`window._cachedUserId` 등) 으로 중복 DOM 탐색 방지 #pattern
- [impl] 마크다운→HTML 파이프라인: 코드블록→테이블→줄별 변환 순서 #algo
- [impl] Task/Subtask 생성 전 `stripOutputSection`으로 "산출물" 섹션 이하 제거 (댓글로 별도 등록 설계) #pattern
- [impl] Task 생성 후 그룹 할당은 별도 `moveTaskToGroupAPI` 호출 (Flow 제약) #pattern
- [impl] 진행상황을 `chrome.runtime.sendMessage`로 Side Panel에 전송 #pattern
- [deps] chrome.runtime, fetch API, DOM API #import
- [note] API 엔드포인트(`.jct`)는 Flow.team 업데이트 시 변경 가능 #caveat
- [note] Task 생성 시 SECTION_SRNO는 항상 '0'으로 고정, 그룹 할당은 별도 API #caveat

## 동작 흐름

```
chrome.runtime.onMessage → 액션 분기
  ├─ getAuthInfo    → DOM에서 인증 정보 반환
  ├─ getProjectInfo → URL에서 colaboSrno 파싱 반환
  ├─ getGroupList   → getGroupListAPI() (DOM→API fallback)
  ├─ createTask     → createSingleTask()
  ├─ addTasksToProject → addTasksToProject()
  └─ createProjectAPI  → createProjectWithAPI()
```

## Relations
- part_of [[flow-task-creator-extension]] (소속 프로젝트)
- contains [[get-user-id]]
- contains [[get-company-sn]]
- contains [[get-auth-token]]
- contains [[get-current-user-name]]
- contains [[get-auth-info]]
- contains [[get-current-project]]
- contains [[get-group-list-from-dom]]
- contains [[get-group-list-api]]
- contains [[call-flow-api]]
- contains [[create-project-api]]
- contains [[create-group-api]]
- contains [[strip-output-section]]
- contains [[content-to-html]]
- contains [[close-lists-to-indent]]
- contains [[close-all-lists]]
- contains [[convert-tables]]
- contains [[convert-code-blocks]]
- contains [[apply-inline-styles]]
- contains [[create-task-api]]
- contains [[move-task-to-group-api]]
- contains [[update-task-status-api]]
- contains [[create-subtask-api]]
- contains [[set-task-depth-api]]
- contains [[create-project-with-api]]
- contains [[create-task-with-api]]
- contains [[create-single-task]]
- contains [[add-tasks-to-project]]
  - add-tasks-to-project calls [[get-group-list-api]] (line 809)
  - add-tasks-to-project calls [[create-group-api]] (line 836)
  - add-tasks-to-project calls [[create-task-api]] (line 851)
  - add-tasks-to-project calls [[create-subtask-api]] (line 854)
  - add-tasks-to-project calls [[update-task-status-api]] (line 858)
  - add-tasks-to-project calls [[get-auth-info]] (line 932)
  - add-tasks-to-project calls [[get-current-user-name]] (line 933)
  - add-tasks-to-project calls [[get-user-id]] (line 933)
  - add-tasks-to-project calls [[get-current-project]] (line 937)
  - add-tasks-to-project calls [[create-single-task]] (line 963)
  - add-tasks-to-project calls [[create-project-with-api]] (line 975)
  - add-tasks-to-project calls [[create-task-with-api]] (line 976)
  - close-all-lists calls [[apply-inline-styles]] (line 344)
  - close-all-lists calls [[close-lists-to-indent]] (line 368)
  - content-to-html calls [[convert-code-blocks]] (line 301)
  - content-to-html calls [[convert-tables]] (line 304)
  - convert-tables calls [[apply-inline-styles]] (line 459)
  - create-group-api calls [[get-auth-info]] (line 266)
  - create-group-api calls [[call-flow-api]] (line 274)
  - create-project-api calls [[get-auth-info]] (line 252)
  - create-project-api calls [[call-flow-api]] (line 260)
  - create-project-with-api calls [[create-project-api]] (line 635)
  - create-project-with-api calls [[create-group-api]] (line 648)
  - create-project-with-api calls [[create-task-api]] (line 661)
  - create-project-with-api calls [[create-subtask-api]] (line 664)
  - create-project-with-api calls [[update-task-status-api]] (line 668)
  - create-single-task calls [[create-task-api]] (line 755)
  - create-single-task calls [[create-subtask-api]] (line 761)
  - create-subtask-api calls [[strip-output-section]] (line 576)
  - create-subtask-api calls [[content-to-html]] (line 578)
  - create-subtask-api calls [[get-auth-info]] (line 580)
  - create-subtask-api calls [[call-flow-api]] (line 594)
  - create-subtask-api calls [[set-task-depth-api]] (line 596)
  - create-task-api calls [[strip-output-section]] (line 510)
  - create-task-api calls [[get-auth-info]] (line 511)
  - create-task-api calls [[content-to-html]] (line 514)
  - create-task-api calls [[call-flow-api]] (line 530)
  - create-task-api calls [[move-task-to-group-api]] (line 534)
  - create-task-with-api calls [[create-task-api]] (line 736)
  - create-task-with-api calls [[create-subtask-api]] (line 737)
  - get-auth-info calls [[get-auth-token]] (line 114)
  - get-auth-info calls [[get-company-sn]] (line 114)
  - get-auth-info calls [[get-current-user-name]] (line 114)
  - get-auth-info calls [[get-user-id]] (line 114)
  - get-group-list-api calls [[get-auth-info]] (line 195)
  - get-group-list-api calls [[get-group-list-from-dom]] (line 198)
  - get-group-list-api calls [[call-flow-api]] (line 220)
  - move-task-to-group-api calls [[get-auth-info]] (line 543)
  - move-task-to-group-api calls [[call-flow-api]] (line 550)
  - set-task-depth-api calls [[get-auth-info]] (line 603)
  - set-task-depth-api calls [[call-flow-api]] (line 608)
  - update-task-status-api calls [[get-auth-info]] (line 557)
  - update-task-status-api calls [[call-flow-api]] (line 569)
- data_flows_to [[flow-sidepanel]] (진행상황 메시지 전송)
