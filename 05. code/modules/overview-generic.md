---
title: overview-generic
type: note
permalink: zettelkasten/05.-code/modules/overview-generic
semantic: module
category: code/modules
path: internal/store/overview_generic.go
tags:
- module
- go
- overview
---

## 역할
config 루프로 8개 플랫폼 Overview 카드 생성 (기존 하드코딩 overview.go 대체)

## 경로
`internal/store/overview_generic.go`

## 함수
- `GetOverviewGeneric` — 전체 Overview 데이터 생성 (cfg.Platforms 루프)
- `RankedToTopPosts` — 순위 데이터를 TopPost 슬라이스로 변환
- `CountActivePosts` — 활성 게시물 수 집계
- `CountCampaigns` — 캠페인 수 집계

## Relations
- part_of [[MOT 실시간 대시보드]]
- depends_on [[config]]
- depends_on [[generic-query]]
- contains [[get-overview-generic]]
- contains [[ranked-to-top-posts]]
- contains [[count-active-posts]]
- contains [[count-campaigns]]

## Observations
- [impl] cfg.Platforms 루프 — 플랫폼 추가 시 코드 변경 없이 YAML만 수정 #architecture
- [impl] organic: TopPosts 3개 + PostCount, ads: CampaignBreakdown + Extra metrics #pattern
- [impl] 에러 시 빈 카드 append (graceful degradation) #pattern