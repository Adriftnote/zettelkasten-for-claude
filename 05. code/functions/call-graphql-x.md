---
title: call-graphql-x
type: function
permalink: functions/call-graphql-x
level: low
category: automation/sns/api
semantic: call graphql api
path: working/worker/from-code/social-analytics-extractor/content/x.js
tags:
- javascript
- graphql
- fetch
---

# call-graphql-x

X GraphQL API (AccountOverviewQuery) 호출

## 시그니처

```javascript
async function callGraphQL(): Promise<object>
```

## Observations

- [impl] Bearer Token(고정) + CSRF Token 헤더로 인증 #pattern
- [impl] 날짜 범위는 getDateRangeFromPage()에서 가져옴 #algo
- [return] GraphQL 응답 JSON 객체
- [deps] fetch API, getCsrfToken, getDateRangeFromPage #import
- [note] GRAPHQL_URL은 AccountOverviewQuery 엔드포인트 #context

## 코드

```javascript
async function callGraphQL() {
  const csrfToken = getCsrfToken();
  const { from_time, to_time } = getDateRangeFromPage();
  
  const variables = {
    requested_metrics: ["Engagements", "Impressions", "Follows", ...],
    to_time, from_time,
    granularity: "Daily"
  };
  
  const response = await fetch(url, {
    headers: {
      'authorization': `Bearer ${BEARER_TOKEN}`,
      'x-csrf-token': csrfToken
    }
  });
  return response.json();
}
```

## Relations

- part_of [[x-extractor]] (소속 모듈)
- depends_on [[get-csrf-token]] (CSRF 토큰 필요)