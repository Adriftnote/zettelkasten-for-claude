---
title: run-verify-integrity
type: function
permalink: functions/run-verify-integrity
level: low
category: data/sns/validation
semantic: run integrity verification report
path: C:/claude-workspace/working/projects/playwright-test/verify-integrity.js
tags:
- javascript
- sqlite
---

# run-verify-integrity

verify-integrity 모듈의 진입점. CLI 인수로 날짜 범위를 받아 Naver Blog, TikTok, Meta 3개 플랫폼의 정합성 검증을 실행하고 텍스트 또는 JSON 리포트를 출력한다.

## 시그니처

```js
function run()
```

## Observations

- [impl] `--from/--to` 없으면 DB에 있는 모든 날짜 자동 탐색 #pattern
- [impl] `--json` 플래그 시 `JSON.stringify(report, null, 2)` 출력, 아니면 텍스트 리포트 #pattern
- [impl] Naver Blog는 `verifyNaverBlog(date)` 1개 호출, TikTok/Meta는 `verifyCumulative` + 날짜쌍(i, i-1) 반복 #algo
- [return] void (stdout 출력)

## Relations

- part_of [[verify-integrity]] (소속 모듈)
- calls [[date-range]] (line 179)
- calls [[verify-naver-blog]] (line 198)
- calls [[verify-cumulative]] (line 206)