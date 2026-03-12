---
title: REF-104 SNS 플랫폼별 크리에이터 스튜디오 전체 탭 API 전수 조사
type: guide
permalink: sources/reference/sns-creator-studio-all-tabs-api-survey
tags:
- sns-api
- playwright
- youtube-studio
- tiktok-creator
- meta-ads
- naver-blog
- data-collection
date: 2026-03-12
---

# SNS 플랫폼별 크리에이터 스튜디오 전체 탭 API 전수 조사

YouTube Studio(11탭), TikTok Creator Center(7탭), NaverTV Creator Studio(5탭), Naver Blog(14탭), Meta Ads Manager(3탭), Meta Business Suite(7탭)의 모든 탭을 Playwright로 순회하며 브라우저가 호출하는 내부 API를 전수 캡처한 결과.

## 📖 핵심 아이디어

각 플랫폼의 크리에이터 스튜디오는 탭(페이지)마다 서로 다른 내부 API를 호출하며, 화면에 표시되는 것은 API 응답의 일부에 불과하다. 전체 탭을 순회하면 단일 탭 조사 대비 2~3배 많은 고유 API 엔드포인트를 발견할 수 있다. Playwright `page.on('response')` 인터셉트 방식으로 캡처하며, 스크립트는 `inspect-all-tabs.js`에 구현.

## 🛠️ API 기준 전수 목록

### YouTube Studio (26개 API, 11탭 순회)

| API                                          | 필드수     | 출현 탭          | 데이터 내용                            | 현재 수집    |
| -------------------------------------------- | ------- | ------------- | --------------------------------- | -------- |
| `get_channel_dashboard`                      | 217     | 대시보드          | TOP_VIDEOS 메트릭, 최근활동, 엔티티 스냅샷     | -        |
| `get_creator_channels`                       | 260-265 | 대시보드, 분석3탭    | 채널 기능/권한 115개 feature key, 수익화 상태 | -        |
| `list_creator_videos`                        | 12-202  | 콘텐츠3탭, 대시보드   | 동영상/Shorts/라이브 목록 + 전체 메타데이터      | **조회수만** |
| `get_channel_page_settings`                  | 102     | 맞춤설정          | 채널 핸들/설명/배너/선반구성 12개/이메일          | -        |
| `yta_web/get_screen`                         | 35-44   | 분석-개요/콘텐츠/시청자 | 시계열 차트 (조회수/시청시간/CTR/인구통계)        | -        |
| `get_creator_videos`                         | 16-41   | 대시보드, 분석2탭    | 최근 동영상 요약 (탭별 필드 차이)              | -        |
| `yta_web/get_cards`                          | 18      | 분석-개요         | 경량 분석 카드 (get_screen의 58% 축소)     | -        |
| `comment/get_comments`                       | 23      | 댓글            | 댓글 텍스트, 작성자, 좋아요수, 하트 여부          | -        |
| `crowdsourcing/get_video_translations`       | 17      | 자막            | 번역 목록                             | -        |
| `crowdsourcing/list_video_translations`      | 8       | 자막            | 번역 요약                             | -        |
| `get_supported_content_languages`            | 11      | 자막            | 지원 언어 목록                          | -        |
| `get_creator_social_suggestions`             | 14      | 맞춤설정          | 소셜 연결 제안                          | -        |
| `list_creator_playlists`                     | 8-11    | 콘텐츠3탭, 분석3탭   | 재생목록 메타데이터                        | -        |
| `promotions/get_account`                     | 13      | 콘텐츠3탭         | 프로모션 계정 정보                        | -        |
| `check_creator_bulk_action`                  | 9       | 콘텐츠3탭         | 일괄작업 가능 여부                        | -        |
| `check_creator_bulk_delete`                  | 9       | 콘텐츠3탭         | 일괄삭제 가능 여부                        | -        |
| `comment/check_creator_comments_bulk_action` | 11      | 댓글            | 댓글 일괄작업 여부                        | -        |
| `get_creator_communications`                 | 8       | 공통(11탭)       | 크리에이터 알림                          | -        |
| `notification/get_unseen_count`              | 9       | 공통(11탭)       | 미확인 알림 수                          | -        |
| `att/get`                                    | 17      | 공통(11탭)       | 추적 설정                             | -        |
| `att/esr`                                    | 10      | 공통(11탭)       | 추적 보고                             | -        |
| `security/get_web_reauth_url`                | 10      | 공통(11탭)       | 보안 재인증 URL                        | -        |
| `ars/grst`                                   | 9       | 공통(11탭)       | 세션 토큰                             | -        |
| `log_event`                                  | 1       | 공통(11탭)       | 이벤트 로깅                            | -        |
| `get_survey`                                 | 9       | 일부탭           | 설문 조사                             | -        |
| `get_creator_google_hats_trigger_ids`        | 8       | 대시보드          | Google 설문 트리거                     | -        |

