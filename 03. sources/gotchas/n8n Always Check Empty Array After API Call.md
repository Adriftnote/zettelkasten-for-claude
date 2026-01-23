---
title: n8n Always Check Empty Array After API Call
type: note
permalink: gotchas/n8n-empty-array-check-after-api
tags:
- n8n
- empty-array
- null-check
- defensive-coding
- api
extraction_status: pending
---

# n8n Always Check Empty Array After API Call

## Observations

### Problem Symptoms
- External API returns empty array → next node gets "Cannot read properties of undefined"
- n8n treats empty array as "no items to execute"
- Data passed to next node is undefined

### Correct Pattern
- HTTP Request → IF node → [True] Set node / [False] No Operation
- IF node condition: `{{ $input.all().length > 0 }}`
- Check array existence first before processing

### Operation Principle
- n8n executes each node per array item
- Empty array = "no items to execute" = data not passed to next node
- Next node receives undefined `$json`

### Recommended Method
- Check array length after every API response
- Branch processing: handle empty array case
- Or set default value

## Relations
- Related: n8n Empty Array Response Returns Items Undefined Error