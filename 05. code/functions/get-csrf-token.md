---
title: get-csrf-token
type: function
permalink: functions/get-csrf-token
level: low
category: automation/sns/auth
semantic: get csrf token
path: working/worker/from-code/social-analytics-extractor/content/x.js
tags:
- javascript
- authentication
---

# get-csrf-token

쿠키에서 X(Twitter) CSRF 토큰(ct0) 추출

## 시그니처

```javascript
function getCsrfToken(): string | null
```

## Observations

- [impl] document.cookie를 파싱하여 ct0 쿠키 값 추출 #algo
- [return] ct0 토큰 문자열 또는 null
- [deps] document.cookie #import
- [note] X 로그인 상태에서만 토큰 존재 #context

## 코드

```javascript
function getCsrfToken() {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'ct0') return value;
  }
  return null;
}
```

## Relations

- part_of [[x-extractor]] (소속 모듈)
- data_flows_to [[call-graphql-x]] (토큰 → API 호출)