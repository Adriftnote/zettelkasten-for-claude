---
title: Claude Code Windows Timestamp Bug and Patch Method
type: note
permalink: gotchas/claude-code-windows-timestamp-bug-patch
tags:
- claude-code
- windows-bug
- timestamp
- cli-patch
extraction_status: pending
---

# Claude Code Windows Timestamp Bug and Patch Method

## Problem Summary

### Symptoms
1. **Edit/Write Tool Failure**
   - "File has been unexpectedly modified"
   - "File has not been read yet"
   - Edit fails even immediately after Read

2. **Excessive Token Consumption**
   - Repeated retry after failure

## Root Cause

### Timestamp Precision Mismatch

```
Windows NTFS mtime precision (100ns) ≠ JavaScript Date.now()(ms)
```

**Process:**
1. NTFS file system: mtime precision in 100ns units
2. JavaScript Date.now(): millisecond (ms) units
3. Claude Code cli.js: validates file cache with timestamp
4. Precision difference causes "unmodified file" to be "modified" false positive

## Version Impact

| Version | Status |
|---------|--------|
| v2.0.60 or earlier | ✅ Normal |
| v2.0.61 | ❌ Bug introduced |
| v2.0.63 | ✅ Normal |
| v2.0.64 | ❌ Worsened (instant auto-compacting) |

## Patch Method (Python)

```python
import re

cli_path = r'C:\\Users\\[USERNAME]\\AppData\\Roaming\\npm\\node_modules\\@anthropic-ai\\claude-code\\cli.js'

with open(cli_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Pattern 1
content = re.sub(
    r'if\\(!C\\|\\|F>C\\.timestamp\\)throw Error',
    'if(false)throw Error',
    content
)

# Pattern 2
content = re.sub(
    r'if\\(!T\\|\\|N>T\\.timestamp\\)throw Error',
    'if(false)throw Error',
    content
)

with open(cli_path, 'w', encoding='utf-8') as f:
    f.write(content)
```

## Safe Patch Method (Bash/sed)

```bash
# Backup essential
cp cli.js cli.js.backup.$(date +%Y%m%d)

# Patch with sed (minimize regex)
sed -i 's/if(!C||F>C\\.timestamp)throw Error/if(false)throw Error/g; s/if(!T||N>T\\.timestamp)throw Error/if(false)throw Error/g' cli.js

# Verify
claude --version
```

## Cautions

### Version-Specific Variable Names (Minified)

| Version | Pattern Variables |
|---------|------------------|
| v2.0.61 | `sD(Y)>W.timestamp`, `!z\|\|C>z.timestamp` |
| v2.0.63 | `!C\|\|F>C.timestamp`, `!T\|\|N>T.timestamp` |
| v2.0.64 | `KE(B)>I.timestamp`, `KE(Y)>W.timestamp` |

### Essential Steps
1. **Backup**: `cli.js.backup.$(date +%Y%m%d)`
2. **Reapply Patch**: Required after npm update
3. **Restart**: Restart Claude Code after patching

### Limitations
- Need re-patch every version update until official fix
- Disables timestamp validation feature (potential side effects)

## DO/DON'T

### DO
- Minimize regex (sed recommended)
- Patch after backup
- Replace with exact pattern

### DON'T
- Use Python re.sub() with complex regex (escape issues)
- Prevent auto-update after downgrade without re-patching

## Related GitHub Issues
- #12805 - Main issue (OPEN)
- #12704 - Cache invalidation problem
- #7624 - Hot Reload disable request

## Relations
- Related: Safe Syntax Conversion When Patching CLI.js
- Related: Windows Environment Claude Code Timestamp Bug

## Observations

- [bug] Windows NTFS timestamp precision (100ns) mismatches with JavaScript Date.now() (ms), causing false "file modified" errors #windows #timestamp #ntfs
- [tech] Bug introduced in v2.0.61, worsened in v2.0.64 with instant auto-compacting, requires re-patching after each update #versioning #regression
- [solution] Patch method: replace timestamp validation with `if(false)throw Error` using sed, avoiding Python regex escape issues #workaround #patch
- [warning] Minified variable names change per version (C/F/T/N in v2.0.63, sD/Y/W/z in v2.0.61), requires version-specific pattern matching #minification
- [pattern] Always backup before patching: `cli.js.backup.$(date +%Y%m%d)`, restart Claude Code after patch application #best-practice