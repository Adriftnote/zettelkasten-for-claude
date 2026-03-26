---
title: types
type: note
permalink: zettelkasten/05.-code/modules/types
tags:
- module
- go
- model
---

## 경로
`internal/model/types.go`

## 역할
전역 데이터 모델 — API 응답에 사용되는 모든 구조체 정의

## 구조체 (13개)
- **PlatformCard**: Overview 카드 (platform, total_views, diff, top_posts, campaign_breakdown, extra)
- **Alert**: 알림 (unused?)
- **TimeseriesPoint**: 시계열 데이터 포인트
- **ContentRow**: 콘텐츠 테이블 행 (uuid, title, platforms map)
- **OverviewResponse**: Overview API 응답 (cards 배열)
- **TopPost**: 상위 게시물 (id, title, views)
- **CampaignItem**: 광고 캠페인 항목 (name, value)
- **InfoCard**: 플랫폼 상세 정보 카드
- **ChartSeries**: 차트 데이터 시리즈
- **ChartData**: 차트 전체 (name, type, series)
- **RankedItem**: 순위 항목 (id, title, views)
- **TableData**: 테이블 데이터
- **PlatformDetail**: 플랫폼 상세 페이지 (info + charts + tables)

## Relations
- part_of [[MOT 실시간 대시보드]]

## Observations
- [impl] PlatformCard.Extra는 map[string]interface{} — 광고 추가 지표용 #pattern
- [impl] PlatformDetail이 플랫폼 상세 페이지의 통합 응답 구조 (Info+Charts+Tables) #pattern
- [impl] ContentRow.Platforms는 map[string]ContentPlatformData — 플랫폼별 조회수 #type
- [note] CampaignItem은 Name+Value 구조 (generic-query의 CampaignBreakdown이 이 타입 반환) #type