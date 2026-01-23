---
title: Claude Code File Watcher Blocks .claude/ File Edit
type: note
permalink: gotchas/claude-code-file-watcher-blocks-claude-folder-edit
tags:
- claude-code
- edit
- file-watcher
- error
- .claude-folder
extraction_status: pending
---

# Claude Code File Watcher Blocks .claude/ File Edit

## Observations

### Problem Phenomenon
- Error when modifying files in `.claude/` folder: "File has been unexpectedly modified"
- "File has not been read yet" error
- Read immediately followed by Edit/Write still fails

### Root Cause
- Claude Code v1.0.90+ Settings Hot Reload feature
- File Watcher monitors `.claude/` folder and `.claude.json` in real-time
- Read tool access changes internal timestamp/hash
- File Watcher detects change → Edit time point → hash mismatch → error

### Edit Tool Usage Limitation
- Cannot reliably modify files inside `.claude/` folder using Edit tool
- Cannot modify `.claude.json` using Edit tool
- Read → Edit pattern always fails

### Correct Modification Method
- Python script for atomic file modification
- Bash heredoc/cat to directly overwrite
- Write entire file atomically (partial modification prohibited)

### Impact Scope
- `.claude/` internal files - Edit unstable
- `.claude.json` - Edit unstable
- Other files - Edit normal

## Relations
- Related: Live Config File Edit Risk