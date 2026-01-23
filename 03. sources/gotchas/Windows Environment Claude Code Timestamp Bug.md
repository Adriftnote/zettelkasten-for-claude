---
title: Windows Environment Claude Code Timestamp Bug
type: note
permalink: gotchas/windows-environment-claude-code-timestamp
tags:
- claude-code
- windows
- timestamp
- bug
- file-edit
extraction_status: pending
---

# Windows Environment Claude Code Timestamp Bug

## Observations

### Gotchas
- **Windows NTFS Timestamp Precision Problem** - Despite `Math.ceil(mtimeMs)` rounding, file system cache sync delay can change timestamp between Read and Edit on `.claude/` files
- **Path-Dependent Occurrence** - Occurs with Korean paths (e.g., `C:\\유정우\\Projects\\`) but normal with English paths (e.g., `C:\\claude-code-env\\`)
- **Version Update No Solution** - v2.0.63 and v2.0.64 have identical core validation logic, so upgrade alone doesn't fix
- **Path-Specific Monitoring** - Some paths may be OneDrive/antivirus real-time check targets

### When to Watch
- Windows Edit failures repeat despite retries
- "File has been unexpectedly modified" occurs only in specific directories
- Very short Read → Edit interval still causes errors

### Solutions
- **Method 1 (Recommended)**: Patch cli.js - Disable `KE()` function validation (refer GitHub Issue #12805 patch)
- **Method 2 (Temporary)**: Use Write tool - Read then Write full file overwrite instead of Edit
- **Method 3**: Change work path - Avoid Korean paths, work with English paths
- **Diagnostic**: Compare NTFS properties, OneDrive sync status, antivirus settings between working/non-working folders

## Relations
- Related: File Unexpectedly Modified Error (Initial case)
- Related: Knowledge Base File Edit Failure (Re-occurrence)