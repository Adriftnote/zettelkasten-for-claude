---
title: content-generic
type: note
permalink: zettelkasten/05.-code/modules/content-generic
semantic: module
category: code/modules
path: internal/store/content_generic.go
tags:
- module
- go
- content
- cross-platform
---

## 역할
크로스플랫폼 콘텐츠 성과 조회 (x_contents + x_content_platforms JOIN)

## 경로
`internal/store/content_generic.go`

## 함수
- `GetContentGeneric` — 콘텐츠 목록 + 플랫폼별 조회수 통합
- `LoadContents` — x_contents 테이블 로드
- `LoadContentPlatforms` — x_content_platforms 테이블 로드
- `LatestViewsByID` — ID 기반 최신 조회수 (모드별 분기)
- `LatestViewsSnapshot` — 스냅샷 기반 최신 조회수
- `LatestViewsPreAgg` — 사전 집계 기반 최신 조회수

## Relations
- part_of [[MOT 실시간 대시보드]]
- depends_on [[config]]
- contains [[get-content-generic]]
- contains [[load-contents]]
- contains [[load-content-platforms]]
- contains [[latest-views-by-id]]
- contains [[latest-views-snapshot]]
- contains [[latest-views-pre-agg]]

## Observations
- [impl] x_content_platforms.platform "meta" → config key "meta_organic" 매핑 필요 #caveat
- [impl] 전체 시간 범위의 최신 스냅샷 사용 (오늘 데이터만이 아님) #pattern
- [return] []ContentRow — UUID, Title, ContentType, Platforms map, TotalViews #type