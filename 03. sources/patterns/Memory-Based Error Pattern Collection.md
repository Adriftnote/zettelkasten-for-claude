---
title: Memory-Based Error Pattern Collection
type: note
permalink: patterns/memory-based-error-pattern-collection
tags:
- error-patterns
- troubleshooting
- mcp
- python
- config
- diagnostic
extraction_status: pending
---

# Memory-Based Error Pattern Collection

## Observations

### MCP CLI Configuration File Structure Error
- [gotcha] Don't use `"--command"`, `"--args"` as field names
- [good] command is executable path, args is array
- [pattern] Store API keys in env object, not args

### GraphRAG + Ollama Integration
- [gotcha] Don't use model_provider: ollama (native)
- [good] model_provider: openai → api_base: http://localhost:11434/v1
- [reason] Ollama only supports GraphRAG via OpenAI-compatible API mode

### Python Package PATH Conflict
- [problem] Same package installed in conda/pip/uv multiple times
- [symptom] "cannot import name" error
- [pattern] Use which -a command to find conflicting versions
- [recovery] Remove problem version then reinstall

### SQLite WAL File Remnants
- [cause] WAL file cleanup failed on abnormal termination
- [symptom] DB lock/access issues
- [recovery] rm -f ~/.claude-mem/*.db-shm ~/.claude-mem/*.db-wal

### Claude Code settings.local.json Syntax
- [gotcha] Single incorrect permission pattern causes entire file to be ignored
- [good] "Bash(DEBUG=:*)" (colon required)
- [bad] "Bash(DEBUG=*)" (missing colon → entire file ignored)

### .bashrc PATH Dependency Forbidden
- [gotcha] Claude Code executes scripts via /bin/sh (non-interactive shell)
- [problem] .bashrc PATH settings not applied
- [solution] Create symbolic links in global paths

### MCP Client Registration/Execution Time Separation
- [gotcha] Connect at registration → disconnect immediately → no client at execution
- [solution] Create new client and connect at execution time
- [reference] MCP CLI LazyToolLoader Pattern (2026-01-09)

### Quick Diagnosis Checklist
- [symptom] 404 error (Ollama) → change model_provider: openai
- [symptom] Client not initialized → apply LazyToolLoader pattern
- [symptom] cannot import → check PATH conflicts
- [symptom] Plugin hook error → symlink tools to global PATH
- [symptom] settings ignored → check permission pattern syntax
- [symptom] DB problem → clean WAL files

## Relations
- WSL Claude Code Plugin Crash Prevention: Related solution (2026-01-09)
- MCP CLI LazyToolLoader Pattern: Implementation reference (2026-01-09)