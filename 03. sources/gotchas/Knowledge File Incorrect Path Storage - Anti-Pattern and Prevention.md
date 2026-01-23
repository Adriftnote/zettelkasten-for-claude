---
title: Knowledge File Incorrect Path Storage - Anti-Pattern and Prevention
type: note
permalink: gotchas/knowledge-file-incorrect-path-anti-pattern-prevention
tags:
- workflow
- knowledge
- path
- anti-pattern
- prevention
- gotcha
extraction_status: pending
---

# Knowledge File Incorrect Path Storage - Anti-Pattern and Prevention

## Problem

Knowledge files saved in **project internal** instead of external:
- **Wrong path**: `project/knowledge/004-...md`
- **Correct path**: `claude-code-env/knowledge-base/knowledge/`

## Root Cause (Anti-Patterns)

### Anti-Pattern #1: Workflow Shortcut
- Normal: Review → Knowledge (sequential)
- Actual: Create Knowledge directly (skip Review)

### Anti-Pattern #2: Path Guessing
- Following existing file paths from inertia
- Stuck in project context
- Referencing nonexistent files

### Anti-Pattern #3: Proceeding Without Validation
- No verification of parent file existence
- No path rule confirmation
- No validation checklist

## Decision Rules

| Type | Storage Location |
|------|------------------|
| Project spec | `project/spec/` |
| Project outputs | `project/outputs/` |
| **Reusable Knowledge** | `claude-code-env/knowledge-base/knowledge/` |
| **Review/Analysis** | `claude-code-env/knowledge-base/reviews/` |

## Prevention Checklist

Before creating Knowledge file, must confirm:
1. □ Is this information **project-dependent**? (NO → store externally)
2. Is this **reusable in other projects**? (YES → store externally)
3. Is correct path `claude-code-env/knowledge-base/knowledge/`?

## Lessons

1. **Knowledge is not project-dependent** - Externalization principle
2. **Workflow has reason** - Follow Review → Knowledge order
3. **Path is confirmation, not guessing** - Rule-based decision
4. **System won't enforce, mistakes happen** - Need automated validation

## System Improvements Needed

1. Clarify external file path rules in CLAUDE.md
2. `/compound` command validates parent file existence
3. Implement Review creation command

## Relations

- **anti-pattern**: workflow, path, knowledge-base
- **related**: workflow-rules, path-rules
- **date**: 2025-12-09
- **type**: gotcha, prevention

## Observations

- [pattern] Knowledge files mistakenly stored in project internal paths instead of external claude-code-env/knowledge-base/knowledge/ #path #anti-pattern
- [cause] Workflow shortcuts (skipping Review step) and path guessing from project context lead to incorrect storage location #workflow
- [decision] Reusable knowledge must be stored externally in claude-code-env, not in project-specific folders #knowledge-base #externalization
- [tip] Before creating knowledge file, verify it's not project-dependent and is reusable across projects #prevention #checklist
- [warning] System won't enforce path rules automatically - manual validation required to prevent mistakes #gotcha