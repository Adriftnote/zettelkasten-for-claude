---
title: extract-daily-stats
type: function
permalink: functions/extract-daily-stats
level: low
category: automation/sns/extraction
semantic: extract naver daily stats
path: working/worker/from-code/social-analytics-extractor/content/naver.js
tags:
- javascript
- dom-parsing
---

# extract-daily-stats

네이버 블로그 통계 페이지에서 일간 데이터 DOM 파싱

## 시그니처

```javascript
function extractDailyStats(): object
```

## Observations

- [impl] CSS 셀렉터로 통계 항목 파싱 (u_ni_item, u_ni_value) #algo
- [impl] 날짜는 3가지 패턴으로 추출 시도 #pattern
- [return] { date, views, likes, comments, neighbors, interactions }
- [deps] document.querySelectorAll #import

## 코드

```javascript
function extractDailyStats() {
  const results = { date: getTodayDate(), views: 0, likes: 0, ... };
  
  // 날짜 추출 (3가지 패턴)
  const bodyText = document.body?.innerText || '';
  let dateMatch = bodyText.match(/(\d{4})\.(\d{2})\.(\d{2})\.\s*\d{2}:\d{2}\s*기준/);
  
  // 통계 항목 파싱
  const items = document.querySelectorAll('[class*="u_ni_item"]');
  items.forEach(item => {
    const label = item.querySelector('[class*="u_ni_title"]')?.textContent;
    const value = parseNumber(item.querySelector('[class*="u_ni_value"]')?.textContent);
    // LABEL_MAP으로 매핑
  });
  
  return results;
}
```

## LABEL_MAP

```javascript
{ '조회수': 'views', '공감수': 'likes', '댓글수': 'comments', '이웃증감': 'neighbors' }
```

## Relations

- part_of [[naver-extractor]] (소속 모듈)