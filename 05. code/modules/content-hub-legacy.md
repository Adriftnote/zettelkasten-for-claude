---
title: content-hub-legacy
type: note
permalink: zettelkasten/05.-code/modules/content-hub-legacy
tags:
- module
- go
- store
- legacy
---

## 경로
`internal/store/content_hub.go`

## 역할
[legacy] 크로스플랫폼 콘텐츠 분석 (switch문 4개) — content-generic.go로 대체됨

## 함수
- **get-content-performance**: 콘텐츠 성과 조회 (362줄)

## Relations
- part_of [[MOT 실시간 대시보드]]

## Observations
- [note] [legacy] content-generic.go(config 조회)로 대체 #deprecated
- [impl] 4개 switch문 × 4-5 case = 16-20개 플랫폼 분기 — 플랫폼 추가마다 4곳 수정 필요했음 #context
- [impl] getSnapTimes, getViewDiff, publishedAt, 누적조회수 — 각각 별도 switch #pattern