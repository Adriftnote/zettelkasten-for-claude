---
title: Metabase IN Clause Parameter Usage
type: note
permalink: gotchas/metabase-in-clause-parameter-usage
tags:
- metabase
- sql
- parameter
- field-filter
- model
extraction_status: pending
---

# Metabase IN Clause Parameter Usage

## Observations

### Basic Variable Does Not Support IN Clause
- Basic Variable (Text/Number) supports single value only
- Use `WHERE platform = {{platform}}` format for single value comparison
- `WHERE platform IN ({{variable}})` ❌ SQLite syntax error

### Field Filter (Direct Table Mapping) - Standalone Syntax Required
- Field Filter mapped directly to table column uses `WHERE {{platform}}` format
- Cannot use in IN clause directly
- Metabase automatically generates "platform IN (...)"

### Field Filter (Model Mapping) - Can Use IN Clause Directly
- Field Filter with Model mapping can use `WHERE platform IN ({{platform}})` format
- Model created via UNION ALL to generate selection data
- Convert Question → Model, then Variable type → Field Filter, Field to map to → Model column select

## Relations
- Related: Metabase Model for Dropdown
- Related: Metabase Optional Clause Syntax

## Observations

- [gotcha] Basic Variable (Text/Number) type does not support IN clause - only single value comparisons work #metabase #parameter #sql
- [pattern] Field Filter with direct table mapping requires standalone `WHERE {{variable}}` syntax - Metabase auto-generates IN clause #metabase #field-filter
- [solution] Field Filter with Model mapping allows direct IN clause usage `WHERE column IN ({{variable}})` #metabase #model #workaround
- [tech] Create Model via UNION ALL for selection data, then convert Question to Model and map Field Filter to Model column #metabase #implementation