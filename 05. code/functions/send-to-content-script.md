---
title: send-to-content-script
type: function
permalink: functions/send-to-content-script
level: low
category: automation/workflow/messaging
semantic: send message to content script
path: working/worker/from-code/flow-task-creator/sidepanel.js
tags:
- javascript
- chrome-extension
- messaging
---

# send-to-content-script

Side Panel에서 Content Script로 메시지 전송

## 시그니처

```javascript
async function sendToContentScript(
  action: string,
  data: object
): Promise<any>
```

## Observations

- [impl] chrome.tabs.query로 활성 탭 조회 #pattern
- [impl] flow.team 페이지인지 URL 검사 #algo
- [impl] chrome.tabs.sendMessage로 메시지 전송 #pattern
- [return] Content Script 응답
- [deps] chrome.tabs #import
- [note] flow.team 페이지가 아니면 에러 throw #caveat

## 코드

```javascript
async function sendToContentScript(action, data) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab) throw new Error('활성 탭을 찾을 수 없습니다');
  if (!tab.url?.includes('flow.team')) {
    throw new Error('Flow.team 페이지가 아닙니다');
  }
  
  return chrome.tabs.sendMessage(tab.id, { action, data });
}
```

## Relations

- part_of [[flow-sidepanel]] (소속 모듈)
- data_flows_to [[flow-content-script]] (메시지 전달)