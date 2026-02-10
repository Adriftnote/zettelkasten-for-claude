---
title: flow-content-script
type: module
permalink: modules/flow-content-script
level: low
category: automation/workflow/task-creation
semantic: create task via api
path: working/worker/from-code/flow-task-creator/content.js
tags:
- javascript
- content-script
- flow-team-api
---

# flow-content-script

Flow.team 내부 API로 Task 생성하는 Content Script (937줄, 25+개 함수)

## Observations

- [impl] Flow.team 내부 API 직접 호출 (script 태그에서 토큰 추출) #algo
- [impl] 프로젝트/그룹/Task/Subtask CRUD 전체 지원 #pattern
- [impl] 마크다운→HTML 변환 (테이블, 코드블록, 리스트 지원) #algo
- [impl] 진행상황을 Side Panel로 메시지 전송 #pattern
- [deps] chrome.runtime, fetch API, DOM API #import
- [note] API 엔드포인트는 Flow.team 업데이트 시 변경 가능 #caveat

## 함수 목록

### 인증
| 함수 | 역할 |
|------|------|
| `getUserId()` | 사용자 ID 추출 (script/localStorage) |
| `getCompanySn()` | 회사 ID 추출 |
| `getAuthToken()` | RGSN_DTTM 토큰 추출 |
| `getAuthInfo()` | 전체 인증 정보 반환 |

### 프로젝트/그룹
| 함수 | 역할 |
|------|------|
| `getCurrentProject()` | URL에서 colaboSrno 파싱 |
| `getGroupListFromDOM()` | DOM에서 그룹 목록 파싱 |
| `getGroupListAPI()` | API로 그룹 목록 조회 |

### CRUD API
| 함수 | 역할 |
|------|------|
| `callFlowAPI(endpoint, payload)` | Flow API 호출 |
| `createProjectAPI(data)` | 프로젝트 생성 |
| `createGroupAPI(name, colabo)` | 그룹 생성 |
| `createTaskAPI(data, colabo, section)` | Task 생성 |
| `createSubtaskAPI(sub, parent, colabo)` | Subtask 생성 |
| `moveTaskToGroupAPI(task, section, colabo)` | Task를 그룹으로 이동 |
| `updateTaskStatusAPI(task, status)` | Task 상태 변경 |
| `setTaskDepthAPI(parent, child, colabo)` | 부모-자식 관계 설정 |

### 마크다운 변환
| 함수 | 역할 |
|------|------|
| `contentToHtml(content)` | 마크다운 → HTML 전체 변환 |
| `convertTables(content)` | 테이블 변환 |
| `convertCodeBlocks(content)` | 코드 블록 변환 |
| `applyInlineStyles(text)` | **굵게**, *기울임*, `코드` |

### 복합 기능
| 함수 | 역할 |
|------|------|
| `createProjectWithAPI(data)` | 프로젝트+그룹+Task 일괄 생성 |
| `createSingleTask(data)` | 단일 Task 생성 |
| `addTasksToProject(data)` | 현재 프로젝트에 Task 추가 |

## Relations

- part_of [[flow-task-creator-extension]] (소속 프로젝트)
- data_flows_to [[flow-sidepanel]] (진행상황 메시지)