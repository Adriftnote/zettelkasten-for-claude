---
title: collect-naver-tv
type: function
permalink: 05.-code/functions/collect-naver-tv
level: low
category: data/sns/analytics
semantic: collect naver tv post view counts
path: C:/claude-workspace/working/projects/playwright-test/run-posts.js
tags:
- javascript
- playwright
- naver
---

# collectNaverTV

네이버TV 크리에이터 스튜디오 API를 통해 채널 클립 목록과 조회수를 수집하는 함수.

## 시그니처

```javascript
async function collectNaverTV(page: Page, capturedAt: string): Promise<object[]>
```

## Observations

- [impl] `creator.tv.naver.com`에 접속 후 리다이렉트 URL 또는 HTML에서 `channelId` 추출 — URL 패턴 `/channel/([^\/\?]+)` 또는 HTML regex `"channelId":"..."` #algo
- [impl] `page.evaluate()` 내에서 `apis.naver.com/creator-studio-web/.../clips?pageSize=100` API를 `credentials: 'include'`로 fetch — 세션 쿠키 자동 포함 #pattern
- [impl] API 응답 구조: `data?.result?.items || data?.items` — 버전별 응답 차이 대응 #caveat
- [return] `{platform:'naver_tv', post_id, post_title, view_count, captured_at}[]`
- [usage] `const records = await collectNaverTV(page, capturedAt);`
- [note] 로그인 만료 감지: URL에 `login` 또는 `nid.naver.com` 포함 시 Error throw #caveat

## Relations

- part_of [[run-posts]] (소속 모듈)
- called_by [[run]] (line 543)