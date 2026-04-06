---
title: REF-133 Anatomy of the .claude Folder — Claude Code 설정 구조 해부
type: guide
permalink: sources/reference/anatomy-of-claude-folder
tags:
- claude-code
- CLAUDE-md
- configuration
- developer-experience
date: 2026-03-23
---

# Anatomy of the .claude/ Folder

.claude 폴더의 모든 구성 요소를 해부한 실전 가이드. CLAUDE.md, rules/, commands/, skills/, agents/, settings.json의 역할과 계층 구조를 정리.

## 📖 핵심 아이디어

`.claude` 폴더는 "Claude가 프로젝트에서 어떻게 행동할지 제어하는 컨트롤 센터". 두 계층으로 작동한다: **프로젝트 레벨**(`.claude/`, git 커밋)과 **글로벌 레벨**(`~/.claude/`, 개인 설정). CLAUDE.md가 가장 높은 레버리지 파일이며, 나머지는 최적화.

## 🛠️ 구성 요소 / 주요 내용

| 구성 요소 | 위치 | 역할 |
|-----------|------|------|
| `CLAUDE.md` | 프로젝트 루트 | 핵심 지침 — 빌드 명령, 아키텍처, gotcha, 컨벤션 (200줄 이하 권장) |
| `CLAUDE.local.md` | 프로젝트 루트 | 개인 오버라이드 (gitignored) |
| `rules/` | `.claude/rules/` | 관심사별 분리된 지침. path-scoped YAML frontmatter 지원 |
| `commands/` | `.claude/commands/` | 슬래시 커맨드 (`/project:name`). `$ARGUMENTS` 변수, `` !`shell` `` 실행 |
| `skills/` | `.claude/skills/` | 자동 호출 워크플로우. 대화 감시 → 적절 시점에 자동 개입 |
| `agents/` | `.claude/agents/` | 전문 서브에이전트. 격리된 컨텍스트, 도구 제한 |
| `settings.json` | `.claude/` | 권한 (allow/deny 리스트). `settings.local.json`으로 개인 오버라이드 |

## 🔧 작동 방식 / 적용 방법

### 디렉토리 구조

```
.claude/                      ← 프로젝트 (git 커밋)
├── CLAUDE.md                 ← 핵심 지침
├── CLAUDE.local.md           ← 개인 오버라이드 (.gitignore)
├── settings.json             ← 권한 설정
├── settings.local.json       ← 개인 권한 (.gitignore)
├── rules/                    ← path-scoped 규칙
│   └── api-rules.md          ← paths: ["src/api/**/*.ts"]
├── commands/                 ← /project:command-name
│   └── review.md
├── skills/                   ← 자동 호출
│   └── security-review/
│       └── SKILL.md
└── agents/                   ← 전문 서브에이전트
    └── code-reviewer.md

~/.claude/                    ← 글로벌 (개인)
├── CLAUDE.md                 ← 모든 프로젝트 적용
├── projects/                 ← 세션 기록, auto-memory
├── commands/                 ← /user:command-name
├── skills/
└── agents/
```

### rules/ path-scoping 예시

```yaml
---
paths:
  - "src/api/**/*.ts"
  - "src/handlers/**/*.ts"
---
# API 핸들러 규칙
- 모든 핸들러에 에러 미들웨어 적용
- ...
```

### settings.json 권한 모델

```json
{
  "permissions": {
    "allow": ["Bash(npm run *)", "Read", "Write"],
    "deny": ["Bash(rm -rf *)", "Read(./.env)"]
  }
}
```

- Allow → 확인 없이 실행
- Deny → 완전 차단
- 미등록 → 매번 사용자 확인

### 도입 순서 (점진적)

1. `/init` → CLAUDE.md 생성
2. `settings.json` allow/deny 설정
3. 자주 쓰는 commands 1-2개 추가
4. CLAUDE.md 비대해지면 `rules/`로 분리
5. `~/.claude/CLAUDE.md`에 개인 선호 추가

## 💡 실용적 평가 / 적용

**commands vs skills 차이**:
- commands: 명시적 슬래시 호출 필요 (`/project:review`)
- skills: 대화 감시 후 자동 개입 (frontmatter로 트리거 조건 정의)
- 최근 업데이트에서 commands가 skills로 병합되는 추세 (댓글 정보)

**CLAUDE.md 작성 원칙**:
- 포함: 빌드/테스트 명령, 아키텍처 결정, 비자명한 gotcha, 컨벤션
- 제외: 린터/포매터 설정(자동 감지), 전체 문서(링크만), 이론 설명

**우리 시스템과의 비교**:
- 이 가이드의 2-level(프로젝트+글로벌) → 우리는 3-tier(글로벌 CLAUDE.md + 프로젝트 CLAUDE.md + working/CLAUDE.md)
- rules/ path-scoping → 우리 `.claude/rules/`에서 활용 중 (figma-design-system.md, flow-outputs.md 등)
- skills/ 자동 호출 → 우리 superpowers 플러그인 + 커스텀 스킬에서 적극 활용
- agents/ → 우리 `.claude/agents/`에서 db-analyst, task-reviewer 정의

## 🔗 관련 개념

- [[REF-087 65 Lines of Markdown - A Claude Code Sensation]] - (CLAUDE.md 작성 철학의 커뮤니티 사례 — 이 가이드가 다루는 구조의 핵심 파일)
- [[REF-088 Codified Context - Infrastructure for AI Agents in a Complex Codebase]] - (3계층 코드화 컨텍스트 인프라 — .claude 폴더 구조를 대규모로 적용한 실증 연구)
- [[REF-096 Claude Code 플러그인 vs MCP — 시스템 프롬프트 주입과 확장 레벨 차이]] - (플러그인/MCP가 .claude 구성과 어떻게 상호작용하는지)
- [[REF-095 LangChain Skills — Claude Code 통과율 25%에서 95%로 개선한 방법]] - (skills/ 활용의 실전 성과 사례)

---

**작성일**: 2026-04-02
**분류**: Claude Code / Configuration
**출처**: https://blog.dailydoseofds.com/p/anatomy-of-the-claude-folder