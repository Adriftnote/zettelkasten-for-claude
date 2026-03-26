---
title: overview-legacy
type: note
permalink: zettelkasten/05.-code/modules/overview-legacy
tags:
- module
- go
- store
- legacy
---

## 경로
`internal/store/overview.go`

## 역할
[legacy] 하드코딩 Overview 카드 생성 (587줄) — overview-generic.go로 대체됨

## 주요 함수 (16개)
- **get-overview**: 전체 Overview 카드 조합
- **query-today-diff**: 금일 변화량
- **query-top-posts**: 상위 게시물
- **query-mini-cumulative**: 미니 누적 차트
- 등 25개 내부 호출 관계

## Relations
- part_of [[MOT 실시간 대시보드]]

## Observations
- [note] [legacy] overview-generic.go(config 루프)로 대체 #deprecated
- [impl] 587줄 중 200줄이 플랫폼별 하드코딩 초기화 — 동형화의 주요 타겟이었음 #context
- [impl] SQLite 전용 SQL (date('now'), datetime() 등) — MariaDB 비호환 #caveat
- [impl] queryTodayDiff가 공통 로직이지만 테이블/컬럼 매개변수가 호출마다 다름 #pattern