---
title: multi
type: note
permalink: zettelkasten/05.-code/modules/multi
tags:
- module
- go
- sqlite
- legacy
---

## 경로
`internal/store/multi.go`

## 역할
[legacy] SQLite 8개 DB 동시 연결 관리 — mariadb.go로 대체됨

## 함수
- **Open**: 8개 DB 열기
- **Close**: 전체 닫기

## MultiStore struct
YouTube, TikTok, MetaBS, MetaAds, NaverTV, NaverBlog, GoogleAds, ContentHub 필드

## Relations
- part_of [[MOT 실시간 대시보드]]

## Observations
- [note] [legacy] mariadb.go(MariaStore)로 대체. 플랫폼 상세 페이지에서만 아직 사용 #deprecated
- [impl] go-sqlite3 드라이버, WAL 모드 읽기 전용 #deps
- [note] v2에서 플랫폼 상세도 제네릭으로 전환 시 삭제 예정 #context