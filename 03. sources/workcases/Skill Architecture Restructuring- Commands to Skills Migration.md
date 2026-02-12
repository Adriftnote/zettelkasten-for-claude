---
title: 'Skill Architecture Restructuring: Commands to Skills Migration'
type: workcase
permalink: sources/workcases/skill-architecture-restructuring
tags:
- claude-code
- skills
- architecture
- delegation
- mcp-tools
---

# Skill Architecture Restructuring: Commands to Skills Migration

> Claude Code 환경에서 스킬 구조를 개선하고 자동 위임 메커니즘을 도입한 경험

## 1. 문제 상황

### 기존 구조의 문제점
- 스킬이 두 곳에 산재: `commands/{name}.md` (flat) vs `skills/` (참고용)
- 위임 방식이 불일관: `delegate_to` 필드 수동 입력, 때로는 누락
- MCP 도구 접근 제한: 커스텀 에이전트는 MCP 서버 연결 불가 (버그)
- 마이그레이션 경로 불명확: 어떤 스킬부터, 어떻게 옮길지 미정의

### 발견된 제약사항
| 구성요소 | 제약 | 영향 |
|---------|------|------|
| 커스텀 에이전트 | MCP 접근 불가 | 노트 저장 불가 → Explore만 사용 가능 |
| `delegate_to` | 수동 지정 필요 | 실수 가능성, 일관성 부족 |
| 폴더 구조 | 제어 어려움 | reference 마이그레이션 지연 |
| Frontmatter | 표준 미정의 | 각 스킬마다 형식 다름 |

## 2. 시도했지만 안 된 방법

### 시도 1: 커스텀 에이전트로 MCP 도구 사용
```yaml
# ✗ 실패
- `.claude/agents/skill-creator.yaml`에 MCP 도구 명시
→ 그래도 MCP 접근 불가 (에이전트 생성 시 MCP 연결 전파 안 됨)
```

### 시도 2: commands/ 파일 유지 + 동시 reference
```
# ✗ 혼란 야기
- 동일 이름이 두 곳에 존재하면 commands/가 우선 로딩
→ skills/의 개선 사항이 무시됨
→ 명확한 제거 규칙 필요
```

## 3. 근본 원인

### A. MCP 서버 연결 메커니즘
Claude Code의 MCP 서버는 빌트인 에이전트(Explore, general-purpose, Plan, Bash)에만 전파됨.
커스텀 에이전트(`.claude/agents/`)는 에이전트 생성 시점에 MCP 세션이 독립적으로 생성되어, 부모 세션의 MCP 서버를 상속하지 않음.

```
부모 세션 (MCP 활성) 
  └─ Explore (빌트인) → MCP 상속 ✓
  └─ custom-agent (커스텀) → MCP 미상속 ✗
```

### B. 위임 패턴의 진화
- 초기: 수동 위임 (delegate_to 필드)
- 현재: 자동 위임 (context: fork + agent 정의)

`context: fork` + 스킬 frontmatter의 agent 필드를 조합하면, 사용자가 스킬을 호출할 때 자동으로 해당 에이전트가 스폰됨. 별도 Task tool 호출 불필요.

## 4. 해결책

### 4.1 아키텍처 결정

**신 구조 (목표):**
```
.claude/skills/
├── {skill-name}/
│   ├── SKILL.md          ← 실행 가능한 스킬 정의
│   └── [기타 참고]
```

**필수 frontmatter 형식:**
```yaml
---
name: {skill-name}
description: "[사용 트리거 설명]"
context: fork              # ← 자동 위임 활성화
agent: Explore            # ← 빌트인 에이전트만
model: haiku|sonnet|opus  # ← 난이도별 모델 선택
allowed-tools: [...]      # ← 명시적 도구 목록
argument-hint: "[인자 설명]"
---
```

### 4.2 마이그레이션 전략

#### Phase 1: 핵심 3개 먼저 (의존성 낮음)
- `/workcase` → basic-memory 노트 저장 (이미 성숙)
- `/reference` → WebSearch + basic-memory (안정적)
- `/rpg` → 코드 분석 + basic-memory (복잡도 높음)

#### Phase 2: 지원 도구들
- `/research-team` → Explore teammate 관리
- `/summarize-session` → 세션 정리 유틸
- `/task-status` → Task 상태 조회

#### Phase 3: 외부 도구 통합
- `/json-canvas`, `/obsidian-*` → 외부 애플리케이션 CLI
- `/task-status` → orchestration.db 조회

### 4.3 세부 작업

**1단계: 9개 스킬 폴더 구조 생성**
```bash
for skill in workcase reference rpg research-team summarize-session \
             task-status json-canvas obsidian-bases obsidian-markdown; do
  mkdir -p "C:\claude-workspace\.claude\skills\$skill"
  # 기존 파일 이동 (commands/ → skills/{name}/)
done
```

