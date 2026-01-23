---
title: MCP-CLI Command Conventions
type: note
permalink: patterns/mcp-cli-command-conventions
tags:
- mcp-cli
- pattern
- naming-convention
- configuration
extraction_status: pending
---

# MCP-CLI Command Conventions

## 명령어 규칙

MCP-CLI 사용 시 알아야 할 명명 규칙과 제한사항.

- [mcp-cli commands] [use] [underscore naming convention]
- [mcp-cli] [does not support] [list-tools command]

## 도구 이름 규칙

### ✅ 올바른 형식
```bash
mcp-cli sqlite_tiktok list_tables
mcp-cli markitdown convert_to_markdown
```

### ❌ 잘못된 형식
```bash
mcp-cli sqlite_tiktok list-tables  # 하이픈 사용 불가
mcp-cli markitdown list-tools      # 존재하지 않는 명령
```

## 서버 타입별 설정

| 서버 타입 | 실행 방식 | 예시 |
|----------|----------|------|
| uvx 기반 | `uvx package-name` | markitdown |
| Python venv | `venv/bin/python -m module` | document-edit |
| Node.js | `node path/to/server.js` | progressive-loader |

## .mcp-cli.json 설정 예시

```json
{
  "mcpServers": {
    "markitdown": {
      "command": "uvx",
      "args": ["markitdown-mcp"]
    },
    "document-edit": {
      "command": "/path/to/venv/bin/python",
      "args": ["-m", "claude_document_mcp.server"]
    }
  }
}
```

## 자동 제안 기능

잘못된 명령어 입력 시 CLI가 올바른 명령 제안:
```
Did you mean list_tables?
```

- [CLI autocorrect] [suggests] [correct command names]

---

*Promoted from claude-mem: #1271, #1262, #277 (2026-01-06)*

## Observations

- [fact] MCP CLI 도구 이름은 언더스코어 규칙 (list_tables), 하이픈 불가 #naming-convention #mcp-cli
- [fact] list-tools 명령어는 존재하지 않음, 도구는 동적으로 fetch됨 #command #limitation
- [pattern] 서버 타입별 실행 방식: uvx, Python venv, Node.js 등 다양한 환경 지원 #configuration #polyglot
- [tip] .mcp-cli.json에서 command와 args 분리 설정 #config-pattern
