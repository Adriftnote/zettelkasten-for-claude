---
title: test-tiktok-retention
type: module
permalink: modules/test-tiktok-retention
tags:
- javascript
- playwright
- tiktok
- retention-rate
- insight-api
level: medium
category: data/sns/tiktok-detail
semantic: fetch tiktok video retention rate
path: C:/claude-workspace/working/projects/playwright-test/test-tiktok-retention.js
---

# test-tiktok-retention

TikTok 영상별 유지율(retention rate) 커브를 `/aweme/v2/data/insight/` API로 수집하는 테스트 모듈. Playwright 세션 쿠키를 활용하여 크리에이터 센터 내부 API를 직접 호출한다.

## 개요

TikTok 크리에이터 스튜디오의 영상별 analytics 페이지에서 표시되는 유지율 그래프 데이터를 API로 추출한다. `video_retention_rate_realtime` insight type을 호출하면 1초 단위의 유지율 커브가 반환된다. 3초/5초/10초 유지율과 완시율을 추출할 수 있다.

## API 구조

```
GET /aweme/v2/data/insight/
  ?type_requests=[{"insigh_type":"video_retention_rate_realtime","aweme_id":"<VIDEO_ID>"}]
  &locale=ko-KR&aid=1988&app_name=tiktok_creator_center
  &device_platform=web_pc&tz_offset=32400

응답:
{
  "video_retention_rate_realtime": {
    "value": {
      "list": [
        {"timestamp": "0", "value": 1.0},      // 0초: 100%
        {"timestamp": "1000", "value": 0.5},    // 1초: 50%
        {"timestamp": "3000", "value": 0.18},   // 3초: 18%
        ...
      ]
    }
  }
}
```

## 사용 가능한 insight_type

| insight_type | 설명 |
|---|---|
| `video_retention_rate_realtime` | 1초 단위 유지율 커브 |
| `video_finish_rate_realtime` | 완시율 |
| `video_view_realtime` | 조회수 |
| `video_total_duration_realtime` | 총 시청 시간 |
| `video_per_duration_realtime` | 평균 시청 시간 |
| `video_new_follower_realtime` | 영상→신규 팔로워 |
| `video_traffic_source_percent_realtime` | 트래픽 소스 비율 |
| `video_vv_history_7d` | 7일 조회수 시계열 |
| `video_vv_history_48_hours` | 48시간 조회수 시계열 |

## Observations

- [impl] Playwright persistentContext로 TikTok 로그인 세션 유지 → page.evaluate에서 fetch(credentials:'include')로 API 직접 호출 #pattern
- [impl] timestamp는 밀리초 문자열 ("3000" = 3초) — 1초 간격으로 전체 영상 길이까지 반환 #context
- [note] 3초 유지율 = list에서 timestamp==="3000"인 항목의 value (0~1 비율) #context
- [note] 채널 overview API와 별개 — 채널 API에서는 video_finish_rate_history_7d가 null 반환. 영상별 analytics 페이지에서만 retention 데이터 반환 #caveat
- [note] `insigh_type` (오타 아님) — TikTok API 원본 파라미터명이 insigh_type #caveat
- [deps] `playwright.chromium`, `better-sqlite3` (향후 저장용) #import
- [usage] `node test-tiktok-retention.js` — 단독 실행 테스트 #usage

## Relations
- part_of [[SNS 게시물별 조회수 추적]] (소속 프로젝트)
- part_of [[playwright-sns-collector]] (상위 모듈 그룹)
- contains [[fetch-retention-rate]]
- contains [[extract-retention]]
- contains [[extract-finish-rate]]
  - extract-finish-rate calls [[fetch-retention-rate]] (line 89)
  - extract-finish-rate calls [[extract-retention]] (line 96)
- relates_to [[collect-posts]] (collect-posts의 TikTok 목록 수집 결과에 영상 ID를 받아 상세 유지율 수집)
- depends_on [[playwright]]