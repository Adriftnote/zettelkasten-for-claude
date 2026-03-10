---
title: SNS 채널 자동화 파이프라인 — automation-pipeline 완료 기록
type: note
permalink: 03.-sources/workcases/sns-caeneol-jadonghwa-paipeurain-automation-pipeline-wanryo-girog
tags:
- sns
- automation
- pipeline
- n8n
- sqlite
- channel
---

# SNS 채널 자동화 파이프라인 — automation-pipeline 완료 기록

## 상황
- SNS 채널 레벨 데이터 자동 수집 → 적재 → 집계 파이프라인
- 수동 데이터 집계를 자동화하여 업무 효율화
- 2025-12-03 완료

## 범위
- Channel 레벨 데이터 (Account/채널 전체 집계)
- Video 레벨은 별도 `video-analytics-pipeline`으로 분리

## 산출물 DB

| DB                     | 용도                   | 상태  |
| ---------------------- | -------------------- | --- |
| youtube_analytics.db   | YouTube Channel 분석   | 운영  |
| instagram_analytics.db | Instagram Account 분석 | 운영  |
| tiktok_analytics.db    | TikTok Video 분석      | 운영  |
| dashboard_atomic.db    | 대시보드용 통합 Atomic      | 운영  |

## Phase 구조 (17개+)
```
01: API 연동 (토큰 관리 포함)
02: 데이터 수집 (YouTube, Instagram, TikTok, Facebook 각각 설계)
03: SQLite 적재 (atomic DB 설계)
04: 자동 집계 (KPI 계산)
05: 검증
```

## 교훈
- Channel vs Video 레벨 분리가 중요 (규모/복잡도 차이)
- atomic DB 패턴: 원본 → 집계 → 대시보드 3단계
- 각 플랫폼별 API 특성이 달라 개별 Phase 필요

## 소스
- `C:\Projects\data-analytics\automation-pipeline\` (archive 대상)
- Video 레벨: `video-analytics-pipeline/` (활성, 유지)
