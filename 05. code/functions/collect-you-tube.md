---
title: collect-you-tube
type: function
permalink: 05.-code/functions/collect-you-tube
level: low
category: data/sns/analytics
semantic: collect youtube post view counts via api interception
path: C:/claude-workspace/working/projects/playwright-test/run-posts.js
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

- [impl] `page.on('response')` 이벤트로 URL에 `list_creator_videos` 포함된 응답 가로채기 — API 직접 호출 대신 브라우저 세션 활용 #pattern
- [impl] 동영상 탭(`videos/upload`) + Shorts 탭(`videos/short`) 순차 처리 — 탭 전환 시 `apiResponses` 배열 초기화 #algo
- [impl] `videosTotalSize.size`로 전체 개수 파악 → "다음" 버튼(`aria-label="다음"` 또는 `#navigate-after`) 클릭으로 페이지네이션 — 최대 20페이지 #algo
- [impl] `Set`으로 `videoId` 중복 제거 — 탭 간 동일 영상 방지 #pattern
- [impl] 조회수 추출: `publicMetrics.externalViewCount || publicMetrics.viewCount` — 필드명 버전별 차이 대응 #caveat
- [return] `{platform:'youtube', post_id, post_title, view_count, captured_at}[]`
- [usage] `const records = await collectYouTube(page, capturedAt);`
- [note] 탭 이동 후 8초 대기 — API 응답 수신 완료 대기 (하드코딩된 타임아웃) #caveat
- [note] 수집 완료 후 `page.removeAllListeners('response')` — 다른 수집기와 리스너 충돌 방지 #pattern

## Relations

- part_of [[run-posts]] (소속 모듈)
- called_by [[run]] (line 532)