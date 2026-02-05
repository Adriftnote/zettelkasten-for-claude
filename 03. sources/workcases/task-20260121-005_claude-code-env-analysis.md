---
task_id: task-20260121-005
source: code
target: obsidian
created_at: 2026-01-21 19:30:00+09:00
status: completed
extraction_status: pending
type: workcase
tags:
- claude-code
- environment
- mcp
- junction
- troubleshooting
permalink: sources/workcases/task-20260121-005-claude-code-env-analysis
---

# Claude Code 환경설정 심층 분석 및 정리

## 배경

Task-002, 003 완료 후 환경설정이 의도와 다르게 되어있다는 문제 제기로 심층 분석 수행.

---

## 발견된 문제들

### 1. MCP 등록 방식 오류 (Task-002 관련)

**증상:**
```bash
$ claude mcp list
→ "No MCP servers configured"
```

settings.json에 `mcpServers`가 있었지만 Claude Code가 인식하지 못함.

**원인:**
- Claude Code는 `settings.json`의 mcpServers를 **읽지 않음**
- MCP는 `claude mcp add` 명령어로 등록해야 `.claude.json`에 저장됨

**환경설정 파일 역할 (새로 파악):**

| 파일 | 용도 | MCP 저장 |
|------|------|----------|
| `settings.json` | hooks, env, plugins, statusLine | ❌ |
| `settings.local.json` | 권한 설정 (allow/deny) | ❌ |
| `.claude.json` | MCP 서버, 프로젝트 정보, 통계 | ✅ |

---

### 2. 중첩된 .claude 폴더 (Task-003 관련)

**증상:**
```
environments/claude-code/
├── settings.json        ← 현재 사용 중
├── .claude/             ← 원본 백업 (삭제 안 됨)
│   └── settings.json    ← 다른 설정!
```

**원인:**
Task-003에서 Junction 생성 시 원본 폴더를 삭제하지 않고 그대로 남겨둠.

**두 settings.json 비교:**

| 항목 | 현재 사용 중 | 중첩 폴더 (원본) |
|------|-------------|-----------------|
| MCP | basic-memory | google-sheets |
| hooks matcher | `""` (빈 문자열) | `"*"` |
| 수정 시간 | 2026-01-21 | 2026-01-15 |

---

### 3. hooks matcher 불일치

**문제:**
- 원본: `"matcher": "*"` (모든 도구에 적용)
- 병합 후: `"matcher": ""` (빈 문자열 = 의도 불명확)

---

## 환경설정 의도

### Junction 구조의 목적

```
C:\Users\RL\.claude  ──Junction──>  C:\claude-workspace\environments\claude-code\
```

**의도:**
1. Claude Code 설정을 중앙 작업공간(claude-workspace)에서 관리
2. 다른 Claude 인스턴스(Claudian 등)와 설정 참조 용이
3. 백업 및 버전 관리 편의성

### MCP 공유의 목적

Claudian(Obsidian)에서 사용 중인 `basic-memory` MCP를 Claude Code에서도 사용하여:
- 두 인스턴스 간 메모리/지식 공유
- 일관된 작업 맥락 유지

---

## 해결 과정

### Step 1: MCP 올바른 등록

```bash
claude mcp add -s user basic-memory uvx basic-memory mcp
```

**결과:**
```bash
$ claude mcp list
basic-memory: uvx basic-memory mcp - ✓ Connected
```

`.claude.json`에 MCP 설정 저장됨:
```json
"mcpServers": {
  "basic-memory": {
    "type": "stdio",
    "command": "uvx",
    "args": ["basic-memory", "mcp"],
    "env": {}
  }
}
```

---

### Step 2: 중첩 폴더 정리

**파일 비교:**

| 파일 | 현재 사용 중 | 중첩 폴더 |
|------|-------------|----------|
| history.jsonl | 263KB, 2026-01-21 | 177KB, 2025-11-10 |
| settings.json | 986B, 2026-01-21 | 614B, 2026-01-15 |

→ 현재 사용 중인 파일이 더 최신이고 완전함

**조치:**
```bash
mv environments/claude-code/.claude → _system/backups/20260121/.claude-backup
```

---

### Step 3: settings.json 정리

**변경 사항:**
1. `mcpServers` 섹션 삭제 (이미 .claude.json에 등록됨)
2. hooks matcher: `""` → `"*"` 수정

**최종 settings.json:**
```json
{
  "env": {
    "DISABLE_AUTOUPDATER": "1",
    "TMPDIR": "C:\\Users\\RL\\AppData\\Local\\Temp",
    "TMP": "C:\\Users\\RL\\AppData\\Local\\Temp",
    "TEMP": "C:\\Users\\RL\\AppData\\Local\\Temp"
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "python C:/claude-workspace/_system/hooks/post-tool-use.py",
            "timeout": 5000
          }
        ]
      }
    ]
  },
  "enabledPlugins": {
    "documentation-generator@claude-code-templates": false,
    "canvas@claude-canvas": false,
    "feature-dev@claude-plugins-official": false,
    "hookify@claude-plugins-official": false
  },
  "alwaysThinkingEnabled": true,
  "statusLine": {
    "type": "command",
    "command": "bash C:\\claude-workspace\\environments\\claude-code\\statusline-command.sh"
  }
}
```

---

## 전후 비교

### Before

```
C:\Users\RL\.claude → environments/claude-code/
├── settings.json (mcpServers: basic-memory, matcher: "")
├── settings.local.json
├── .claude.json (mcpServers: 없음)
└── .claude/  ← 중첩! (원본 백업)
    └── settings.json (mcpServers: google-sheets, matcher: "*")

$ claude mcp list → "No MCP servers configured"
```

### After

```
C:\Users\RL\.claude → environments/claude-code/
├── settings.json (mcpServers: 없음, matcher: "*")
├── settings.local.json
└── .claude.json (mcpServers: basic-memory ✓)

$ claude mcp list → "basic-memory: ✓ Connected"

백업: _system/backups/20260121/.claude-backup
```

---

## 교훈 및 권장사항

### Claude Code 설정 파일 가이드

| 설정 종류 | 저장 위치 | 등록 방법 |
|-----------|----------|----------|
| MCP 서버 | `.claude.json` | `claude mcp add` 명령어 |
| Hooks | `settings.json` | 직접 편집 |
| 환경변수 | `settings.json` | 직접 편집 |
| 권한 | `settings.local.json` | 직접 편집 또는 런타임 승인 |
| 플러그인 | `settings.json` | `/plugins` 명령어 |

### Junction 작업 시 체크리스트

- [ ] 원본 폴더 백업 완료
- [ ] Junction 생성 후 원본 폴더 삭제/이동
- [ ] 설정 파일 내용 병합 확인
- [ ] 중첩 구조 발생 여부 확인

---

## 관련 Task

- task-20260121-002: basic-memory MCP 등록 (completed)
- task-20260121-003: Junction 통합 (completed)
- task-20260121-005: 환경설정 심층 분석 및 정리 (본 문서)