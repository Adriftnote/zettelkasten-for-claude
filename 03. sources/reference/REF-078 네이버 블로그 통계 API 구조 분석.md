---
title: REF-078 네이버 블로그 통계 API 구조 분석
type: doc-summary
permalink: sources/reference/naver-blog-stat-api-analysis
tags:
- naver
- blog-stat
- api
- sns-data
date: 2026-03-05
---

# 네이버 블로그 통계 API 구조 분석

blog.stat.naver.com SPA가 호출하는 내부 API의 엔드포인트와 응답 구조 분석. 현재 DOM 파싱 방식(naver.js)을 API 직접 호출로 전환할 수 있는 근거.

## 📖 핵심 아이디어

네이버 블로그 통계 페이지는 SPA(React)로 `<div id="_root">` 셸만 제공하고, 실제 데이터는 Fetch API로 동적 로드. DevTools Network 탭에서 2종류 엔드포인트 확인:
- `total` — 블로그 전체 대시보드 (8개 데이터셋 한번에)
- `cv` — 개별 게시글 조회수 (일간/주간)

## 🛠️ 엔드포인트 구조

### total 엔드포인트 (블로그 전체)

`total?timeDimension=DATE&startDate=YYYY-MM-DD&content...ticleInfo,dashboard...`

| dataId | 내용 | 비고 |
|--------|------|------|
| `cv` | 15일간 일별 조회수 + 비율(cv_p) | 블로그 전체 |
| `dashboard` | 오늘 실시간 (dailyCv, dailyLike, dailyComment, dailyPlayCount, dailyRelationDelta) | |
| `weekAndMonthAnalysis` | UV, 재방문율(revisit), 평균방문수(averageVisit) | DOM에선 못 얻는 데이터 |
| `rankCv` | 인기글 TOP 6 (title, uri, cv, rank, createDate) | |
| `refererTotal` | 유입경로별 조회수 (네이버검색 모바일/PC, Daum 등) | |
| `refererDetail` | 유입 검색어 TOP 20 (searchQuery, cv, referrerUrl) | |
| `refererTotalCount` | 총 유입수 | |
| `rank_play_cnt` | 동영상 재생 랭킹 | |

### cv 엔드포인트 (개별 게시글)

`cv?timeDimension=DATE|WEEK&startDate=YYYY-MM-DD&content...clude=articleInfo...`

```json
{
  "columnInfo": ["date", "cv", "cv_p"],
  "rows": {
    "date": ["2026-02-23", ...],
    "cv": [17, 9, ...],
    "cv_p": [36.17, ...]
  }
}
```

- `cv` = Content View (조회수)
- `cv_p` = 전체 대비 비율 (%)
- `timeDimension`: DATE(일간 15일) / WEEK(주간 15주)

## 🔧 현행 대비 비교

| | 현행 (naver.js DOM 파싱) | API 직접 호출 |
|---|---|---|
| 방식 | `u_ni_item`, `u_ni_value` 셀렉터 | Fetch API |
| 범위 | 단일 날짜, 단일 게시글 | 15일/15주 한번에 |
| 데이터 | views, likes, comments | + UV, 재방문율, 유입경로, 검색어, 인기글 |
| 안정성 | DOM 구조 변경 시 깨짐 | API 스키마가 더 안정적 |
| 인증 | content script (로그인 세션) | 동일 (쿠키 기반) |

## 💡 실용적 평가

**장점**:
- X/Facebook(GraphQL API 방식)과 통일 가능
- 한 호출로 15일치 + 유입경로 + 검색어까지 수집
- DOM 셀렉터 변경에 의존하지 않아 유지보수 용이

**테스트 필요 (TODO)**:
- API 엔드포인트 정확한 URL 패턴 확인 (쿼리 파라미터 전체)
- 인증 방식 확인 (쿠키? 토큰?)
- rate limit 확인
- 여러 블로그 계정에서 동작 여부

## 🔗 관련 개념

- [[naver-extractor]] - (현재 DOM 파싱 방식, API 전환 대상)
- [[extract-daily-stats]] - (현행 추출 함수, API 방식으로 교체 가능)
- [[011-chrome-extension-naver-stats]] - (초기 개발 워크케이스, DOM 파싱으로 시작한 경위)
- [[SNS 기초 데이터 수집 자동화]] - (상위 프로젝트, 3개 플랫폼 모두 API 통일 가능)
- [[REF-077 Meta Business Suite 게시물별 GraphQL API 분석]] - (Facebook도 유사하게 API 구조 분석한 레퍼런스)

---

**작성일**: 2026-03-05
**분류**: SNS 데이터 수집 / API 분석