---
title: extract-tokens-fb
type: function
permalink: functions/extract-tokens-fb
level: low
category: automation/sns/auth
semantic: extract facebook tokens
path: working/worker/from-code/social-analytics-extractor/content/facebook.js
tags:
- javascript
- authentication
---

# extract-tokens-fb

Facebook 페이지 HTML에서 fb_dtsg, lsd 토큰 추출

## 시그니처

```javascript
function extractTokens(): { fb_dtsg: string|null, lsd: string|null }
```

## Observations

- [impl] HTML에서 정규식으로 DTSGInitialData, LSD 패턴 매칭 #algo
- [impl] fallback으로 input[name="fb_dtsg"] 확인 #pattern
- [return] { fb_dtsg, lsd } 객체
- [deps] document.documentElement.innerHTML #import

## 코드

```javascript
function extractTokens() {
  const html = document.documentElement.innerHTML;
  
  // fb_dtsg 토큰
  const dtsgMatch = html.match(/"DTSGInitialData".*?"token":"([^"]+)"/);
  const fb_dtsg = dtsgMatch ? dtsgMatch[1] : null;
  
  // lsd 토큰
  const lsdMatch = html.match(/"LSD".*?\[.*?"([^"]+)"\]/);
  const lsd = lsdMatch ? lsdMatch[1] : null;
  
  return { fb_dtsg, lsd };
}
```

## Relations

- part_of [[facebook-extractor]] (소속 모듈)
- data_flows_to [[call-graphql-x]] (토큰 → API 호출)