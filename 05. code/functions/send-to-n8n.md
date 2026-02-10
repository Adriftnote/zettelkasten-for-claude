---
title: send-to-n8n
type: function
permalink: functions/send-to-n8n
level: low
category: automation/sns/webhook
semantic: send data to webhook
path: working/worker/from-code/social-analytics-extractor/background.js
tags:
- javascript
- webhook
- fetch
---

# send-to-n8n

n8n webhook으로 데이터 POST 전송

## 시그니처

```javascript
async function sendToN8n(data: object): Promise<object>
```

## Observations

- [impl] chrome.storage.sync에서 webhookUrl 가져옴 #pattern
- [impl] POST JSON으로 데이터 전송 #algo
- [return] n8n 응답 JSON 또는 { message: 'OK' }
- [deps] chrome.storage.sync, fetch API #import
- [note] URL 미설정 시 에러 throw #caveat

## 코드

```javascript
async function sendToN8n(data) {
  const { webhookUrl } = await chrome.storage.sync.get('webhookUrl');
  
  if (!webhookUrl) {
    throw new Error('Webhook URL이 설정되지 않았습니다.');
  }
  
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  return await response.json();
}
```

## Relations

- part_of [[background-service-worker]] (소속 모듈)