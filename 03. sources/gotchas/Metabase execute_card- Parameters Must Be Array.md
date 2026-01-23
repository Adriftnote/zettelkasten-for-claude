---
title: 'Metabase execute_card: Parameters Must Be Array'
type: note
permalink: gotchas/metabase-execute-card-parameters-array
tags:
- metabase
- mcp
- api
- bug
extraction_status: pending
---

# Metabase execute_card: Parameters Must Be Array

## Observations

### Problem Occurrence
- Passing `parameters` as object `{}` causes error
- Error: Assert failed: (u/maybe? sequential? parameters)
- Cause: @easecloudio/mcp-metabase-server package bug

### Correct Usage
- `parameters` **must be array `[]` format**
- Example: execute_card({ card_id: 47, parameters: [] })
- Metabase API accepts array or nil only

### Bug Fix Location
- File: C:\\Users\\RL\\AppData\\Local\\npm-cache\\_npx\\...\\card-tools.js:213
- Approach 3 (PUT /api/dashboard/:id/cards) disabled
- Replaced with clear error message

## Relations
- Related: Metabase MCP Server Only