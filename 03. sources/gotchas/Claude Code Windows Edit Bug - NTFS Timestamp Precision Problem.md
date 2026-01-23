---
title: Claude Code Windows Edit Bug - NTFS Timestamp Precision Problem
type: note
permalink: gotchas/claude-code-windows-edit-ntfs-timestamp-precision
tags:
- claude-code
- windows
- timestamp
- ntfs
- bug
- file-watcher
extraction_status: pending
---

# Claude Code Windows Edit Bug - NTFS Timestamp Precision Problem

## Observations

### Bug History
- v2.0.61 - Bug introduced (VSCode terminal related revert)
- v2.0.64 - Symptoms worsened (instant auto-compacting added)
- **Symptom occurrence version ≠ Bug introduction version**

### Root Cause
- Windows NTFS mtime precision problem
- NTFS timestamp precision ≠ JavaScript Date.now() precision
- v2.0.61 introduced timestamp check logic change

### Deterioration Trigger
- v2.0.64 "instant auto-compacting" added
- Cache invalidation failures occur more frequently
- **Same bug experienced differently across versions**

### Correct Bug Analysis Method
- Check version history: OK → bug introduced → worsened
- Investigate GitHub Issues to confirm actual root cause
- Separate root cause from trigger
- **Understand that symptom visibility point ≠ bug introduction point**

## Relations
- Related: File Watcher Blocking .claude/ File Edit
- Related: Bug Analysis: Distinguish Symptom Version and Bug Introduction Version