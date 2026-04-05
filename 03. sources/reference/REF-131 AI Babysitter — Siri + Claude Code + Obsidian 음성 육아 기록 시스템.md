---
title: REF-131 AI Babysitter — Siri + Claude Code + Obsidian 음성 육아 기록 시스템
type: guide
permalink: sources/reference/ai-babysitter-siri-claude-obsidian
tags:
- claude-code
- obsidian
- siri
- voice-interface
- automation
- runbear
date: 2026-03-30
---

# AI Babysitter — Siri + Claude Code + Obsidian 음성 육아 기록 시스템

Siri 음성 명령 → Runbear Skills API → Claude Code 에이전트 → Obsidian 마크다운 기록의 파이프라인으로, 손이 자유롭지 않은 육아 상황에서 음성만으로 수유/기저귀/건강 기록을 자동화한 사례.

## 📖 핵심 아이디어

신생아 돌봄에서 수유 시간, 기저귀 교체, 건강 마일스톤을 추적해야 하지만 양손이 바쁜 상황이 대부분이다. "Hey Siri, Babysitter"로 음성 명령을 보내면, Claude Code 에이전트가 Obsidian vault의 마크다운 케어 로그에 타임스탬프 기록을 자동 추가하고, Dataview 플러그인이 히트맵 대시보드를 자동 생성한다.

핵심은 CLAUDE.md에 테이블 구조를 정의하고, Claude Code를 상시 실행 서버로 두어 API 엔드포인트를 노출하는 구조다.

## 🛠️ 구성 요소 / 주요 내용

| 항목 | 설명 |
|------|------|
| **Obsidian** | 마크다운 기반 케어 로그 저장소 (클라우드 동기화) |
| **Claude Code** | Mac Mini에서 상시 실행, 에이전트 역할 |
| **Runbear Skills** | Claude Code 에이전트를 API 엔드포인트로 노출 |
| **Siri Shortcuts** | 음성 인터페이스 — POST 요청으로 API 호출 |
| **Dataview 플러그인** | JavaScript 쿼리로 GitHub 스타일 활동 히트맵 생성 |
| **CLAUDE.md** | 테이블 구조·기록 형식 정의 (에이전트 행동 지침) |

## 🔧 작동 방식

```
[사용자] "Hey Siri, Babysitter"
    │
    ▼
[Siri Shortcuts] ── POST 요청 ──▶ [Runbear Skills API]
                                        │
                                        ▼
                                  [Claude Code 에이전트]
                                  (Mac Mini 상시 실행)
                                        │
                                        ▼
                                  [Obsidian Vault]
                                  (마크다운 케어 로그)
                                        │
                                        ▼
                                  [Dataview 플러그인]
                                  (히트맵 대시보드 자동 생성)
```

**셋업 과정:**
1. `CLAUDE.md`에 테이블 구조 정의 (수유, 기저귀, 건강 등)
2. Claude Code를 홈 서버(Mac Mini)에서 상시 실행
3. Runbear의 http-dispatch 명령 2개로 API 엔드포인트 노출
4. Siri Shortcut에서 해당 API로 POST 요청 연결

## 💡 실용적 평가

**주목할 점:**
- Claude Code + CLAUDE.md를 "에이전트 서버"로 사용하는 패턴 — 코딩 도구가 아닌 범용 자동화 에이전트로 활용
- Runbear Skills가 Claude Code에 API 레이어를 붙여주는 역할 — 별도 서버 구축 없이 외부 접근 가능
- Obsidian + Dataview로 시각화까지 완결 — 별도 대시보드 앱 불필요
- 음성 → API → 에이전트 → 파일시스템 파이프라인이 단 4단계로 완성

**한계:**
- Mac Mini 상시 실행 필요 (전력, 관리)
- Runbear Skills 의존 — 서비스 변경/중단 리스크
- Claude Code API 비용 발생

**우리 환경과의 연결:**
- 현재 구조(Claude Code + Obsidian vault + CLAUDE.md)와 거의 동일한 스택
- Runbear Skills 대신 n8n webhook으로 동일한 API 레이어 구현 가능
- Siri 대신 Google Assistant/카카오 미니 등으로 대체 가능

## 🔗 관련 개념

- [[context-engineering]] - (CLAUDE.md로 에이전트 행동을 제어하는 컨텍스트 엔지니어링 패턴)
- [[mcp-tool-patterns]] - (외부 서비스를 에이전트에 연결하는 도구 패턴 — Runbear Skills가 MCP와 유사한 역할)

---

**작성일**: 2026-03-30
**분류**: AI Agent / Voice Automation / Personal Productivity
**출처**: https://snow.runbear.io/i-built-an-ai-babysitter-with-siri-claude-cowork-and-obsidian-82fc3adbfc7a