### TikTok Creator Center (16개 API, 7탭 순회)

| API                                 | 필드수  | 출현 탭        | 데이터 내용                                             | 현재 수집     |
| ----------------------------------- | ---- | ----------- | -------------------------------------------------- | --------- |
| `item_list/v1`                      | 60   | 콘텐츠         | 게시물별 play/like/comment/share/favorite + 상태/고정/다운로드 | **play만** |
| `aweme/v2/data/insight/`            | 41   | 분석-개요, 인사이트 | 16일 시계열: 조회수/좋아요/댓글/공유/팔로워/도달                      | -         |
| `web/user`                          | 95   | 공통(7탭)      | 채널 프로필 전체 (닉네임/바이오/지역/인증/계정종류)                     | -         |
| `getHashCount`                      | 13   | 콘텐츠         | 콘텐츠수, 리핀수, 미읽음 방문자, 친구/비친구 도달                      | -         |
| `multiGetFollowRelationCount`       | 8    | 콘텐츠         | 팔로워/팔로잉 실시간 수                                      | -         |
| `at/default/list`                   | 53   | 댓글          | 멘션 가능 사용자 목록 + 팔로우 상태 + 계정 라벨                      | -         |
| `analytics/insights/`               | 13   | 공통(7탭)      | 기사 링크 CTR 데이터                                      | -         |
| `commentsV2`                        | 3    | 댓글          | 댓글 목록 (item_id 파라미터 필요)                            | -         |
| `reward_analytics`                  | 4    | 공통(7탭)      | 크리에이터 수익 (현재 Invalid parameters 에러)                | -         |
| `getanalyticsbannercontent`         | 6    | 분석-팔로워/라이브  | 커뮤니티 가이드라인 위반 배너                                   | -         |
| `items-from-item-ids`               | 1    | 분석-팔로워/라이브  | 특정 게시물 ID로 상세 조회                                   | -         |
| `common-app-context`                | 1251 | 공통(7탭)      | 앱 설정/실험 플래그 (데이터 수집용 아님)                           | -         |
| `web/project/get/ab/`               | 13   | 공통(7탭)      | A/B 테스트 설정                                         | -         |
| `editor_tool/async_tasks/icon_info` | 11   | 공통(7탭)      | 편집 도구 아이콘                                          | -         |
| `web-cookie-privacy/config`         | 57   | 공통(7탭)      | 쿠키 정책 설정                                           | -         |
| `mention/recent/contact/list/v1`    | 9    | 댓글          | 최근 멘션 연락처                                          | -         |

**`aweme/v2/data/insight/` 시계열 상세 (19개 배열)**:

