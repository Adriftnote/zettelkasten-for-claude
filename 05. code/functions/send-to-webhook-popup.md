---
title: send-to-webhook-popup
type: function
permalink: functions/send-to-webhook-popup
level: low
category: automation/sns/webhook
semantic: send data to webhook
path: working/worker/from-code/social-analytics-extractor/popup.js
tags:
- javascript
- chrome-runtime
- webhook
---

# send-to-webhook-popup

팝업에서 n8n webhook으로 데이터 전송하는 함수

## 📖 시그니처

```javascript
async function sendToWebhook(data) → void
```

## Observations

- [impl] chrome.storage.sync에서 webhookUrl 조회 #pattern
- [impl] background.js로 메시지 전송하여 실제 fetch 위임 #pattern
- [impl] 성공/실패 상태를 UI에 표시 #pattern
- [deps] chrome.storage.sync, chrome.runtime #import
- [note] 실제 HTTP 호출은 background.js에서 수행 #context

## 로직

```javascript
async function sendToWebhook(data) {
  const { webhookUrl } = await chrome.storage.sync.get('webhookUrl');
  if (!webhookUrl) return;

  const response = await chrome.runtime.sendMessage({
    action: 'sendToWebhook',
    data: {
      platform: currentPlatform,
      data: data,
      extractedAt: new Date().toISOString()
    }
  });
  // UI 상태 업데이트...
}
```

## Relations

- part_of [[popup-controller]] (소속 모듈)
- calls [[send-to-n8n]] (background.js의 실제 전송 함수)