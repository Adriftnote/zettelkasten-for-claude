---
title: handler-generic
type: note
permalink: zettelkasten/05.-code/modules/handler-generic
semantic: module
category: code/modules
path: internal/handler/generic.go
tags:
- module
- go
- gin
- handler
- api
---

## 역할
Gin 핸들러 — Overview, PlatformDetail, ConfigAPI, ContentGeneric

## 경로
`internal/handler/generic.go`

## 함수
- `OverviewGenericHandler` — GET /api/overview → overview-generic 호출
- `PlatformDetail` — GET /api/platform/:key → 플랫폼 상세 (legacy 위임)
- `ConfigAPI` — GET /api/config → 프론트엔드에 플랫폼 목록 제공
- `ContentGenericHandler` — GET /api/contents → 크로스플랫폼 콘텐츠 조회

## Relations
- part_of [[MOT 실시간 대시보드]]
- depends_on [[overview-generic]]
- depends_on [[content-generic]]
- contains [[overview-generic-handler]]
- contains [[platform-detail]]
- contains [[config-api]]
- contains [[content-generic-handler]]

## Observations
- [impl] PlatformDetail은 legacy SQLite store에 위임 (점진적 전환) #pattern
- [impl] ConfigAPI: 프론트엔드가 플랫폼 목록을 서버에서 동적 수신 #architecture
- [note] legacy MultiStore가 nil이면 "coming soon" 반환 #caveat