| 배열 | 포인트 | 내용 |
|---|---|---|
| `vv_history` | 16일 | 일별 조회수 |
| `pv_history` | 16일 | 일별 페이지뷰 |
| `like_history` | 16일 | 일별 좋아요 |
| `comment_history` | 16일 | 일별 댓글 |
| `share_history` | 16일 | 일별 공유 |
| `follower_num_history` | 16일 | 일별 팔로워 수 (누적) |
| `reached_audience_history` | 16일 | 일별 도달 사용자 수 |
| `net_follower_history` | 16일 | 일별 순 팔로워 증감 |
| `video_vv_history_7d` | 7일 | 7일 영상별 조회수 |
| `video_vv_history_48_hours` | 48h | 48시간 영상별 조회수 |
| `video_like_history_7d` | 7일 | 7일 영상별 좋아요 |
| `video_comment_history_7d` | 7일 | 7일 영상별 댓글 |
| `video_shares_history_7d` | 7일 | 7일 영상별 공유 |
| `video_favorites_history_7d` | 7일 | 7일 영상별 즐겨찾기 |
| `video_new_followers_history_7d` | 7일 | 7일 영상으로 신규 팔로워 |
| `video_finish_rate_history_7d` | 7일 | 7일 영상 완시청률 |
| `follower_active_history_days` | 요일 | 팔로워 요일별 활성 분포 |
| `follower_active_history_hours` | 시간대 | 팔로워 시간대별 활성 분포 |
| `previous_video_vv_history_7d` | 7일 | 이전 7일 조회수 (비교용) |

### Meta Ads Manager (22개 API, 3탭 순회)

| API                                     | 필드수 | 출현 탭      | 데이터 내용                                       | 현재 수집     |
| --------------------------------------- | --- | --------- | -------------------------------------------- | --------- |
| `am_tabular`                            | 25  | 공통(3탭)    | 광고 성과 (dimensions + atomic + action columns) | **전체 수집** |
| `facebook_pages`                        | 132 | 공통(3탭)    | 페이지 메타 + WhatsApp 연동 + 전환최적화 자격 30+플래그       | -         |
| `ad_quick_views`                        | 32  | 공통(3탭)    | 저장된 뷰/필터 프리셋 (column_fields, filters, sort)  | -         |
| `adimages`                              | 34  | 광고        | 이미지 메타 + ML 품질점수(aes_rating/balance/rot)     | -         |
| `adset 상세 (ID)`                         | 79  | 광고세트      | 계정 UI 설정, AI 옵트인, 크리에이티브 최적화 설정              | -         |
| `lightads`                              | 10  | 캠페인, 광고세트 | 경량 광고 ID 목록 (67개)                            | -         |
| `light_adsets`                          | 10  | 캠페인, 광고   | 경량 광고세트 ID 목록 (16개)                          | -         |
| `light_campaigns`                       | 10  | 광고세트, 광고  | 경량 캠페인 ID 목록                                 | -         |
| `ad_custom_derived_metrics`             | 3   | 공통(3탭)    | 사용자 정의 파생 메트릭                                | -         |
| `ad_export_presets`                     | 3   | 공통(3탭)    | 내보내기 프리셋                                     | -         |
| `adlabels`                              | 5   | 공통(3탭)    | 광고 라벨/태그                                     | -         |
| `impacting_ad_studies`                  | 3   | 공통(3탭)    | A/B 테스트 연구                                   | -         |
| `editing_proposals`                     | 3   | 공통(3탭)    | 편집 제안                                        | -         |
| `column_suggestions`                    | 3   | 공통(3탭)    | 컬럼 추천                                        | -         |
| `publisher_block_lists`                 | 3   | 공통(3탭)    | 퍼블리셔 차단 목록                                   | -         |
| `customconversions`                     | 3   | 공통(3탭)    | 맞춤 전환 이벤트                                    | -         |
| `ads_guidance_qe_exposure`              | 4   | 공통(3탭)    | 광고 가이던스 실험                                   | -         |
| `account (act_ID)`                      | 9   | 공통(3탭)    | 광고 계정 기본 정보                                  | -         |
| `ad_column_sizes`                       | 3   | 광고세트      | 컬럼 너비 설정 (빈 배열)                              | -         |
| `graphql`                               | 8-9 | 공통(3탭)    | UI 상태/설정                                     | -         |
| `v22.0/` (root)                         | 9   | 공통(3탭)    | API 메타 정보                                    | -         |
| `adsmanager-graph.facebook.com/` (root) | 2   | 공통(3탭)    | 연결 확인                                        | -         |

