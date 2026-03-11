---
title: REF-096 Claude Code 플러그인 vs MCP — 시스템 프롬프트 주입과 확장 레벨 차이
type: guide
permalink: sources/reference/claude-code-plugin-vs-mcp-system-prompt
tags:
- Claude-Code
- MCP
- plugin
- system-prompt
- Superpowers
- skills
date: 2026-03-11
---

# Claude Code 플러그인 vs MCP — 시스템 프롬프트 주입과 확장 레벨 차이

Claude Code의 확장 메커니즘인 MCP 서버와 플러그인은 접근 레벨이 근본적으로 다르다. MCP는 도구를 제공하고, 플러그인은 Claude의 행동 규칙 자체를 변경할 수 있다.

## 📖 핵심 아이디어

MCP(Model Context Protocol) 서버는 도구/리소스를 제공하는 외부 서비스로, Claude가 필요할 때 호출하는 구조다. 반면 플러그인은 Claude Code의 **프롬프트 구성 파이프라인에 직접 개입**하여 시스템 프롬프트에 텍스트를 주입하고, 스킬을 등록하고, hooks를 실행할 수 있다. 비유하자면 MCP는 "앱에서 쓰는 API"이고, 플러그인은 "앱의 설정 파일을 덮어쓸 수 있는 확장"이다.

## 🛠️ 구성 요소 / 주요 내용

| 항목 | MCP 서버 | 플러그인 |
|------|----------|----------|
| **할 수 있는 것** | 도구(tools) + 리소스(resources) 제공 | 도구 + **시스템 프롬프트 주입** + **hooks** + **스킬 등록** |
| **접근 레벨** | Claude가 호출할 때만 작동 | Claude의 **행동 규칙 자체를 변경** 가능 |
| **시스템 프롬프트 수정** | 불가 | 가능 (세션 시작 시 인라인 주입) |
| **예시** | basic-memory, context7 | Superpowers, figma, frontend-design |
| **설치 위치** | `~/.claude/.claude.json` mcpServers | `plugins/cache/claude-plugins-official/` |
| **비유** | 앱에서 쓰는 API | 앱의 설정 파일을 덮어쓸 수 있는 확장 |

## 🔧 작동 방식 / 적용 방법

```
세션 시작
  ├── 플러그인 로딩
  │     ├── SessionStart hooks 실행 → "startup hook success"
  │     ├── 특정 스킬 내용을 시스템 프롬프트에 인라인 주입
  │     │     예: using-superpowers → "1%라도 가능성 있으면 스킬 호출" 규칙
  │     └── 모든 스킬 목록을 시스템 프롬프트에 등록
  │
  ├── MCP 서버 연결
  │     └── 도구 목록만 등록 (프롬프트 수정 불가)
  │
  └── Claude가 조합된 프롬프트를 받고 대화 시작
```

### Superpowers 플러그인 사례 (using-superpowers)

- **위치**: `plugins/cache/claude-plugins-official/superpowers/5.0.0/skills/using-superpowers`
- **동작**: 세션 시작 시 시스템 프롬프트에 강제 규칙 주입
- **주입 내용**: "1%라도 관련 스킬 있으면 반드시 먼저 호출" + 합리화 차단 테이블
- **결과**: 매 턴마다 33개+ 스킬 목록을 스캔하는 오버헤드 발생

## 💡 실용적 평가 / 적용

- **보안 관점**: 플러그인은 MCP보다 영향력이 훨씬 크므로 설치 시 더 신중해야 함
- **스킬 과부하 문제**: using-superpowers의 자동 스킬 스캔 강제 규칙 + 스킬 수 33개 → 잘못된 스킬 선택 발생 가능
- **해결 방향**: 스킬 수를 줄이는 것보다 자동 선택 범위를 한정하거나 규칙을 완화하는 게 효과적
- **사용자가 직접 호출하는 스킬** (`/commit`, `/source` 등)은 몇 개든 혼동 없음 — 문제는 자동 선택 대상 스킬에서만 발생

## 🔗 관련 개념

- [[MCP (Model Context Protocol)]] - (플러그인과 대비되는 도구 제공 메커니즘)
- [[Claude Code - Anthropic 공식 CLI 에이전트]] - (플러그인과 MCP가 적용되는 대상 에이전트)
- [[Native Host와 MCP]] - (MCP의 통신 구조와 한계)
- [[REF-095 LangChain Skills — Claude Code 통과율 25%에서 95%로 개선한 방법]] - (스킬 수 최적화 12개 기준의 근거)
- [[REF-088 Codified Context - Infrastructure for AI Agents in a Complex Codebase]] - (에이전트 맥락 전달 인프라)

---

**작성일**: 2026-03-11
**분류**: AI 개발 가이드
**원문**: 대화에서 직접 발견한 내용 (Superpowers 플러그인 분석)