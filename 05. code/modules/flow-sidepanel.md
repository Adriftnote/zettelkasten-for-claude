---
title: flow-sidepanel
type: module
permalink: modules/flow-sidepanel
level: low
category: automation/workflow/ui
semantic: control task creation
path: working/worker/from-code/flow-task-creator/sidepanel.js
tags:
- javascript
- sidepanel
- ui-controller
---

# flow-sidepanel

Flow Task Creator Side Panel UI 컨트롤러 (711줄, 20+개 함수)

## Observations

- [impl] 2개 탭: Task 직접 입력 / 프로젝트 JSON 업로드 #pattern
- [impl] project.json 파일 드래그앤드롭 지원 #pattern
- [impl] Content Script와 메시지 통신으로 Task 생성 제어 #pattern
- [impl] 진행상황 프로그레스바 + 로그 패널 표시 #pattern
- [deps] chrome.runtime, chrome.tabs, FileReader API #import

## 함수 목록 (주요)

### UI 제어
| 함수 | 역할 |
|------|------|
| `setStatus(msg, type)` | 상태 표시 업데이트 |
| `showProgress(title, cur, total, task)` | 프로그레스바 표시 |
| `hideProgress()` | 프로그레스바 숨기기 |
| `addLog(msg, type)` | 로그 추가 |

### Task 탭
| 함수 | 역할 |
|------|------|
| `loadGroupList()` | 그룹 목록 로드 |
| `handleCreateTask()` | Task 생성 (직접 입력) |
| `handleClearTask()` | 입력 초기화 |

### 프로젝트 탭
| 함수 | 역할 |
|------|------|
| `renderTaskDateList(json)` | JSON 파싱 후 날짜 UI 표시 |
| `mergeTaskDates(data)` | 입력 날짜를 data에 병합 |
| `showProjectSummary(data)` | 프로젝트 요약 표시 |
| `handleCreateProject()` | 프로젝트 생성/Tasks 추가 |

### 통신
| 함수 | 역할 |
|------|------|
| `sendToContentScript(action, data)` | Content Script에 메시지 전송 |
| `loadAuthInfo()` | 인증 정보 로드 |

## Relations

- part_of [[flow-task-creator-extension]] (소속 프로젝트)
- depends_on [[flow-content-script]] (Task 생성 위임)