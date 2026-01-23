---
title: Prevent Claude Code Plugin Crash on WSL
type: note
permalink: gotchas/prevent-claude-code-plugin-crash-wsl
tags:
- wsl
- claude-code
- plugin
- crash
- sqlite
- path
- settings
extraction_status: pending
---

# Prevent Claude Code Plugin Crash on WSL

## Observations

### Post-Crash Checklist
- Check ports: ss -tlnp | grep -E '37777|8000'
- Check processes: pgrep -la 'claude|node|bun|chroma'
- Clean SQLite WAL: rm -f ~/.claude-mem/*.db-shm ~/.claude-mem/*.db-wal
- Disable plugin and test
- Retry

### Root Cause
- `.bashrc` dependency alone insufficient (/bin/sh doesn't read .bashrc)
- Claude Code executes scripts with /bin/sh (non-interactive shell)
- SQLite WAL file residue (token limit/forced shutdown cleanup missing)
- Plugin initialization failure → uncaught exception → full process termination

### Solutions
- Place tools globally: ln -sf ~/.bun/bin/bun /usr/local/bin/bun
- Check settings.local.json permission syntax (Prefix matching)
- Bash(DEBUG=*) ❌ → Bash(DEBUG=:*) ✅

### settings.local.json Syntax
- Single invalid pattern → entire file ignored
- "Bash(DEBUG=*)" - entire file ignored
- ✅ "Bash(DEBUG=:*)" - correct Prefix matching
- ✅ "Bash(python:*)" - correct pattern

### Symptom-to-Cause
- Warning message + instant termination → settings.local.json syntax error
- "Plugin hook error: not found" → PATH issue (bun/node etc.)
- DB related error → SQLite WAL file residue
- "The operation was aborted" → plugin initialization failed

### Cautions
- Don't restart immediately after crash (same error repeats)
- Clean WAL files to resolve DB lock issue
- Follow crash recovery procedure systematically

## Relations
- Related: WSL Environment Configuration
- Related: Claude Code Plugin Stability