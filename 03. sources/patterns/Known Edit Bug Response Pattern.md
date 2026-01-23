---
title: Known Edit Bug Response Pattern
type: note
permalink: patterns/known-edit-bug-response-pattern
extraction_status: pending
---

# Known Edit Bug Response Pattern

## Observations

### Patterns
- [pattern] **Review previous errors first** - When Edit fails, don't retry immediately. First check existing review documents (005, 007) for same issue history
- [pattern] **Understand error characteristics** - Distinguish Windows timestamp bug (specific paths), file conflicts (multiple instances), or new cause
- [pattern] **Check if new file creation works** - If existing file Edit fails but new file Write succeeds → confirms timestamp validation issue
- [pattern] **Switch tools after 2 Edit failures** - If "File has been unexpectedly modified" error occurs twice consecutively → abandon Edit tool and switch to Write

### When to Use
- Known bug possibility exists in specific environment/path
- Same error occurred previously
- Error resolution takes 30+ minutes

### Solutions
- [solution] **Root fix**: Apply CLI patch (disable timestamp validation in cli.js) - reapply after each Claude Code update
- [solution] **Immediate workaround**: Use Write tool to overwrite entire file
- [solution] **Environment improvement**: Anglicize Windows path, exclude OneDrive sync, set antivirus exceptions
- [solution] **Documentation**: If issue repeats, add permanent documentation to knowledge/ directory for fast reference in next session

## Relations
- File Unexpectedly Modified Error: File conflict documentation (2026-01-09)
- Edit Cache Bug: Windows timestamp issue (2026-01-09)
- Previous Bug Reference: History from earlier resolution (2026-01-09)