---
title: collect-posts
type: note
permalink: 05.-code/modules/collect-posts
tags:
- javascript
- playwright
- sns
- webhook
---

# collect-posts

5개 SNS 플랫폼(YouTube, 네이버TV, 네이버 블로그, Meta, TikTok) 게시물 조회수를 Playwright로 수집하여 n8n webhook으로 전송하는 메인 모듈.

## 개요

Playwright 퍼시스턴트 컨텍스트를 사용하여 로그인 세션을 유지하며, 각 플랫폼의 크리에이터 스튜디오 내부 API(직접 호출 또는 응답 가로채기)를 통해 게시물별 조회수를 추출한다. 수집된 레코드는 `{platform, post_id, post_title, view_count, captured_at}` 구조로 일괄 webhook 전송한다.

## Observations

- [impl] Playwright 퍼시스턴트 컨텍스트(`playwright-data/` 디렉토리)로 세션 쿠키 재사용 — 매 실행마다 로그인 불필요 #pattern
- [impl] 플랫폼별 수집 전략: 네이버TV/Meta = 직접 API fetch, YouTube/TikTok = `page.on('response')` 가로채기, 네이버 블로그 = iframe 내 API 호출 #algo
- [impl] YouTube: `videos/upload`(동영상)와 `videos/short`(Shorts) 탭 순차 수집, `#navigate-after` 버튼으로 페이징(최대 20페이지), 중복 post_id 제거 #algo
- [impl] TikTok: item_list API 응답 가로채기, 응답 없을 시 DOM fallback(`a[href*="/video/"]` 텍스트 파싱) #algo
- [impl] 네이버 블로그: `daily_total`(post_id='daily_total') 전체 조회수 레코드 + 개별 게시물 레코드 동시 수집 #pattern
- [impl] Meta: `callGraphQL`/`fetchEdges`는 `collectMeta` 내부 `page.evaluate` 클로저 — 인라인 함수, 별도 모듈 레벨 함수 아님. doc_id `34106016262374963` 사용 #pattern
- [impl] Meta: LIFETIME 범위로 전체 게시물 조회, 0건이면 LAST_90D fallback #algo
- [impl] `captured_at`은 KST 기준 시간 단위 반올림 ISO 문자열 — 동일 시간대 레코드 식별용 #pattern
- [impl] `YOUTUBE_CHANNEL_ID = 'UCWpvotHqOrqnaT_cielUzRQ'` 상수 하드코딩 (line 193) #context
- [deps] `playwright.chromium`, `path` (Node.js 내장) #import
- [usage] `node collect-posts.js` — Task Scheduler 1시간 주기 자동 실행 #usage
- [note] n8n webhook이 Split Out 노드로 500 응답 반환하더라도 `"code":0` 포함 시 정상 처리로 간주 #caveat
- [note] 각 플랫폼 수집은 독립 try-catch — 일부 실패해도 나머지 수집 + webhook 전송 계속 #pattern
- [note] 파일명 변경: run-posts.js → collect-posts.js (2026-03-10) #context

## 플랫폼별 수집 전략

| 플랫폼 | 접근 방식 | 엔드포인트 | 비고 |
|--------|----------|----------|------|
| 네이버TV | page.evaluate → fetch | apis.naver.com creator-studio-web | channelId URL/HTML 자동 추출 |
| 네이버 블로그 | iframe frame → fetch | blog.stat.naver.com cvContentPc | daily_total + 개별 게시물 수집 |
| YouTube | response 가로채기 | studio.youtube.com list_creator_videos | 동영상+Shorts 탭 분리, 페이징 지원 |
| TikTok | response 가로채기 + DOM fallback | /creator/manage/item_list/v1 | API 없을 시 a[href*="/video/"] 파싱 |
| Meta | page.evaluate → fetch (인라인 클로저) | business.facebook.com/api/graphql/ | doc_id 34106016262374963, LIFETIME→LAST_90D fallback |

## 레코드 스키마

```js
{
  platform: 'youtube' | 'naver_tv' | 'naver_blog' | 'meta' | 'tiktok',
  post_id: string,
  post_title: string,
  view_count: number,
  captured_at: string    // KST 시간 단위 반올림 ISO (e.g., "2026-03-09T15:00:00")
}
```

## Relations

- part_of [[SNS 게시물별 조회수 추적]] (소속 프로젝트)
- contains [[get-captured-at]]
- contains [[send-to-webhook]]
- contains [[collect-naver-tv]]
- contains [[collect-naver-blog]]
- contains [[collect-you-tube]]
- contains [[collect-tik-tok]]
- contains [[collect-meta]]
- contains [[run]]
  - run calls [[get-captured-at]] (line 511)
  - run calls [[collect-you-tube]] (line 531)
  - run calls [[collect-naver-tv]] (line 542)
  - run calls [[collect-naver-blog]] (line 553)
  - run calls [[collect-meta]] (line 564)
  - run calls [[collect-tik-tok]] (line 575)
  - run calls [[send-to-webhook]] (line 588)
- data_flows_to [[n8n webhook]] (post-view-snapshots)
- depends_on [[playwright]]