**2단계: Frontmatter 표준화**
```yaml
# 예: /workcase
name: workcase
context: fork
agent: Explore          # ← MCP 도구 필요 (basic-memory)
model: haiku           # ← 단순 작업
allowed-tools: Bash(python *vecsearch*), mcp__basic-memory__*, WebSearch
```

**3단계: commands/ 폴더 정리**
- ✓ 모든 파일 이동 완료
- ✗ 동명 파일 있으면 삭제 (skills/가 정식)

**4단계: 설정 업데이트**
- CLAUDE.md (Orchestrator): § 7에 공용 스킬 목록 추가
- working/CLAUDE.md (Worker): § 4에 위임 규칙 + AOrchestra 패턴 추가
- MEMORY.md: 마이그레이션 상태 + 자동 위임 패턴 기록

## 5. 적용

### 5.1 9개 스킬 완전 마이그레이션 완료

| 스킬 | Agent | Model | 주요 도구 | 상태 |
|------|-------|-------|----------|------|
| `/workcase` | Explore | haiku | basic-memory + vecsearch | ✓ 완료 |
| `/reference` | Explore | haiku | basic-memory + WebSearch | ✓ 완료 |
| `/rpg` | Explore | sonnet | basic-memory + Glob/Grep | ✓ 완료 |
| `/research-team` | Explore | haiku | SendMessage + TeamCreate | ✓ 완료 |
| `/summarize-session` | - | haiku | sqlite3 + Bash | ✓ 완료 |
| `/task-status` | - | haiku | sqlite3 + Bash | ✓ 완료 |
| `/json-canvas` | - | haiku | Bash 래퍼 | ✓ 완료 |
| `/obsidian-bases` | - | haiku | Bash 래퍼 | ✓ 완료 |
| `/obsidian-markdown` | - | haiku | Bash 래퍼 | ✓ 완료 |

### 5.2 부작용 처리

**중복 파일 정리:**
- `skills/vecsearch.md` (구 스킬 참고) 삭제
- `skills/vecsearch/SKILL.md` (신 스킬) 유지

**commands/ 폴더:**
- 모든 스킬 파일 이동 완료
- 폴더 자체는 유지 (다른 용도 미정)

### 5.3 검증 결과

**기능 테스트:**
```
/workcase "스킬 구조 마이그레이션"
→ Explore 에이전트 자동 스폰
→ basic-memory 도구 접근 ✓
→ vecsearch 벡터 검색 ✓
→ 노트 저장 완료 ✓
```

**구조 검증:**
```bash
# 11개 SKILL.md 파일 확인
find C:\claude-workspace\.claude\skills -name SKILL.md
→ json-canvas, n8n-node-templates, obsidian-bases, obsidian-markdown,
  reference, research-team, rpg, summarize-session, task-status,
  vecsearch, workcase
```

## 관련 Task

- task-20260212-012: [Act] 스킬 구조 마이그레이션 (commands → skills/) 실행
- task-20260212-013: [Do] 스킬 마이그레이션 마무리 정리 및 workcase 테스트

## Observations

- **[fact]** Claude Code의 `context: fork` + `agent` frontmatter 조합은 스킬 호출 시 자동으로 해당 에이전트를 스폰하므로 수동 Task tool 호출 불필요 #skill-delegation
- **[fact]** 커스텀 에이전트(`.claude/agents/`)는 MCP 서버 연결을 상속하지 않으므로, MCP 도구(basic-memory, context7, google-dev-knowledge)가 필요한 작업은 반드시 빌트인 Explore/general-purpose 에이전트만 사용 가능 #mcp-limitation #custom-agent-bug
- **[solution]** 같은 이름의 파일이 commands/와 skills/에 동시 존재하면 commands/가 우선 로딩되므로, 마이그레이션 후 반드시 commands/에서 삭제해야 함 #file-loading-order
- **[pattern]** 스킬의 model 선택은 작업 난이도에 따라 결정: haiku(수집/검색), sonnet(분석/코드리뷰), opus(설계/크리티컬) #model-selection-pattern #AOrchestra
- **[method]** 스킬 frontmatter 표준화: name, description, context: fork, agent, model, allowed-tools, argument-hint 7개 필드는 필수/권장 #skill-structure-standard
- **[warning]** Basic-memory의 permalink는 반드시 폴더를 포함한 영문 slug: `sources/workcases/[slug]` (폴더 없이 `[slug]`만 지정하면 저장 실패) #permalink-format
- **[tech]** vecsearch 도구(벡터 검색)는 Explore 에이전트에 python 실행 권한(Bash allowed-tool)이 필요하며, 중복 제거 후에도 vecsearch/SKILL.md 파일로 `/vecsearch` 스킬 호출 가능 #vecsearch-integration