---
title: Claude Code MCP Configuration File Path
type: note
permalink: gotchas/claude-code-mcp-configuration-file-path
tags:
- claude-code
- mcp
- config
- windows
- path
extraction_status: pending
---

# Claude Code MCP Configuration File Path

## Observations

### Correct Configuration File Location
- Windows: C:\\ClaudeCode\\.claude.json
- MCP server settings recognized only in this file

### Incorrect Paths to Avoid
- ~/.claude/settings.json - No MCP settings
- ~/.claude/settings.local.json - No MCP settings
- C:/유정우/Projects/.claude/settings.json - No MCP settings
- ~/AppData/Roaming/Claude/claude_desktop_config.json - For Desktop (not Code)

### Configuration Structure
- "mcpServers" object with server names as keys
- type: "stdio" specification
- command: executable path
- args: argument array
- env: environment variables object

### After Configuration Change
- Claude Code restart required
- Must restart even after server add/remove

## Relations
- Related: Claude Code MCP Disabling Limitations

## Observations
- [fact] MCP server settings must be in C:\ClaudeCode\.claude.json on Windows, no other location works #config #path #windows
- [warning] settings.json and settings.local.json do NOT support MCP server configuration #limitation #config
- [tech] MCP configuration requires "mcpServers" object with type, command, args, and env fields #structure #json
- [pattern] Claude Code restart is mandatory after any MCP configuration change #requirement #restart
- [tip] claude_desktop_config.json is for Claude Desktop only, not for Claude Code #distinction #config