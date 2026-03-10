---
title: run-run-posts
type: function
permalink: functions/run-run-posts
level: low
category: data/sns/analytics
semantic: orchestrate all platform collection and webhook dispatch
path: C:/claude-workspace/working/projects/playwright-test/collect-posts.js
tags:
- javascript
- playwright
---

# run (run-posts)

전 플랫폼 수집기를 순차 실행하고 결과를 webhook으로 전송하는 메인 오케스트레이션 함수.

## 시그니처

```javascript
async function run(): Promise<void>
```

## Observations

- [impl] Playwright `chromium.launchPersistentContext(USER_DATA_DIR, {headless: false})` — 퍼시스턴트 세션, 자동화 감지 비활성화(`--disable-blink-features=AutomationControlled`) #pattern
- [impl] 수집 순서: YouTube → 네이버TV → 네이버 블로그 → Meta → TikTok — 각각 독립 try-catch로 부분 실패 허용 #algo
- [impl] `allRecords`에 성공한 플랫폼 레코드 누적 → `sendToWebhook` 일괄 전송 #pattern
- [impl] `results` 배열로 플랫폼별 성공/실패 + 수집 건수 추적 → 실행 완료 후 요약 출력 #pattern
- [return] void — 에러는 `run().catch(console.error)`로 최상위 캐치
- [usage] `node collect-posts.js` 실행 시 자동 호출 (`run().catch(console.error)`)
- [note] 단일 `page` 객체로 전 플랫폼 순차 처리 — 플랫폼 간 탭/컨텍스트 공유 #pattern

## Relations

- part_of [[collect-posts]] (소속 모듈)
- calls [[get-captured-at]] (line 512)
- calls [[collect-you-tube]] (line 532)
- calls [[collect-naver-tv]] (line 543)
- calls [[collect-naver-blog]] (line 554)
- calls [[collect-meta]] (line 565)
- calls [[collect-tik-tok]] (line 576)
- calls [[send-to-webhook]] (line 589)