---
title: REF-100 Meta Ads API 지표 산출 관계 — 52개 메트릭 계층 구조
type: guide
permalink: sources/reference/meta-ads-api-metrics-hierarchy
tags:
- meta-ads
- metrics
- data-integrity
date: 2026-03-11
---

# Meta Ads API 지표 산출 관계 — 52개 메트릭 계층 구조

Meta Ads am_tabular API가 반환하는 52개 메트릭의 계층 구조와 산출 공식을 정리. ad_metrics_atomic 테이블 검증 기준.

## 📖 핵심 아이디어

Meta Ads API 메트릭은 4계층으로 구성된다: 기본(Raw) → 산출(Derived) → 액션(Action) → 단가(Cost-per). 산출 지표는 기본 지표의 사칙연산이며, 동치 관계인 지표 쌍이 존재한다. 2025년 Business Suite는 Impressions→Views로 전환했지만 Ads Manager API는 여전히 impressions를 사용한다.

## 🛠️ 지표 계층 구조

### Layer 1: 기본 지표 (Raw)

| 지표                 | 설명                   |
| ------------------ | -------------------- |
| impressions        | 광고 노출 횟수 (동일인 중복 포함) |
| reach              | 도달 (유니크 사람 수)        |
| clicks             | 전체 클릭 (링크+프로필+좋아요 등) |
| spend              | 지출 금액 (원)            |
| unique_clicks      | 유니크 클릭 (사람 수)        |
| unique_impressions | 유니크 노출 (= reach)     |

### Layer 2: 산출 지표 (Derived)

| 지표 | 공식 | 검증 |
|------|------|------|
| frequency | impressions / reach | 32개 광고 전수 일치 |
| cpm | spend / impressions × 1000 | 전수 일치 |
| cpc | spend / clicks | 전수 일치 |
| ctr | clicks / impressions × 100 | 전수 일치 |
| unique_ctr | unique_clicks / unique_impressions × 100 | 전수 일치 |
| cost_per_unique_click | spend / unique_clicks | 전수 일치 |

### Layer 3: 액션 지표 (Action)

| 지표                                        | 설명                 |
| ----------------------------------------- | ------------------ |
| actions:video_view                        | 3초+ 영상 조회          |
| actions:link_click                        | 링크 클릭              |
| actions:landing_page_view                 | 랜딩페이지 도착           |
| actions:post_engagement                   | 게시물 참여 (좋아요/댓글/공유) |
| actions:page_engagement                   | 페이지 참여             |
| video_play_actions:video_view             | 영상 재생 시작           |
| video_thruplay_watched_actions:video_view | 15초+ 시청 (ThruPlay) |
| video_p25/p50/p75/p100_watched_actions    | 영상 진행률별 시청         |

### Layer 4: 단가 지표 (Cost-per)

| 지표 | 공식 |
|------|------|
| cost_per_action_type:link_click | spend / actions:link_click |
| cost_per_action_type:video_view | spend / actions:video_view |
| cost_per_action_type:post_engagement | spend / actions:post_engagement |
| cost_per_thruplay:video_view | spend / thruplay_watched |
| cost_per_inline_link_click | spend / inline_link_clicks |
| cost_per_inline_post_engagement | spend / inline_post_engagement |
| cost_per_outbound_click | spend / outbound_clicks |

## 🔧 동치 관계 (같은 값, 다른 이름)

| A | B | 검증 |
|---|---|------|
| reach | unique_impressions | 32개 광고 전수 동일 |
| inline_link_clicks | actions:link_click | 전수 동일 |
| inline_post_engagement | actions:post_engagement | 전수 동일 |
| cost_per_inline_link_click | cost_per_action_type:link_click | 전수 동일 |
| cost_per_inline_post_engagement | cost_per_action_type:post_engagement | 전수 동일 |

## 🔧 산출 관계 다이어그램

```
impressions ──→ cpm (spend/impressions×1000)
    │          ctr (clicks/impressions×100)
    ├── reach(=unique_impressions) → frequency (impressions/reach)
    ├── clicks → cpc (spend/clicks)
    │     ├── inline_link_clicks (=actions:link_click)
    │     ├── outbound_clicks
    │     └── unique_clicks → cost_per_unique_click (spend/unique_clicks)
    │                       → unique_ctr (unique_clicks/unique_impressions×100)
    └── actions (사용자 행동)
          ├── video_view (3초+) → cost_per_action_type:video_view
          ├── video_play (재생 시작)
          │     └── thruplay (15초+) → cost_per_thruplay
          │           └── p25 → p50 → p75 → p100 (진행률)
          ├── link_click → landing_page_view
          │                  → cost_per_action_type:link_click
          └── post_engagement → cost_per_action_type:post_engagement
```

## 💡 실용적 평가

### Business Suite "조회수" vs Ads API

- Business Suite 채널일별 `views_line` (PROFILE_PLUS_INSIGHTS) = 오가닉 + 유료 합산
- Business Suite 게시물별 (ORGANIC_CONTENT) = 오가닉만
- Ads Manager API = impressions/reach/clicks (Views 미지원)
- **Business Suite "광고를 통해 발생한 조회수"는 Ads API 어떤 단일 지표와도 일치하지 않음** (3/9 검증: BS 13,168 vs impressions 35,755 vs reach 34,173)

### 데이터 특성

- captured_at 포맷: collect-channels 일별 = `YYYY-MM-DD`, collect-posts 시간별 = `YYYY-MM-DDTHH:00:00`
- time_range `{since: today, until: today}` → 당일치 (누적 아님, 날마다 오르락내리락 확인)
- 검증 기준일: 2026-03-11, 32개 광고 전수 검증

### 정합성 검증 미해결

- BS 광고 조회수의 정확한 산출 공식 미확인 — Ads API 표준 지표로 재현 불가
- 채널일별 데이터 2일 지연 (API lag) → 연속일 비교 시 고려 필요

## 🔗 관련 개념

- [[REF-099 Facebook Ads Manager 내부 API 구조 분석 — am_tabular 엔드포인트]] - (am_tabular API 구조, 이 노트는 그 API가 반환하는 지표 간 관계)
- [[REF-077 Meta Business Suite 게시물별 GraphQL API 분석]] - (오가닉 게시물 API, 이 노트의 유료광고 지표와 대비)
- [[REF-079 SNS 게시물별 실시간 조회수 추적 — 플랫폼별 API 비교 및 자동화 전략]] - (6개 플랫폼 API 비교, Meta 광고 지표는 이 전략의 유료광고 보완)
- [[collect-posts]] - (ad_metrics_atomic 수집 구현 모듈)
- [[collect-channels]] - (채널일별 + Meta Ads Daily 수집 모듈)

---

**작성일**: 2026-03-11
**분류**: 데이터 수집 / Meta Ads