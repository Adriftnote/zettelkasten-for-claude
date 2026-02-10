---
title: new-task-json
type: function
permalink: functions/new-task-json
level: low
category: automation/workflow/generator
semantic: create task json
path: working/worker/from-code/flow-task-creator/FlowGenerator.ps1
tags:
- powershell
- json-generator
---

# new-task-json

선택한 Task들을 JSON 파일로 변환하는 PowerShell 함수

## 📖 시그니처

```powershell
function New-TaskJson → void
```

## Observations

- [impl] 다중 선택 메뉴로 Task 선택 (Space 토글, Enter 확정) #pattern
- [impl] 단일 선택 시 task.json (객체), 다중 선택 시 tasks.json (groups 구조) #algo
- [impl] 힌트 파일(.txt/.md) 내용을 content 필드에 포함 #pattern
- [impl] 그룹별로 Task 자동 분류 #algo
- [deps] ConvertTo-Json, Get-ChildItem #import

## 출력 형식

### 단일 Task (task.json)
```json
{
  "title": "1. 업무명",
  "group": "1. 그룹명",
  "content": "## 방법\n1. ...",
  "subtasks": [...]
}
```

### 다중 Task (tasks.json)
```json
{
  "useGroups": true,
  "groups": [
    {
      "title": "1. 그룹명",
      "tasks": [...]
    }
  ]
}
```

## Relations

- part_of [[flow-generator-cli]] (소속 모듈)
- output_to [[flow-content-script]] (생성된 JSON을 Extension이 사용)