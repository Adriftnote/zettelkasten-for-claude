---
title: detect-platform
type: function
permalink: functions/detect-platform
level: low
category: automation/sns/detection
semantic: detect sns platform
path: working/worker/from-code/social-analytics-extractor/popup.js
tags:
- javascript
- url-parsing
---

# detect-platform

URL로 SNS 플랫폼을 자동 감지하는 함수

## 📖 시그니처

```javascript
function detectPlatform(url) → string | null
```

## Observations

- [impl] URL 문자열에 플랫폼별 도메인 포함 여부 확인 #algo
- [return] 'facebook' | 'x' | 'naver' | null
- [usage] `const platform = detectPlatform(tab.url)`
- [deps] 없음 (순수 함수) #import

## 로직

```javascript
function detectPlatform(url) {
  if (url.includes('business.facebook.com')) return 'facebook';
  if (url.includes('x.com') || url.includes('twitter.com')) return 'x';
  if (url.includes('blog.naver.com') || url.includes('blog.stat.naver.com')) return 'naver';
  return null;
}
```

## Relations

- part_of [[popup-controller]] (소속 모듈)
- used_by [[popup-controller]] (UI 초기화 시 호출)