---
title: dashboard-server
type: module
permalink: modules/dashboard-server
level: high
category: data/sns/dashboard
semantic: gin http server entrypoint
path: /Users/ryu/AI-Projects/creator-dashboard/main.go
tags:
- go
- gin
- server
---

# dashboard-server

크리에이터 실시간 대시보드의 Gin 서버 진입점. HTML 템플릿 렌더링, 정적 파일 서빙, 5개 페이지 라우트 + 5개 API 라우트를 등록한다.

## 개요

`gin.ReleaseMode`로 설정하고, `templates/*` 글로브로 HTML 템플릿을 로드, `/static` 경로에 CSS/JS를 서빙한다. 페이지 라우트(`/`, `/youtube`, `/tiktok`, `/meta`, `/naver`)는 HTML을 반환하고, API 라우트(`/api/*`)는 JSON을 반환한다. 포트 8080에서 실행.

## Observations

- [impl] `gin.SetMode(gin.ReleaseMode)` — 프로덕션 모드, 디버그 로그 비활성화 #config
- [impl] `r.LoadHTMLGlob("templates/*")` — 각 템플릿은 독립 HTML 파일 (공유 레이아웃 없음) #template
- [impl] 5 페이지 라우트 + 5 API 라우트 = 총 10개 엔드포인트 #routing
- [deps] `github.com/gin-gonic/gin`, `creator-dashboard/handlers` #import
- [note] Go html/template의 LoadHTMLGlob은 단일 네임스페이스 — 여러 파일이 같은 define 블록 사용 시 충돌. 독립 HTML로 해결 #caveat

## 라우트 맵

| Method | Path | Handler | 응답 |
|--------|------|---------|------|
| GET | / | PageOverview | HTML |
| GET | /youtube | PageYouTube | HTML |
| GET | /tiktok | PageTikTok | HTML |
| GET | /meta | PageMeta | HTML |
| GET | /naver | PageNaver | HTML |
| GET | /api/overview | APIOverview | JSON |
| GET | /api/youtube/stats | APIYouTube | JSON |
| GET | /api/tiktok/stats | APITikTok | JSON |
| GET | /api/meta/stats | APIMeta | JSON |
| GET | /api/naver/stats | APINaver | JSON |

## Relations

- part_of [[크리에이터 실시간 대시보드]] (소속 프로젝트)
- depends_on [[api-handlers]] (JSON API 핸들러)
  - r.GET("/api/overview") → [[api-handlers]].APIOverview (main.go:27)
  - r.GET("/api/youtube/stats") → [[api-handlers]].APIYouTube (main.go:28)
  - r.GET("/api/tiktok/stats") → [[api-handlers]].APITikTok (main.go:29)
  - r.GET("/api/meta/stats") → [[api-handlers]].APIMeta (main.go:30)
  - r.GET("/api/naver/stats") → [[api-handlers]].APINaver (main.go:31)
- depends_on [[page-handlers]] (HTML 페이지 핸들러)
  - r.GET("/") → [[page-handlers]].PageOverview (main.go:20)
  - r.GET("/youtube") → [[page-handlers]].PageYouTube (main.go:21)
  - r.GET("/tiktok") → [[page-handlers]].PageTikTok (main.go:22)
  - r.GET("/meta") → [[page-handlers]].PageMeta (main.go:23)
  - r.GET("/naver") → [[page-handlers]].PageNaver (main.go:24)
- depends_on [[dummy-data]] (via [[api-handlers]])
- depends_on [[dashboard-js]] (프론트엔드 JS, static 서빙)
