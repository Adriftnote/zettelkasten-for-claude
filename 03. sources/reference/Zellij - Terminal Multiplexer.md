---
title: Zellij - Terminal Multiplexer
type: doc-summary
permalink: sources/reference/zellij
tags:
- terminal
- multiplexer
- rust
- workspace
- developer-tools
date: 2026-02-11
---

# Zellij - Terminal Multiplexer

Rust로 작성된 현대적 터미널 멀티플렉서. tmux의 가장 강력한 최신 대안.

## 📖 핵심 아이디어

Zellij는 "simplicity와 power를 모두 제공하는 터미널 워크스페이스"로, Rust로 작성된 현대적인 tmux 대안이다. 화면 하단에 단축키 안내(UI)가 표시되어 직관적이며, 초보자 친화적 UI와 고급 커스터마이제이션을 동시에 지원한다.

## 🛠️ 구성 요소 / 주요 내용

| 항목 | 설명 |
|------|------|
| **언어** | Rust (안전성, 효율성, 메모리 관리) |
| **최신 버전** | v0.43.1 (2025-08-08) |
| **핵심 기능** | 플로팅/스택 패널, 레이아웃 시스템, 멀티플레이 협업 |
| **플러그인** | WebAssembly (어떤 언어도 지원) |
| **웹 클라이언트** | 터미널 없이 브라우저에서 사용 가능 |
| **Tmux 호환** | Tmux 키바인딩 모드 포함 |
| **설정 형식** | KDL (YAML도 지원) |

## 🔧 작동 방식 / 적용 방법

### 설치

**설치 없이 시도:**
```bash
bash <(curl -L https://zellij.dev/launch)
```

**Cargo:**
```bash
cargo install --locked zellij
```

**OS 패키지 관리자:** Homebrew, APT, Pacman 등

### 기본 사용

```bash
zellij          # 기본 세션 시작
zellij -l tab   # tab 레이아웃으로 시작
zellij ls       # 활성 세션 목록
zellij attach   # 기존 세션 재연결
```

### Tmux와 비교

| 구분 | Zellij | Tmux |
|------|--------|------|
| 학습 곡선 | 낮음 (화면 하단 단축키 표시) | 높음 (키바인딩 암기 필요) |
| 기본 UX | 직관적 UI, 상태바 명확 | 최소주의, 설정 필수 |
| 성능 | Rust, 멀티코어 활용 | C, 안정적 |
| 플로팅 패널 | 지원 | 미지원 |
| 웹 클라이언트 | 내장 | 별도 도구 필요 |
| 플러그인 | WASM (현대적) | Tcl (전통적) |
| 생태계 성숙도 | 성장 중 | 매우 높음 (Unix 표준) |
| 멀티플레이 | 네이티브 지원 | 제한적 |

## 💡 실용적 평가 / 적용

**강점:**
- 초보자도 즉시 사용 가능 (하단 키 안내)
- 현대적 기능 (플로팅 패널, 웹 클라이언트, WASM 플러그인)
- 레이아웃 파일로 워크스페이스 자동 구성
- 메모리 효율성 우수

**약점:**
- Tmux 대비 생태계 미성숙
- Windows 네이티브 미지원 (WSL 필요)
- 플러그인 생태계 아직 초기

**추천 대상:**
- 터미널 멀티플렉서 처음 사용하는 개발자
- 직관적 UI 선호하는 사용자
- 브라우저 기반 원격 워크스페이스 필요 시

## 🔗 관련 개념

- [[웹 기초 (Web Fundamentals)]] - 웹 기반 터미널 접근
- [[rust-language]] - Zellij 구현 언어

---

**작성일**: 2026-02-11
**분류**: developer-tools/terminal
**공식 사이트**: https://zellij.dev/
**GitHub**: https://github.com/zellij-org/zellij