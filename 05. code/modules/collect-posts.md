---
title: collect-posts
type: module
permalink: modules/collect-posts
tags:
- javascript
- playwright
- sns
- webhook
- youtube
- naver-tv
- naver-blog
- meta
- tiktok
- meta-ads
level: high
category: data/sns/post-snapshot
semantic: collect post view snapshots
path: C:/claude-workspace/working/projects/playwright-test/collect-posts.js
---

# collect-posts

YouTube, 네이버TV, 네이버 블로그, Meta(Facebook+Instagram), TikTok, Meta Ads 6개 플랫폼의 게시물별 조회수를 1시간 주기로 스냅샷 수집하여 n8n webhook으로 전송하는 모듈. 수집 실패 시 이메일 알림 전송.

## 개요

Playwright 퍼시스턴트 컨텍스트로 로그인 세션을 유지하며, 각 플랫폼 스튜디오/내부 API에서 최근 게시물의 조회수를 추출한다. capturedAt은 시간 단위 반올림(KST YYYY-MM-DDTHH:00:00)하여 시간대별 성장 곡선 분석용 데이터를 축적한다. allRecords(조회수)와 adRecords(광고 성과)를 각각 별도 webhook으로 전송한다.

## Observations

- [impl] YouTube: studio.youtube.com API → channelId 추출 → /youtubei/v1/analytics_data/join 호출 → 게시물별 VIEWS #algo
- [impl] Naver TV: tv.naver.com 내부 API → channelNo 추출 → /api/clipmeta 호출 → 클립별 viewCount #algo
- [impl] Naver Blog: blog.naver.com → blog.stat.naver.com/blog/rank/content → 게시물 순위별 조회수 #algo
- [impl] Meta: page.evaluate → fb_dtsg + pageId → GraphQL fetchEdges → tofu_unified_table → 게시물별 views #algo
- [impl] TikTok: tiktok.com/creator → /api/post/list API → 게시물별 playCount #algo
- [impl] Meta Ads: page.evaluate → access_token + act_id → am_tabular API → 광고별 8개 성과 메트릭 (EAV) #algo
- [impl] getCapturedAt(): KST 시간 단위 반올림 → "YYYY-MM-DDTHH:00:00" #pattern
- [impl] 실패 알림: results에서 success:false 필터 → ALERT_WEBHOOK_URL로 subject/html 전송 → n8n → Gmail #pattern
- [deps] `playwright.chromium`, `path` (Node.js 내장) #import
- [usage] `node collect-posts.js` — scheduler.js가 1시간 주기 실행 #usage
- [note] 각 플랫폼은 독립적 try/catch — 하나 실패해도 나머지 계속 수집 #context
- [note] allRecords(조회수)와 adRecords(광고 EAV)는 별도 webhook으로 전송 #context
- [note] ALERT_WEBHOOK_URL: collect-alert → n8n(xkq4OyyRpC6fkjBl) → Gmail #context
- [note] Meta Ads capturedAt은 시간 단위(YYYY-MM-DDTHH:00:00), collect-channels의 일별(YYYY-MM-DD)과 구분 #context

## 플랫폼별 수집 전략

| 플랫폼 | 접근 방식 | 수집 데이터 |
|--------|---------|-----------| 
| YouTube | studio.youtube.com → analytics_data API | 게시물별 views (최근 3개) |
| Naver TV | tv.naver.com → clipmeta API | 클립별 viewCount (최근 3개) |
| Naver Blog | blog.stat → rank/content API | 게시물별 views (상위 목록) |
| Meta | page.evaluate → GraphQL tofu_unified_table | 게시물별 views (최근) |
| TikTok | creator → /api/post/list | 게시물별 playCount (최근 3개) |
| Meta Ads | adsmanager → am_tabular API | 광고별 8개 메트릭 EAV |

## 레코드 스키마

```js
// post_view_snapshots (allRecords)
{
  platform: string,          // "youtube" | "naver_tv" | "naver_blog" | "meta" | "tiktok"
  post_id: string,
  post_title: string,
  view_count: number,
  captured_at: string        // "YYYY-MM-DDTHH:00:00" (시간 단위)
}

// ad_metrics_atomic (adRecords)
{
  captured_at: string,       // "YYYY-MM-DDTHH:00:00" (시간 단위)
  platform: 'meta',
  ad_id: string,
  ad_name: string,
  metric_type: string,       // "impressions", "cpc", etc.
  value: number
}
```

## Relations
- part_of [[SNS 게시물별 조회수 추적]] (소속 프로젝트)
- contains [[get-captured-at]]
- contains [[send-to-webhook]]
- contains [[collect-you-tube]]
- contains [[collect-naver-tv]]
- contains [[collect-naver-blog]]
- contains [[collect-meta]]
- contains [[collect-tik-tok]]
- contains [[collect-meta-ads]]
- contains [[call-graph-ql]]
- contains [[fetch-edges]]
- contains [[run]]
  - fetch-edges calls [[call-graph-ql]] (line 460)
  - run calls [[get-captured-at]] (line 628)
  - run calls [[collect-you-tube]] (line 649)
  - run calls [[collect-naver-tv]] (line 660)
  - run calls [[collect-naver-blog]] (line 671)
  - run calls [[collect-meta]] (line 682)
  - run calls [[collect-tik-tok]] (line 693)
  - run calls [[collect-meta-ads]] (line 704)
  - run calls [[send-to-webhook]] (line 717)
- data_flows_to [[n8n webhook]] (post-view-snapshots, ad-metrics-atomic, collect-alert)
- depends_on [[playwright]]
- part_of [[playwright-sns-collector]] (상위 모듈 그룹)