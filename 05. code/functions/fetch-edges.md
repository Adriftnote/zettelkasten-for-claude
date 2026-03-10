---
title: fetch-edges
type: function
permalink: 05.-code/functions/fetch-edges
level: low
category: data/sns/analytics
semantic: fetch meta tofu unified table content edges
path: C:/claude-workspace/working/projects/playwright-test/collect-posts.js
tags:
- javascript
- graphql
- meta
---

# fetchEdges

Meta tofu_unified_table의 content edges를 특정 시간 범위로 수집하는 래퍼 함수. collectMeta 내부 클로저.

## 시그니처

```javascript
async function fetchEdges(range: 'LIFETIME' | 'LAST_90D'): Promise<object[]>
```

## Observations

- [impl] `callGraphQL`을 호출하여 `timeRange: {type: range}` 조건으로 요청, 응답 chunks에서 `data.tofu_unified_table.content.edges` 수집 #algo
- [impl] `count: 500` 포함 — `callGraphQL` variables에 전달되어 최대 500개 게시물 요청 #algo
- [impl] 복수 chunk 처리: for...of로 각 chunk edges를 하나의 배열로 누적 #pattern
- [return] edge 객체 배열 — `node.header.entity`, `node.fields.views.renderer.result.value` 포함
- [note] `collectMeta` 내부 클로저 — `pageId`, `callGraphQL` 클로저 캡처로 직접 호출 불가 #caveat
- [note] range 값: `LIFETIME`(전체 기간) 또는 `LAST_90D`(90일) — collectMeta에서 LIFETIME 우선, 빈 배열 시 LAST_90D fallback #context

## Relations

- part_of [[collect-posts]] (소속 모듈 — collectMeta 내부 클로저)
- calls [[call-graph-ql]] (line 458)
- called_by [[collect-meta]] (내부 fallback 체인에서 3회 호출)