---
title: playwright-sns-collector
type: note
permalink: 05.-code/modules/playwright-sns-collector
tags:
- playwright
- automation
- sns
- persistent-context
- data-collection
---

# playwright-sns-collector

Playwright Persistent Context 기반 SNS 자동 데이터 수집 모듈

## 📖 개요

Chrome Extension(social-analytics-extractor)의 activeTab 제약으로 자동화 불가 → Playwright가 브라우저 세션(쿠키/로그인)을 유지한 채 각 플랫폼 내부 API를 `page.evaluate()`로 직접 호출하는 방식으로 전환. 19초에 3개 플랫폼 전체 수집 완료.

## Observations

- [impl] Playwright `launchPersistentContext`로 세션 유지 — 로그인 1회만 수동 #pattern
- [impl] `page.evaluate()` 안에서 내부 API fetch — 브라우저 쿠키로 인증 통과 #algo
- [impl] 2개 스크립트 분리: `collect-channels.js`(채널 일별 요약) / `collect-posts.js`(게시물별 스냅샷) #pattern
- [impl] n8n webhook POST로 DB 저장 (daily_channel_summary / post_view_snapshots) #pattern
- [deps] playwright ^1.58.2, Node.js #import
- [note] headless: false 필수 — 일부 플랫폼 headless 감지 차단 #context
- [note] `--disable-blink-features=AutomationControlled` + `ignoreDefaultArgs: ['--enable-automation']` 봇 탐지 회피 #context

## 파일 구조

```
playwright-test/
├── package.json              ← scripts: setup/collect-channels/collect-posts
├── setup.js                  ← 최초 로그인 세션 저장 (1회)
├── test-session.js           ← 세션 유지 확인 테스트
├── collect-channels.js       ← 채널 일별 요약 수집 (Facebook, X, Naver Blog)
├── collect-posts.js          ← 게시물별 조회수 스냅샷 (5플랫폼)
├── register-scheduler.ps1    ← Task Scheduler 등록 스크립트
└── playwright-data/          ← Persistent Context (쿠키, 세션, localStorage)
```

## 아키텍처 비교: Extension vs Playwright

| 항목     | Chrome Extension     | Playwright               |
| ------ | -------------------- | ------------------------ |
| 자동화    | ❌ activeTab 수동 클릭 필요 | ✅ 완전 자동 (Task Scheduler) |
| 세션 유지  | Chrome 프로필 의존        | playwright-data/ 독립      |
| API 호출 | content script 컨텍스트  | page.evaluate() 컨텍스트     |
| 배포     | 확장프로그램 설치 필요         | Node.js만 있으면 실행          |
| 속도     | 수동 3~5분              | 자동 ~19초                  |

## 수집 대상 플랫폼
### collect-channels.js (채널 일별 요약 → daily_channel_summary)
| 플랫폼 | API 방식 | 데이터 |
|--------|---------|--------|
| Facebook | GraphQL doc_id 3종 병렬 | views, interactions, followers (7일) |
| X | AccountOverviewQuery GraphQL | impressions, engagements, follows (7일) |
| Naver Blog | admin.blog iframe DOM 파싱 | views, likes, comments, neighbors (7일) |

### collect-posts.js (게시물별 스냅샷 → post_view_snapshots)
| 플랫폼 | 현재 API 방식 | 데이터 |
|--------|---------|--------|
| YouTube | `list_creator_videos` API 가로채기 | 동영상+Shorts 전체 (페이지네이션) — viewCount, likeCount, commentCount만 |
| 네이버TV | apis.naver.com clips API | 최근 10개 클립 totalPlayCount |
| 네이버 블로그 | blog.stat.naver.com cvContentPc API (rank 상위 10개만) | 오늘 게시물별 조회수 |
| Meta | GraphQL LIFETIME + count 500 | FB+IG 통합 게시물 views |
| TikTok | `/creator/manage/item_list/v1` 가로채기 | 최근 게시물 play_count |

## 수집기 개선 탐색 (2026-03-25)

현재 수집 방식의 한계와 개선 방향을 Playwright 직접 테스트로 검증.

### YouTube: yta_web API 발견

**현재 한계**: `list_creator_videos`는 viewCount/likeCount/commentCount만 반환. 시청시간, CTR, 트래픽소스, 인구통계, 리텐션 등 미수집.

**발견**: `studio.youtube.com/video/{videoId}/analytics/tab-overview/period-default` 접속 시 내부 API 2개 호출됨:
- `yta_web/get_screen` — 탭 레이아웃 + 주요 지표
- `yta_web/get_cards` — 상세 카드 데이터

**수집 가능 지표** (overview 1회 방문으로 전부):

| Metric | 예시값 | 현재 수집 |
|--------|--------|----------|
| EXTERNAL_VIEWS | 13,620 | O (기존 방식) |
| EXTERNAL_WATCH_TIME | 126,492,918ms (35.1h) | X |
| AVERAGE_WATCH_TIME | 29,225ms (29s) | X |
| VIDEO_THUMBNAIL_IMPRESSIONS | 89 | X |
| VIDEO_THUMBNAIL_IMPRESSIONS_VTR | 28.09% | X |
| ESTIMATED_UNIQUE_VIEWERS | 16 | X |
| SUBSCRIBERS_NET_CHANGE | 0 | X |

