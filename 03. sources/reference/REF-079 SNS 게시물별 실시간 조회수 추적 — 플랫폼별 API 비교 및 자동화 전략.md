---
title: REF-079 SNS 게시물별 실시간 조회수 추적 — 플랫폼별 API 비교 및 자동화 전략
type: guide
permalink: sources/reference/sns-per-post-view-tracking-comparison
tags:
- sns-data
- per-post-tracking
- view-count
- api-comparison
- automation
- playwright
- n8n
date: 2026-03-06
---

# SNS 게시물별 실시간 조회수 추적 — 플랫폼별 API 비교 및 자동화 전략

6개 SNS 플랫폼(TikTok, YouTube, 네이버TV, 네이버 블로그, 인스타그램, 페이스북)의 게시물별 조회수를 시간대별로 추적하기 위한 API 가용성, 실시간성, 자동화 가능성을 비교 분석.

## 📖 핵심 아이디어

게시물 업로드 후 시간대별 조회수 성장 곡선을 추적하여, 어떤 게시물이 언제 가장 큰 폭으로 증가하는지, 어느 시점에 업로드해야 유의미하게 다른지를 분석하고 싶음. 플랫폼마다 API 구조와 인증 방식이 달라, 완전 자동화가 가능한 것과 브라우저 세션이 필요한 것으로 나뉨.

## 🛠️ 플랫폼별 API 비교

### 실시간 조회수 API

| 플랫폼               | API                                   | 조회수 필드           | 실시간성           | 시계열 내장      | 인증         |
| ----------------- | ------------------------------------- | ---------------- | -------------- | ----------- | ---------- |
| **TikTok**        | `/v2/video/query/` (공식)               | `view_count`     | 즉시 반영          | X (폴링)      | OAuth 토큰   |
| **YouTube**       | `/v3/videos?part=statistics` (공식)     | `viewCount`      | 즉시 반영          | X (폴링)      | API Key    |
| **네이버TV**         | `creator.tv.naver.com/.../list` (내부)  | `totalPlayCount` | 즉시 반영          | X (폴링)      | 쿠키 세션      |
| **네이버 블로그**       | `blog.stat.naver.com/cv` (내부)         | `cv`             | 지연 추정          | 일별 15일      | 쿠키 세션      |
| **Meta (인스타+페북)** | 내부 GraphQL `doc_id:31321294414185827` | `VIEW/COUNT`     | 15분 간격         | **15분 시계열** | fb_dtsg 토큰 |
| **Meta 공식**       | Graph API Insights                    | `impressions` 등  | **최대 48시간 지연** | 일별          | OAuth 토큰   |

### 네이버TV Creator Studio API 상세

엔드포인트: `https://creator.tv.naver.com/channel/{channelId}/content/video/list`

```json
{
  "result": {
    "totalCount": 45,
    "items": [
      {
        "itemNo": 92729922,
        "clipTitle": "영상 제목",
        "totalPlayCount": 3,
        "registerDate": "2026-01-22T09:45:50+09:00",
        "playTime": 47,
        "isOpen": true,
        "firstCategory": {"code": "TECH"},
        "secondCategory": {"code": "INTERNET"}
      }
    ]
  }
}
```

- `pageSize` 파라미터로 한 번에 전체 목록 조회 가능
- `totalPlayCount`는 실시간 반영 (통계 분석 페이지의 `play-count`는 배치 집계로 지연 있음)
- 분석 페이지 엔드포인트: `overviews?period=all&from=...&to=...`, `play-count?period=48h`, `play-count?period=all&from=...&to=...`

### TikTok Content API 상세

```
POST /v2/video/query/
- video ID 최대 20개 배치 조회
- fields: id, view_count, like_count, comment_count, share_count
- 이미 n8n 워크플로우에서 video/list → video/query 패턴 사용 중
- Research API에만 favorites_count(저장수) 있음 (학술/비영리 전용)
```

### YouTube Data API 상세

