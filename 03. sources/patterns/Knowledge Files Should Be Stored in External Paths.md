---
title: Knowledge Files Should Be Stored in External Paths
type: note
permalink: patterns/knowledge-files-external-storage-pattern
tags:
- knowledge
- workflow
- path
- organization
extraction_status: pending
---

# Knowledge Files Should Be Stored in External Paths

## Observations

### Path Classification Rules
- [pattern] Project spec → `project/spec/`
- [pattern] Project outputs → `project/outputs/`
- [pattern] Reusable knowledge → `claude-code-env/knowledge-base/knowledge/`
- [pattern] Reviews/analysis → `claude-code-env/knowledge-base/reviews/`

### Knowledge Storage Location Decision Criteria
- [question] Is this information project-dependent? → NO, then external
- [question] Can other projects use this? → YES, then external
- [pattern] Do not create knowledge folder inside project

### Correct Path Examples
- [example] C:\users\name\claude-code-env\knowledge-base\knowledge\007-xxx.md ✅
- [example] C:\users\name\Projects\{project}\knowledge\007-xxx.md ❌

### Design Principles
- [principle] Knowledge is not project-dependent
- [principle] Must be reusable
- [principle] Search/reference must be possible in one location

## Relations
- Knowledge Workflow: Knowledge files external organization pattern (2026-01-09)