**카드 타입별 상세 데이터**:
- TRAFFIC_SOURCES — 트래픽 소스별 조회수/비율
- AUDIENCE_RETENTION — 시청 지속 시간 (100개 데이터포인트)
- DEMOGRAPHICS — 성별/연령 분포 (7연령 × 3성별)
- FUNNEL — 노출→클릭→조회→시청시간 퍼널
- STACKED_BAR — 신규/재방문 비율, 디바이스별
- AUDIENCE_INTERESTS — 시청자 관심사 (관련 영상/채널)
- 시계열 데이터 117개 포인트 (시간별)

**핵심 발견**: 4개 탭(overview/reach/interest/audience) 중 overview 1회만 방문하면 나머지 3탭의 카드 타입이 전부 포함됨. 4탭 순회 불필요.

**개선 전략**: 기존 `list_creator_videos`로 영상 ID 목록 확보 → 각 ID로 `yta_web/get_screen` + `get_cards` API 호출 (헤더+세션 캡처 후 videoId만 교체)

**테스트 데이터**: `data/yt_analytics_dump.json`에 4탭 raw JSON 저장됨.

### 네이버 블로그: 개별 article stat URL 발견

**현재 한계**: `cvContentPc` API는 오늘 조회수 상위 10개만 반환. 순위 밖 게시물 미수집.

**발견**: `blog.stat.naver.com/blog/article/{content_id}/cv` 직접 접근 가능. 개별 게시물 상세 통계 포함:
- 누적 조회수 (예: 12,386)
- 누적 공감수, 댓글수
- 일별 조회수/공감수/댓글수
- 유입경로 (검색어 포함)
- 성별/연령별 분포

**개선 전략**: `article_meta` 테이블(MariaDB `nb_article_meta`)에 게시물 ID 관리 → 각 ID로 stat URL 접근하여 상세 수집

**현재 article_meta 상태**: 10개 게시물 등록 완료 (SQLite + MariaDB 동기화)

**iframe 수정**: `waitUntil: 'domcontentloaded'` + `waitForFunction(iframe.src)` → `waitUntil: 'networkidle'`로 변경 (iframe 감지 타이밍 이슈 해결)

### 네이버TV: 공유 지표 주의

**발견**: 네이버TV "공유" 지표는 일반적인 shares가 아님. 영상이 임베드된 상태에서 하루 1회씩 카운트되는 구조 (조회수 1 + 공유 65 → 등록일부터 매일 +1). 다른 플랫폼 shares와 동일선상 비교 불가. 수집 제외 또는 별도 컬럼(`embed_days`) 분리 권장.

### YouTube 광고 조회수 참고

Google Ads "TrueView 조회수"와 YouTube Studio "공개 조회수"는 별개 지표:
- 건너뛸 수 있는 인스트림: 30초 시청 시 TrueView 조회수 + 스튜디오 합산
- 건너뛸 수 없는 인스트림/범퍼: TrueView 미집계, 스튜디오에는 최근부터 합산
- 스튜디오 조회수에 광고 조회수가 섞여 있음 (트래픽소스 > "YouTube 광고"로 분리 가능)
### collect-channels.js (채널 일별 요약 → daily_channel_summary)
| 플랫폼 | API 방식 | 데이터 |
|--------|---------|--------|
| Facebook | GraphQL doc_id 3종 병렬 | views, interactions, followers (7일) |
| X | AccountOverviewQuery GraphQL | impressions, engagements, follows (7일) |
| Naver Blog | admin.blog iframe DOM 파싱 | views, likes, comments, neighbors (7일) |

### collect-posts.js (게시물별 스냅샷 → post_view_snapshots)
| 플랫폼 | API 방식 | 데이터 |
|--------|---------|--------|
| YouTube | `list_creator_videos` API 가로채기 | 동영상+Shorts 전체 (페이지네이션) |
| 네이버TV | apis.naver.com clips API | 최근 10개 클립 totalPlayCount |
| 네이버 블로그 | blog.stat.naver.com cvContentPc API | 전체 게시물 조회수 |
| Meta | GraphQL LIFETIME + count 500 | FB+IG 통합 게시물 views |
| TikTok | `/creator/manage/item_list/v1` 가로채기 | 최근 게시물 play_count |

## Relations
- part_of [[SNS 기초 데이터 수집 자동화]] (소속 프로젝트)
- replaces [[social-analytics-extractor]] (Chrome Extension → Playwright 전환)
- contains [[run-channel-collector]] (채널 일별 요약 수집)
- contains [[collect-posts]] (게시물별 조회수 스냅샷)
- contains [[playwright-setup]] (세션 초기화)
- contains [[verify-integrity]] (정합성 검증)
- uses [[n8n-webhook-workflow]] (데이터 DB 저장)

### Meta Business Suite: 개별 게시물 인사이트 API 발견

**현재 한계**: `tofu_unified_table` GraphQL로 FB+IG 통합 조회수만 수집. 개별 게시물 상세/FB-IG 분리 불가.

