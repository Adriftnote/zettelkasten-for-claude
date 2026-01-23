---
title: Knowledge Base File Edit Failure and Background Process
type: note
permalink: gotchas/knowledge-base-file-edit-failure-background-process
tags:
- knowledge-base
- edit-tool-failure
- background-process
- sync-conflict
extraction_status: pending
---

# Knowledge Base File Edit Failure and Background Process

## Symptoms
When editing files in knowledge-base/knowledge/ folder:
```
File has been unexpectedly modified. Read it again before attempting to write it.
```

**Characteristic**: 2+ Read-Edit attempts on same file fail repeatedly

## Occurrence Situation
1. Read file ✅
2. Edit tool attempt ❌
3. Read again ✅ then Edit ❌ (same error)

**Success case**: Creating new file in same folder succeeds

## Root Cause Hypothesis

### Hypothesis 1: History Tracker SDK Agent
- Background monitoring of knowledge-base folder
- Auto-record/update file changes
- Concurrency conflict with Edit tool

### Hypothesis 2: File Locking (Windows)
- File system sync delay
- NTFS timestamp validation failure

### Hypothesis 3: Obsidian or Other Editor
- Background file monitoring

## Actual Success Conditions
- **Create new file** (Write): ✅ Success
- **Edit existing file**: ❌ Fail
- **File outside working directory**: ✅ May succeed

## Estimated Cause Classification

| Scenario | Probability | Evidence |
|----------|---------|----------|
| Background process monitoring | High | New creation succeeds, only existing file fails |
| File locking | Medium | Repeated retry fails |
| Hot Reload/File Watcher | Medium | Similar pattern to .claude/ problem |

## Solutions

### Immediate Workaround
1. **Write entire file overwrite** (after Read)
```python
content = Read(file)  # Read existing content
Write(file, modified_content)  # Overwrite entire file
```

2. **Python script for atomic modification**
```python
with open(path, 'r') as f:
    content = f.read()
modified = content.replace('old', 'new')
with open(path, 'w') as f:
    f.write(modified)
```

3. **Work outside working directory**
- Use Claude-code-env/ folder

### Root Solution (Required)
1. Concurrency control between History Tracker and Edit tool
2. Lock file mechanism
3. /save option to temporarily pause Watcher

## DO/DON'T

### DO
- Use Write for knowledge-base file complete overwrite
- Use Python script for atomic modification
- Work outside working directory
- Use Write for new file creation

### DON'T
- Edit existing knowledge-base files
- Retry Read-Edit
- Proceed without considering background processes

## Related Files
- claude-agent-swarm/src/history-tracker.ts
- claude-agent-swarm/src/watcher.ts

## Observations

- [bug] Edit tool repeatedly fails with "File has been unexpectedly modified" error on existing knowledge-base files #edit-tool-failure #concurrency
- [cause] Background process (History Tracker SDK Agent or File Watcher) monitors knowledge-base folder causing concurrency conflicts #background-process #file-locking
- [pattern] New file creation succeeds while editing existing files fails - indicates background monitoring issue #sync-conflict
- [solution] Use Write tool for complete file overwrite or Python script for atomic modification instead of Edit tool #workaround
- [warning] Retrying Read-Edit pattern will not resolve the issue - different approach required #anti-pattern