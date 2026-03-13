---
title: sidebar
type: function
permalink: functions/sidebar
level: low
category: data/sns/dashboard
semantic: generate sidebar html with active menu highlighting
path: /Users/ryu/AI-Projects/creator-dashboard/handlers/pages.go
tags:
- go
- html
- template
- navigation
---

# sidebar

활성 메뉴가 하이라이트된 사이드바 HTML을 생성하는 함수. Go의 `html/template` 네임스페이스 충돌을 우회하기 위해 Go 코드에서 직접 HTML을 문자열로 조립한다.

## 시그니처

```go
func sidebar(active string) template.HTML
```

## Observations

- [impl] 5개 메뉴 아이템(Overview/YouTube/TikTok/Meta/Naver) 순회 — `it.cls == active` 비교로 `.active` 클래스 부여 #algo
- [impl] 각 메뉴에 플랫폼별 색상 dot 포함 — `.dot.yt`(red), `.dot.tt`(teal), `.dot.mt`(blue), `.dot.nv`(green) #ui
- [impl] `template.HTML` 반환 — Go의 자동 HTML 이스케이프를 우회하여 raw HTML 주입 #pattern
- [impl] 사이드바 하단에 pulse 애니메이션 + `updated-at` span — JS에서 API 응답 시간으로 갱신 #ui
- [return] `template.HTML` — 완성된 `<aside class="sidebar">...</aside>` 문자열
- [usage] `c.HTML(200, "overview.html", gin.H{"sidebar": sidebar("overview")})`
- [note] LoadHTMLGlob 네임스페이스 충돌 우회용 — 공유 layout.html의 define 블록이 마지막 파일로 덮어쓰기되는 Go 템플릿 버그 방지 #caveat

## Relations

- part_of [[page-handlers]] (소속 모듈)
- part_of [[크리에이터 실시간 대시보드]] (소속 프로젝트)
- called_by [[page-handlers]].PageOverview (pages.go:32)
- called_by [[page-handlers]].PageYouTube (pages.go:36)
- called_by [[page-handlers]].PageTikTok (pages.go:40)
- called_by [[page-handlers]].PageMeta (pages.go:44)
- called_by [[page-handlers]].PageNaver (pages.go:48)
