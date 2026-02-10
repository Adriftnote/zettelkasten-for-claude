---
title: facebook-extractor
type: module
permalink: modules/facebook-extractor
level: low
category: automation/sns/extraction
semantic: extract facebook statistics
path: working/projects/social-analytics-extractor/content/facebook.js
tags:
- javascript
- graphql
- content-script
---

# facebook-extractor

Meta Business Suite GraphQL로 인사이트 데이터 추출 (451줄, 10개 함수)

## Observations

- [impl] fb_dtsg + lsd 토큰으로 GraphQL 인증 #pattern
- [impl] 3가지 개별 쿼리로 조회수/반응수/팔로워 추출 #algo
- [impl] 일별 데이터는 별도 doc_id 사용 #pattern
- [impl] 날짜 범위는 페이지 UI에서만 결정 (popup requestedDays 제거) #algo
- [deps] fetch API, chrome.runtime #import
- [note] Meta API 응답 앞에 "for (;;);" 제거 필요 #caveat

## 함수 목록

| 함수 | 역할 |
|------|------|
| `extractTokens()` | fb_dtsg, lsd 토큰 추출 |
| `extractPageId()` | 페이지 ID 추출 |
| `getDateRangeFromPage()` | 날짜 범위 파싱 |
| `callGraphQL()` | GraphQL API 호출 |
| `getViews()` | 조회수 조회 |
| `getEngagement()` | 반응수 조회 |
| `getFollowers()` | 팔로워 변화 조회 |
| `getAllInsights()` | 기간 합계 조회 |
| `getDailyLineData()` | 일별 라인 데이터 |
| `getDailyInsights()` | 일별 인사이트 (진입점) |

## Relations

- part_of [[social-analytics-extractor]] (소속 프로젝트)
- data_flows_to [[background-service-worker]] (추출 데이터 → webhook)


## Change Log

| 날짜 | 변경 내용 |
|------|----------|
| 2026-02-06 | path 수정: `worker/from-code/` → `projects/` |
| 2026-02-06 | 줄 수 수정: 452줄 → 451줄 |
| 2026-02-06 | 함수 개수 수정: 11개 → 10개 (실제 코드 반영) |
| 2026-02-06 | getDailyInsights() requestedDays 파라미터 제거, 페이지 UI 날짜만 사용 |
