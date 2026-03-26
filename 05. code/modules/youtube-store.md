---
title: youtube-store
type: note
permalink: zettelkasten/05.-code/modules/youtube-store
tags:
- module
- go
- store
- youtube
---

## 경로
`internal/store/youtube.go`

## 역할
YouTube 플랫폼 상세 페이지 데이터 (596줄) — legacy이나 상세 페이지용으로 현역

## 주요 함수 (10개)
- **get-you-tube**: YouTube 상세 데이터 조합
- **query-video-views-stacked**: 30일 비디오별 일별 조회수 stacked chart
- **query-retention-chart**: 리텐션 곡선
- **query-realtime48h-chart**: 48시간 실시간 차트
- **query-top-videos-enhanced**: 상위 비디오 강화 데이터
- 등 10개 함수

## Relations
- part_of [[MOT 실시간 대시보드]]
- depends_on [[multi]]

## Observations
- [impl] 가장 큰 플랫폼 store (596줄) — 상세 차트 5종 제공 #context
- [impl] 30일 비디오별 일별 조회수 stacked chart, 48시간 실시간, 리텐션 곡선 #pattern
- [note] v2에서 제네릭 상세 페이지 전환 시 가장 복잡한 마이그레이션 대상 #context
- [impl] 고정 20색 팔레트로 비디오별 색상 배정 #impl