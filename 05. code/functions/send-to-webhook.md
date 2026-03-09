---
title: send-to-webhook
type: function
permalink: 05.-code/functions/send-to-webhook
level: low
category: data/sns/analytics
semantic: post records to n8n webhook
path: C:/claude-workspace/working/projects/playwright-test/run-posts.js
tags:
- javascript
- webhook
---

# sendToWebhook

수집된 레코드 배열을 n8n webhook endpoint에 JSON POST로 전송하는 함수.

## 시그니처

```javascript
async function sendToWebhook(records: object[]): Promise<void>
```

## Observations

- [impl] `{data: records, extractedAt: ISO}` 구조로 POST — n8n Split Out 노드가 data 배열 분해 #pattern
- [impl] HTTP 500이라도 응답 body에 `"code":0` 포함 시 정상 처리로 판단 — n8n Split Out 특이 동작 대응 #caveat
- [return] void — 전송 실패 시 Error throw, run()에서 catch 처리
- [usage] `await sendToWebhook(allRecords);` — 전 플랫폼 수집 완료 후 일괄 전송
- [note] records가 빈 배열이면 즉시 return (전송 생략) #pattern

## Relations

- part_of [[run-posts]] (소속 모듈)
- called_by [[run]] (line 589)
- data_flows_to [[n8n webhook]] (post-view-snapshots)