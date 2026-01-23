---
title: 'MCP Server Stderr: Distinguishing Actual Errors from Informational Messages'
type: note
permalink: gotchas/mcp-server-stderr-informational-vs-error
tags:
- mcp
- claude-code
- logging
- stderr
- false-positive
extraction_status: pending
---

# MCP Server Stderr False Positive: Informational Message vs Actual Error

## Observations

### Symptoms
- Claude Code debug log shows `[ERROR]` level message
- Example: `[ERROR] MCP server "memory" Server stderr: Knowledge Graph MCP Server running on stdio`
- Occurs during MCP server connection process

### Root Cause

#### This is NOT actual error!

**Analysis:**
1. MCP server outputs status message to stderr on startup
2. `"Knowledge Graph MCP Server running on stdio"` - Server started normally
3. Claude Code logs **all MCP stderr output as ERROR level** (bug/limitation)

**Log Context Evidence:**
```
[ERROR] MCP server "memory" Server stderr: Knowledge Graph MCP Server running on stdio
[DEBUG] MCP server "memory": Successfully connected to stdio server in 2701ms ← Normal connection!
[DEBUG] MCP server "memory": Connection established with capabilities: {"hasTools":true, ...}
```
→ Error followed by normal connection

#### Why stderr?
- Node.js MCP servers usually output startup messages with `console.error()` or `process.stderr.write()`
- stdout reserved for JSON-RPC communication
- This is **standard MCP server pattern**

### Actual Error Distinction

#### Informational Messages (Safe to Ignore)
```
[ERROR] MCP server "memory" Server stderr: Knowledge Graph MCP Server running on stdio
[ERROR] MCP server "xxx" Server stderr: Server started on port 3000
```
→ Log afterward shows `Successfully connected`

#### Actual Errors (Action Required)
```
[ERROR] MCP server "memory" Server stderr: Error: Cannot connect to database
[ERROR] MCP server "memory" Server stderr: ENOENT: no such file or directory
[ERROR] MCP server "memory" failed to connect
```
→ Connection failure or functional error message

## DO/DON'T

### DON'T
- Treat all stderr output as errors
- Attempt troubleshooting for informational messages
- Restart/reinstall MCP server unnecessarily

### DO
- Check log **context before and after**
- Verify `Successfully connected` message presence
- Final judgment based on actual functionality

## MCP Server stderr Startup Message Patterns

| Server | stderr Startup Message |
|--------|----------------------|
| memory | "Knowledge Graph MCP Server running on stdio" |
| filesystem | "Filesystem MCP Server running" |
| Other | Varies per server |

## Claude Code Limitation
- MCP server stderr logged at ERROR level uniformly
- No distinction between informational and actual errors
- Potential for future improvement

## Summary

| Item | Content |
|------|---------|
| Error? | ❌ False Positive |
| Severity | None |
| Action | Unnecessary |
| Cause | MCP server normal startup message sent to stderr |
| Decision Basis | Log context + "Successfully connected" verification |

## Related Information
- Source: claude-code-mcp (2025-12-26)
- Tags: mcp, memory-server, stderr, false-positive, info-log