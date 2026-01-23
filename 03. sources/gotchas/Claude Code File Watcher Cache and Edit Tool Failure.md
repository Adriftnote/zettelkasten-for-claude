---
title: Claude Code File Watcher Cache and Edit Tool Failure
type: note
permalink: gotchas/claude-code-file-watcher-cache-edit-failure
tags:
- claude-code
- edit-tool
- file-watcher
- windows-bug
extraction_status: pending
---

# Claude Code File Watcher Cache and Edit Tool Failure

## Problem Situation
Attempting to modify files in `.claude.json` or `.claude/` folder with Edit tool results in repeated failures:
- "File has been unexpectedly modified"
- "File has not been read yet"

## Root Cause

### Cause 1: File Watcher Hot Reload
Claude Code v1.0.90+ implements Settings Hot Reload feature that monitors `.claude/` folder and `.claude.json` in real-time.

**Operation:**
1. Read tool called → file accessed
2. File Watcher detects change → internal hash/checksum updated
3. Edit time point → hash mismatch → "unexpectedly modified" error

### Cause 2: Windows Timestamp Precision Mismatch
NTFS mtime precision (100ns) ≠ JavaScript Date.now() (ms):
- v2.0.61+ introduced timestamp validation logic
- Precision difference causes false positive detection

## Impact Scope
| File/Folder | Monitored | Edit Possible |
|-----------|-----------|---------------|
| `.claude.json` | ✅ Monitored | ❌ Unstable |
| `.claude/` | ✅ Monitored | ❌ Unstable |
| Other folders | ❌ Not monitored | ✅ Normal |

## Solutions

### DO
- Modify `.claude/` related files with Python script for atomic updates
- Use `/mcp` command to change MCP server settings
- Use Bash heredoc/cat for direct overwrite
- Work outside working directory (e.g., claude-code-env/)

### DON'T
- Attempt to modify `.claude/` folder files with Edit tool
- Attempt to modify `.claude.json` with Edit tool
- Use Read → Edit pattern on files watched by File Watcher

## Version Information
| Version | Status |
|---------|--------|
| v1.0.110 or earlier | ✅ Normal |
| v2.0.61+ | ❌ Timestamp bug introduced |
| v2.0.63 | ✅ Normal operation |
| v2.0.64+ | ❌ Bug occurs |

## Relations
- Related: File Watcher Blocking .claude/ File Edit
- Related: Windows Timestamp Bug

## Observations
- [bug] Edit tool fails on .claude/ files due to File Watcher hot reload detecting timestamp changes #edit-tool #file-watcher #bug
- [cause] NTFS timestamp precision (100ns) mismatches JavaScript Date.now() (ms) causing false positive detection #windows-bug #timestamp
- [warning] .claude.json and .claude/ folder files cannot be reliably modified with Edit tool in v2.0.64+ #limitation #config
- [solution] Use Python script for atomic file updates or Bash heredoc for direct overwrite instead of Edit tool #workaround #python
- [pattern] File Watcher monitors specific paths (.claude/) in real-time, other folders remain safe for Edit tool #monitoring #scope