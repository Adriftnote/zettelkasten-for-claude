---
title: run-posts-collector
type: function
permalink: functions/run-posts-collector
tags:
- javascript
- playwright
- naver-tv
- naver-blog
- youtube
- tiktok
- meta
- post-tracking
level: low
category: automation/sns/collection
semantic: collect post view snapshots
path: C:\claude-workspace\working\projects\playwright-test\run-posts.js
---

# run-posts-collector

게시물별 조회수 스냅샷 수집 (run-posts.js) — 6개 플랫폼 지원

## 개요

YouTube, 네이버TV, 네이버 블로그, Meta(Facebook+Instagram), TikTok의 최근 게시물별 조회수를 1시간 단위 스냅샷으로 수집. 시간대별 성장 곡선 분석용 데이터 축적.

## Observations

- [impl] Playwright `launchPersistentContext` + `headless: false` — 봇 탐지 회피, 기존 세션 재사용 #pattern
- [impl] 6개 플랫폼 순차 실행 후 전체를 단일 webhook POST로 일괄 전송 #pattern
- [impl] 각 플랫폼 try/catch 독립 처리 — 하나 실패해도 나머지 수집 계속 #algo
- [impl] `getCapturedAt()` — KST 시간 단위 반올림 (예: 2026-03-06T15:00:00) #algo
- [impl] n8n Split Out 노드가 500 반환해도 DB 저장 정상 — body에 `"code":0` 있으면 에러 무시 #caveat
- [deps] playwright, path, fetch #import
- [note] YouTube Studio: DOM 파싱 (`ytcp-video-row`) — 동영상+Shorts 탭 순차 수집, 중복 제거 #context
- [note] 네이버TV: `page.evaluate()` 내부에서 apis.naver.com clips API 직접 호출 — `credentials: include` #context
- [note] 네이버 블로그: `admin.blog.naver.com` → iframe(`blog.stat.naver.com`) 내 게시물 순위 테이블 파싱 #context
- [note] TikTok: `page.on('response')` 로 `/creator/manage/item_list/v1` API 가로채기, DOM fallback 있음 #context
- [note] Meta: `page.evaluate()` 내부 중첩 함수(`callGraphQL`, `fetchEdges`) — GraphQL doc_id 34106016262374963, LAST_7D→28D→90D fallback #context

## 수집 플랫폼 상세

| 플랫폼 | 수집 방식 | API/DOM | 데이터 |
|--------|---------|---------|--------|
| youtube | DOM 파싱 | `ytcp-video-row` | videoId, title, viewCount (최대 20개) |
| naver_tv | page.evaluate 내부 API | apis.naver.com clips API | itemNo, clipTitle, totalPlayCount (최근 10개) |
| naver_blog | iframe DOM 파싱 | blog.stat.naver.com 순위 테이블 | logNo, title, viewCount |
| meta | page.evaluate 내부 GraphQL | doc_id 34106016262374963 | row_id, title, views (최근 10개) |
| tiktok | response 가로채기 | /creator/manage/item_list/v1 | item_id, desc, play_count (최근 10개) |

## 출력 스키마 (post_view_snapshots)

```json
{
  "platform": "youtube | naver_tv | naver_blog | meta | tiktok",
  "post_id": "게시물 고유 ID",
  "post_title": "게시물 제목 (100자 제한)",
  "view_count": 12345,
  "captured_at": "2026-03-06T15:00:00"
}
```

## 주요 상수

| 상수 | 값 | 설명 |
|------|---|------|
| WEBHOOK_URL | `http://192.168.0.9:5678/webhook/post-view-snapshots` | n8n webhook |
| USER_DATA_DIR | `./playwright-data` | 세션 저장 경로 |
| YOUTUBE_CHANNEL_ID | `UCWpvotHqOrqnaT_cielUzRQ` | YouTube Studio 채널 ID |

## Relations (auto-extracted + manual)

- part_of [[playwright-sns-collector]] (소속 모듈)
- contains [[get-captured-at]]
- contains [[send-to-webhook]]
- contains [[collect-naver-tv]]
- contains [[collect-naver-blog]]
- contains [[collect-you-tube]]
- contains [[collect-tik-tok]]
- contains [[collect-meta]]
- contains [[call-graph-ql]]
- contains [[fetch-edges]]
- contains [[run-main]]
  - fetch-edges calls [[call-graph-ql]] (line 401)
  - run-main calls [[get-captured-at]] (line 455)
  - run-main calls [[collect-you-tube]] (line 475)
  - run-main calls [[collect-naver-tv]] (line 486)
  - run-main calls [[collect-naver-blog]] (line 497)
  - run-main calls [[collect-meta]] (line 508)
  - run-main calls [[collect-tik-tok]] (line 519)
  - run-main calls [[send-to-webhook]] (line 532)
- data_flows_to [[n8n-webhook-workflow]] (post_view_snapshots 웹훅 전송)