```
GET /youtube/v3/videos?part=statistics&id=VIDEO_ID
- 최대 50개 video ID 배치 조회
- API Key만 있으면 됨 (OAuth 불필요)
- Shorts: 2025-03-31부터 재생/리플레이 시 즉시 카운트
```

## 🔧 자동화 전략

### 그룹 A: 완전 자동 (공식 API + n8n 스케줄)

| 플랫폼 | 방식 | 폴링 주기 |
|--------|------|----------|
| TikTok | n8n HTTP Request + OAuth | 15~30분 |
| YouTube | n8n HTTP Request + API Key | 15~30분 |

시계열 구축: 주기적 스냅샷 → DB 저장 → 시간대별 delta 계산

### 그룹 B: 반자동 — Playwright Persistent Context (브라우저 세션 필요)

| 플랫폼 | API | 세션 수명 |
|--------|-----|----------|
| 네이버TV | `list` API (totalPlayCount) | NID_SES 쿠키 2~4주 |
| 네이버 블로그 | `cv` 엔드포인트 | 동일 |
| Meta (인스타+페북) | 내부 GraphQL | c_user/xs 쿠키 수주 |

**Playwright Persistent Context 방식**:
1. 처음 한 번 수동 로그인 → 브라우저 상태(쿠키, localStorage) 디스크 저장
2. NAS Docker에서 cron/n8n으로 1시간마다 → 저장된 상태로 headless 실행 → 내부 API 호출
3. 세션 만료 감지 시 → 알림 → 수동 재로그인 (한 달 1~2회)

쿠키 직접 복붙보다 안정적: 브라우저 상태 전체(쿠키+localStorage+세션스토리지)를 유지하므로 세션 갱신이 자연스러움.

### 그룹 C: 수동 (Chrome Extension)

기존 `social-analytics-extractor` 패턴: 브라우저에서 버튼 클릭 → 수집 → webhook → DB.
게시물별 조회수 기능 추가 시 "전 채널 일괄 수집" 버튼으로 반자동화 가능.

## 💡 실용적 평가

### 권장 구현 순서

1. **TikTok/YouTube**: n8n 폴링 워크플로우 먼저 (공식 API, 즉시 가능)
2. **네이버TV**: `list` API → Playwright 자동화 또는 Extension 확장
3. **Meta**: REF-077 기반 Extension per-post 함수 추가
4. **네이버 블로그**: REF-078 기반 API 직접 호출 테스트

### 공통 DB 스키마 (시계열 저장)

```sql
CREATE TABLE post_view_snapshots (
  id INTEGER PRIMARY KEY,
  platform TEXT NOT NULL,       -- tiktok, youtube, naver_tv, ...
  post_id TEXT NOT NULL,
  view_count INTEGER NOT NULL,
  captured_at TEXT NOT NULL,    -- ISO 8601
  UNIQUE(platform, post_id, captured_at)
);
```

### 한계

- 내부 API(네이버, Meta)는 비공식이므로 변경 리스크 존재
- Playwright 세션 유지는 플랫폼의 보안 정책 변경에 영향받음
- Meta 공식 Graph API는 48시간 지연으로 실시간 추적에 부적합

## 🔗 관련 개념

- [[REF-077 Meta Business Suite 게시물별 GraphQL API 분석]] - (Meta 내부 GraphQL per-post 상세 분석, doc_id/시계열 구조)
- [[REF-078 네이버 블로그 통계 API 구조 분석]] - (네이버 블로그 내부 API 구조, 동일 쿠키 인증 패턴)
- [[SNS 기초 데이터 수집 자동화]] - (상위 프로젝트, 채널 레벨에서 게시물 레벨로 확장)
- [[social-analytics-extractor]] - (기존 Chrome Extension, per-post 기능 추가 대상)
- [[REF-068 TikTok 저장수(Saves)와 알고리즘 장수 컨텐츠 관계]] - (TikTok 북마크 기반 장수 컨텐츠 가설, 조회수 추적의 동기)

---

**작성일**: 2026-03-06
**분류**: SNS 데이터 수집 / API 비교 / 자동화 전략