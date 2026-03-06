---
title: collect-naver-tv
type: function
permalink: functions/collect-naver-tv
level: low
category: automation/sns/collection
semantic: collect naver tv clip view counts
path: C:\claude-workspace\working\projects\playwright-test\run-posts.js
tags:
- javascript
- playwright
- naver-tv
---

# collect-naver-tv

네이버TV 최근 클립 조회수 수집 (apis.naver.com 내부 API)

## 시그니처

```javascript
async function collectNaverTV(page: Page, capturedAt: string): Promise<Array<object>>
```

## Observations

- [impl] `creator.tv.naver.com/` 접속 → 리다이렉트된 URL에서 channelId 추출 #algo
- [impl] channelId 추출 순서: URL 패턴(`/channel/[id]`) → HTML 정규식(`"channelId":"..."`) #algo
- [impl] `page.evaluate()` 내부에서 `apis.naver.com/creator-studio-web/navertv_studio/.../clips` API 직접 fetch — `credentials: include`로 인증 통과 #pattern
- [impl] 응답 구조 `data?.result?.items || data?.items` — 버전별 응답 차이 방어 처리 #caveat
- [impl] post_id: `item.itemNo || item.clipNo || item.id`, view_count: `item.totalPlayCount || item.playCount` — 필드명 다중 폴백 #caveat
- [return] platform='naver_tv' 레코드 배열 (최대 10개)
- [note] 로그인 만료 시 `login` 또는 `nid.naver.com` URL 감지 → throw #context

## Relations

- part_of [[run-posts-collector]] (소속 모듈)
- called_by [[run-main]] (line 486)