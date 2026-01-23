---
title: Safe Syntax Conversion When Patching CLI.js
type: note
permalink: gotchas/safe-syntax-conversion-cli-patch
tags:
- claude-code
- cli-patch
- sed
- bash-safe-method
extraction_status: pending
---

# Safe Syntax Conversion When Patching CLI.js

## Problem Situation
When replacing patterns in cli.js using Python `re.sub()`, escape errors occur:
```
SyntaxError: Invalid or unexpected token
if(false)return{result:\!1,message:...
              ^^^ Invalid escape
```

## Root Cause
Python `re.sub()` may escape `!` as `\!` or replace similar patterns elsewhere, causing syntax corruption.

## Safe Patching Methods

### Bash sed (Recommended)
```bash
# Backup is essential
cp cli.js cli.js.backup.$(date +%Y%m%d_%H%M%S)

# Patch with sed (simple string replacement)
sed -i 's/if(!C||F>C\\.timestamp)throw Error/if(false)throw Error/g; s/if(!T||N>T\\.timestamp)throw Error/if(false)throw Error/g' cli.js

# Verify
node -c cli.js  # Syntax check
claude --version  # Execution test
```

### Python Safe Method
```python
import re

cli_path = r'C:\\Users\\[USERNAME]\\AppData\\Roaming\\npm\\node_modules\\@anthropic-ai\\claude-code\\cli.js'

# Confirm exact pattern first with grep
with open(cli_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Backup
import shutil
shutil.copy(cli_path, f"{cli_path}.backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}")

# Use simple replace instead of regex
content = content.replace(
    'if(!C||F>C.timestamp)throw Error',
    'if(false)throw Error'
)
content = content.replace(
    'if(!T||N>T.timestamp)throw Error',
    'if(false)throw Error'
)

with open(cli_path, 'w', encoding='utf-8') as f:
    f.write(content)
```

## Safe Procedure

1. **Confirm Pattern** (sed check, do not actually replace)
```bash
grep -n "if(!C||F>C\\.timestamp)" cli.js
```

2. **Backup**
```bash
cp cli.js cli.js.backup.$(date +%Y%m%d_%H%M%S)
```

3. **Replace** (sed recommended)
```bash
sed -i 's/if(!C||F>C\\.timestamp)throw Error/if(false)throw Error/g' cli.js
```

4. **Verify**
```bash
node -c cli.js  # Syntax check
which claude  # Installation location check
claude --version  # Execution test
```

5. **Recovery if Failed**
```bash
mv cli.js.backup.20251211_134956 cli.js
```

## Cautions

### DO
- Use exact patterns for replacement (minimize wildcards)
- Use sed (minimize regex)
- Always create backup
- Perform syntax check (`node -c`)
- Replace one pattern at a time

### DON'T
- Use complex regex with Python `re.sub()`
- Replace without pattern confirmation
- Handle multiple patterns at once
- Skip syntax check

## Version-Specific Patterns (Minified)

To find exact patterns:
```bash
# Print exact patterns
grep -oE "if\\(!C\\|\\|F>C\\.timestamp\\)throw Error" cli.js
grep -oE "if\\(!T\\|\\|N>T\\.timestamp\\)throw Error" cli.js
```

| Version | Pattern 1 | Pattern 2 |
|---------|-----------|-----------|
| v2.0.63 | `if(!C\|\|F>C.timestamp)throw Error` | `if(!T\|\|N>T.timestamp)throw Error` |
| v2.0.64 | `if(KE(B)>I.timestamp)throw Error` | `if(KE(Y)>W.timestamp)throw Error` |

## Relations
- Related: CLI.js Timestamp Validation Patch
- Related: Windows Timestamp Bug (NTFS Precision Issue)

## Observations

- [bug] Python `re.sub()` may escape `!` as `\!` causing JavaScript syntax corruption in minified code #python #regex #cli-patch
- [solution] Use bash sed with simple string replacement instead of Python regex for safer CLI.js patching #bash #sed #safe-method
- [pattern] Always backup before patching: `cp cli.js cli.js.backup.$(date +%Y%m%d_%H%M%S)` #bash #backup #best-practice
- [tech] Verify patches with `node -c cli.js` syntax check before deployment #node #verification #testing
- [warning] Minified code patterns change between versions, always confirm exact pattern before replacement #cli-patch #version-specific