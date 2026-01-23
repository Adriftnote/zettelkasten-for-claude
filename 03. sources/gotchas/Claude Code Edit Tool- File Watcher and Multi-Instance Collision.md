---
title: 'Claude Code Edit Tool: File Watcher and Multi-Instance Collision'
type: note
permalink: gotchas/claude-code-edit-file-watcher-multi-instance-collision
tags:
- claude-code
- edit-tool
- file-watcher
- error
extraction_status: pending
---

# Claude Code Edit Tool: File Watcher and Multi-Instance Collision

## Observations

### Gotchas
- **Prohibit Multiple Claude Code Instances Running Simultaneously** - Files like `.claude.json` are shared among all instances. If another instance modifies a file between Read and Edit, "File has been unexpectedly modified" error occurs
- **Don't Retry Edit Continuously** - 4+ consecutive Edit failures usually indicate structural issues, so don't attempt direct resolution
- **Danger of Modifying "Live" Config Files** - Files that are modified in real-time during a session (`.claude.json`, `.claude/` etc.) should never be modified using Edit tool

### When to Watch
- Edit error occurs 2+ times on same file
- Need to modify `.claude.json` or config files
- Running multiple projects simultaneously

### Solutions
- **Python Script Bypass**: Modify file system directly (subprocess or os.system)
- **MCP Slash Command Usage**: Use `/mcp` command to change MCP server settings in-session (safer)
- **Single Claude Code Instance**: Maintain only one instance running at a time

## Relations
- Related: Windows Timestamp Bug (File Watcher Edit Cache Bug)
- Related: Unexpected File Modification Error (Same issue recurring)