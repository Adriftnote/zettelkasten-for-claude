---
title: Claude Code MCP Server Process Leak (Windows)
type: note
permalink: gotchas/claude-code-mcp-server-process-leak-windows
tags:
- claude-code
- mcp
- windows
- bug
- process
- memory-leak
extraction_status: pending
---

# Claude Code MCP Server Process Leak (Windows)

## Observations

### Problem Symptoms
- MCP server processes (Python) don't terminate when Claude Code closes
- Multiple sessions open/close result in duplicate MCP server execution
- tasklist shows 9+ processes running with same command

### Root Cause
- MCP uses stdio-based communication → parent termination should close server by closing stdin
- Windows processes become detached → survive after parent termination
- Claude Code Windows version doesn't properly clean up child processes

### Impact
- Memory: ~10-70MB per process accumulated
- DB locking: SQLite concurrent access may cause locking conflicts
- Resources: Unnecessary port/resource occupation

### Temporary Workaround
- Periodically clean up with taskkill /F /IM python.exe
- Develop habit of checking processes after Claude Code termination
- Computer reboot cleans up all processes

### Process Check and Cleanup
- `tasklist | grep -i python` - View process list
- `taskkill /F /IM python.exe` - Terminate all Python processes
- `Get-CimInstance Win32_Process | Where-Object ...` - PowerShell detailed view

### Cautions
- Don't ignore process proliferation → memory leak occurs
- Don't kill processes one by one by PID → overall cleanup is more efficient

### Root Solution
- GitHub issue report needed
- Reference: https://github.com/anthropics/claude-code/issues

## Relations
- Related: Claude Code MCP Configuration File Path

## Observations
- [bug] MCP server processes (Python) don't terminate when Claude Code closes on Windows #windows-bug #process-leak #mcp
- [cause] Windows processes become detached and survive after parent termination, stdin close doesn't propagate #windows #architecture
- [warning] Multiple sessions accumulate 10-70MB memory per leaked process, causing DB locking conflicts #memory-leak #performance
- [solution] Use taskkill /F /IM python.exe periodically or reboot to clean up leaked processes #workaround #cleanup
- [tip] Check process list with tasklist | grep -i python after closing Claude Code to detect leaks #monitoring #maintenance