**발견**: `business.facebook.com/latest/insights/object_insights/?content_id={id}` 직접 접근 가능. 내부 GraphQL API 20+건 호출됨.

**핵심 API**:

| GraphQL Query | 용도 |
|---|---|
| `TofuObjectInsightsV2EntityQuery` | 게시물 메타 + cross_posted_entities (FB/IG ID 쌍) |
| `useBizWebInsightsSingleValueQuery` | 단일 지표값 (event+tofu_metric 조합) |
| `useTofuMetricsQuery` | 분류별 집계 (DISTRIBUTION_SOURCE 등) |
| `useBizWebInsightsPrivateSingleLineChartWithoutBreakdownQuery` | 시계열 데이터 |

**지표 구조**: `{event, id, time_range, tofu_metric, breakdowns}`
- event: VIEW, VIDEO_VIEW, LINK_CLICK, INTERACTION, FOLLOW, SHARE, SAVE, COMMENT, REACTION 등
- tofu_metric: COUNT, UNIQUE_USERS, TIME, FOA_COUNT 등

**FB/IG 분리 수집 확인 완료 (2026-03-25)**:
- 크로스포스팅 게시물 `cross_posted_entities` → FB ID + IG ID 획득
- FB: `122120724525065988`, IG: `18023320628798598`
- 같은 API, id만 교체하면 FB/IG 분리 수집 가능
- **값이 다름 확인**: VIEW/COUNT → FB=19, IG=144
- 제공 지표도 플랫폼별 상이: FB는 FOA_COUNT(도달 기반), UNIQUE_USERS 등 IG보다 더 많은 분류 제공

**FB 지표 예시** (content_id=122120724525065988):
- VIEW/COUNT=19, VIEW/UNIQUE_USERS=12, VIEW/FOA_COUNT=162
- INTERACTION/FOA_COUNT=3, REACTION/FOA_COUNT=3
- FOLLOW/COUNT=0, SHARE/FOA_COUNT=0, SAVE/FOA_COUNT=0

**VIDEO_VIEW + DISTRIBUTION_SOURCE**: followers=47,851 / recommended=13,004

**테스트 데이터**: `data/meta_insights_dump.json`, `data/meta_graphql_pairs.json`

### TikTok Studio: 개별 게시물 analytics API 발견

**현재 한계**: `/creator/manage/item_list/v1` 가로채기로 play_count만 수집.

**발견**: `tiktok.com/tiktokstudio/analytics/{itemId}` 직접 접근 가능. 내부 API 3종 호출됨.

**핵심 API**:

| API | 데이터 |
|---|---|
| `/aweme/v2/data/insight/` (3회 호출) | comment_history, like_history, pv_history, follower_num_history, net_follower_history, item_search_terms, photo_retention_drop, follower_active_history_days/hours |
| `/tiktokstudio/api/web/item/items-from-item-ids` | playCount, commentCount, shareCount (기본 지표) |
| `/tiktok/v1/creator/m10n_center/reward_analytics` | 60일 수익 데이터 (daily_estimated_income) |
| `/tiktok/v1/analytics/insights/` | article_links_ctr 등 |

**items-from-item-ids 예시** (itemId=7597981245372452116):
- playCount: 9,716
- commentCount: 0
- shareCount: 73

**개선 전략**: itemId만 바꿔가며 `/aweme/v2/data/insight/` 호출 → 시계열(히스토리) + 리텐션 + 검색어 수집 가능

### 네이버TV Creator Studio: 개별 클립 analytics API 발견

**현재 한계**: `apis.naver.com clips API`로 최근 10개 클립 totalPlayCount만 수집.

**발견**: `creator.tv.naver.com/channel/{channelId}/analysis/content/video/{clipId}?type={tab}` 직접 접근 가능. REST API가 깔끔하게 분리됨.

**API 패턴**: `apis.naver.com/creator-studio-web/creator-studio-stats-api/channel/{channelId}/clip/{clipId}/{endpoint}?period=all&from=...&to=...`

**탭별 API**:

| 탭 | API endpoint | 데이터 |
|---|---|---|
| play | `play-count` | 일별 재생수 시계열 (62포인트) |
| play | `play/overviews` | 총재생수, 총시청시간, 순시청자수, 평균재생수, 평균시청시간, 채널평균비교 |
| play | `meta` | 제목, 썸네일, 등록일, clipNo, 길이, contentsType |
| play | `ranks/play-count` | 재생수 랭킹 |
| inflow | `entry` | 유입경로 |
| engagement | `like-count` | 일별 좋아요수 시계열 |

**overviews 예시** (clipId=92729922):
- totalPlayCount=4, totalWatchTime=50초, totalUserCount=2
- averagePlayCount=2, averageWatchTime=12.5초, averagePlayCountInChannel=4.1

**viewer 탭**: play와 동일 API (고유 데이터 없음)

**개선 전략**: play + entry + like-count 3개 API만 호출하면 전부 수집 가능. clipId만 교체하면 됨. 5개 플랫폼 중 API 구조가 가장 깔끔.