---
title: Windows Junction에서 Claude Code 팀 도구 실패 해결
type: note
permalink: 03.-sources/workcases/windows-junctioneseo-claude-code-tim-dogu-silpae-haegyeol
---

# Windows Junction에서 Claude Code 팀 도구 실패 해결

## 문제 상황

`C:\claude-workspace\working\`에서 Claude Code를 실행하면 Teammate 도구로 팀 생성 시 에러 발생:

```
EUNKNOWN: unknown error, open 'C:\Users\RL\.claude\teams\test-team\config.json'
```

Node.js가 Junction을 통과해서 파일을 생성하지 못함.

## 시도했지만 안 된 방법

### 1. Agent 정의 파일에 팀 도구 추가
- `.claude/agents/worker-*.md`에 Task, Teammate, SendMessage 등 추가
- 결과: 도구 자체는 사용 가능해졌지만 Junction 에러는 별개 문제

### 2. 프로젝트 레벨 `.claude/teams/` 폴더 생성
- `working/.claude/teams/` 디렉토리 수동 생성
- 결과: Claude Code가 항상 절대경로 `C:\Users\RL\.claude\teams\`를 사용하므로 무의미

## 근본 원인

두 가지 문제가 복합적으로 작용:

```
[문제 1] Agent 도구 제한
.claude/agents/worker-*.md의 tools: 목록에
Teammate, SendMessage, Task 등 팀 도구가 빠져 있었음

[문제 2] Junction vs Symlink
C:\Users\RL\.claude  --Junction-->  C:\claude-workspace\environments\claude-code

Junction(mklink /J)은 Node.js의 일부 파일 작업에서
경로 해석 실패 발생 (특히 \\?\ prefix와 충돌)

Symlink(mklink /D)은 Node.js와 더 호환이 좋음
```

### 왜 Orchestrator에서는 됐나?

같은 Junction이지만 실행 위치(`C:\claude-workspace` vs `C:\claude-workspace\working`)에 따라 `\\?\` extended-length path prefix 처리가 달라져서 Junction 해석 결과가 달랐을 가능성.

## 해결책

### 해결 1: Agent 정의에 팀 도구 추가

6개 Worker agent 파일 모두에 팀 도구 추가:

```yaml
# .claude/agents/worker-*.md
tools:
  # 기존 도구들...
  # 팀 도구 추가
  - Task
  - Teammate
  - SendMessage
  - TaskCreate
  - TaskUpdate
  - TaskList
```

### 해결 2: Junction → Symlink 교체

관리자 PowerShell에서:

```powershell
# 1. Junction 제거
cmd /c rmdir "C:\Users\RL\.claude"

# 2. Symlink 생성 (관리자 권한 필요)
cmd /c "mklink /D C:\Users\RL\.claude C:\claude-workspace\environments\claude-code"
```

주의: `mklink`은 PowerShell 명령어가 아니므로 `cmd /c`로 감싸야 함.

## 적용

- Worker agent 6개 파일 수정 완료
- `C:\Users\RL\.claude` Junction → Symlink 교체 완료

## 관련 Task

- 이 세션에서 직접 수행 (별도 task 미등록)

## Observations

- [fact] Claude Code는 팀 설정을 항상 절대경로 `C:\Users\RL\.claude\teams\`에 저장한다 #claude-code
- [fact] Agent 정의 파일(.claude/agents/*.md)의 tools 목록이 해당 에이전트의 사용 가능 도구를 제한한다 #claude-code
- [fact] 프로젝트 레벨 `.claude/`가 존재해도 teams/tasks 경로는 유저 홈 `.claude/`를 사용한다 #claude-code
- [solution] Windows Junction(mklink /J) → Directory Symlink(mklink /D) 교체로 Node.js 파일 작업 호환성 해결 #windows #nodejs
- [warning] PowerShell에서 mklink 직접 사용 불가 - cmd /c로 감싸야 함 #powershell
- [warning] Symlink 생성은 관리자 권한 또는 개발자 모드 필요, Junction은 불필요 #windows
- [pattern] working/.claude/는 Claude Code 실행 시 자동 생성됨 (settings.local.json 등) - 삭제해도 재생성 #claude-code
