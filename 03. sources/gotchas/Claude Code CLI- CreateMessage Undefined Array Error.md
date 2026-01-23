---
title: 'Claude Code CLI: CreateMessage Undefined Array Error'
type: note
permalink: gotchas/claude-code-cli-create-message-undefined-array
tags:
- claude-code
- mcp-error
- undefined-error
extraction_status: pending
---

# Claude Code CLI: CreateMessage Undefined Array Error

## Observations

### Gotchas
- **MCP Server Shutdown Then Data Reference** - If trying to reference data from an MCP server after it's terminated with SIGINT, undefined gets passed, causing `.map()` call failure
- **Undefined Array Field** - CLI internal `_createMessage` function receives undefined for variables that should be arrays, causing timing issues
- **Async Timing Problem** - If MCP server connection breaks while receiving API response, incomplete data structure occurs
- **Session State Mismatch** - If one MCP server has issues, entire message creation pipeline can halt

### When to Watch
- Immediately after MCP server abnormal termination (SIGINT log shown)
- When one server dies in multi-MCP server sessions
- When API response is incomplete or timeout occurs

### Solutions
- **Quick Recovery**: Claude Code session restart (`claude` command)
- **Check MCP Status**: `claude mcp list` to check all MCP server connection status
- **Reinstall Package**: For repeated issues, reinstall npm global package
  ```bash
  npm uninstall -g @anthropic-ai/claude-code
  npm cache clean --force
  npm install -g @anthropic-ai/claude-code
  ```
- **Defensive Programming**: Use Optional chaining and nullish coalescing before array reference
  ```javascript
  // DON'T: data.items.map()
  // DO: (data?.items ?? []).map()
  ```

## Relations
- Similar-to: n8n Empty Array Items Error (similar undefined array access pattern)
- Caused-by: MCP Server Instability

## Basic Memory Observations
- [bug] MCP server SIGINT termination causes undefined array reference in _createMessage function #mcp #undefined-error #timing
- [cause] Async timing issue when MCP server connection breaks during API response processing #async #race-condition
- [warning] One MCP server failure can halt entire message creation pipeline in multi-server sessions #mcp #stability
- [solution] Use optional chaining and nullish coalescing `(data?.items ?? [])` for defensive array handling #javascript #best-practice
- [tip] Quick recovery via Claude Code session restart rather than npm reinstall for transient errors #troubleshooting #recovery