### NaverTV Creator Studio (8개 API, 5탭 순회)

| API | 필드수 | 출현 탭 | 데이터 내용 | 현재 수집 |
| --- | --- | --- | --- | --- |
| `studio/channels/{id}/clips` | 15 | 콘텐츠 | 클립 목록 (itemNo/title/playTime/totalPlayCount/category/registerDate) | **totalPlayCount만** |
| `stats:channel/{id}/overviews` | 20 | 대시보드, 통계 | 7일 채널 개요 (current vs previous: 재생수/시청시간/유저수/구독/좋아요/댓글/공유) | - |
| `stats:channel/{id}/ranks/play-count` | 4 | 대시보드 | 48시간 재생수 TOP5 랭킹 | - |
| `stats:channel/{id}/snapshot` | 0 | 대시보드 | 채널 스냅샷 (현재 빈 배열) | - |
| `studio/channels/{id}/dashboard/recent-comments` | 17 | 대시보드 | 최근 댓글 (clipNo/title/댓글내용/작성자/프로필/날짜/스티커) | - |
| `studio/menu/snb/channels/{id}` | 10 | 공통 | 채널 메타 (accountId/role/channelName/partnerNo/subscriptionCount/메뉴목록) | - |
| `studio/partners/{id}/gnb/noticelog/list` | 3 | 공통 | 알림 로그 (totalCount/items/newMessage) | - |
| `studio/clip/category/list` | 2 | 콘텐츠 | 카테고리 목록 (39개: code/description) | - |

**API 도메인 구분**:
- `creator-studio-stats-api` — 통계 데이터 (overviews, ranks, snapshot)
- `navertv_studio` — 스튜디오 기능 (clips, comments, menu, category)

**조사 탭**: 대시보드 → 통계 → 수익 → 콘텐츠 → 댓글 (inspect-navertv-stats.js)

### Naver Blog (14개 API, 14탭 순회 — 2개 도메인)

네이버 블로그는 **두 개의 독립된 시스템**으로 구성:
- **블로그 관리** (`admin.blog.naver.com`) — 통계가 `blog.stat.naver.com` iframe으로 로드
- **Creator Advisor** (`creator-advisor.naver.com`) — 자체 REST API

#### blog.stat.naver.com iframe API (7개, frame.evaluate로 직접 호출)

| API | dataId | 컬럼 | 행수 | 데이터 내용 | 현재 수집 |
| --- | --- | --- | --- | --- | --- |
| `daily/cv` | cv | date, cv, cv_p | 15일 | 일별 조회수 + 전체 대비 비율(%) | - |
| `daily/cv` | dashboard | dailyCv/Like/Comment/RelationDelta | 1 | 오늘 요약 (조회수/좋아요/댓글/이웃변동) | - |
| `daily/cv` | weekAndMonthAnalysis | uv/cv/visit/revisit/averageVisit | 1 | 주간 분석 (재방문율 64%, 평균방문 1.03) | - |
| `daily/cv` | rankCv | date/uri/cv/rank/title/createDate | 6 | 조회수 TOP 게시물 | - |
| `daily/cv` | refererTotal | referrerDomain/referrerSearchEngine/cv | 6 | 유입 경로 도메인별 요약 | - |
| `daily/cv` | refererDetail | searchQuery/referrerUrl/cv | 20 | 유입 상세 (검색어/URL별) | - |
| `daily/visit` | visit | date, visit | 15일 | 일별 방문수 | - |
| `visit/cv` | cv | date, total/friend/follow/etc | 15일 | 방문자 유형별 조회수 (이웃/팔로워/기타) | - |
| `visit/uv` | uv | date, total/friend/follow/etc | 15일 | 방문자 유형별 UV | - |
| `visit/visit` | visit | date, visit | 15일 | 일별 방문수 | - |
| `rank/cvContentPc` | rankCv | date/uri/cv/rank/title/createDate | 26 | 게시물별 조회수 랭킹 (전체) | - |
| `rank/comment` | rankComment | date/uri/event/rank/title/createDate/type | 0* | 댓글수 랭킹 (*현재 데이터 없음) | - |

