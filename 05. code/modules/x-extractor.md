---
title: x-extractor
type: module
permalink: modules/x-extractor
level: low
category: automation/sns/extraction
semantic: extract x statistics
path: working/projects/social-analytics-extractor/content/x.js
tags:
- javascript
- graphql
- content-script
---

# x-extractor

X(Twitter) Analytics GraphQL API에서 통계 데이터 추출 (251줄, 8개 함수)

## Observations

- [impl] GraphQL API (AccountOverviewQuery) 직접 호출 #algo
- [impl] Bearer Token(고정) + CSRF Token(쿠키) 인증 #pattern
- [impl] 날짜 범위는 기간 탭(7D/2W/4W/3M/1Y) 텍스트색으로 감지 (선택=rgb(0,0,0), 비선택=rgb(230,233,234)) #algo
- [impl] 표준 액션: `getDailyInsights` (기존 `getInsights`도 하위호환) #pattern
- [deps] fetch API, document.cookie, chrome.runtime #import
- [note] Bearer Token은 X 웹 클라이언트 공개 토큰 (고정값) #context

## 함수 목록

| 함수 | 역할 |
|------|------|
| `getCsrfToken()` | 쿠키에서 ct0 값 추출 |
| `getDateRangeFromPage()` | 페이지 UI에서 날짜 범위 파싱 |
| `calculateDateRange(days)` | N일 기준 날짜 범위 계산 |
| `callGraphQL()` | GraphQL API 호출 |
| `formatTimestamp(ts)` | timestamp를 YYYY-MM-DD로 변환 |
| `parseTimeSeriesData(data)` | API 응답에서 일별 데이터 추출 |
| `getAllInsights()` | 전체 인사이트 수집 (진입점) |
| `checkPage()` | 페이지 상태 확인 |

## Relations

- part_of [[social-analytics-extractor]] (소속 프로젝트)
- data_flows_to [[background-service-worker]] (추출 데이터 → webhook)


## Change Log

| 날짜 | 변경 내용 |
|------|----------|
| 2026-02-06 | path 수정: `worker/from-code/` → `projects/` |
| 2026-02-06 | 줄 수 수정: 252줄 → 251줄 (실제 코드 반영) |
| 2026-02-06 | 액션 통일: getInsights → getDailyInsights (하위호환 유지) |
| 2026-02-06 | getDateRangeFromPage() 수정: button 셀렉터 → 기간 탭(7D/2W/4W/3M/1Y) 텍스트색 감지 |
