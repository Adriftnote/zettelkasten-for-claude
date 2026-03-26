---
title: mariadb
type: note
permalink: zettelkasten/05.-code/modules/mariadb
semantic: module
category: code/modules
path: internal/store/mariadb.go
tags:
- module
- go
- database
- mariadb
---

## 역할
MariaDB 단일 연결 관리 (multi.go의 8개 SQLite 대체)

## 경로
`internal/store/mariadb.go`

## 함수
- `OpenMaria` — MariaDB 연결 풀 생성
- `CloseMaria` — 연결 해제

## Relations
- part_of [[MOT 실시간 대시보드]]
- contains [[open-maria]]
- contains [[close-maria]]

## Observations
- [impl] go-sql-driver/mysql, pool: maxOpen=10, maxIdle=5 #deps
- [impl] DSN에 parseTime=true 필수 (datetime 스캔) #caveat