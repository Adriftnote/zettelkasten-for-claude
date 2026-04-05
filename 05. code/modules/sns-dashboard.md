---
title: sns-dashboard
type: module
permalink: modules/sns-dashboard
tags:
- go
- gin
- sqlite
- echarts
- dashboard
level: high
category: data/sns/dashboard
semantic: serve sns dashboard api
path: C:/claude-workspace/working/projects/sns-dashboard/
---

# sns-dashboard

Go Gin 기반 SNS 크리에이터 대시보드 서버. collect-posts.js가 생성한 sns-dashboard.db를 읽기전용으로 열어 REST API + HTML 페이지를 서빙한다.

## 개요

6개 플랫폼(YouTube, TikTok, Meta, Meta Ads, Naver TV, Naver Blog)의 게시물 조회수 데이터를 시각화하는 대시보드. SQLite WAL 모드로 수집기와 동시 접근이 가능하며, ECharts로 시계열 차트를 렌더링한다. 1분 폴링으로 자동 갱신.

## Observations

- [impl] Go Gin 프레임워크, html/template 렌더링, Static 파일 서빙 #pattern
- [impl] SQLite 읽기전용 연결 (?mode=ro), WAL 모드 — 수집기와 동시 접근 #pattern
- [impl] CTE(Common Table Expression)로 1시간 delta 계산 — latest vs previous hour #algo
- [impl] ECharts CDN으로 라인 차트 렌더링, 1분 폴링 자동 갱신 #pattern
- [deps] `github.com/gin-gonic/gin`, `github.com/mattn/go-sqlite3` (CGO 필요) #import
- [usage] `./sns-dashboard.exe -db "../playwright-test/sns-dashboard.db" -port 8080` #cli
- [note] CGO_ENABLED=1 빌드 필수 (go-sqlite3가 C 바인딩) #caveat

## API 엔드포인트

| 경로 | 응답 | 용도 |
|------|------|------|
| GET /api/overview | 전체 플랫폼 요약 (총 조회수, 1시간 delta) | Overview 페이지 |
| GET /api/platform/:name | 플랫폼별 게시물 목록 + 조회수 | 플랫폼 상세 |
| GET /api/timeseries?platform=&hours=24 | 시계열 데이터 (시간별 포인트) | 라인 차트 |
| GET /api/health | 마지막 수집 시각, 성공/실패 현황 | 모니터링 |

## 코드 구성

```
sns-dashboard/
  main.go                           -- Gin 서버 진입점
  internal/db/sqlite.go             -- DB 연결, 쿼리 메서드
  internal/models/snapshot.go       -- 구조체 정의
  internal/handlers/overview.go     -- Overview API + 페이지
  internal/handlers/platform.go     -- Platform API + 페이지
  internal/handlers/timeseries.go   -- Timeseries API
  internal/handlers/health.go       -- Health API
  templates/{layout,overview,platform}.html
  static/{app.js,style.css}
```

## Relations
- part_of [[크리에이터 실시간 대시보드]] (소속 프로젝트)
- depends_on [[gin]] (Go web framework)
- depends_on [[go-sqlite3]] (CGO SQLite driver)
- data_flows_to [[echarts]] (프론트엔드 차트 렌더링)
- [[collect-posts]] data_flows_to [[sns-dashboard]] (sns-dashboard.db)
