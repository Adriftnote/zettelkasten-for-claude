---
title: SNS 게시물별 조회수 추적
type: project
permalink: projects/sns-post-view-tracking
level: high
category: data/sns/analytics
path: C:/claude-workspace/working/projects/playwright-test/
tags:
- playwright
- sns
- analytics
- javascript
---

# SNS 게시물별 조회수 추적

Playwright를 이용하여 5개 플랫폼(YouTube, 네이버TV, 네이버 블로그, Meta, TikTok) 게시물 조회수를 1시간 단위로 수집하고 n8n webhook으로 전송하는 스냅샷 수집기.

## 개요

각 플랫폼의 크리에이터 스튜디오/관리자 페이지에 Playwright 퍼시스턴트 컨텍스트로 접속하여 세션 쿠키를 재사용, 내부 API 또는 DOM을 통해 게시물별 조회수를 추출한다. 수집된 레코드는 `{platform, post_id, post_title, view_count, captured_at}` 구조로 n8n webhook에 일괄 전송되어 시계열 DB에 저장된다.

## 코드 구성
**모듈**
- collect-posts: 메인 수집 모듈 (5플랫폼 게시물별 조회수 스냅샷)
- collect-channels: 채널 일별 요약 수집 (Facebook, X, Naver Blog)
- setup: 세션 초기화 (최초 1회 수동 로그인)
- verify-integrity: 두 수집기 결과 정합성 검증 CLI

**함수 (collect-posts)**
- get-captured-at: KST 기준 시간 단위 반올림 타임스탬프 생성
- collect-naver-tv: 네이버TV creator API 수집
- collect-naver-blog: 블로그 stat API iframe 접근 수집
- collect-you-tube: YouTube Studio list_creator_videos API 가로채기 수집
- collect-tik-tok: TikTok Studio item_list API 가로채기 수집
- collect-meta: Meta GraphQL API 호출 수집
- call-graph-ql: Meta GraphQL endpoint POST 헬퍼
- fetch-edges: Meta tofu_unified_table edges 수집 with range fallback
- send-to-webhook: n8n webhook POST 전송 (collect-posts용)
- run: 전 플랫폼 순차 수집 + webhook 전송 진입점

**함수 (collect-channels)**
- normalize-for-webhook: 플랫폼별 raw → webhook 공통 스키마 정규화
- run-channel-collector: FB/X/Naver 채널 일별 요약 수집 + webhook 전송 진입점
- find-prev-button: Naver Blog iframe 이전 날짜 버튼 탐색
- extract-current-day: Naver Blog 7일치 통계 DOM 파싱

**함수 (setup)**
- playwright-setup: 퍼시스턴트 컨텍스트 생성 + 수동 로그인 대기

**함수 (verify-integrity)**
- get-arg: CLI 인수 파싱 헬퍼
- date-range: 날짜 범위 배열 생성
- get-channel-daily: daily_channel_summary 일별 조회수 조회
- verify-naver-blog: Naver Blog 정합성 검증 (절대값 비교)
- verify-cumulative: 누적형 플랫폼(TikTok, Meta) 정합성 검증 (증분 계산)
- run-verify-integrity: 전체 검증 실행 + 리포트 출력 진입점

## Relations
- contains [[collect-posts]]
- contains [[collect-channels]]
- contains [[setup]]
- contains [[verify-integrity]]
