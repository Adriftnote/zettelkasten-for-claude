---
title: flow-background-service
type: module
permalink: modules/flow-background-service
level: low
category: automation/workflow/service
semantic: control sidepanel messaging
path: working/worker/from-code/flow-task-creator/background.js
tags:
- javascript
- service-worker
- chrome-extension
---

# flow-background-service

Flow Task Creator Service Worker - Side Panel 제어 및 메시지 중계 (33줄)

## Observations

- [impl] action.onClicked로 Side Panel 열기 #pattern
- [impl] Content Script → Side Panel 메시지 중계 (progress, log) #pattern
- [impl] setPanelBehavior로 아이콘 클릭 시 자동 열기 설정 #pattern
- [deps] chrome.action, chrome.sidePanel, chrome.runtime #import
- [note] 단순 중계 역할, 복잡한 로직 없음 #context

## 동작

```
1. 확장 아이콘 클릭 → Side Panel 열기
2. Content Script에서 progress/log 메시지 수신 → Side Panel로 전달
```

## Relations

- part_of [[flow-task-creator-extension]] (소속 프로젝트)
- bridges [[flow-content-script]] (메시지 송신)
- bridges [[flow-sidepanel]] (메시지 수신)