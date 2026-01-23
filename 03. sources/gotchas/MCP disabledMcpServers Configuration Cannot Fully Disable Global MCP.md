---
title: MCP disabledMcpServers Configuration Cannot Fully Disable Global MCP
type: note
permalink: gotchas/mcp-disabledmcpservers-cannot-disable-global
tags:
- mcp
- claude-code
- configuration
- gotcha
extraction_status: pending
---

# MCP disabledMcpServers Configuration Cannot Fully Disable Global MCP

## Observations

### Problem Situation
- Project level `.claude/settings.json` has `disabledMcpServers` array to disable MCP servers
- After Claude Code restart, specified MCP tools still available
- Cannot fully disable MCP servers defined globally

### Root Cause
1. **Global Settings Priority**: MCP servers defined in `~/.claude/settings.json` (global)
2. **Project Settings Limitation**: Project level `disabledMcpServers` cannot completely override globally enabled MCP
3. **Alternative Activation Path**: MCP servers may be additionally activated from `~/.claude.json` projects setting

### Additional Discovery
- `/mcp disable` is not CLI command (unknown command error)
- `/mcp disable` only works as in-session slash command
- Cannot execute `/mcp disable` from `.claude/commands/` command files

### Configuration Example
```json
{
  "disabledMcpServers": [
    "sqlite_youtube_analytics",
    "sqlite_dashboard_atomic",
    "sqlite_instagram_analytics",
    "sqlite_tiktok_analytics",
    "n8n-workflow-builder",
    "metabase-server"
  ]
}
```

## DO/DON'T

### DON'T
- Expect project settings alone to completely disable global MCP
- Try MCP disable automation from command files
- Use `/mcp disable` as CLI command

### DO
- Request user manually disable in `/mcp` menu after session start
- Design automation based on user interaction
- Configure default values in global settings (`~/.claude/settings.json`)

## Related Information
- Document source: system/claude-code-mcp (2025-12-10)
- Tags: claude-code, mcp, config
- MCP settings system: global > project hierarchy

## Observations

- [bug] Project level `disabledMcpServers` cannot override globally enabled MCP servers #mcp #configuration #limitation
- [pattern] Global settings (`~/.claude/settings.json`) take priority over project settings (`.claude/settings.json`) #mcp #hierarchy
- [gotcha] `/mcp disable` only works as in-session slash command, not as CLI command or in command files #mcp #cli
- [solution] User must manually disable MCP servers via `/mcp` menu after session start for project-specific disabling #workaround #mcp