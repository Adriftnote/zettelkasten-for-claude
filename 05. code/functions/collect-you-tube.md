---
title: collect-you-tube
type: function
permalink: functions/collect-you-tube
level: low
category: automation/sns/collection
semantic: collect youtube studio video view counts
path: C:\claude-workspace\working\projects\playwright-test\run-posts.js
tags:
- javascript
- playwright
- youtube
---

# collect-you-tube

YouTube Studio 동영상 및 Shorts 조회수 수집 (DOM 파싱)

## 시그니처

```javascript
async function collectYouTube(page: Page, capturedAt: string): Promise<Array<object>>
```

## Observations

- [impl] 동영상 탭(`videos/upload`) + Shorts 탭(`videos/short`) 순차 수집 후 중복 제거 (Set 기반) #algo
- [impl] `ytcp-video-row` 커스텀 엘리먼트 탐색 → `#video-title`, `.tablecell-views`, `a[href*="/video/"]` 선택 #pattern
- [impl] 최대 20개 (탭당 10개), 중복 videoId 제거 후 youtube 플랫폼 레코드로 변환 #pattern
- [return] platform='youtube' 레코드 배열
- [note] `accounts.google.com` URL 감지 시 로그인 만료 throw #context
- [note] YOUTUBE_CHANNEL_ID 상수(`UCWpvotHqOrqnaT_cielUzRQ`)를 URL에 직접 삽입 #context

## Relations

- part_of [[run-posts-collector]] (소속 모듈)
- called_by [[run-main]] (line 475)