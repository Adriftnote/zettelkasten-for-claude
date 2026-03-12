---
title: REF-103 SNS 플랫폼별 수집 가능 지표 및 API 엔드포인트 전수 조사
type: guide
permalink: sources/reference/sns-platform-collectible-metrics-survey
tags:
- sns
- api
- playwright
- naver-blog
- facebook
- youtube
- tiktok
- meta-ads
date: 2026-03-12
---

# SNS 플랫폼별 수집 가능 지표 및 API 엔드포인트 전수 조사

6개 플랫폼의 수집 가능 지표를 채널(daily)과 게시물(hourly) 관점에서 정리하고, 네이버 블로그 admin stat 메뉴를 전수 조사한 가이드.

## 📖 핵심 아이디어

Playwright 브라우저 자동화로 수집하는 SNS 데이터의 범위를 명확히 정의한다. 현재 수집 중인 지표와 API에서 추가 확장 가능한 지표를 구분하여, 향후 수집 확장 시 참조 문서로 활용한다.

## 🛠️ 채널별 일별 수집 (collect-channels.js)

| 플랫폼 | 함수명 | API 방식 | 수집 지표 |
|--------|--------|----------|----------|
| Facebook | `run()` 내 inline | GraphQL doc_id 3종 병렬 | 조회수, 반응수, 팔로워 변동 |
| X (Twitter) | `run()` 내 inline | GraphQL AccountOverviewQuery | Impressions, Engagements, Follows, Likes, Retweets, Replies |
| Naver Blog | `run()` 내 inline | DOM 파싱 (iframe prev 버튼 7회 클릭) | 조회수, 공감수, 댓글수, 이웃증감, 동영상 재생수 |
| Meta Ads | `collectMetaAdsDaily()` | 내부 am_tabular API | 52개+ 필드 (impressions, reach, clicks, spend, CPM, CPC, CTR, frequency, conversions 등) |

## 🛠️ 게시물별 시간 수집 (collect-posts.js)
| 플랫폼 | 함수명 | API 방식 | 현재 수집 | 추가 확장 가능 |
|--------|--------|----------|----------|--------------:|
| YouTube | `collectYouTube()` | REST (list_creator_videos) | viewCount, externalViewCount | likeCount, commentCount, dislikeCount(비공개), clipCount |
| Naver TV | `collectNaverTV()` | REST (clips API) | totalPlayCount | playTime, registerDate, category |
| Naver Blog | `collectNaverBlog()` | REST (blog.stat rank/cvContentPc) | 조회수 (상위 랭킹 + 일일 합계) | 공감수, 댓글수, 공유수 (rank_ API 확장) |
| Meta (FB+IG) | `collectMeta()` | GraphQL (tofu_unified_table) | views (최대 500개) | viewers, reach, engagement, reactions, comments, shares, saves, link_clicks 등 40개+ |
| TikTok | `collectTikTok()` | REST (/api/post/list) | play_count | like_count, comment_count, share_count, favorite_count, duration |
| Meta Ads | `collectMetaAdsBS()` | GraphQL (tofu_unified_table) | VIEW LIFETIME (최대 100개) | VIEWERS, SPEND, DELIVERY 상태 |


## 🔧 네이버 블로그 admin.blog.naver.com stat 전수 조사

Playwright로 `admin.blog.naver.com/ssen_info/stat/` 하위 메뉴를 전수 스캔한 결과.

### 공식 메뉴 (네비게이션에 표시)

**채널 지표 (일별 트렌드)**

| URL slug | 지표명 | 설명 |
|----------|--------|------|
| `today` | 일간 현황 | 종합 대시보드 |
| `visit_pv` | 조회수 | 일별 페이지뷰 |
| `uv` | 순방문자수 | 유니크 방문자 |
| `visit` | 방문 횟수 | 총 방문 세션 |
| `frequency` | 평균 방문 횟수 | 1인당 방문 빈도 |
| `retention` | 재방문율 | 재방문 비율 |
| `averageDuration` | 평균 사용 시간 | 체류 시간 |
| `referer` | 유입분석 | 유입 경로별 분포 |
| `hour_cv` | 시간대 분석 | 시간대별 조회수 |
| `demo` | 성별·연령별 분포 | 인구통계 |
| `device` | 기기별 분포 | PC/모바일 비율 |
| `country` | 국가별 분포 | 접속 국가 |

