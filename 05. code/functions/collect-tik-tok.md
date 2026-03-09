---
title: collect-tik-tok
type: function
permalink: 05.-code/functions/collect-tik-tok
level: low
category: data/sns/analytics
semantic: collect tiktok post view counts via api interception
path: C:/claude-workspace/working/projects/playwright-test/run-posts.js
tags:
- javascript
- playwright
- tiktok
---

# collectTikTok

TikTok Studio의 item_list 내부 API 응답을 response 가로채기로 수집하는 함수. API 실패 시 DOM fallback 포함.

## 시그니처

```javascript
async function collectTikTok(page: Page, capturedAt: string): Promise<object[]>
```

## Observations

- [impl] `page.on('response')`로 `/creator/manage/item_list/v1` URL 포함 응답 가로채기 — 페이지 로드 시 자동 호출되는 API 수집 #pattern
- [impl] API 응답 필드: `item_id`(영상 ID), `desc`(제목), `play_count`(조회수 문자열) #algo
- [impl] DOM fallback: API 응답 없을 시 `a[href*="/video/"]` 링크에서 videoId 추출 + 상위 row의 span 텍스트에서 숫자 파싱 — 신뢰도 낮음 #caveat
- [impl] `Set`으로 `item_id` 중복 제거 — 복수 API 호출로 인한 중복 방지 #pattern
- [return] `{platform:'tiktok', post_id, post_title, view_count, captured_at}[]`
- [usage] `const records = await collectTikTok(page, capturedAt);`
- [note] 로그인 만료 감지: URL에 `login` 또는 `passport` 포함 시 Error throw — 퍼시스턴트 컨텍스트에서 TikTok 직접 로그인 필요 #caveat
- [note] 수집 완료 후 `page.removeAllListeners('response')` 필수 #pattern

## Relations

- part_of [[run-posts]] (소속 모듈)
- called_by [[run]] (line 576)