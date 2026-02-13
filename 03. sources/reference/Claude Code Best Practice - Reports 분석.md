---
title: Claude Code Best Practice - Reports 분석
type: guide
permalink: sources/reference/claude-code-best-practice-reports
tags:
- claude-code
- best-practice
- settings
- skills
- agents
- hooks
date: 2026-02-13
---

# Claude Code Best Practice - Reports 분석

shanraisshan/claude-code-best-practice 레포의 reports/ 폴더 10개 가이드 분석 정리.

## 📖 핵심 아이디어

Claude Code CLI의 설정, 스킬, 에이전트, 훅 등 커스터마이징 전체를 다루는 커뮤니티 가이드 모음 (2.5k stars). 공식 문서에서 빠진 실전 설정 패턴과 모노레포 대응 전략이 핵심.

## 🛠️ Reports 10개 요약

### 1. Agent Memory (claude-agent-memory.md)
| 항목 | 내용 |
|------|------|
| 기능 | 에이전트별 지속 메모리 (v2.1.33+) |
| 범위 | user (개인교차), project (팀공유), local (개인전용) |
| 설정 | 프론트매터 `memory: user` |
| 동작 | MEMORY.md 첫 200줄 시스템 프롬프트 주입 |

### 2. Agent SDK vs CLI System Prompts
| 항목 | CLI | SDK (기본) | SDK (프리셋) |
|------|-----|----------|-----------|
| 도구 | 18+ 내장 | 최소 | 18+ |
| CLAUDE.md 자동로드 | O | X | X |
| 출력 재현성 | 보장 안됨 | 보장 안됨 | 보장 안됨 |

### 3. Boris Cherny 12가지 팁
- `/config` 테마, `/terminal-setup` Shift+Enter
- `/model` Low/Medium/High (High 권장)
- 플러그인 마켓플레이스, 커스텀 에이전트
- `/permissions` 사전 승인, `/sandbox` 보안
- `/statusline` 상태라인, `/keybindings` 키매핑
- 훅, 스피너 커스터마이징, 출력 스타일

### 4. CLI Startup Flags 주요 항목
| 플래그                | 용도             |
| ------------------ | -------------- |
| `--continue/-c`    | 최근 대화 계속       |
| `--resume/-r`      | 특정 세션 재개       |
| `--fallback-model` | 과부하 시 자동 전환    |
| `--model`          | 모델 선택          |
| `--print/-p`       | 헤드리스 출력        |
| `--json-schema`    | 스키마 검증 JSON 출력 |
| `--agent`          | 특정 에이전트 지정     |
| `--agents`         | 런타임 에이전트 동적 정의 |
| `--max-budget-usd` | API 비용 제한      |
| `--max-turns`      | 에이전트 턴 제한      |
| `--chrome`         | Chrome 자동화 활성화 |

### 5. Commands & Shortcuts
- 세션: `/clear`, `/compact`, `/resume`, `/rewind`, `/fork`
- 컨텍스트: `/context`, `/cost`, `/usage`
- 모델: `/model`, `/plan`, `/fast`
- 단축키: `Ctrl+C`(취소), `Alt+P`(모델전환), `Esc+Esc`(되감기)
- 접두사: `/`(명령), `!`(셸), `@`(파일경로)

### 6. Global vs Project Settings
우선순위 (높→낮):
1. CLI 플래그
2. `.claude/settings.local.json` (프로젝트 개인)
3. `.claude/settings.json` (팀 공유)
4. `~/.claude/settings.local.json` (전역 개인)
5. `~/.claude/settings.json` (전역 기본)

글로벌 전용: Tasks, Teams, 자동메모리, 보안자격증명

### 7. Claude in Chrome vs Chrome DevTools MCP
| 항목 | Claude in Chrome | DevTools MCP |
|------|-----------------|-------------|
| 토큰 | 15.4k | 19.0k |
| 강점 | 로그인 세션, 빠른 검증 | 성능 분석, 네트워크 디버깅 |
| 헤드리스 | 불가 | 가능 |
| CI/CD | 약함 | 우수 |

권장: Playwright(E2E) + DevTools(성능) + Chrome(로그인 검증)

