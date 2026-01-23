---
title: Safely Patching CLI.js with sed
type: note
permalink: patterns/cli.js-safely-patching-sed-method
tags:
- claude-code
- cli.js
- patch
- sed
- javascript
- minified
extraction_status: pending
---

# Safely Patching CLI.js with sed

## Observations

### Methods to Avoid
- [gotcha] Python re.sub() usage prohibited
- [problem] Regular expression escape handling causes unintended character conversions
- [example] `!` converts to `\!` causing syntax errors
- [result] SyntaxError: Invalid or unexpected token

### Correct Patching Order
1. [step] Use grep to verify actual pattern (identify exact string)
2. [step] Create backup (immediate recovery on failure)
3. [step] Use sed for simple string substitution
4. [step] Check syntax with claude --version
5. [step] Restart Claude Code (mandatory)

### Core Principles
- [pattern] Verify with grep first - understand the actual pattern precisely
- [pattern] Use sed - simple string substitution, minimize regex
- [pattern] Backup mandatory - enable immediate recovery on failure
- [pattern] Validate immediately - check syntax with claude --version
- [pattern] Restart required - close and restart Claude Code terminal after patching

### Version-Specific Cautions
- [gotcha] Variable names differ across versions due to minified code
- [pattern] Always verify with grep first!
- [reference] v2.0.61: !z||C>z.timestamp
- [reference] v2.0.63: !C||F>C.timestamp, !T||N>T.timestamp
- [reference] v2.0.69: !_||M>_.timestamp
- [reference] v2.0.75: !z||E>z.timestamp, !R||M>R.timestamp
- [reference] v2.1.6: !_||M>_.timestamp, !z||E>z.timestamp

## Relations