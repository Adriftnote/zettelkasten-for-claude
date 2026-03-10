---
title: collect-naver-blog
type: function
permalink: 05.-code/functions/collect-naver-blog
level: low
category: data/sns/analytics
semantic: collect naver blog post view counts via iframe api
path: C:/claude-workspace/working/projects/playwright-test/collect-posts.js
tags:
- javascript
- playwright
- naver
---

# collectNaverBlog

네이버 블로그 통계 페이지의 iframe 내 stat API를 통해 오늘 게시물별 조회수를 수집하는 함수.

## 시그니처

```javascript
async function collectNaverBlog(page: Page, capturedAt: string): Promise<object[]>
```

## Observations

- [impl] `admin.blog.naver.com/.../stat/rank_pv` 접속 → 5초 대기 → `page.frames()` 순회 — `blog.stat.naver.com` URL의 iframe만 대상 #algo
- [impl] iframe 내에서 `/api/blog/rank/cvContentPc?timeDimension=DATE&startDate=오늘` API 호출 — iframe context에서 세션 자동 포함 #pattern
- [impl] 응답 구조: `result.statDataList[0].data.rows` — `cv`(조회수), `uri`(post_id), `title`, `rank` 배열 #algo
- [impl] `daily_total` 레코드(전체 합계)를 개별 게시물 앞에 추가 — 채널 전체 조회수 트래킹 #pattern
- [return] `{platform:'naver_blog', post_id, post_title, view_count, captured_at}[]` — 첫 번째가 daily_total
- [usage] `const records = await collectNaverBlog(page, capturedAt);`
- [note] iframe을 통한 API 접근 — stat.naver.com 도메인 iframe이 없거나 데이터 없으면 빈 배열 반환 #caveat

## Relations

- part_of [[collect-posts]] (소속 모듈)
- called_by [[run]] (line 554)