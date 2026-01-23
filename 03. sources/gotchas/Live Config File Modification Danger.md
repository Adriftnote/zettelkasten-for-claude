---
title: Live Config File Modification Danger
type: note
permalink: gotchas/live-config-file-modification-danger
tags:
- claude-code
- config
- edit
- file-watcher
- atomic
extraction_status: pending
---

# Live Config File Modification Danger

## Observations

### Problem Phenomenon
- Edit `.claude.json` with Edit tool → "File has been unexpectedly modified" error
- Read immediately followed by Edit still fails
- Root cause: `.claude.json` is global config → shared by all instances

### Root Cause
- Claude Code File Watcher monitors `.claude/` folder and `.claude.json` in real-time
- Read tool access changes internal timestamp/hash
- File Watcher detects change → Edit time point → hash mismatch → error
- Multiple Claude Code instances simultaneously save session state

### Edit Tool Usage Limitation
- Cannot reliably modify `.claude/` internal files with Edit tool
- Cannot modify `.claude.json` with Edit tool
- Read → Edit pattern always fails

### Correct Modification Method
- Python script for atomic file modification
- Bash heredoc/cat to directly overwrite
- /mcp command to change MCP server settings
- Run single Claude Code instance then modify

### Impact Scope
- `.claude/` internal files - Edit unstable
- `.claude.json` - Edit unstable
- Other files - Edit normal

## Relations
- Related: Claude Code File Watcher Edit Cache Bug
- Related: Claude Code Edit Tool File Watcher Multi-Instance Collision

## Observations

- [bug] Edit tool cannot reliably modify .claude.json or .claude/ internal files due to File Watcher monitoring #edit-tool-failure #file-watcher
- [cause] File Watcher detects Read tool access as modification, causing timestamp/hash mismatch when Edit attempts to write #concurrency #atomic
- [pattern] Read → Edit pattern always fails on config files monitored by File Watcher in real-time #anti-pattern
- [solution] Use Python script for atomic modification, Bash heredoc/cat for direct overwrite, or /mcp command for MCP settings #workaround
- [warning] Multiple Claude Code instances simultaneously saving session state increases collision risk #multi-instance