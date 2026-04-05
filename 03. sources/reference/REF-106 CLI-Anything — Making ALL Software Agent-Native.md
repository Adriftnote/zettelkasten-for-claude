---
title: REF-106 CLI-Anything — Making ALL Software Agent-Native
type: note
permalink: zettelkasten/03.-sources/reference/ref-106-cli-anything-making-all-software-agent-native
tags:
- cli
- llm-tools
- agent
- automation
- gui-to-cli
---

# CLI-Anything — Making ALL Software Agent-Native

HKUDS의 오픈소스 프레임워크. 모든 소프트웨어를 자동으로 에이전트가 제어 가능한 CLI 하니스(harness)로 변환한다.

## 📖 핵심 아이디어

AI 에이전트는 추론은 잘하지만, 실제 전문 소프트웨어 조작에서 취약하다. GUI 자동화는 깨지기 쉽고, API는 불완전하며, 재구현은 기능을 잃는다. CLI-Anything은 소스코드를 분석하여 7단계 파이프라인으로 production-ready CLI를 자동 생성함으로써 이 격차를 해소한다. "오늘의 소프트웨어는 인간을 위해 만들어졌지만, 내일의 사용자는 에이전트가 될 것이다."

## 🛠️ 구성 요소

| 항목 | 설명 |
|------|------|
| 7-Phase Pipeline | Analyze → Design → Implement → Plan Tests → Write Tests → Document → Publish |
| CLI Framework | Python Click 기반, REPL + JSON 출력 + undo/redo |
| 출력 모드 | Human-readable (터미널) + Machine-readable (JSON) 이중 출력 |
| 세션 관리 | Persistent state, undo/redo, 프로젝트 컨텍스트 유지 |
| 네이밍 | `cli-anything-*` 네임스페이스 통일 |
| 설치 | `pip install -e .` → 시스템 PATH 등록 |

## 🔧 작동 방식

```
[소스코드] → Analyze (GUI→API 매핑)
           → Design (커맨드 그룹, 상태 모델)
           → Implement (Click CLI + REPL + JSON)
           → Plan Tests → Write Tests (unit + E2E)
           → Document → Publish (setup.py + PATH)
```

**지원 플랫폼**: Claude Code (primary, marketplace plugin), OpenCode (experimental), Codex (experimental)

**검증 결과**: 11개 앱, 1,508 테스트 (1,073 unit + 435 E2E), 100% pass rate

| 소프트웨어 | 도메인 | 백엔드 |
|-----------|--------|--------|
| GIMP | 이미지 편집 | Pillow + Script-Fu |
| Blender | 3D 모델링 | bpy scripting |
| Inkscape | 벡터 그래픽 | SVG/XML |
| LibreOffice | 오피스 | ODF + headless |
| OBS Studio | 스트리밍 | JSON scenes + websocket |
| Audacity | 오디오 | wave + sox |
| Kdenlive/Shotcut | 비디오 편집 | MLT XML + melt |
| Draw.io | 다이어그램 | mxGraph XML |

## 💡 실용적 평가

**강점**:
- GUI 자동화(Playwright/Selenium)의 취약성 문제를 구조적으로 해결 — 실제 API 직접 호출
- JSON 출력으로 에이전트 파싱 복잡도 제거
- 기존 소프트웨어의 전체 기능을 보존하면서 자동화 가능
- REF-069 "MCP vs CLI" 논쟁에 대한 실전 답변 — CLI가 에이전트 인터페이스로서 우수함을 11개 앱으로 실증

**한계**:
- Python 3.10+ 필수, 대상 소프트웨어 로컬 설치 필요
- 7단계 파이프라인 자체가 AI 에이전트에 의존 (Claude Code 등) — 생성 품질이 모델 성능에 종속
- GUI-only 앱(내부 API 없음)에 대한 적용 한계 불명확
- Cursor, Windsurf 등 주요 IDE 지원은 "coming soon"

**적용 가능성**:
- 사내 레거시 소프트웨어를 에이전트 자동화 대상으로 전환하는 접근법으로 참고 가능
- CLI-first 에이전트 설계 패턴 — MCP 서버 구축보다 CLI 래퍼가 더 실용적인 경우의 판단 기준

## 🔗 관련 개념

- [[REF-069 MCP is Dead Long Live the CLI - MCP vs CLI 비교]] - (CLI가 에이전트 인터페이스로 MCP보다 우수하다는 주장의 실증 프레임워크)
- [[REF-088 Codified Context - Infrastructure for AI Agents in a Complex Codebase]] - (에이전트 인프라 설계라는 공통 관심사, CLI-Anything은 소프트웨어 접근 레이어에 집중)
- [[REF-105 Page Agent — In-Page GUI Agent for Web Automation via Natural Language]] - (GUI 자동화 접근법과의 대비 — CLI-Anything은 GUI를 우회하고 API 직접 호출)
- [[REF-093 OpenDev — 터미널 AI 코딩 에이전트 아키텍처 및 컨텍스트 엔지니어링]] - (터미널 기반 에이전트 아키텍처라는 공통점)
- [[MCP CLI Polymorphism]] - (MCP와 CLI를 다형적으로 취급하는 아키텍처 패턴, CLI-Anything은 CLI 쪽 구현체)

---

**작성일**: 2026-03-13
**분류**: AI Agent Infrastructure
**출처**: https://github.com/HKUDS/CLI-Anything