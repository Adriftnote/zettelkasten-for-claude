---
title: MCP 서버 PATH 문제 - 터미널별 uvx 못 찾음
type: note
permalink: 03.-sources/workcases/mcp-seobeo-path-munje-teomineolbyeol-uvx-mos-cajeum
---

# MCP 서버 PATH 문제 - 터미널별 uvx 못 찾음

## 문제 상황

`C:\claude-workspace\working`에서 Warp 터미널로 Claude Code를 띄우면 basic-memory MCP가 연결 안 됨. 같은 PC, 같은 계정인데 `C:\claude-workspace`에서는 정상 동작.

## 시도했지만 안 된 방법

- `.claude.json`의 `mcpServers` 확인 → user-level에 basic-memory 등록되어 있음
- `settings.local.json` 권한 확인 → `mcp__basic-memory__*` 허용되어 있음
- junction/symlink 여부 확인 → 별도 파일

## 근본 원인

```
Git Bash (기본 터미널)     Warp 터미널
      │                        │
  PATH에 uvx 있음          PATH에 uvx 없음
      │                        │
  MCP 서버 시작 성공       MCP 서버 시작 실패
```

MCP 서버 설정에서 `"command": "uvx"`로 되어 있으면 shell의 PATH에 의존. 터미널마다 PATH가 다르면 특정 터미널에서만 실패.

## 해결책

`~/.claude/.claude.json`의 `mcpServers`에서 command를 절대 경로로 변경:

```json
"mcpServers": {
  "basic-memory": {
    "type": "stdio",
    "command": "C:\\Users\\RL\\.local\\bin\\uvx.exe",
    "args": ["basic-memory", "mcp"],
    "env": {}
  }
}
```

## 적용

- 파일: `C:\Users\RL\.claude\.claude.json` (user-level config)
- Warp에서 `C:\claude-workspace\working` 실행 시 basic-memory 정상 연결 확인

## Observations

- [fact] Claude Code의 MCP 서버는 shell PATH에 의존하여 command를 실행함 #mcp #claude-code
- [fact] `~/.claude/.claude.json`과 `environments/claude-code/.claude.json`은 별도 파일 (junction 아님) #claude-code #config
- [solution] MCP command를 절대 경로로 지정하면 터미널 환경에 무관하게 동작 #mcp
- [warning] 터미널을 바꾸면 (Git Bash → Warp 등) MCP 서버가 깨질 수 있음 #mcp #terminal
- [pattern] "여기서는 되고 저기서는 안 됨" = 대부분 PATH 또는 환경변수 차이 #troubleshooting
