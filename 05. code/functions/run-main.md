---
title: run-main
type: function
permalink: functions/run-main
level: low
category: automation/sns/collection
semantic: orchestrate all platform collectors and send results
path: C:\claude-workspace\working\projects\playwright-test\run-posts.js
tags:
- javascript
- playwright
---

# run-main

6개 플랫폼 수집 오케스트레이터 및 webhook 전송 (run-posts.js 진입점)

## 시그니처

```javascript
async function run(): Promise<void>
```

## Observations

- [impl] `chromium.launchPersistentContext(USER_DATA_DIR, { headless: false })` — 봇 탐지 회피 설정 포함 #pattern
- [impl] 실행 순서: YouTube → 네이버TV → 네이버 블로그 → Meta → TikTok → webhook 전송 #algo
- [impl] 각 플랫폼 try/catch 독립 처리 — 실패해도 계속 진행, results 배열에 성공/실패 기록 #pattern
- [impl] 모든 수집 완료 후 `allRecords` 일괄 webhook POST — 플랫폼별 분리 전송 아님 #pattern
- [return] void — 콘솔에 결과 요약 출력 후 context.close()

## Relations

- part_of [[run-posts-collector]] (소속 모듈)
- calls [[get-captured-at]] (line 455)
- calls [[collect-you-tube]] (line 475)
- calls [[collect-naver-tv]] (line 486)
- calls [[collect-naver-blog]] (line 497)
- calls [[collect-meta]] (line 508)
- calls [[collect-tik-tok]] (line 519)
- calls [[send-to-webhook]] (line 532)