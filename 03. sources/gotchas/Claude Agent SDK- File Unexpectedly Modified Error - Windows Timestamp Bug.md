---
title: 'Claude Agent SDK: File Unexpectedly Modified Error - Windows Timestamp Bug'
type: note
permalink: gotchas/claude-agent-sdk-file-unexpectedly-modified-windows-timestamp
tags:
- claude-agent-sdk
- windows
- edit-error
- timestamp-bug
- file-watcher
extraction_status: pending
---

# Claude Agent SDK: File Unexpectedly Modified Error

## Overview
File modification error occurs in Claude Agent SDK's Edit tool on Windows. **Same root cause as Claude Code.**

## Symptoms
```
Error: File has been unexpectedly modified. Read it again before attempting to write it.
    at Object.call (cli.js:1673:754)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
```

- Location: `@anthropic-ai/claude-agent-sdk/cli.js:1673:754`
- Tool: Edit
- Environment: Windows (especially common with Korean paths)

## Root Cause

### 1. Windows Timestamp Precision Issue
Claude Agent SDK uses same cli.js-based implementation as Claude Code:

```javascript
// Get file mtime (millisecond rounding up)
function KE(A) {
    return Math.ceil(Q.statSync(A).mtimeMs);
}

// Timestamp comparison
if (KE(B) > I.timestamp) {
    throw Error("File has been unexpectedly modified...")
}
```

Windows NTFS timestamp cache/sync delay can cause `mtimeMs` to differ between Read and Edit time points.

### 2. Korean Path Impact Possible
- Problem path: `C:\\유정우\\Projects\\claude-agent-swarm`
- URL encoding: `file:///C:/%EC%9C%A0%EC%A0%95%EC%9A%B0/Projects/...`
- Korean paths show higher problem frequency in existing analysis

### 3. Node.js Async Processing
- `process.processTicksAndRejections` stack present
- Timing issues possible during async file operations

## Solutions

### Method 1: Use Write Tool (Recommended)
```
Replace Edit with Write to overwrite entire file:
1. Read current contents with Read
2. Save modified entire contents with Write

Write tool does not perform timestamp validation.
```

### Method 2: Move Project to English Path
```bash
mv "C:\\유정우\\Projects\\claude-agent-swarm" "C:\\Projects\\claude-agent-swarm"
```

### Method 3: Patch cli.js (Agent SDK)
```powershell
$cliPath = "C:\\Projects\\claude-agent-swarm\\node_modules\\@anthropic-ai\\claude-agent-sdk\\cli.js"

# Backup
Copy-Item $cliPath "$cliPath.backup"
$content = Get-Content $cliPath -Raw

# Disable timestamp validation
$content = $content -replace 'if\\(KE\\(B\\)>I\\.timestamp\\)return\\{result:!1', 'if(false)return{result:!1'
$content = $content -replace 'if\\(!C\\|\\|F>C\\.timestamp\\)throw Error', 'if(false)throw Error'

Set-Content $cliPath $content -NoNewline
```

**Caution:** Patch resets on `npm install`

## Learning (DO/DON'T)

### DON'T
- Retry Edit infinitely when it fails (same result)
- Treat Claude Agent SDK and Claude Code as different issues (both use same cli.js)

### DO
- **Switch to Write tool after 2 consecutive Edit failures**
- Be aware of this error possibility when using Korean paths
- Apply cli.js patch at project level (project-specific)

## Environment Comparison

| Item | Claude Code | Claude Agent SDK |
|------|-------------|---------------------|
| cli.js Location | `%APPDATA%\\npm\\node_modules\\...` | Project `node_modules\\...` |
| Patch Scope | Global | Per-project |
| npm install Impact | Global update | Project reinstall |

## Occurrence History
- 2025-12-26 05:46:03 UTC (claude-agent-swarm)
- 2025-12-26 05:59:01 UTC (claude-agent-swarm)

## Relations
- Related: File Unexpectedly Modified Error
- Related: Windows File Watcher Edit Cache Bug
- GitHub: [#12805](https://github.com/anthropics/claude-code/issues/12805) - Windows MINGW environment bug
- SDK: @anthropic-ai/claude-agent-sdk

## Observations
- [bug] Edit tool fails with "File unexpectedly modified" due to Windows NTFS timestamp precision issues #windows #timestamp #file-system
- [cause] Math.ceil(mtimeMs) timestamp validation fails due to Windows NTFS cache/sync delays #ntfs #timing
- [fact] Claude Agent SDK and Claude Code share same cli.js implementation and same bug #architecture #shared-code
- [solution] Switch to Write tool after 2 consecutive Edit failures instead of infinite retry #workaround #error-handling
- [pattern] Korean paths show higher error frequency than English paths #unicode #file-paths