**이웃 분석**

| URL slug | 지표명 |
|----------|--------|
| `relationDist` | 이웃 방문 현황 |
| `relationDelta` | 이웃 증감수 |
| `relationDemo` | 이웃 증감 분석 |

**동영상 분석**

| URL slug | 지표명 |
|----------|--------|
| `play_count` | 재생수 |
| `play_time` | 재생시간 |
| `uniq_watcher` | 시청자수 |

**게시물 랭킹 (공식 4개)**

| URL slug | 지표명 |
|----------|--------|
| `rank_pv` | 조회수 순위 |
| `rank_like` | 공감수 순위 |
| `rank_comment` | 댓글수 순위 |
| `rank_play_count` | 동영상 순위 |

**기타**

| URL slug | 지표명 |
|----------|--------|
| `average_upperGroup` | 블로그 평균 데이터 |
| `download` | 지표 다운로드 |

### 숨겨진 rank_ 페이지 (메뉴 미표시, URL 직접 접근 유효)

| URL slug | 추정 지표 |
|----------|----------|
| `rank_share` | 공유수 순위 |
| `rank_sympathy` | 공감 순위 (rank_like와 별도) |
| `rank_neighbor` | 이웃 순위 |
| `rank_visit` | 방문 순위 |
| `rank_subscriber` | 구독자 순위 |
| `rank_search` | 검색 순위 |
| `rank_keyword` | 키워드 순위 |
| `rank_category` | 카테고리 순위 |
| `rank_tag` | 태그 순위 |
| `rank_series` | 시리즈 순위 |
| `rank_bookmark` | 북마크 순위 |
| `rank_scrap` | 스크랩 순위 |

### blog.stat.naver.com API 엔드포인트

| API endpoint | 상태 | 설명 |
|-------------|------|------|
| `/api/blog/rank/cvContentPc` | ✅ 200 OK | 조회수 랭킹 (현재 수집 중) |
| `cvLikeContentPc` | ❌ 400 | 파라미터 불일치 (추가 조사 필요) |
| `cvCommentContentPc` | ❌ 400 | 파라미터 불일치 |
| `cvShareContentPc` | ❌ 400 | 파라미터 불일치 |

> cvContentPc 외 API는 400 반환 — 각 rank_ 페이지의 iframe 내부에서 실제 호출되는 API 엔드포인트를 네트워크 탭으로 확인해야 정확한 파라미터를 알 수 있음.

## 💡 실용적 평가
**현재 수집 커버리지**: 조회수 중심. 채널 수집은 반응수/팔로워까지 포함하나, 게시물 수집은 조회수만.

### 플랫폼별 API 전수 조사 결과 (2026-03-12 Playwright 덤프)

**YouTube Studio** (`list_creator_videos` API) — 192개 필드 중 현재 3개만 사용

| 분류     | 미사용 필드                                                     | 비고        |
| ------ | ---------------------------------------------------------- | --------- |
| 인게이지먼트 | `publicMetrics.likeCount`, `commentCount`                  | 즉시 수집 가능  |
| 비공개 지표 | `privateMetrics.dislikeCount`, `clipCount`                 | 크리에이터만 접근 |
| 영상 메타  | `lengthSeconds`, `contentType` (SHORTS/REGULAR), `privacy` | 타입 구분 가능  |
| 날짜     | `timePublishedSeconds`, `timeCreatedSeconds`               | 게시일       |

**TikTok** (`item_list` API) — 57개 필드 중 현재 3개만 사용

| 미사용 필드 | 값 예시 |
|-----------|--------|
| `like_count` | 127 |
| `comment_count` | 0 |
| `share_count` | 73 |
| `favorite_count` | 60 (즐겨찾기/북마크) |
| `duration` | 47553 (ms) |
| `create_time`, `post_time` | Unix timestamp |

**Meta Organic FB+IG** (`tofu_unified_table`) — 47개 필드 중 현재 1개(views)만 사용

