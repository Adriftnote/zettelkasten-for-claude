---
title: Metabase MCP Server Selection - metabase-server Only
type: note
permalink: patterns/metabase-mcp-server-selection-metabase-server-only
tags:
- metabase
- mcp
- visualization
- question
- card
extraction_status: pending
---

# Metabase MCP Server Selection - metabase-server Only

## Observations

### MCP Server Selection
- [gotcha] metabase-ai-assistant has many unimplemented functions
- [warning] `mb_question_create_parametric` ❌
- [warning] `mb_dashboard_add_filter` ❌
- [warning] `mb_dashboard_layout_optimize` ❌
- [pattern] For all visualization tasks → use metabase-server.create_card only

### Required Elements for Question Creation
- [pattern] display field required (visualization type)
- [pattern] visualization_settings included (object possible)
- [pattern] collection_id specifies save location

### Display Type Mapping
- [reference] `scalar` - KPI/single value
- [reference] `table` - table
- [reference] `line` - line chart
- [reference] `bar` - bar chart
- [reference] `pie` - pie chart

## Relations
- Metabase Card Parameters Array (2026-01-09)