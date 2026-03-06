---
title: collect-naver-blog
type: function
permalink: functions/collect-naver-blog
level: low
category: automation/sns/collection
semantic: collect naver blog post view ranks via iframe
path: C:\claude-workspace\working\projects\playwright-test\run-posts.js
tags:
- javascript
- playwright
- naver-blog
---

# collect-naver-blog

네이버 블로그 게시물 조회수 순위 수집 (iframe DOM 파싱)

## 시그니처

```javascript
async function collectNaverBlog(page: Page, capturedAt: string): Promise<Array<object>>
```

## Observations

- [impl] `admin.blog.naver.com/.../stat/today` 접속 후 `page.frames()`를 순회하여 `blog.stat.naver.com` iframe 탐색 #algo
- [impl] iframe 내 `<table>` 순회 → 헤더에 '순위', '조회수' 포함된 테이블 탐지 #algo
- [impl] `<td>` 첫 셀이 숫자인 행만 데이터 행으로 필터 (헤더 행 제외) #pattern
- [impl] post_id: `<a>` href의 `/(\d+)$` 또는 `logNo=(\d+)` 정규식 추출, 없으면 `rank-N` 폴백 #caveat
- [return] platform='naver_blog' 레코드 배열 (당일 조회수 상위 게시물)
- [note] iframe URL이 `blog.stat.naver.com`인 frame이 없으면 빈 배열 반환 #caveat

## Relations

- part_of [[run-posts-collector]] (소속 모듈)
- called_by [[run-main]] (line 497)