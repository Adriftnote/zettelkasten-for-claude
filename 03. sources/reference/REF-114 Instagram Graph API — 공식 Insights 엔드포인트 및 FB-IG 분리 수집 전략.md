---
title: "Instagram Graph API — 공식 Insights 엔드포인트 및 FB/IG 분리 수집 전략"
type: doc-summary
tags:
  - instagram
  - meta
  - graph-api
  - insights
  - sns-api
date: 2026-03-13
permalink: sources/reference/instagram-graph-api-insights-fb-ig-split
---

# Instagram Graph API — 공식 Insights 엔드포인트 및 FB/IG 분리 수집 전략

Meta Business Suite의 tofu_unified_table GraphQL API는 FB_PAGE_POST만 반환하고 IG_POST 메트릭은 제공하지 않음. Instagram Graph API 공식 엔드포인트를 통해 IG 전용 메트릭 분리 수집이 가능함을 확인.

## 📖 핵심 아이디어

Meta BS 내부 API(tofu_unified_table)는 Facebook Page 중심 설계로, 교차 게시된 콘텐츠의 Instagram 메트릭을 별도 행으로 반환하지 않는다. cross_posted_entities에 IG Media ID는 포함되지만 메트릭은 없음. Instagram Graph API의 `GET /{ig-media-id}/insights` 엔드포인트를 별도 호출해야 IG 전용 메트릭(views, reach, engagement, saves, shares)을 얻을 수 있다.

## 🛠️ 주요 엔드포인트

| 엔드포인트 | 용도 | 비고 |
|-----------|------|------|
| `GET /{ig-user-id}/media` | 게시물 ID 목록 조회 | 최대 10K개, Stories 제외 |
| `GET /{ig-media-id}/insights` | 개별 게시물 메트릭 | metric 파라미터 필수 |
| `GET /{ig-media-id}?fields=...` | 게시물 메타데이터 | caption, media_type, timestamp, permalink |
| `GET /{ig-user-id}/insights` | 계정 전체 인사이트 | 팔로워 증감, 프로필 방문 등 |
| `GET /{ig-user-id}/stories` | 스토리 목록 | media 엔드포인트와 별도 |

## 🔧 수집 플로우

```
1단계: 게시물 목록
  GET /{ig-user-id}/media?fields=id,media_type,timestamp,caption

2단계: 개별 메트릭 (게시물당 1회 호출)
  GET /{ig-media-id}/insights?metric=views,reach,likes,comments,saves,shares

3단계: (선택) 메타데이터 보강
  GET /{ig-media-id}?fields=permalink,media_product_type
```

### 사용 가능 메트릭 (2025.04 이후 기준)

| 메트릭 | FEED | REELS | STORY | 설명 |
|--------|:----:|:-----:|:-----:|------|
| views | O | O | O | 조회수 (impressions 대체) |
| reach | O | O | O | 도달 (고유 계정) |
| likes | O | O | - | 좋아요 |
| comments | O | O | - | 댓글 |
| saves | O | O | - | 저장 |
| shares | O | O | O | 공유 |
| engagement | O | - | - | 좋아요+댓글 합산 |

### 폐지된 메트릭 (주의)

- ~~impressions~~ → views로 대체 (2025.04.21 전 버전 적용)
- ~~video_views~~ → 폐지 (v21.0+)
- ~~plays~~ → 폐지
- ~~clips_replays_count~~ → 폐지

### 권한 및 토큰

| 권한 | 용도 | 필수 |
|------|------|:----:|
| instagram_basic | IG 계정 ID, 게시물 목록 | O |
| instagram_manage_insights | Insights API 접근 | O |
| pages_read_engagement | Page 연동 | O |
| pages_show_list | Page 목록 | O |

- **Long-lived User Token**: 60일 유효 (수동 갱신)
- **System User Token**: 만료 없음 (Business Manager 필요)
- **Rate Limit**: 200 호출/시간 (계정당, 실패 포함)
- Business/Creator Account 필수 (Personal 불가)

### 자체 비즈니스 계정 소유자의 경우

앱 소유자가 비즈니스 계정 소유자인 경우 **앱 리뷰 없이 개발 모드에서 사용 가능**. 단 instagram_manage_insights 권한은 앱 대시보드에서 활성화 필요. 외부 사용자에게 공개하려면 앱 리뷰 필수.

## 💡 실용적 평가

### 현재 상태 (tofu_unified_table 실증 테스트 결과)

- FB_PAGE_POST 120개 반환, IG_POST 0개
- cross_posted_entities에 IG Media ID 존재 (예: TofuEntity:18623606215033891)
- entity_type 구분값: FB_PAGE_POST vs IG_POST (API 응답에는 있으나 IG 행 미반환)
- 114/120 게시물이 FB↔IG 교차 게시
- 6개는 FB-only (IG 교차 게시 없음)

### 해결 전략

1. 기존 tofu_unified_table에서 FB 메트릭 + cross_posted IG ID 추출 (현재 방식 유지)
2. IG ID로 Instagram Graph API 별도 호출하여 IG 메트릭 수집
3. content_hub.db에서 같은 content_uuid로 FB/IG 메트릭 병합

### 한계

- Rate Limit 200/시간 → 120개 게시물 × insights 호출 = 2분이면 충분하나 다른 API와 공유
- 토큰 60일 갱신 필요 (자동화 어려움, System User Token 추천)
- Stories는 24시간 후 삭제, 메트릭은 14일 보존

## 🔗 관련 개념

- [[REF-077 Meta Business Suite 게시물별 GraphQL API 분석]] - (tofu_unified_table API 구조, 본 노트의 한계 원인)
- [[REF-079 SNS 게시물별 실시간 조회수 추적 — 플랫폼별 API 비교 및 자동화 전략]] - (6개 플랫폼 비교 중 Meta 부분 보완)
- [[REF-103 SNS 플랫폼별 수집 가능 지표 및 API 엔드포인트 전수 조사]] - (IG 공식 API 지표 추가 필요)
- [[REF-104 SNS 플랫폼별 크리에이터 스튜디오 전체 탭 API 전수조사]] - (Meta BS 탭별 API 한계, IG 분리 불가 확인)

---

**작성일**: 2026-03-13
**분류**: SNS 데이터 수집
**출처**: Meta 공식 문서 (developers.facebook.com/docs/instagram-platform/) + Context7 + 실증 테스트
