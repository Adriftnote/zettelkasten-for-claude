---
title: send-to-webhook
type: function
permalink: functions/send-to-webhook
level: low
category: automation/sns/collection
semantic: send records to n8n webhook
path: C:\claude-workspace\working\projects\playwright-test\run-posts.js
tags:
- javascript
- n8n
- webhook
---

# send-to-webhook

수집된 게시물 레코드를 n8n webhook으로 POST 전송

## 시그니처

```javascript
async function sendToWebhook(records: Array<object>): Promise<void>
```

## Observations

- [impl] `records.length === 0`이면 즉시 return (빈 배열 전송 방지) #pattern
- [impl] `{ data: records, extractedAt: new Date().toISOString() }` 형식으로 JSON body 구성 #pattern
- [impl] n8n Split Out 노드가 HTTP 500 반환하지만 body에 `"code":0` 있으면 정상 처리 — 조건부 에러 무시 #caveat
- [return] void — 성공 시 아무것도 반환하지 않음, 실패 시 throw
- [deps] fetch API (Node.js 18+) #import

## Relations

- part_of [[run-posts-collector]] (소속 모듈)
- called_by [[run-main]] (line 532)
- data_flows_to [[n8n-webhook-workflow]] (post_view_snapshots 저장)