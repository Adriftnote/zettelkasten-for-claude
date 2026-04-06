---
title: collect-channels
type: module
permalink: modules/collect-channels
level: high
category: data/sns/channel-summary
semantic: collect channel daily summary
path: C:/claude-workspace/working/projects/playwright-test/collect-channels.js
tags:
- javascript
- playwright
- sns
- webhook
- facebook
- x-twitter
- naver-blog
---

# collect-channels

Facebook, X(Twitter), 네이버 블로그 3개 플랫폼의 채널 레벨 일별 통계를 Playwright로 수집하여 n8n webhook으로 전송하는 채널 요약 수집 모듈.

## 개요

Playwright 퍼시스턴트 컨텍스트로 로그인 세션을 유지하며, `page.evaluate()` 안에서 각 플랫폼 내부 API를 직접 호출한다. 수집된 데이터는 `{date, platform, views, interactions, followers_diff}` 구조로 정규화하여 n8n webhook → `daily_channel_summary` DB에 저장한다.

## Observations

- [impl] Facebook: page.evaluate 내부에서 DTSGInitialData 토큰 + pageID 추출 → GraphQL doc_id 3종 병렬 호출(views/interactions/followers) #algo
- [impl] X: ct0 쿠키 + 공개 Bearer 토큰 → AccountOverviewQuery GraphQL GET #algo
- [impl] Naver Blog: admin.blog iframe → prev 버튼 7회 클릭 → 날짜별 DOM 파싱 (확정 데이터만 수집) #algo
- [impl] `normalizeForWebhook(platform, rawData)` — 플랫폼별 raw → `{date, platform, views, interactions, followers_diff}` 정규화, Extension popup.js와 동일 스키마 #pattern
- [deps] `playwright.chromium`, `path` (Node.js 내장) #import
- [usage] `node collect-channels.js` — Task Scheduler 1시간 주기 자동 실행 #usage
- [note] 파일명 변경: run.js → collect-channels.js (2026-03-10) #context
- [note] Facebook GraphQL doc_id: 25139519128986465(views), 24296175803410872(interactions), 24470603935939530(followers) #context
- [note] X Bearer 토큰은 공개 토큰 (모든 X 웹앱 공유) — 로그인 세션과 별개 #context

## 플랫폼별 수집 전략

| 플랫폼 | 접근 방식 | 수집 데이터 |
|--------|---------|-----------|
| Facebook | page.evaluate → GraphQL 3종 병렬 | views, interactions, followers (7일) |
| X | page.evaluate → AccountOverviewQuery GET | impressions, engagements, follows (7일) |
| Naver Blog | iframe frame → DOM 파싱 | views, likes, comments, neighbors (7일) |

## 레코드 스키마

```js
{
  date: string,              // "YYYY-MM-DD"
  platform: 'facebook' | 'x' | 'naver',
  views: number,
  interactions: number,
  followers_diff: number
}
```

## Relations
- part_of [[SNS 게시물별 조회수 추적]] (소속 프로젝트)
- contains [[normalize-for-webhook]]
- contains [[send-to-webhook]]
- contains [[collect-meta-ads-daily]]
- contains [[run-channel-collector]]
- contains [[call-graph-ql]]
- contains [[find-prev-button]]
- contains [[extract-current-day]]
  - extract-current-day calls [[find-prev-button]] (line 452)
  - extract-current-day calls [[collect-meta-ads-daily]] (line 484)
  - extract-current-day calls [[normalize-for-webhook]] (line 531)
  - extract-current-day calls [[send-to-webhook]] (line 532)
  - extract-current-day calls [[run-channel-collector]] (line 565)
- data_flows_to [[n8n webhook]] (daily-channel-summary, ad-metrics-atomic, collect-alert)
- depends_on [[playwright]]
- part_of [[playwright-sns-collector]] (상위 모듈 그룹)
## collect-channels
# collect-channels

Facebook, X(Twitter), 네이버 블로그, Meta Ads Daily 4개 소스의 채널 레벨 일별 통계를 Playwright로 수집하여 n8n webhook으로 전송하는 채널 요약 수집 모듈. 수집 실패 시 이메일 알림 전송.

## 개요

Playwright 퍼시스턴트 컨텍스트로 로그인 세션을 유지하며, `page.evaluate()` 안에서 각 플랫폼 내부 API를 직접 호출한다. 수집된 데이터는 `{date, platform, views, interactions, followers_diff}` 구조로 정규화하여 n8n webhook → `daily_channel_summary` DB에 저장한다. Meta Ads는 am_tabular API 전체 필드를 EAV 형태로 `ad_metrics_atomic` DB에 일별 저장한다.

## Observations

- [impl] Facebook: page.evaluate 내부에서 DTSGInitialData 토큰 + pageID 추출 → GraphQL doc_id 3종 병렬 호출(views/interactions/followers) #algo
- [impl] X: ct0 쿠키 + 공개 Bearer 토큰 → AccountOverviewQuery GraphQL GET #algo
- [impl] Naver Blog: admin.blog iframe → prev 버튼 7회 클릭 → 날짜별 DOM 파싱 (확정 데이터만 수집) #algo
- [impl] Meta Ads Daily: collectMetaAdsDaily → am_tabular API 48+ 필드 호출 → atomic + action breakdown → EAV 변환 (captured_at: YYYY-MM-DD) #algo
- [impl] `normalizeForWebhook(platform, rawData)` — 플랫폼별 raw → `{date, platform, views, interactions, followers_diff}` 정규화 #pattern
- [impl] 실패 알림: results에서 success:false 필터 → ALERT_WEBHOOK_URL로 subject/html 전송 → n8n → Gmail #pattern
- [deps] `playwright.chromium`, `path` (Node.js 내장) #import
- [usage] `node collect-channels.js` — scheduler.js가 1시간 주기 실행 #usage
- [note] ALERT_WEBHOOK_URL: collect-alert → n8n 워크플로우(xkq4OyyRpC6fkjBl) → Gmail(alerts@example.com) #context
- [note] AD_WEBHOOK_URL: ad-metrics-atomic → 100건씩 배치 전송, n8n 500 반환하지만 데이터 저장됨 #context
- [note] Meta Ads captured_at은 date-only(YYYY-MM-DD)로 hourly(YYYY-MM-DDTHH:00:00)와 구분 #context

## 플랫폼별 수집 전략

| 플랫폼 | 접근 방식 | 수집 데이터 |
|--------|---------|-----------| 
| Facebook | page.evaluate → GraphQL 3종 병렬 | views, interactions, followers (7일) |
| X | page.evaluate → AccountOverviewQuery GET | impressions, engagements, follows (7일) |
| Naver Blog | iframe frame → DOM 파싱 | views, likes, comments, neighbors (7일) |
| Meta Ads | page.evaluate → am_tabular API | 48+ 필드, EAV 형태 (7일, 일별) |

## 레코드 스키마

```js
// daily_channel_summary
{
  date: string,              // "YYYY-MM-DD"
  platform: 'facebook' | 'x' | 'naver',
  views: number,
  interactions: number,
  followers_diff: number
}

// ad_metrics_atomic (EAV)
{
  captured_at: string,       // "YYYY-MM-DD" (일별)
  platform: 'meta',
  ad_id: string,
  ad_name: string,
  metric_type: string,       // "impressions" or "actions:link_click"
  value: number
}
```