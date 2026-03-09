---
title: REF-080 Portless - Stable Named Localhost URLs for Local Development
type: doc-summary
permalink: sources/reference/portless-stable-named-localhost-urls
tags:
- devtools
- localhost
- proxy
- monorepo
- vercel
- dx
date: 2026-03-09
---

# Portless - Stable Named Localhost URLs for Local Development

포트 번호 대신 안정적인 `.localhost` 이름 URL을 사용하는 로컬 개발 프록시. `myapp.localhost:1355`처럼 사람이 읽을 수 있는 주소로 서비스에 접근한다.

## 📖 핵심 아이디어

로컬 개발에서 포트 번호 기반 접근의 문제점(포트 충돌, 암기 부담, 쿠키 오염, 팀 커뮤니케이션 마찰 등)을 **이름 기반 `.localhost` 라우팅**으로 해결한다. 데몬 프록시가 포트 1355에서 리슨하며, `portless run` 명령으로 실행한 앱에 랜덤 임시 포트를 할당하고 이름 기반으로 라우팅한다.

핵심 통찰: 포트 번호는 머신을 위한 것이고, 이름은 개발자를 위한 것이다. 터널링(ngrok 등) 없이 순수 로컬에서 이름 기반 접근을 제공한다.

## 🛠️ 구성 요소 / 주요 내용

| 항목 | 설명 |
|------|------|
| **프록시 데몬** | 포트 1355에서 리슨, `.localhost` 서브도메인을 실제 임시 포트로 라우팅 |
| **자동 이름 추론** | `package.json`, git 설정, 디렉토리명에서 프로젝트명 자동 유추 |
| **Git Worktree 지원** | 브랜치명이 자동으로 서브도메인 (`fix-ui.myapp.localhost:1355`) |
| **서브도메인** | `api.myapp.localhost:1355` 형태 + 와일드카드 라우팅 |
| **HTTP/2 + HTTPS** | 자동 인증서 생성 + 시스템 신뢰 저장소 등록. Vite 등 unbundled 서버의 6-connection 제한 해결 |
| **Static Routes** | `portless alias`로 Docker 컨테이너 등 외부 서비스도 등록 가능 |
| **프레임워크 자동 감지** | PORT 무시하는 프레임워크(Vite, Astro, Angular)에 `--port`/`--host` 플래그 자동 주입 |
| **루프 감지** | Host 헤더 미설정 프록시 순환 시 508 응답 + 가이드 제공 |

## 🔧 작동 방식

```
[개발자] ─── myapp.localhost:1355 ───▶ [Portless 프록시 :1355]
                                           │
                                           ▼ (라우트 테이블 조회)
                                      [실제 앱 :4xxx] (랜덤 임시 포트)

$ portless myapp next dev
  → PORT=4123 HOST=127.0.0.1 next dev
  → myapp.localhost:1355 → 127.0.0.1:4123
```

**주입되는 환경 변수:**
- `PORT` — 임시 포트 (4000-4999)
- `HOST` — 항상 `127.0.0.1`
- `PORTLESS_URL` — 공개 URL (예: `http://myapp.localhost:1355`)

**상태 저장:**
- 포트 < 1024: `/tmp/portless` (sudo, root/user 공유)
- 포트 ≥ 1024: `~/.portless` (user-scoped)

## 💡 실용적 평가

**장점:**
- 포트 번호 기억 불필요 — 이름만으로 접근
- 모노레포에서 서비스별 서브도메인 자연스럽게 분리
- Git worktree 지원으로 브랜치별 격리 URL 자동 생성
- HTTPS/HTTP2 지원으로 개발 환경을 프로덕션에 더 가깝게
- OAuth 리다이렉트, CORS 설정에서 포트 변경 시 설정 깨지는 문제 해결

**한계:**
- macOS / Linux 전용 (Windows 미지원)
- Node.js 20+ 필요
- Safari 등 `.localhost` 서브도메인 미지원 브라우저는 `/etc/hosts` 동기화 필요
- Vercel Labs 실험 프로젝트 — 안정성 미검증

**AI 에이전트 관점:**
- 에이전트가 포트 번호를 추측하는 문제 해결 — 이름 기반으로 확정적 접근 가능
- `PORTLESS_URL` 환경 변수로 에이전트에 URL 전달 용이

## 🔗 관련 개념

- [[Native Host]] - (Portless는 브라우저↔로컬 통신이 아닌 프록시 기반이지만, 로컬 개발 환경 도구라는 맥락 공유)

---

**작성일**: 2026-03-09
**분류**: DevTools / Local Development
**출처**: https://github.com/vercel-labs/portless