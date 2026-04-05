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

YouTube, 네이버TV, 네이버 블로그, Meta(Facebook+Instagram), TikTok, Meta Ads(BS) 6개 플랫폼의 게시물별 조회수를 병렬 수집하여 로컬 SQLite + n8n webhook으로 이중 저장하는 모듈. 수집 실패 시 이메일 알림 전송.

## 개요

Playwright 퍼시스턴트 컨텍스트로 로그인 세션을 유지하며, 6개 page를 동시에 열어 각 플랫폼 스튜디오/내부 API에서 게시물의 조회수를 병렬 추출한다(Promise.allSettled). capturedAt은 시간 단위 반올림(KST YYYY-MM-DDTHH:00:00)하여 시간대별 성장 곡선 분석용 데이터를 축적한다. 수집 결과는 로컬 SQLite(sns-dashboard.db)에 저장하고, 기존 n8n webhook으로도 전송한다(이중 저장). 순차 실행 ~90초 → 병렬 ~30초로 단축.

## Observations

- [impl] YouTube: studio.youtube.com SPA request capture → list_creator_videos API 헤더+바디 통째로 캡처 → pageToken 페이지네이션으로 Shorts 전체 수집 (headless:false + off-screen + visibility override 필요) #algo
- [impl] Naver TV: tv.naver.com 내부 API → channelNo 추출 → /api/clipmeta 호출 → 전체 클립 viewCount #algo
- [impl] Naver Blog: blog.naver.com → blog.stat.naver.com/blog/rank/content → 오늘 조회수 상위 랭킹 전체 + 일일 합계 #algo
- [impl] Meta: page.evaluate → fb_dtsg + pageId → GraphQL fetchEdges → tofu_unified_table → 게시물 최대 500개 views #algo
- [impl] TikTok: tiktok.com/creator → /api/post/list API → 게시물 전체 playCount #algo
- [impl] Meta Ads BS: BS content_ads → tofu_unified_table (callerID=CONTENT_TABLE_ADS) → 광고 최대 100개 VIEW LIFETIME 스냅샷 #algo
- [impl] getCapturedAt(): KST 시간 단위 반올림 → "YYYY-MM-DDTHH:00:00" #pattern
- [impl] **병렬 수집**: 6개 page 생성 → Promise.allSettled() 1회 → ~30초 (기존 순차 ~90-100초) #pattern
- [impl] **로컬 SQLite 이중 저장**: better-sqlite3 WAL 모드, INSERT OR REPLACE, 트랜잭션 배치 #pattern
- [impl] 실패 알림: results에서 success:false 필터 → ALERT_WEBHOOK_URL로 subject/html 전송 → n8n → Gmail #pattern
- [deps] `playwright.chromium`, `path`, `better-sqlite3` #import
- [usage] `node collect-posts.js` — scheduler.js가 1시간 주기 실행 #usage
- [note] 각 플랫폼은 독립적 page에서 병렬 실행 — 하나 실패해도 나머지 계속 수집 (Promise.allSettled) #context
- [note] 모든 레코드(오가닉+광고)를 로컬 DB + webhook으로 이중 저장 #context
- [note] Meta Ads BS의 VIEW는 항상 LIFETIME 누적값 — 스냅샷 차분으로 증분 산출 (REF-101) #context
- [note] Ads Manager am_tabular 52개 메트릭 daily 수집은 collect-channels.js가 담당 #context

## 플랫폼별 수집 전략

| 플랫폼 | 접근 방식 | 수집 데이터 |
|--------|---------|-----------| 
| YouTube | studio.youtube.com SPA request capture → list_creator_videos pageToken pagination | Shorts 전체 (headless:false + off-screen window) |
| Naver TV | tv.naver.com → clipmeta API | 전체 클립 viewCount |
| Naver Blog | blog.stat → rank/content API | 오늘 조회수 상위 랭킹 전체 + 일일 합계 |
| Meta | page.evaluate → GraphQL tofu_unified_table | 게시물 최대 500개 views |
| TikTok | creator → /api/post/list | 게시물 전체 playCount |
| Meta Ads BS | page.evaluate → GraphQL tofu_unified_table (callerID=CONTENT_TABLE_ADS) | 광고 최대 100개 VIEW LIFETIME 스냅샷 |

## 레코드 스키마

```js
// post_view_snapshots (allRecords — 오가닉+광고 통합)
{
  platform: string,          // "youtube" | "naver_tv" | "naver_blog" | "meta" | "tiktok" | "meta_ads"
  post_id: string,
  post_title: string,
  view_count: number,
  captured_at: string        // "YYYY-MM-DDTHH:00:00" (시간 단위)
}
```

## 로컬 DB 스키마

```sql
-- sns-dashboard.db (WAL 모드)
CREATE TABLE post_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT NOT NULL, post_id TEXT NOT NULL,
  post_title TEXT, view_count INTEGER DEFAULT 0,
  captured_at TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(platform, post_id, captured_at)
);
CREATE TABLE collection_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_at TEXT NOT NULL, total_records INTEGER,
  duration_ms INTEGER, results_json TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
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
- contains [[collect-meta-ads-bs]]
- contains [[call-graph-ql]]
- contains [[fetch-edges]]
- contains [[init-local-db]]
- contains [[save-to-local-db]]
- contains [[run]]
  - fetch-edges calls [[call-graph-ql]] (line 479)
  - run calls [[get-captured-at]] (line 684)
  - run calls [[collect-you-tube]] (line 717, parallel)
  - run calls [[collect-tik-tok]] (line 717, parallel)
  - run calls [[collect-meta]] (line 717, parallel)
  - run calls [[collect-meta-ads-bs]] (line 717, parallel)
  - run calls [[collect-naver-tv]] (line 717, parallel)
  - run calls [[collect-naver-blog]] (line 717, parallel)
  - run calls [[init-local-db]] (line 745)
  - run calls [[save-to-local-db]] (line 746)
  - run calls [[send-to-webhook]] (line 757)
- data_flows_to [[n8n webhook]] (post-view-snapshots, collect-alert)
- data_flows_to [[sns-dashboard]] (로컬 SQLite sns-dashboard.db)
- depends_on [[playwright]]
- depends_on [[better-sqlite3]]
- part_of [[playwright-sns-collector]] (상위 모듈 그룹)