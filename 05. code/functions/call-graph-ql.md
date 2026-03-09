---
title: call-graph-ql
type: function
permalink: 05.-code/functions/call-graph-ql
level: low
category: data/sns/analytics
semantic: post meta graphql request and parse response
path: C:/claude-workspace/working/projects/playwright-test/run-posts.js
tags:
- javascript
- graphql
- meta
---

# callGraphQL

Meta Business API GraphQL endpoint에 variables를 POST하고 멀티라인 JSON 응답을 파싱하는 헬퍼 함수. collectMeta 내부 클로저.

## 시그니처

```javascript
async function callGraphQL(variables: object): Promise<object[]>
```

## Observations

- [impl] `URLSearchParams`로 `doc_id`, `variables`, `fb_dtsg`, `lsd`, `__a=1` 인코딩 후 POST — application/x-www-form-urlencoded #pattern
- [impl] 응답 텍스트에서 `for(;;);` 제거 후 줄별 JSON.parse — FB API JSONP 방어 코드 처리 #algo
- [impl] variables에 `count: 500` 포함 시 최대 500개 게시물 요청 — fetchEdges에서 주입 #algo
- [return] 파싱된 JSON 객체 배열 — 1개 또는 복수 chunk로 구성
- [note] `collectMeta` 내부 클로저 — `fb_dtsg`, `lsd` 클로저 캡처로 직접 호출 불가 #caveat

## Relations

- part_of [[run-posts]] (소속 모듈)
- called_by [[fetch-edges]] (line 458)