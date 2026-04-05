---
title: main-sns-dashboard
type: note
permalink: zettelkasten/05.-code/modules/main-sns-dashboard
tags:
- module
- go
- entrypoint
---

## 경로
`main.go`

## 역할
서버 엔트리포인트 — config 로드, MariaDB 연결, 라우트 등록, 인증 미들웨어

## 함수
- **generate-session-id**: 세션 ID 생성
- **auth-middleware**: 쿠키 기반 인증 미들웨어
- **main**: 엔트리포인트

## Relations
- part_of [[MOT 실시간 대시보드]]
- depends_on [[config]]
- depends_on [[mariadb]]
- depends_on [[handler-generic]]
- depends_on [[multi]]

## Observations
- [impl] 이중 DB: MariaDB(주) + legacy SQLite(옵션, 상세 페이지용) #architecture
- [impl] 인증: 하드코딩 admin/mot2026 + 쿠키 세션(24시간) #impl
- [impl] legacy SQLite 실패 시 경고만 출력, 서버 정상 기동 (graceful) #pattern
- [note] /api/login과 /login은 인증 미들웨어 밖 (공개) #caveat