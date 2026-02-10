---
title: naver-extractor
type: module
permalink: modules/naver-extractor
level: low
category: automation/sns/extraction
semantic: extract naver statistics
path: working/projects/social-analytics-extractor/content/naver.js
tags:
- javascript
- dom-parsing
- content-script
---

# naver-extractor

네이버 블로그 통계 페이지에서 DOM 파싱으로 데이터 추출

## Observations

- [impl] DOM 셀렉터로 통계 항목 파싱 (u_ni_item, u_ni_value) #algo
- [impl] iframe 내부에서도 실행 (all_frames: true) #pattern
- [impl] 데이터 없는 frame은 응답하지 않음 → 다른 frame 응답 가능 #pattern
- [impl] 표준 액션: `getDailyInsights` (기존 `extract`도 하위호환) #pattern
- [impl] 표준 응답: `{ success, data: { extractedAt, period, totals, dailyData } }` #pattern
- [deps] document.querySelectorAll, chrome.runtime #import
- [note] 날짜는 3가지 패턴으로 추출 시도 (기준시간/선택기/URL) #algo
- [note] 단일 날짜 추출 (dailyData 배열 길이 1) #context

## 함수 목록

| 함수 | 역할 |
|------|------|
| `extractDailyStats()` | 통계 데이터 추출 (진입점) |
| `getTodayDate()` | 오늘 날짜 YYYY-MM-DD |
| `parseNumber(text)` | 숫자 파싱 (콤마 제거) |
| `toCSV(data)` | CSV 형식 변환 |
| `toDBFormat(data)` | DB 포맷 변환 |
| `hasStatsData()` | 데이터 존재 여부 확인 |

## LABEL_MAP

```javascript
{ '조회수': 'views', '공감수': 'likes', '댓글수': 'comments', 
  '이웃증감': 'neighbors', '동영상 재생수': 'videoViews' }
```

## Relations

- part_of [[social-analytics-extractor]] (소속 프로젝트)
- data_flows_to [[background-service-worker]] (추출 데이터 → webhook)


## Change Log

| 날짜 | 변경 내용 |
|------|----------|
| 2026-02-06 | path 수정: `worker/from-code/` → `projects/` |
| 2026-02-06 | 줄 수 수정: 195줄 → 193줄 |
| 2026-02-06 | 함수 개수 수정: 7개 → 6개 (실제 코드 반영) |
| 2026-02-06 | 액션 통일: extract → getDailyInsights (하위호환 유지), 응답구조 표준화 |
