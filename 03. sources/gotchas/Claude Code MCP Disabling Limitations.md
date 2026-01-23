---
title: Claude Code MCP Disabling Limitations
type: note
permalink: gotchas/claude-code-mcp-disabling-limitations
tags:
- claude-code
- mcp
- config
- disable
- limitation
extraction_status: pending
---

# Claude Code MCP Disabling Limitations

## Observations

### Correct Disabling Method
- Use `/mcp` slash command in session
- Or toggle by @mentioning server name
- For global setting, directly edit ~/.claude/settings.json

### Methods That Don't Work
- `disabledMcpServers` in ~/.claude/settings.json - May not apply
- `/mcp disable` in .claude/commands/ - Doesn't execute
- `claude mcp disable` CLI command - Doesn't exist

### Problem Cause
- `/mcp disable` is slash command in-session only, not CLI command
- `disabledMcpServers` setting cannot completely override globally enabled MCP
- Slash commands in command files cannot be nested execution

### Recommended Method
- Type `/mcp` after session start
- Select unnecessary servers and disable
- Or remove MCP server definition itself in global settings

## Relations
- Related: Claude Code MCP Configuration File Path

## Observations
- [solution] Use /mcp slash command in session or @mention server name to disable MCP servers #mcp #disable #workaround
- [warning] disabledMcpServers in settings.json may not apply to globally enabled MCP servers #limitation #config
- [bug] claude mcp disable CLI command does not exist, /mcp is session-only command #cli #limitation
- [cause] Slash commands in .claude/commands/ files cannot execute nested slash commands #architecture #limitation
- [tip] To permanently disable MCP, remove server definition from global settings instead of using disable flag #best-practice #config