---
title: call-graph-ql
type: function
permalink: functions/call-graph-ql
level: low
category: automation/sns/collection
semantic: call meta graphql api with dtsg auth
path: C:\claude-workspace\working\projects\playwright-test\run-posts.js
tags:
- javascript
- meta
- graphql
---

# call-graph-ql

Meta GraphQL API POST 호출 (collectMeta 내부 중첩 함수)

## 시그니처

```javascript
async function callGraphQL(variables: object): Promise<Array<object>>
```

## Observations

- [impl] `URLSearchParams`로 `doc_id`, `variables`, `fb_dtsg`, `lsd`, `__a=1` 구성하여 POST #algo
- [impl] `application/x-www-form-urlencoded` Content-Type, `credentials: include` #pattern
- [impl] 응답 텍스트에서 `for (;;);` 프리픽스 제거 후 줄 단위로 JSON.parse — 파싱 실패 행 무시 #caveat
- [return] 파싱된 JSON 객체 배열 (복수 응답 청크)
- [note] `page.evaluate()` 클로저 내부에 정의 — fb_dtsg, lsd, pageId 클로저 캡처 #context

## Relations

- part_of [[collect-meta]] (소속 함수)
- called_by [[fetch-edges]] (line 401)