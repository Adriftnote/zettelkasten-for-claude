---
title: 커스텀 에이전트 MCP 접근 제한 - 플러그인 vs 수동등록
type: workcase
permalink: sources/workcases/custom-agent-mcp-access
tags:
- claude-code
- mcp
- custom-agent
- troubleshooting
- agent-teams
---

# 커스텀 에이전트 MCP 접근 제한 - 플러그인 vs 수동등록

## 문제 상황

`/reference` 스킬을 worker-research에 위임했을 때, 리서치는 성공하지만 basic-memory MCP로 노트 저장이 실패함. worker-research가 `mcp__basic-memory__write_note` 도구에 접근할 수 없었음.

## 시도했지만 안 된 방법

### 1. agent 정의에 MCP 도구 추가
```yaml
# .claude/agents/worker-research.md
tools:
  - mcp__basic-memory__write_note
  - mcp__basic-memory__read_note
  - mcp__basic-memory__search_notes
```
→ 도구 목록에 추가해도 실제로 MCP 연결이 안 됨

### 2. Task tool로 subagent 호출
```
Task(subagent_type="worker-research", prompt="MCP 도구 호출해")
```
→ 실패. worker-research 도구 목록에 MCP 도구 없음

### 3. Agent Teams teammate로 호출
```
TeamCreate → Task(subagent_type="worker-research", team_name="...")
```
→ 동일하게 실패. teammate로 해도 MCP 접근 불가

### 4. general-purpose (빌트인) 에이전트로 호출
```
Task(subagent_type="general-purpose", prompt="MCP 도구 호출해")
```
→ **성공!** general-purpose는 MCP 접근 가능

## 근본 원인
## 근본 원인 (2026-02-11 수정)

```
에이전트 타입에 따라 MCP 접근 여부가 결정됨

빌트인 에이전트 (general-purpose, Explore 등):
  → 부모 세션의 MCP 서버 연결 상속 ✅

커스텀 에이전트 (.claude/agents/*.md):
  → MCP 서버 연결 전파 안 됨 ❌
  → tools 필드에 MCP 명시해도 불가 ❌
  → 플러그인 등록해도 불가 ❌
```

### 검증 결과 (2026-02-11)

| 에이전트 | 타입 | context7 MCP | basic-memory MCP |
|---|---|---|---|
| general-purpose | 빌트인 | O | O |
| worker-research | 커스텀 | X | X |
| worker-research (teammate) | 커스텀 | X | X |

**결론**: 등록 방식(플러그인 vs 수동)이 아니라, 에이전트 타입(빌트인 vs 커스텀)이 결정 요인
### 증거: researcher가 보고한 사용 가능 도구

| MCP 서버 | 등록 방식 | 커스텀 에이전트 접근 |
|---|---|---|
| context7 | 플러그인 (`plugins/` 디렉토리) | O |
| basic-memory | `.claude.json` 수동 등록 | X |
| GitHub | `.claude.json` 수동 등록 | X |
| Chrome | `.claude.json` 수동 등록 | X |

### 관련 GitHub Issues
- [#13605](https://github.com/anthropics/claude-code/issues/13605) - Custom plugin subagents cannot access MCP tools
- [#13898](https://github.com/anthropics/claude-code/issues/13898) - Custom Subagents Cannot Access Project-Scoped MCP Servers
- [#13254](https://github.com/anthropics/claude-code/issues/13254) - Background subagents cannot access MCP tools

## 해결책

### 현재 워크어라운드

**방법 1**: MCP 필요 작업은 `general-purpose` 에이전트에 위임
```
Task(
  subagent_type="general-purpose",
  model="haiku",  # 비용 절감
  prompt="리서치 + basic-memory 저장"
)
```

**방법 2**: 2단계 분리 (리서치 → 메인이 저장)
```
1. worker-research: 웹 조사 + 내용 분석 → 결과 반환
2. 메인 에이전트: 결과 받아서 basic-memory에 저장
```

### 미검증 해결책 (TODO)

**basic-memory를 플러그인 형태로 등록** → context7처럼 `plugins/` 디렉토리에 설치하면 서브에이전트에도 전파될 가능성

## 적용

- `/reference` 스킬: delegate_to를 `general-purpose`로 변경 검토
- `/workcase` 스킬: 동일 이슈 (worker-docs도 MCP 불가)
- 모든 MCP 필요 위임 작업에 해당

## 관련 Task

- 이번 세션 탐구 작업 (2026-02-11)

## Observations
- [fact] 커스텀 에이전트(.claude/agents/)는 어떤 MCP 서버에도 접근 불가 — 등록 방식 무관 #claude-code #mcp
- [correction] 이전 관찰 "플러그인 MCP만 전파"는 오류. 실제로는 빌트인 에이전트만 MCP 상속 #claude-code #mcp
- [fact] 빌트인 에이전트(general-purpose)는 모든 MCP 서버에 접근 가능 #claude-code #mcp
- [fact] agent 정의 파일의 tools 리스트에 MCP 도구를 추가해도 실제 MCP 연결이 생기지 않음 #claude-code #mcp
- [fact] Task tool 호출이든 Agent Teams teammate이든 결과 동일 — 스폰 방식과 무관 #claude-code #agent-teams
- [pattern] MCP 전파 = 에이전트 타입(빌트인 vs 커스텀)에 의존, 등록 방식과 무관 #claude-code #mcp
- [solution] 워크어라운드: general-purpose + model="haiku"로 비용 절감하면서 MCP 접근 가능 #claude-code
- [warning] 공식 문서는 "subagents inherit all MCP tools"라고 하지만 실제로는 커스텀 에이전트에서 작동 안 함 #claude-code