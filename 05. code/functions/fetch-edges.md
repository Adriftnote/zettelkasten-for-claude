---
title: fetch-edges
type: function
permalink: functions/fetch-edges
level: low
category: automation/sns/collection
semantic: fetch graphql edges for given time range
path: C:\claude-workspace\working\projects\playwright-test\run-posts.js
tags:
- javascript
- meta
- graphql
---

# fetch-edges

Meta GraphQL tofu_unified_table edges 조회 (timeRange 래퍼)

## 시그니처

```javascript
async function fetchEdges(range: string): Promise<Array<object>>
```

## Observations

- [impl] `callGraphQL`에 pageId, count=10, callerID="BIZWEB_INSIGHTS_ORGANIC_CONTENT" 조합 전달 #pattern
- [impl] 청크 응답에서 `data.tofu_unified_table.content.edges` 추출 후 병합 #algo
- [return] edges 배열 (각 edge는 node.header, node.fields.views 포함)
- [usage] `LAST_7D`, `LAST_28D`, `LAST_90D` 순서로 fallback 호출

## Relations

- part_of [[collect-meta]] (소속 함수)
- calls [[call-graph-ql]] (line 401)