---
title: n8n Empty Array Response Returns Items Undefined Error
type: note
permalink: gotchas/n8n-empty-array-items-undefined-error
tags:
- n8n
- gotcha
- error
- guard-pattern
extraction_status: pending
---

# n8n Empty Array Response Returns Items Undefined Error

## Observations

### Symptoms
- `TypeError: Cannot read properties of undefined (reading 'items')`
- Occurs between HTTP Request node and Set node
- Happens only when API response is empty array `[]`

### Root Cause
n8n HTTP Request node returns empty array:
- Data passed to next node becomes `undefined`
- `$json` itself doesn't exist, can't access properties
- n8n treats empty array as "no items to execute"

### Attempted Solutions
| Method | Result |
|--------|--------|
| Direct `$json.items` access in Set node | Failed |
| IF node checks array length and branches | Success |

### Recommended Solution
Add IF node after HTTP Request to check empty array:

```javascript
// IF node condition (Expression)
{{ $json ? true : false }}

// Or check input item count
{{ $input.all().length > 0 }}
```

Workflow structure:
```
HTTP Request → IF (check empty) → [True] Set node
                                → [False] No Operation
```

## Best Practices (DO/DON'T)

### ✓ DO
- Check empty response with IF node after every API call
- Use `$input.all().length > 0` pattern
- Set alternative path when array is empty (No Operation or default)

### ✗ DON'T
- Pass API response directly to next node
- Access properties without checking empty array possibility

## Relations
- **Type**: Error & Guard Pattern
- **Tags**: n8n, runtime-error, empty-array, null-check
- **Related**: n8n Empty Array Guard, n8n Expression Patterns