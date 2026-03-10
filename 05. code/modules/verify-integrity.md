---
title: verify-integrity
type: module
permalink: modules/verify-integrity
level: high
category: data/sns/validation
semantic: verify sns data integrity
path: C:/claude-workspace/working/projects/playwright-test/verify-integrity.js
tags:
- javascript
- sqlite
- validation
- sns
---

# verify-integrity

collect-posts.js(게시물별 스냅샷)와 collect-channels.js(채널 일별 요약) 수집 결과 간 정합성을 검증하는 CLI 도구.

## 개요

`post_view_snapshots`(게시물별 누적 조회수)와 `daily_channel_summary`(채널 레벨 일별 집계)를 대조하여 두 수집기의 데이터 일치율을 검증한다. Naver Blog(당일 절대값 비교)와 TikTok/Meta(누적→증분 변환 후 비교) 두 가지 검증 전략을 사용한다.

## Observations

- [impl] CLI 파싱: `--db`, `--from`, `--to`, `--json` 인자로 검증 범위 지정 #pattern
- [impl] Naver Blog 전략: 마지막 스냅샷 시각의 조회수 합산 vs `daily_channel_summary.views` 직접 비교 #algo
- [impl] TikTok/Meta 전략: 당일/전일 마지막 스냅샷 차분(증분) 계산 → 채널 일별 합산과 비교 #algo
- [impl] `matchRate` = `min/max` — 양쪽 값 중 큰 쪽 대비 작은 쪽 비율 (90% 이상 PASS) #algo
- [impl] Meta 검증 시 `channelPlatforms: ['facebook', 'instagram']` — Meta post_view_snapshots가 FB+IG 통합이므로 양쪽 합산 #pattern
- [deps] `better-sqlite3`, `path` (Node.js 내장) #import
- [usage] `node verify-integrity.js --db "./dashboard_atomic.db" --from 2026-03-10 --to 2026-03-14` #usage
- [usage] `--json` 플래그로 JSON 리포트 출력 가능 #usage
- [note] `PASS_THRESHOLD = 0.90` — 90% 이상이면 PASS #context
- [note] Naver Blog에 `오늘 전체 조회수` 특수 행이 있으면 합산 대신 해당 값 우선 사용 #caveat

## 검증 전략 비교

| 플랫폼 | 전략 | 이유 |
|--------|------|------|
| Naver Blog | 절대값 직접 비교 | collect-posts가 당일 누적값 수집 |
| TikTok | 증분(당일-전일) vs 채널 일별 | collect-posts가 누적 조회수 수집 |
| Meta | 증분(당일-전일) vs FB+IG 합산 | collect-posts가 누적 조회수, collect-channels는 분리 수집 |

## 리포트 스키마

```js
{
  period: { from: "YYYY-MM-DD", to: "YYYY-MM-DD" },
  executedAt: string,
  platforms: {
    naver_blog: [{ date, postSum, channelViews, lastSnapshot, diff, matchRate }],
    tiktok: [{ date, postSum, channelViews, lastSnapshot, prevSnapshot, matchedPosts, newPosts, diff, matchRate }],
    meta: [{ ... }]
  }
}
```

## Relations

- part_of [[SNS 게시물별 조회수 추적]] (소속 프로젝트)
- contains [[get-arg]]
- contains [[date-range]]
- contains [[get-channel-daily]]
- contains [[verify-naver-blog]]
- contains [[verify-cumulative]]
- contains [[run]]
  - run calls [[date-range]] (line 179)
  - run calls [[verify-naver-blog]] (line 198)
  - run calls [[verify-cumulative]] (line 206)
  - verify-cumulative calls [[get-channel-daily]] (line 158)
  - verify-naver-blog calls [[get-channel-daily]] (line 81)
- depends_on [[better-sqlite3]]
- validates [[collect-posts]] (게시물별 스냅샷 검증)
- validates [[collect-channels]] (채널 일별 요약 검증)