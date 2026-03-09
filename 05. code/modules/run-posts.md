---
title: run-posts
type: module
permalink: modules/run-posts
level: high
category: data/sns/analytics
semantic: collect sns post view snapshots
path: C:/claude-workspace/working/projects/playwright-test/run-posts.js
tags:
- javascript
- playwright
- sns
- webhook
---

# run-posts

5개 SNS 플랫폼(YouTube, 네이버TV, 네이버 블로그, Meta, TikTok) 게시물 조회수를 Playwright로 수집하여 n8n webhook으로 전송하는 메인 모듈.

## 개요

Playwright 퍼시스턴트 컨텍스트를 사용하여 로그인 세션을 유지하며, 각 플랫폼의 크리에이터 스튜디오 내부 API(직접 호출 또는 응답 가로채기)를 통해 게시물별 조회수를 추출한다. 수집된 레코드는 `{platform, post_id, post_title, view_count, captured_at}` 구조로 일괄 webhook 전송한다.

## Observations

- [impl] Playwright 퍼시스턴트 컨텍스트(`playwright-data/` 디렉토리)로 세션 쿠키 재사용 — 매 실행마다 로그인 불필요 #pattern
- [impl] 플랫폼별 수집 전략: 네이버TV/Meta = 직접 API fetch, YouTube/TikTok = `page.on('response')` 가로채기, 네이버 블로그 = iframe 내 API 호출 #algo
- [impl] `captured_at`은 KST 기준 시간 단위 반올림 ISO 문자열 — 동일 시간대 레코드 식별용 #pattern
- [deps] `playwright.chromium`, `path` (Node.js 내장) #import
- [usage] `node run-posts.js` — 1시간 주기 cron 실행 권장
- [note] n8n webhook이 Split Out 노드로 500 응답 반환하더라도 `"code":0` 포함 시 정상 처리로 간주 #caveat
- [note] 각 플랫폼 수집은 독립 try-catch — 일부 실패해도 나머지 수집 + webhook 전송 계속 #pattern

## 플랫폼별 수집 전략

| 플랫폼 | 접근 방식 | 엔드포인트 |
|--------|----------|----------|
| 네이버TV | page.evaluate → fetch | apis.naver.com creator-studio-web |
| 네이버 블로그 | iframe frame → fetch | blog.stat.naver.com cvContentPc |
| YouTube | response 가로채기 | studio.youtube.com list_creator_videos |
| TikTok | response 가로채기 | /creator/manage/item_list/v1 |
| Meta | page.evaluate → fetch | business.facebook.com/api/graphql/ |

## 레코드 스키마

```js
{
  platform: 'youtube' | 'naver_tv' | 'naver_blog' | 'meta' | 'tiktok',
  post_id: string,       // 플랫폼별 고유 ID
  post_title: string,    // 게시물 제목 (최대 100자)
  view_count: number,    // 조회수 (숫자)
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
- contains [[call-graph-ql]]
- contains [[fetch-edges]]
- contains [[run]]
  - fetch-edges calls [[call-graph-ql]] (line 458)
  - run calls [[get-captured-at]] (line 512)
  - run calls [[collect-you-tube]] (line 532)
  - run calls [[collect-naver-tv]] (line 543)
  - run calls [[collect-naver-blog]] (line 554)
  - run calls [[collect-meta]] (line 565)
  - run calls [[collect-tik-tok]] (line 576)
  - run calls [[send-to-webhook]] (line 589)
- data_flows_to [[n8n webhook]] (post-view-snapshots 수신 후 DB 저장)
- depends_on [[playwright]] (chromium 퍼시스턴트 컨텍스트)