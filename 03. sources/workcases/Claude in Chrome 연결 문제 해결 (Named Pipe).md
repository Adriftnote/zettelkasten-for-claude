---
title: Claude in Chrome 연결 문제 해결 (Named Pipe)
type: workcase
permalink: sources/workcases/claude-in-chrome-named-pipe-fix
tags:
- claude-code
- chrome-extension
- named-pipe
- windows
- npm
---

# Claude in Chrome 연결 문제 해결 (Named Pipe)

## 문제 상황

Claude Code에서 `mcp__claude-in-chrome__*` 도구 호출 시 **"Browser extension is not connected"** 에러 발생.

- Chrome 확장프로그램은 설치되어 있고 사이드패널도 열려 있음
- `claude mcp list`에서 claude-in-chrome이 보이지 않음
- `/chrome` 명령 실행해도 연결 안 됨
- 환경: Windows (MINGW64/Git Bash), Claude Code standalone 바이너리 v2.1.32

## 시도했지만 안 된 방법

1. Chrome 재시작 → 실패
2. 확장프로그램 재로그인 → 실패
3. Claude Desktop 설치하여 Desktop의 native host 사용 시도 → Desktop 연결은 되나 Claude Code MCP 도구는 여전히 자체 native host 사용하여 불가
4. WSL에서 테스트 → Linux에서는 정상 (Unix socket 사용)

## 근본 원인

```
Claude Code standalone 바이너리 (v2.1.32)
  └─ 내장 Bun 런타임 v1.3.5
       └─ Windows Named Pipe 생성 시 크래시 버그
            └─ Chrome 확장프로그램과 IPC 통신 불가
```

- Claude Code ↔ Chrome 확장프로그램은 **Named Pipe** (Windows) 또는 **Unix Socket** (Linux/Mac)으로 통신
- Bun 1.3.5의 Windows Named Pipe 구현에 버그 존재
- GitHub 이슈: #23193, #23212, #22416, #22941

## 해결책

**standalone 바이너리 → npm 설치로 전환**

```bash
# 1. 기존 바이너리 백업
mv claude.exe claude.exe.bak

# 2. npm으로 재설치
npm install -g @anthropic-ai/claude-code

# 3. 버전 확인
claude --version  # v2.1.38
```

v2.1.38에는 Windows Named Pipe 지원이 이미 포함(Tn4 함수). cli.js 수동 패치 불필요.

## 적용

- Claude Code v2.1.32 (standalone) → v2.1.38 (npm) 전환
- 재시작 후 Chrome 연결 성공 확인 (navigate, tabs_context 정상)
- 2/5 발생 → 2/10 해결 (5일 소요)

## 관련 Task

- task-20260205-001: [Check] Claude in Chrome 연결 문제 트러블슈팅 (원인 분석)
- task-20260205-005: [Do] Claude in Chrome 연결 문제 해결 (시도, 미해결)
- task-20260210-006: [Act] Claude in Chrome 연결 문제 수동 패치 (npm 재설치, 해결)

## Observations

- [fact] Claude Code ↔ Chrome 확장프로그램은 Windows에서 Named Pipe로 IPC 통신 #named-pipe #windows
- [fact] standalone 바이너리는 Bun 런타임을 내장하고, npm 설치는 시스템 Node.js 사용 #claude-code #bun
- [fact] Bun 1.3.5에 Windows Named Pipe 크래시 버그 존재 (GitHub #23193) #bun #windows
- [solution] standalone → npm 설치 전환으로 해결. npm 버전이 이미 패치 포함 #npm #claude-code
- [warning] standalone 바이너리는 자동 업데이트되지만 Bun 버그가 해결될 때까지 npm 설치 유지 권장 #claude-code
- [pattern] Linux/WSL에서는 정상인데 Windows에서만 안 되면 IPC 메커니즘(Named Pipe vs Unix Socket) 차이 의심 #windows #debugging
- [tech] `claude.exe.bak`으로 백업 후 npm 설치하면 롤백 가능 #npm