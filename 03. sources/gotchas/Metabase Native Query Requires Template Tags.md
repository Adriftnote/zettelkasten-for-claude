---
title: Metabase Native Query Requires Template Tags
type: note
permalink: gotchas/metabase-native-query-requires-template-tags
tags:
- metabase
- sql
- template-tags
- api
- native-query
extraction_status: pending
---

# Metabase Native Query Requires Template Tags

## Observations

### Problem Symptoms
- Using `{{variable}}` in SQL but not defining in template-tags → parameter not recognized
- Parameter doesn't appear in Question UI
- Cannot connect filter in Dashboard
- `result_metadata` shows null

### Core Rule
- Native Query using `{{variable}}` **must define in `template-tags`**
- MCP has `mb_question_create_parametric` tool (use if available - auto-generates)
- Otherwise include `template-tags` in `dataset_query` directly

### Template-Tags Types
- `date` - Date selection
- `text` - Text input
- `number` - Number input
- `dimension` - Field Filter (connect table column)

### Correct Implementation
- template-tags needs id, type, name, display-name required fields
- Using {{start_date}} in SQL requires start_date in template-tags definition

## Relations
- Related: Metabase IN Clause Parameter Usage
- Related: Metabase Optional Clause Syntax

## Observations

- [gotcha] Native Query using `{{variable}}` syntax must define corresponding entry in `template-tags` object - parameter won't be recognized otherwise #metabase #native-query #template-tags
- [pattern] Template-tags types: `date`, `text`, `number`, `dimension` (Field Filter) - each serves different parameter use cases #metabase #parameter-types
- [tip] Use MCP `mb_question_create_parametric` tool when available - auto-generates template-tags correctly #metabase #mcp #automation
- [cause] Missing template-tags definition causes parameter not appearing in UI, dashboard filter connection failure, and null `result_metadata` #metabase #troubleshooting