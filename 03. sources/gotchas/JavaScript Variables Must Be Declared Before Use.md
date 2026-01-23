---
title: JavaScript Variables Must Be Declared Before Use
type: note
permalink: gotchas/javascript-variables-must-declare-before-use
tags:
- javascript
- hoisting
- tdz
- let
- const
- variable-declaration
extraction_status: pending
---

# JavaScript Variables Must Be Declared Before Use

## Observations

### Problem Symptoms
- let/const usage causes ReferenceError when accessing before declaration
- TDZ (Temporal Dead Zone) - access impossible before declaration
- Different from var which returns undefined via hoisting

### TDZ (Temporal Dead Zone)
- let/const cannot be accessed in any form before declaration
- var is hoisted so declaration moves to scope top
- **Hoisting behavior completely different between var and let/const**

### Correct Method
- Declare variables before use
- Only access after declaration
- Collect all variable declarations at function scope top to prevent mistakes

### Prevention Method
- ESLint `no-use-before-define` rule prevents in advance
- Develop habit of checking variable declaration location during review

### Additional Tips
- TDZ is region from block scope start to declaration
- if, for, while blocks create new scope

## Relations
- Related: JavaScript ReferenceError - Variable Use Before Declaration