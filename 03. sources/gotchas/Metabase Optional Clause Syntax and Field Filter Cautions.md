---
title: Metabase Optional Clause Syntax and Field Filter Cautions
type: note
permalink: gotchas/metabase-optional-clause-field-filter-syntax
tags:
- metabase
- sql
- optional-clause
- field-filter
- gotcha
extraction_status: pending
---

# Metabase SQL: Optional Clause and Field Filter Syntax

## Optional Clause Syntax

### Purpose
Skip condition when variable is empty.

### Basic Syntax
```sql
SELECT * FROM table
WHERE
  column_name = [[ AND additional_condition ]]
```

**Double Bracket `[[ ]]` = Optional Clause**

### Examples

```sql
-- Basic: No constraints
SELECT * FROM daily_channel_summary

-- Period filter (optional)
WHERE
  [[AND date >= {{start_date}}]]

-- Multiple conditions
WHERE
  status = 'active'
  [[AND platform = {{platform}}]]
  [[AND date >= {{start_date}}]]
```

### Operation
- `{{platform}}` has value → execute `AND platform = value`
- `{{platform}}` empty → skip entire `AND` clause

### Important: Operator Position
- ✅ `[[AND column = {{var}}]]` - AND **inside** bracket
- ❌ `WHERE [[column = {{var}}]] AND ...` - AND **outside** bracket (syntax error)

## Field Filter Syntax

### Purpose
Support dropdown filter with auto operator selection.

### Basic Syntax
```sql
-- Use variable only (column name, operator omitted)
WHERE {{date_filter}}

-- With comparison operator
WHERE date = {{period}}
```

### Template-Tag Type Comparison

| Type | Syntax | Dropdown | When to Use |
|------|--------|----------|-------------|
| **text** | `WHERE column = {{var}}` | ❌ | Text input only |
| **category** | `WHERE column = {{var}}` | ✅ | Fixed choices (static) |
| **Field Filter** | `WHERE {{var}}` | ✅ | Model/DB table values |

### Field Filter Example
```sql
-- Field Filter (column name omitted)
SELECT * FROM orders
WHERE {{date_filter}}

-- Variables setting:
-- - Type: Field Filter
-- - Field to map to: orders.created_at
```

## DO/DON'T

### DO
- Place AND inside Optional Clause bracket
- Field Filter use variable name only (column auto)
- Distinguish text/category types
- Use Model reference for dropdown

### DON'T
- `AND [[column = {{var}}]]` order (syntax error)
- Specify column name in Field Filter syntax (auto)
- Optional Clause variable empty result in NULL (skip entire condition)
- Use category type for dynamic values (Model)

## Pattern Template

### Optional + Field Filter
```sql
SELECT SUM(amount) AS total
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id
WHERE
  o.status = 'completed'
  [[AND {{date_range}}]]
  [[AND {{customer_filter}}]]
```

### Nested Optional Clauses
```sql
SELECT *
FROM table
WHERE
  1=1
  [[AND date >= {{start_date}}]]
  [[AND date <= {{end_date}}]]
  [[AND status = {{status}}]]
  [[AND platform = {{platform}}]]
```

## Relations
- Related: Field Filter Dimension Type Returns Null
- Related: Metabase Template Tags Required

## Observations

- [pattern] Double bracket `[[ ]]` syntax enables optional SQL clauses that skip when variable is empty #metabase #sql #optional-clause
- [warning] AND operator must be placed inside optional clause brackets `[[AND ...]]`, not outside to avoid syntax errors #metabase #sql #syntax-error
- [tech] Field Filter type uses variable name only without column specification, auto-maps to database fields #metabase #field-filter #template-tag
- [decision] Use text type for static input, category for fixed choices, Field Filter for dynamic database values #metabase #variable-types
- [pattern] Start WHERE clause with `1=1` when using multiple optional clauses for cleaner syntax #metabase #sql #best-practice