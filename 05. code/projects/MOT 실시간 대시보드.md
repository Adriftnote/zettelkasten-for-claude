---
title: MOT 실시간 대시보드
type: note
permalink: zettelkasten/05.-code/projects/mot-silsigan-daesibodeu
semantic: project
category: code/projects
tags:
- project
- dashboard
- go
- mariadb
- echarts
---

## 목적
MOT 채널(소셜+블로그) 실시간 모니터링 대시보드

## 스택
- Backend: Go (Gin)
- Database: MariaDB 12.2.2
- Frontend: Vanilla JS + ECharts

## 핵심 설계
Platform Config YAML 기반 동형 아키텍처.
8개 SNS 플랫폼의 메타데이터(테이블명, 컬럼, 지표)를 YAML로 관리하고, Go 서버는 config를 읽어 QueryMode별 제네릭 쿼리 실행. DB 컬럼명은 RAW 유지, 매핑은 서버 레이어에서만.

## 코드 구성
- `main.go` — 엔트리포인트
- `internal/config/` — 설정 (platform_config.yaml 파싱)
- `internal/store/` — DB 쿼리 (generic_query, overview_generic, content_generic, mariadb)
- `internal/handler/` — API 핸들러 (generic.go)
- `internal/model/` — 타입 정의
- `static/` — 프론트엔드

## 수집기
- `playwright-test/` — collector-config.js + collectors/ + lib/

## Relations
- contains [[config]]
- contains [[generic-query]]
- contains [[overview-generic]]
- contains [[handler-generic]]
- contains [[content-generic]]
- contains [[mariadb]]
- contains [[main-sns-dashboard]]
- contains [[collector-config]]
- contains [[types]]
- contains [[multi]]
- contains [[handler-legacy]]
- contains [[overview-legacy]]
- contains [[content-hub-legacy]]
- contains [[youtube-store]]
- contains [[platform-stores-legacy]]
## Observations
- [impl] Platform Config YAML이 모든 플랫폼 메타데이터의 Single Source of Truth #architecture
- [impl] QueryMode 4종으로 플랫폼별 데이터 구조 차이 흡수: snapshot_diff, snapshot_cumulative, pre_aggregated, ads_campaign #pattern
- [impl] DB 컬럼명 RAW 유지, Go 서버 레이어에서만 매핑 — 비파괴 원칙 #architecture
- [impl] 수집기도 동형 구조: Registry(config) + Normalizer + Saver는 통일, Collector는 플랫폼별 자유 #architecture
- [note] 마감 2026-03-31, v1 배포 목표 #context