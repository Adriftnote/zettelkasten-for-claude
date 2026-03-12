---
title: page-handlers
type: module
permalink: modules/page-handlers
level: low
category: data/sns/dashboard
semantic: html page rendering handlers with sidebar generation
path: /Users/ryu/AI-Projects/creator-dashboard/handlers/pages.go
tags:
- go
- gin
- html
- template
---

# page-handlers

5개 HTML 페이지 렌더링 핸들러와 사이드바 HTML 생성 함수. Go의 `html/template` 네임스페이스 충돌을 회피하기 위해 사이드바를 Go 코드에서 `template.HTML`로 생성한다.

## 개요

각 페이지 핸들러는 `sidebar(active)` 함수로 현재 활성 메뉴가 하이라이트된 사이드바 HTML을 생성하고, `gin.H{"sidebar": sidebar(...)}` 형태로 템플릿에 주입한다. 템플릿에서는 `{{.sidebar}}`로 안전하게 렌더링한다.

## Observations

- [impl] `sidebar(active string)` — 5개 메뉴 아이템을 순회하며 active 클래스 동적 부여 #pattern
- [impl] `template.HTML` 타입 사용 — Go의 HTML 이스케이프 우회하여 raw HTML 주입 #pattern
- [impl] 사이드바에 pulse 애니메이션 + `updated-at` 요소 포함 — JS에서 실시간 갱신 #ui
- [note] Go html/template의 LoadHTMLGlob은 모든 파일을 단일 네임스페이스에 로드 — 공유 layout 사용 시 `{{define "content"}}` 충돌 발생. 독립 HTML + Go 사이드바 생성으로 해결 #caveat
- [deps] `html/template`, `net/http`, `github.com/gin-gonic/gin` #import

## Relations

- part_of [[크리에이터 실시간 대시보드]] (소속 프로젝트)
- contains [[sidebar]]
  - PageOverview calls [[sidebar]]("overview") (pages.go:32)
  - PageYouTube calls [[sidebar]]("youtube") (pages.go:36)
  - PageTikTok calls [[sidebar]]("tiktok") (pages.go:40)
  - PageMeta calls [[sidebar]]("meta") (pages.go:44)
  - PageNaver calls [[sidebar]]("naver") (pages.go:48)
- called_by [[dashboard-server]] (라우터 등록, main.go:20-24)
- renders templates → consumed by [[dashboard-js]] (HTML에서 JS 로드)