**API 패턴**: `/api/blog/{section}/{metric}?timeDimension=DATE&startDate=YYYY-MM-DD&exclude=`

**특이사항**: `daily/cv` 한 번 호출에 8개 dataId가 포함 (대시보드 요약, 주간분석, 조회수 랭킹, 유입분석까지 한 번에 반환). 사실상 블로그 관리자 "오늘 통계" 페이지 전체 데이터.

**조사 방법**: `page.on('response')` 인터셉트 불가 → `frame.evaluate()` + Performance API로 실제 호출 URL 발견 → 238개 엔드포인트 전수 테스트 (inspect-naver-blog7.js)

#### Creator Advisor API (7개, 5탭 순회)

| API | 필드수 | 출현 탭 | 데이터 내용 | 현재 수집 |
| --- | --- | --- | --- | --- |
| `api/v6/home/realtime-summary` | 14 | CA-홈 | 오늘 실시간 조회수(cv) TOP10 + 검색유입 TOP10 + 클립재생수 | - |
| `api/v6/home/yesterday-summary` | 26 | CA-홈 | 어제 vs 그저께 비교: cv/visit/uv/수익/클립(pc+pt) | - |
| `api/v6/home/realtime-summary-histogram` | 9 | CA-홈 | 30분 간격 조회수 히스토그램 (하루치) | - |
| `api/v6/home/soaring-contents` | 16 | CA-홈 | 급상승 콘텐츠 랭킹 (title/contentId/rank/metricValue) | - |
| `api/v6/home/weekly-recommendation` | 31 | CA-홈 | 주간 추천: 카테고리별 TOP5 + 시간대 분포(24h) + 연령/성별 분포 | - |
| `api/v6/accounts/channels` | 13 | 공통(5탭) | 채널 목록 (blog+ntv, userId/channelId/channelName/프로필) | - |
| `api/v6/etc/notifications` | 12 | 공통(5탭) | 데이터 업데이트 알림 (주간/월간 완료 시점) | - |

**조사 탭**: CA-홈 → CA-콘텐츠분석 → CA-방문분석 → CA-수익 → CA-진단

**API 도메인 구분**:
- `blog.stat.naver.com/api/blog/` — 블로그 통계 (iframe 전용, frame.evaluate 필요)
- `creator-advisor.naver.com/api/v6/` — Creator Advisor REST API (response 인터셉트 가능)

**조사 탭 (관리)**: 통계-오늘 → 통계-방문분석 → 통계-조회수 → 통계-공감수 → 통계-유입분석 → 글관리 → 댓글관리 → 메뉴관리 → 블로그정보

### Meta Business Suite (1개 API, 7탭 순회)

| API | 필드수 | 출현 탭 | 데이터 내용 | 현재 수집 |
|---|---|---|---|---|
| `api/graphql/` | 7-9 | 공통(7탭) | UI 상태만 캡처됨 (배너, 대기목록, 온보딩) | **page.evaluate로 별도 수집** |

Meta BS는 모든 탭이 동일 `/api/graphql/` 엔드포인트에 `doc_id` 파라미터만 바꿔 호출 → URL 기준 캡처 방식의 한계. 실제 데이터(콘텐츠 메트릭, 잠재고객 등)는 `page.evaluate()` 직접 호출이 필요.


## 🔧 조사 방법

```
탭 방문 흐름:
page.on('response') 리스너 등록
  → page.goto(탭 URL) 
  → 8~12초 대기 (API 로드 완료)
  → URL 기준으로 고유 API 분류
  → JSON 덤프 저장
page.removeListener('response')
```