| 분류 | 미사용 필드 |
|------|-----------|
| 도달/시청 | `viewers`, `reach` |
| 인게이지먼트 | `engagement`, `interactions`, `reactions`, `comments`, `shares`, `saves` |
| 순수 지표 | `net_comments`, `net_interactions`, `net_reactions`, `net_saves` |
| 클릭 | `link_clicks`, `click_through_rate` |
| 비디오 | `video_average_play_time`, `video_distribution_score`, `video_one_minute_views`, `video_play_time`, `video_returning_viewers`, `video_three_second_views`, `video_thruplays` |
| 팔로워 | `new_follows` |
| 수익화 | `creator_monetization_qualified_views`, `creator_monetization_unified_program_earnings` |
| 커머스 | `leads`, `purchases`, `add_to_cart`, `add_payment_info`, `initiate_checkout` |
| FB/IG 구분 | `header.entity.entity_type` = `FB_PAGE_POST` / `IG_POST` |

**Meta Ads Daily** (`am_tabular`) — 기존 52개 외 새로 발견 16개

| 새 필드 | 설명 |
|---------|------|
| `canvas_avg_view_percent/time` | 인스턴트 경험 조회율/시간 |
| `estimated_ad_recall_rate/recallers` | 추정 광고 회상률/회상자수 |
| `full_view_impressions/reach` | 전체 뷰 노출/도달 |
| `cpp` | 1,000명 도달당 비용 |
| `video_avg_time_watched`, `video_continuous_2_sec`, `video_30_sec` | 비디오 시청 상세 |
| `purchase_roas`, `website_purchase_roas`, `mobile_app_purchase_roas` | ROAS 3종 |
| `social_reach/spend`, `unique_link_clicks_ctr` | 소셜 도달, 고유 CTR |

**네이버TV** (`creator-studio-stats-api`) — 숨겨진 통계 API 발견

| API 엔드포인트 | 수집 가능 지표 |
|---------------|--------------|
| `overviews?period=7d` | totalPlayCount, totalWatchTime, totalUserCount, averagePlayCount, averageWatchTime, totalSubscribeCount, totalLikeCount, totalCommentCount, totalShareCount + 전주 비교(previous) |
| `ranks/play-count?period=48h` | 인기 클립 순위 |
| `snapshot` | 채널 스냅샷 |
| 클립 목록 필드 | playTime, firstCategory, secondCategory, registerDate, isGlobal |

### 확장 우선순위 (수정)

1. **TikTok** like/comment/share/favorite — API 응답에 이미 포함, 파싱만 추가 (난이도: 최저)
2. **Meta Organic** viewers/reach/engagement/comments/shares/saves — tofu_unified_table에 이미 반환됨, 추출 코드만 추가 (난이도: 낮음). FB/IG 분리도 entity_type으로 가능
3. **YouTube** likeCount/commentCount — publicMetrics에 이미 포함, 파싱만 추가 (난이도: 낮음)
4. **네이버TV** overviews API — 채널 통계 9개 지표 한번에 수집 가능 (난이도: 중간, API 호출 추가 필요)
5. **Meta Ads Daily** 신규 16개 필드 — column_fields 배열에 추가만 하면 됨 (난이도: 최저)
6. **네이버 블로그** rank_ API — iframe 네트워크 분석 필요 (난이도: 높음)


## 🔗 관련 개념

- [[REF-079 SNS 게시물별 실시간 조회수 추적 — 플랫폼별 API 비교 및 자동화 전략]] - (6개 플랫폼 API 가용성 비교, 이 노트의 선행 리서치)
- [[REF-077 Meta Business Suite 게시물별 GraphQL API 분석]] - (Meta GraphQL tofu_unified_table 상세 구조)
- [[REF-078 네이버 블로그 통계 API 구조 분석]] - (네이버 블로그 blog.stat API 초기 분석)
- [[REF-099 Facebook Ads Manager 내부 API 구조 분석 — am_tabular 엔드포인트]] - (Meta Ads 52개 메트릭 상세)
- [[collect-posts]] - (게시물별 수집 모듈 RPG 문서)
- [[collect-channels]] - (채널별 수집 모듈 RPG 문서)

---

**작성일**: 2026-03-12
**분류**: data/sns/api-reference