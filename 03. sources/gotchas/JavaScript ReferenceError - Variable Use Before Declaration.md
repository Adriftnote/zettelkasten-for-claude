---
title: JavaScript ReferenceError - Variable Use Before Declaration
type: note
permalink: gotchas/javascript-referenceerror-variable-before-declaration
tags:
- javascript
- reference-error
- hoisting
- tdz
- variable-declaration
- gotchas
extraction_status: pending
---

# JavaScript: ReferenceError - Variable Use Before Declaration

## Observation

**Type:** Error Pattern  
**Date:** 2025-12-12  
**Tags:** javascript, reference-error, hoisting, variable-declaration

---

## Symptoms

- **Error Message:** `ReferenceError: myVariable is not defined`
- **Occurs When:** Accessing `let`, `const` variable before declaration line

```javascript
// Problem code
console.log(myVariable);  // ReferenceError!
let myVariable = "hello";
```

---

## Root Cause

JavaScript's `let`, `const` variables operate with **TDZ (Temporal Dead Zone)** mechanism:

1. **Hoisting** - Variable declaration pulled to scope top
2. **TDZ** - Inaccessible until declaration line (vs `var` initializes to `undefined`)
3. **Result** - ReferenceError occurs

### var vs let/const Comparison

| Method | Hoisting | Initial Value | TDZ |
|--------|----------|---------------|-----|
| `var` | Yes | undefined | None |
| `let`/`const` | Yes | (inaccessible) | Until declaration |

---

## Solution

Move variable declaration before use location:

```javascript
// Fixed code
let myVariable = "hello";
console.log(myVariable);  // "hello"
```

---

## Rules (DO/DON'T)

### DO
- Declare variable before use
- Enable ESLint `no-use-before-define` rule
- Declare needed variables at code top
- Understand TDZ concept before code review

### DON'T
- Access variable before declaration
- Expect `let`/`const` to behave like `var` hoisting
- Ignore TDZ and arrange code arbitrarily

---

## Relations

- **Related Error:** ReferenceError
- **Language:** JavaScript
- **Concepts:** Variable Hoisting, TDZ, Scope
- **Preventions:** Linting (ESLint), Code Review

## Observations

- [bug] let/const variables cause ReferenceError when accessed before declaration line #javascript #tdz #reference-error
- [cause] TDZ (Temporal Dead Zone) makes variables inaccessible until declaration, unlike var which initializes to undefined #hoisting #tdz
- [pattern] var and let/const have fundamentally different hoisting behaviors - var initializes to undefined, let/const remains inaccessible #variable-declaration
- [solution] Move variable declarations before usage locations and enable ESLint no-use-before-define rule #prevention #linting
- [warning] Cannot expect let/const to behave like var hoisting - accessing before declaration always throws error #gotcha