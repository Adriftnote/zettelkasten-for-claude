---
title: REF-127 agent-browser — AI 에이전트용 Rust 네이티브 헤드리스 브라우저 자동화 CLI
type: note
permalink: zettelkasten/03.-sources/reference/ref-127-agent-browser-ai-eijeonteuyong-rust-neitibeu-hedeuriseu-beuraujeo-jadonghwa-cli
date: '2026-03-25'
tags:
- browser-automation
- rust
- cli
- headless
- ai-agent
- vercel
---

# REF-127 agent-browser — AI 에이전트용 Rust 네이티브 헤드리스 브라우저 자동화 CLI

Vercel Labs가 만든 Rust 기반 브라우저 자동화 CLI. Node.js/Playwright 의존성 없이 단일 바이너리로 동작하며, AI 에이전트가 웹을 조작하기 위해 설계됨.

## 📖 핵심 아이디어

AI 에이전트가 브라우저를 제어할 때 Playwright/Puppeteer는 Node.js 런타임 + 라이브러리 의존성이 필요하고 프로세스 오버헤드가 큼. agent-browser는 Rust 네이티브 CLI로 이를 대체하여, 셸 명령 한 줄로 브라우저를 조작하고 접근성 트리(@ref 기반)로 LLM 친화적 출력을 제공함.

## 🛠️ 구성 요소

| 항목 | 설명 |
|------|------|
| 런타임 | Rust 네이티브 바이너리 (Node.js 불필요) |
| 브라우저 | Chrome for Testing (자동 다운로드) |
| 요소 선택 | 참조 기반 `@e1`, `@e2` + CSS/XPath + 시맨틱(role, text, label) |
| 접근성 트리 | `snapshot` 명령으로 AI가 이해하기 쉬운 구조 출력 |
| 배치 실행 | JSON 파이프로 여러 명령 한번에 |
| 설치 | npm, Homebrew, Cargo, 소스 빌드 |

## 🔧 주요 기능

**기본 조작**: open, click, fill, type, select, check, drag, upload
**정보 수집**: text, html, value, attribute, title, url
**스크린샷**: screenshot, pdf, annotated screenshot
**네트워크**: 요청 라우팅/차단/모킹, HAR 기록
**상태 관리**: 쿠키, localStorage, sessionStorage
**브라우저**: 뷰포트, 디바이스 에뮬레이션, 지오로케이션, 오프라인
**멀티탭/iframe**: 탭 전환, iframe 전환

```bash
# 기본 사용
agent-browser open example.com
agent-browser snapshot          # 접근성 트리 (AI용)
agent-browser click @e2         # 참조로 클릭
agent-browser fill @e3 "test@example.com"
agent-browser screenshot page.png
agent-browser close

# 배치 실행
echo '[["open","https://example.com"],["snapshot"],["click","@e1"]]' | agent-browser batch --json
```

## 💡 실용적 평가

**Playwright 대비 장점**:
- Node.js 불필요 — 바이너리 하나로 동작
- 프로세스 시작 오버헤드 최소화
- AI 에이전트 친화적 출력 (`@ref` 기반 접근성 트리)
- 셸에서 직접 호출 가능 — MCP 서버나 Agent SDK와 연동 용이

**한계/주의점**:
- Vercel Labs 실험 단계 (166 open issues, 150 unmerged PRs)
- Persistent Context(세션 유지) 패턴이 Playwright만큼 성숙하지 않을 수 있음
- 현재 수집기가 Playwright persistent context + page.evaluate() 내부 API 호출 패턴에 의존 → 동일 패턴 가능 여부 미검증
- Linux에서 `--with-deps` 플래그로 시스템 의존성 별도 설치 필요

**현재 상황 대비 판단**:
SNS 수집기는 Playwright persistent context + 내부 API 가로채기 패턴이 핵심. agent-browser가 이 패턴을 지원하는지(쿠키 유지, response 인터셉트, page.evaluate 상당) 확인 필요. 당장 전환할 이유는 없으나, Docker/CI 환경 배포 시 Node.js 의존성 제거 목적으로 검토 가치 있음.

## 🔗 관련 개념

- [[REF-105 Page Agent — In-Page GUI Agent for Web Automation via Natural Language]] - (AI 에이전트 웹 자동화 도구 — Page Agent는 in-page 방식, agent-browser는 CLI 방식)
- [[REF-091 Playwright Headless 모드 — Docker 환경 브라우저 실행 가이드]] - (Playwright 헤드리스 vs agent-browser Rust 네이티브 — Docker 배포 시 대안 비교)
- [[playwright-sns-collector]] - (현재 수집기가 Playwright 기반 — agent-browser로 대체 가능성 검토 대상)

---

**작성일**: 2026-03-25
**출처**: https://github.com/vercel-labs/agent-browser
**분류**: 브라우저 자동화 / AI 에이전트 도구