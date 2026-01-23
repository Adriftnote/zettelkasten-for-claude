# Claudian Windows Issues Report

## Issue 1: spawn EINVAL Error on Windows

### Environment
- **OS**: Windows 11
- **Node.js**: 20.x+ (with CVE-2024-27980 security patch)
- **Claudian Version**: 1.3.38 / 1.3.39
- **Claude Code Version**: 2.1.6

### Error Message
```
Error: spawn EINVAL
```

### Root Cause
Node.js security patch (CVE-2024-27980) changed behavior for spawning `.cmd` and `.bat` files. Since April 2024, `child_process.spawn()` requires `shell: true` option when executing `.cmd` files on Windows.

**Affected code locations in main.js:**
- Line ~1924: MCP server spawn
- Line ~11814: Claude CLI spawn

### Current Code (Problematic)
```javascript
const childProcess = spawn(command, args, {
  cwd: cwd2,
  stdio: ["pipe", "pipe", stderrMode],
  signal,
  env,
  windowsHide: true
});
```

### Fixed Code
```javascript
const childProcess = spawn(command, args, {
  cwd: cwd2,
  stdio: ["pipe", "pipe", stderrMode],
  signal,
  env,
  windowsHide: true,
  shell: true  // Required for Windows .cmd files
});
```

### References
- [Node.js Issue #52554](https://github.com/nodejs/node/issues/52554)
- [Node.js Issue #52681](https://github.com/nodejs/node/issues/52681)
- [CVE-2024-27980 Security Fix](https://nodejs.org/en/blog/vulnerability/april-2024-security-releases-2)

---

## Issue 2: Tool Names Must Be Unique (API Error 400)

### Error Message
```
API Error: 400 {"type":"error","error":{"type":"invalid_request_error","message":"tools: Tool names must be unique."}}
```

### Root Cause
When `loadUserClaudeSettings: true`, Claudian loads Claude Code's MCP server configurations. If the same MCP server (e.g., `basic-memory`) is registered in both:
1. Claude Code global settings (`claude mcp add -s user`)
2. Claudian's own `mcpServers` config

The tools from that MCP server get registered twice, causing duplicate tool names.

### Solution
Set `loadUserClaudeSettings: false` in Claudian settings.

Claudian still uses MCP through Claude Code CLI, which has its own MCP configuration. This prevents double-registration while maintaining MCP functionality.

### Recommended Settings
```json
{
  "loadUserClaudeSettings": false,
  "mcpServers": {}
}
```

This way:
- Claude Code CLI handles MCP servers (via global config)
- Claudian doesn't add duplicate MCP registrations
- Both instances share the same MCP/database

---

## Summary

| Issue | Cause | Fix |
|-------|-------|-----|
| spawn EINVAL | Node.js CVE-2024-27980 security patch | Add `shell: true` to spawn options |
| Tool names duplicate | loadUserClaudeSettings loads MCP twice | Set `loadUserClaudeSettings: false` |

## Suggested PR for Claudian

1. Add `shell: true` to all spawn calls on Windows
2. Document the `loadUserClaudeSettings` behavior regarding MCP duplication
3. Consider auto-detecting Windows and applying shell option conditionally

---

**Report Date**: 2026-01-21
**Reported By**: Claude Code
**GitHub**: https://github.com/YishenTu/claudian/issues
