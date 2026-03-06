---
title: collect-meta
type: function
permalink: functions/collect-meta
level: low
category: automation/sns/collection
semantic: collect meta facebook instagram post views via graphql
path: C:\claude-workspace\working\projects\playwright-test\run-posts.js
tags:
- javascript
- playwright
- meta
- facebook
- instagram
---

# collect-meta

Meta(Facebook+Instagram) 게시물 조회수 통합 수집 (GraphQL)

## 시그니처

```javascript
async function collectMeta(page: Page, capturedAt: string): Promise<Array<object>>
```

## Observations

- [impl] `business.facebook.com/latest/insights/content` 접속 후 HTML에서 fb_dtsg, lsd, pageId(asset_id 또는 pageID) 추출 #algo
- [impl] `page.evaluate()` 내부에 `callGraphQL`, `fetchEdges` 중첩 함수 정의 — 브라우저 컨텍스트에서 직접 실행 #pattern
- [impl] GraphQL doc_id `34106016262374963` (tofu_unified_table), timeRange LAST_7D→LAST_28D→LAST_90D fallback #algo
- [impl] `resp.text()` 후 `for (;;);` 프리픽스 제거, 줄 단위로 JSON.parse — n8n 스타일 다중 응답 처리 #caveat
- [impl] `node.fields.views.renderer.result.value` 경로로 조회수 추출 #pattern
- [return] platform='meta' 레코드 배열 (최대 10개, FB+IG 통합)
- [note] 이전 버전(initMeta + collectMetaFB + collectMetaIG 분리)에서 단일 함수로 리팩터링됨 #context
- [note] FB와 IG 게시물을 같은 GraphQL 엔드포인트에서 가져옴 — ids=[pageId]로 통합 쿼리 #context

## 내부 중첩 함수

- `callGraphQL(variables)` — GraphQL POST 호출, `for (;;);` 프리픽스 처리
- `fetchEdges(range)` — callGraphQL 래퍼, timeRange 파라미터 추상화

## Relations

- part_of [[run-posts-collector]] (소속 모듈)
- called_by [[run-main]] (line 508)
- contains [[call-graph-ql]]
- contains [[fetch-edges]]