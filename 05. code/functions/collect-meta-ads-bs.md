---
title: collect-meta-ads-bs
type: function
permalink: 05.-code/functions/collect-meta-ads-bs
level: low
category: data/sns/analytics
semantic: collect meta ads view count lifetime snapshot
path: C:/claude-workspace/working/projects/playwright-test/collect-posts.js
tags:
- javascript
- playwright
- meta
- ads
- business-suite
---

# collectMetaAdsBS

Meta Business Suite의 content_ads 페이지에서 광고별 VIEW(LIFETIME 누적)를 스냅샷 수집하는 함수. collectMeta(오가닉)와 동일한 tofu_unified_table GraphQL API를 사용하되, callerID가 `BIZWEB_INSIGHTS_CONTENT_TABLE_ADS`로 다름.

## 시그니처

```javascript
async function collectMetaAdsBS(page: Page, capturedAt: string): Promise<object[]>
```

## Observations

- [impl] `business.facebook.com/latest/insights/content_ads` 접속 후 HTML에서 `fb_dtsg`, `lsd` 추출 — regex 파싱 #algo
- [impl] `AD_ACCOUNT_NODE = '120238442146380023'` 하드코딩 — 실제 광고 집행 계정의 internal node ID #context
- [impl] `doc_id: '34106016262374963'` 고정 — collectMeta(오가닉)와 동일한 tofu_unified_table 쿼리 #algo
- [impl] `timeRange: {type: 'LIFETIME'}` 고정 — VIEW는 항상 LIFETIME 누적값 (REF-101 실증) #pattern
- [impl] `visibleColumnKeys: ['TITLE','DELIVERY','SPEND','VIEWS','VIEWERS']` — BS가 반환하는 5개 컬럼 #algo
- [impl] 응답 첫 줄만 JSON.parse (광고는 단일 청크) — `for(;;);` 제거 후 newline split #algo
- [return] `{platform:'meta_ads', post_id, post_title, view_count, captured_at}[]` — 오가닉과 동일 스키마로 통합
- [usage] `const records = await collectMetaAdsBS(page, capturedAt);`
- [note] 이전 collectMetaAds(am_tabular API)를 대체 — BS의 "조회수" 공식 숫자가 대시보드 기준 #context
- [note] VIEW=LIFETIME 누적이므로 스냅샷 차분으로 시간대별 증분 산출 (collect-channels.js의 daily Ads API와 역할 분리) #context
- [note] Ads Manager am_tabular 52개 메트릭 daily 수집은 collect-channels.js의 collectMetaAdsDaily가 담당 #context

## Relations

- part_of [[collect-posts]] (소속 모듈)
- called_by [[run]] (line 671)
- replaces [[collect-meta-ads-bs]] (am_tabular → BS content_ads로 교체, 2026-03-12)
- relates_to [[collect-meta]] (동일 API 패턴, callerID만 다름)
- relates_to [[REF-101 Meta BS time_range 동작 원리 — VIEW는 항상 LIFETIME 누적]] (VIEW=LIFETIME 실증 근거)