### 8. CLAUDE.md 모노레포 로딩
- 상향식: 현재→루트 즉시 로드
- 하향식: 하위 디렉토리는 파일 접근 시 지연 로드
- 형제 디렉토리: 로드 안됨

### 9. Settings 종합 (가장 방대)
주요 설정:
| 설정 | 용도 |
|------|------|
| `alwaysThinkingEnabled` | 확장 사고 상시 활성화 |
| `plansDirectory` | /plan 출력 저장소 |
| `sandbox.enabled` | bash 샌드박싱 |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | 자동 압축 임계값 |
| `BASH_MAX_TIMEOUT_MS` | Bash 제한시간 |
| `MAX_MCP_OUTPUT_TOKENS` | MCP 출력 제한 (기본 50000) |
| `SLASH_COMMAND_TOOL_CHAR_BUDGET` | 스킬 문자 예산 (기본 15000) |

Hooks 15가지 이벤트: SessionStart, SessionEnd, UserPromptSubmit, PreToolUse, PostToolUse, Stop, TaskCompleted 등

권한 도구 문법: `Bash(npm run *)`, `Edit(src/**)`, `mcp__server__*`

### 10. Skills 모노레포 로딩
- CLAUDE.md와 다른 동작: 중첩 디렉토리 자동 발견
- 루트 스킬: 항상 로드
- 하위 패키지 스킬: 해당 파일 편집 시 온디맨드 로드
- 설명만 항상 컨텍스트 포함, 전체 내용은 호출 시
- 동일 이름 우선순위: 엔터프라이즈 > 개인 > 프로젝트

## 🔧 우리 환경 적용 가능 항목

| 항목 | 설정 | 효과 |
|------|------|------|
| fallback-model | settings.json `"fallbackModel"` | 과부하 시 자동 전환 |
| MAX_MCP_OUTPUT_TOKENS | env 변수 | basic-memory 대량 조회 최적화 |
| CLAUDE_AUTOCOMPACT_PCT_OVERRIDE | env 변수 | 자동 압축 타이밍 세밀 조절 |
| Hooks Stop/TaskCompleted | hooks 설정 | 작업 완료 시 자동화 트리거 |
| 에이전트 memory 프론트매터 | agents/*.md | 커스텀 에이전트에 지속 메모리 |
| SLASH_COMMAND_TOOL_CHAR_BUDGET | env 변수 | 스킬 많을 때 예산 증가 |
| BASH_MAX_TIMEOUT_MS | env 변수 | 긴 CLI 작업 타임아웃 조절 |

## 💡 실용적 평가

**이미 적용 중인 것**: 3-tier CLAUDE.md (113줄, 150줄 이하), Skills 구조, MCP 연동, auto memory, alwaysThinkingEnabled, Hooks (vecsearch sync)

**새로 적용 가능하나 임팩트 작음**:
- `BASH_MAX_TIMEOUT_MS` — SSH나 긴 CLI 작업 타임아웃 조절
- `MAX_MCP_OUTPUT_TOKENS` — basic-memory 대량 조회 잘림 방지
- `fallback-model`, 환경변수 튜닝

**해당 없음**: 모노레포 전략 (단일 워크스페이스), SDK 통합 (CLI 전용)

### 총평

커뮤니티 2.5k stars 레포치고 정리는 깔끔하지만, 우리 환경에서 당장 바꿀 만한 건 거의 없음. 이미 3-tier CLAUDE.md, Skills, MCP, auto memory, Hooks 등 주요 커스터마이징이 적용된 상태라 "이런 것도 있구나" 확인 수준. 플래그(`--agents`, `--json-schema` 등)는 실행 시점 옵션이라 세션 내에서는 활용 불가. 환경변수 튜닝 몇 개가 유일하게 실질적인 적용 포인트이나, 체감 효과는 크지 않을 것으로 판단.

## 🔗 관련 개념

- [[Claude Code - Anthropic 공식 CLI 에이전트]] - 공식 CLI 개요
- [[Claude Code Overview - 공식 문서]] - 공식 문서 정리
- [[Superpowers - Claude Code 개발 워크플로우 프레임워크]] - 워크플로우 프레임워크

---

**출처**: https://github.com/shanraisshan/claude-code-best-practice
**작성일**: 2026-02-13
**분류**: Claude Code 커스터마이징