**URL 필터 기준 (플랫폼별)**:
- YouTube: `youtubei/v1/`, `list_creator_videos`, `get_creator`, `analytics`
- TikTok: `tiktok.com/api/`, `/creator/`, `analytics`, `item_list`, `comment`
- Meta BS: `facebook.com/api/graphql`, `graph.facebook.com`
- Naver Blog CA: `creator-advisor.naver.com/api/v6/`
- Naver Blog 관리: `blog.stat.naver.com/api/blog/` (iframe 내부 — response 인터셉트 불가)
- Meta Ads: `facebook.com/api/graphql`, `adsmanager-graph.facebook.com`, `am_tabular`

**한계**: 동일 URL + 다른 파라미터로 호출되는 API(Meta GraphQL)는 첫 응답만 캡처. iframe 내부 API(Naver Blog 관리)도 캡처 불가. 두 경우 모두 `page.evaluate()` / `frame.evaluate()` 직접 호출이 더 정확.

## 💡 실용적 평가

### 수집 확장 우선순위

| 순위 | API | 플랫폼 | 이유 |
|---|---|---|---|
| 1 | `aweme/v2/data/insight/` | TikTok | 16일 채널 시계열 — collect-channels.js에 추가하면 일별 트렌드 확보 |
| 2 | `getHashCount` | TikTok | 도달률(친구/비친구), 미읽음 방문자 — 한 번 호출로 채널 스냅샷 |
| 3 | `yta_web/get_screen` | YouTube | 분석 탭 시계열 차트 — 조회수/시청시간/CTR 일별 |
| 4 | `get_channel_dashboard` | YouTube | 대시보드 요약 — TOP_VIDEOS 메트릭 |
| 5 | `adimages` | Meta Ads | ML 품질점수 — 크리에이티브 품질 자동 평가 |
| 6 | `comment/get_comments` | YouTube | 댓글 텍스트 — 감성분석/키워드 추출 |

### 현재 수집 vs 확장 가능 지표

| 플랫폼 | 현재 수집 탭 | 미수집 탭(새 발견) |
|---|---|---|
| YouTube | 콘텐츠(동영상/Shorts) | 대시보드, 분석3탭, 댓글, 맞춤설정 |
| TikTok | 콘텐츠 | 분석-개요(시계열!), 댓글 |
| Meta Ads | 광고(am_tabular) | 광고세트(adset상세), 광고(adimages) |
| NaverTV | 콘텐츠(clips) | 대시보드(overviews/ranks), 댓글, 통계(overviews 시계열) |
| Naver Blog | - | iframe(daily/cv 대시보드 8종, visit 3종, rank 2종), CA-홈(실시간+히스토그램) |
| Meta BS | 인사이트-콘텐츠 | GraphQL 구조상 탭 분리 무의미 |

### 조사 스크립트 위치

| 파일 | 용도 |
|---|---|
| `inspect-all-tabs.js` | 전체 탭 전수 조사 (이 노트의 데이터 소스) |
| `inspect-navertv-stats.js` | NaverTV + YouTube 단일 탭 조사 (이전 세션) |
| `inspect-api-fields.js` | v1 — 전 플랫폼 단일 탭 조사 |
| `inspect-naver-blog.js` ~ `inspect-naver-blog7.js` | Naver Blog 조사 (v7: 238개 엔드포인트 전수 브루트포스) |
| `api-field-dumps/naver_blog_all_tabs.json` | Naver Blog 전체 탭 JSON 덤프 |
| `api-field-dumps/all-tabs/` | 전체 탭 JSON 덤프 (4개 파일) |

## 🔗 관련 개념

- [[REF-103 SNS 플랫폼별 수집 가능 지표 및 API 엔드포인트 전수 조사]] - (단일 탭 기반 조사. 이 노트는 전체 탭으로 확장한 후속 조사)
- [[REF-079 SNS 게시물별 실시간 조회수 추적 — 플랫폼별 API 비교 및 자동화 전략]] - (6개 플랫폼 API 가용성 비교, 수집 전략의 근거)
- [[REF-099 Facebook Ads Manager 내부 API 구조 분석 — am_tabular 엔드포인트]] - (Meta Ads am_tabular 상세 구조)

---

**작성일**: 2026-03-12
**분류**: data-collection / sns-api