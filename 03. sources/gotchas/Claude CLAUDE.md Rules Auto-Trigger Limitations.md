---
title: Claude CLAUDE.md Rules Auto-Trigger Limitations
type: note
permalink: gotchas/claude-md-rules-auto-trigger-limitations
tags:
- claude-code
- rules
- hooks
- automation
- limitation
extraction_status: pending
---

# Claude CLAUDE.md Rules Auto-Trigger Limitations

## Observations

### Problem Phenomenon
- Even with rules in CLAUDE.md, they are not automatically followed
- Complex conditional rules (if error → execute A) are likely ignored
- CLAUDE.md rules exist in context but don't auto-trigger

### Behavioral Characteristics
- Claude tends to follow familiar patterns (e.g., error → retry)
- Conditional rules like "on error → call error-review" are likely ignored
- "Reading rules" and "following rules" are different

### Correct Forced Method
- Important rules must be forced via PostToolUse Hook
- Detect errors at system level and output notifications
- Convert rules from "notification" to "enforcement"

### PostToolUse Hook Implementation
- Register scripts in hooks.PostToolUse array
- Detect error keywords → output systemMessage
- Must trigger at system level to ensure execution

### Design Principles
- Rules alone are insufficient
- Automation-requiring parts must be enforced via Hooks
- System supplementation is essential

## Relations
- Related: PostToolUse Hook Implementation
- Related: Hook System Architecture

## Basic Memory Observations
- [fact] CLAUDE.md rules exist in context but don't automatically trigger conditional logic #claude-code #limitations
- [warning] Complex conditional rules like "if error → execute A" are likely ignored by Claude #automation #behavior
- [pattern] Claude follows familiar patterns (error → retry) rather than custom CLAUDE.md rules #ai-behavior #defaults
- [solution] Important rules must be enforced via PostToolUse Hook at system level #hooks #enforcement
- [decision] Convert critical rules from "notification" to "enforcement" using Hook systemMessage output #architecture #design