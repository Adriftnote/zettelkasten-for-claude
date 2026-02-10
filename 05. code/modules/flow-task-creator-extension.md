---
title: flow-task-creator-extension
type: module
level: high
category: "automation/workflow/task-creation"
semantic: "create flow tasks"
permalink: modules/flow-task-creator-extension
path: "working/worker/from-code/flow-task-creator/"
tags:
- chrome-extension
- manifest-v3
- flow-team
---

# flow-task-creator-extension

Flow.team에 Task/Subtask를 자동 생성하는 Chrome Extension

## 📖 개요

project.json 파일을 읽어 Flow.team 내부 API를 호출하여 프로젝트/그룹/Task를 일괄 생성. Side Panel UI로 진행상황 모니터링.

## Observations

- [impl] Manifest V3 기반, Side Panel + Content Script 구조 #pattern
- [impl] Flow.team 내부 API 직접 호출 (공식 API 없음) #algo
- [deps] chrome.runtime, chrome.sidePanel, fetch API #import
- [usage] Flow.team 페이지에서 Extension 아이콘 클릭 → Side Panel 열기 → JSON 업로드
- [note] Flow.team UI 변경 시 API 엔드포인트 확인 필요 #caveat

## 파일 구조

```
flow-task-creator/
├── manifest.json      ← Extension 설정
├── sidepanel.html/js  ← Side Panel UI
├── content.js         ← Flow.team DOM/API 조작
└── background.js      ← Service Worker
```

## 주요 로직

### Task 생성 흐름
```javascript
// 1. project.json 파싱
// 2. 프로젝트 ID 조회/생성
// 3. 그룹별 Task 생성 (순차)
// 4. Subtask 생성 (순차)
```

### API 호출
```javascript
// Flow.team 내부 API 사용
fetch('https://flow.team/api/tasks', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify(taskData)
})
```

## Relations

- part_of [[Flow 업무처리 자동화]] (소속 프로젝트)
- contains [[flow-content-script]] (DOM/API 조작)
- contains [[flow-sidepanel]] (UI 컨트롤러)
