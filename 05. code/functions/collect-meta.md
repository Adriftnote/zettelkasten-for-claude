---
title: collect-meta
type: function
permalink: 05.-code/functions/collect-meta
level: low
category: data/sns/analytics
semantic: collect meta facebook instagram post view counts
path: C:/claude-workspace/working/projects/playwright-test/collect-posts.js
tags:
- javascript
- playwright
- meta
- facebook
- instagram
---

# collectMeta

Meta Business Suite의 GraphQL API를 통해 Facebook + Instagram 통합 게시물 조회수를 수집하는 함수.

## 시그니처

```javascript
async function collectMeta(page: Page, capturedAt: string): Promise<object[]>
```

## Observations

- [impl] `business.facebook.com/latest/insights/content` 접속 후 HTML에서 `fb_dtsg`, `lsd`, `pageId(asset_id/pageID)` 추출 — regex 파싱 #algo
- [impl] `page.evaluate()` 내에서 `callGraphQL` + `fetchEdges` 중첩 클로저 — `fb_dtsg`, `lsd`, `pageId`를 클로저로 캡처 #pattern
- [impl] `doc_id: '34106016262374963'` 고정 — `tofu_unified_table` 쿼리 (FB+IG 통합 콘텐츠 테이블) #algo
- [impl] `LIFETIME` 우선 조회, edges 빈 배열이면 `LAST_90D`로 fallback — 전체 게시물 확보 목적 #pattern
- [impl] `count: 500`으로 최대 게시물 수 요청 (기존 기본값 대비 수집량 확대) #algo
- [impl] 응답 body에서 `for(;;);` 제거 후 줄별 JSON.parse — JSONP 방어 코드 처리 #algo
- [return] `{platform:'meta', post_id, post_title, view_count, captured_at}[]` — FB와 IG 통합 (entity_type 미분리)
- [usage] `const records = await collectMeta(page, capturedAt);`
- [note] FB/IG 분리 미구현 — `tofu_unified_table`이 통합 반환, entity_type 필터 또는 별도 API 필요 (보류) #caveat
- [note] `LIFETIME` range가 빈 배열 반환 시 `LAST_90D` fallback — 계정 설정에 따라 LIFETIME 미지원 가능 #caveat

## Relations

- part_of [[collect-posts]] (소속 모듈)
- called_by [[run]] (line 565)
- contains [[call-graph-ql]]
- contains [[fetch-edges]]