---
title: background-service-worker
type: module
permalink: modules/background-service-worker
level: low
category: automation/sns/webhook
semantic: send webhook request
path: working/worker/from-code/social-analytics-extractor/background.js
tags:
- javascript
- service-worker
- webhook
---

# background-service-worker

Chrome Extension Service Worker - n8n webhook 호출 담당 (74줄, 2개 함수)

## Observations

- [impl] popup.js로부터 메시지 받아 fetch로 webhook 호출 #algo
- [impl] sendToWebhook, testWebhook 두 가지 액션 처리 #pattern
- [return] { success: boolean, result/error }
- [deps] chrome.runtime, chrome.storage, fetch API #import
- [note] webhook URL은 chrome.storage.sync에 저장 #context

## 함수 목록

| 함수 | 역할 |
|------|------|
| `sendToN8n(data)` | webhook으로 데이터 POST 전송 |
| `testWebhookConnection(url)` | 테스트 데이터로 연결 확인 |

## 메시지 핸들링

```javascript
// action: 'sendToWebhook' → sendToN8n(data)
// action: 'testWebhook' → testWebhookConnection(url)
```

## Relations

- part_of [[social-analytics-extractor]] (소속 프로젝트)
- depends_on [[x-extractor]] (X 데이터 수신)
- depends_on [[facebook-extractor]] (Facebook 데이터 수신)
- depends_on [[naver-extractor]] (Naver 데이터 수신)