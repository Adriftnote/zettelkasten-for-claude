---
title: collect-you-tube
type: function
permalink: 05.-code/functions/collect-you-tube
level: low
category: data/sns/analytics
semantic: collect youtube post view counts via api interception
path: C:/claude-workspace/working/projects/playwright-test/collect-posts.js
tags:
- javascript
- playwright
- youtube
---

# collectYouTube

YouTube Studio의 list_creator_videos API 응답을 Playwright response 가로채기로 수집하는 함수. 동영상 + Shorts 탭을 순차 처리하며 페이지네이션 지원.

## 시그니처

```javascript
async function collectYouTube(page: Page, capturedAt: string): Promise<object[]>
```

## Observations
- [impl] **SPA request capture**: `page.on('request')` + `page.on('response')`로 SPA가 내부 호출하는 `list_creator_videos` API의 헤더+바디를 통째로 캡처 — delegation context, eats token 등 세션 토큰이 body에 포함되어 있어 수동 구성 불가 #pattern
- [impl] **Page Visibility API override**: `addInitScript`로 `document.visibilityState='visible'`, `document.hidden=false` — headless:false + off-screen 윈도우에서 SPA가 정상 초기화되도록 강제 #pattern
- [impl] **pageToken 페이지네이션**: 캡처한 요청 body의 `pageToken` 필드만 교체하며 `page.evaluate` 내에서 fetch 반복 — 최대 20페이지, DOM 스크롤 불필요 #algo
- [impl] `/videos/short` URL로 직접 접속 — Shorts 전용 탭. `/videos/upload`는 롱폼만 표시하므로 Shorts 채널에서 0건 반환 #caveat
- [impl] SPA 첫 응답 대기: 1초 간격 polling × 최대 15회 — 로그인 만료 시 `accounts.google.com` 리다이렉트 감지 #algo
- [impl] `Set`으로 `videoId` 중복 제거 — SPA 응답 + API 재호출 간 중복 방지 #pattern
- [impl] 조회수 추출: `publicMetrics.externalViewCount || publicMetrics.viewCount` — 필드명 버전별 차이 대응 #caveat
- [return] `{platform:'youtube', post_id, post_title, view_count, captured_at}[]`
- [usage] `const records = await collectYouTube(page, capturedAt);`
- [note] 수집 완료 후 `page.removeAllListeners('response')` + `removeAllListeners('request')` — 다른 수집기와 리스너 충돌 방지 #pattern
- [note] headless 모드에서는 SPA가 내부 API를 호출하지 않음 — 반드시 headless:false 필요 (off-screen 윈도우 + visibility override로 해결) #caveat
## Relations
- part_of [[collect-posts]] (소속 모듈)
- called_by [[run]] (line 717, parallel via Promise.allSettled)
## collectYouTube
YouTube Studio의 list_creator_videos API를 SPA request capture 방식으로 수집하는 함수. SPA가 내부적으로 보내는 첫 번째 요청의 헤더+바디를 통째로 캡처한 뒤, pageToken만 교체하며 후속 페이지를 수집하여 Shorts 전체를 가져온다.