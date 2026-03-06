---
title: collect-tik-tok
type: function
permalink: functions/collect-tik-tok
level: low
category: automation/sns/collection
semantic: collect tiktok post view counts via api intercept
path: C:\claude-workspace\working\projects\playwright-test\run-posts.js
tags:
- javascript
- playwright
- tiktok
---

# collect-tik-tok

TikTok 게시물 조회수 수집 (내부 API 응답 가로채기)

## 시그니처

```javascript
async function collectTikTok(page: Page, capturedAt: string): Promise<Array<object>>
```

## Observations

- [impl] `page.on('response', ...)` 로 `/creator/manage/item_list/v1` API 응답 가로채기 — 페이지 로드 시 자동 호출됨 #algo
- [impl] `page.removeAllListeners('response')` — 수집 완료 후 리스너 정리 #pattern
- [impl] API 응답 없을 경우 DOM fallback: `a[href*="/video/"]` 링크에서 videoId 추출 + 부모 요소 스캔으로 viewCount 추출 시도 #caveat
- [impl] 중복 item_id는 Set으로 제거, 최종 10개만 반환 #pattern
- [return] platform='tiktok' 레코드 배열 (최대 10개)
- [note] 필드 매핑: `item.item_id || item.id`, `item.play_count`, `item.desc || item.title` #context
- [note] `login` 또는 `passport` URL 감지 시 로그인 만료 throw #context
- [note] DOM fallback의 숫자 파싱은 K/M/B suffix를 고려하지 않아 부정확할 수 있음 #caveat

## Relations

- part_of [[run-posts-collector]] (소속 모듈)
- called_by [[run-main]] (line 519)