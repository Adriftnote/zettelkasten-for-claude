---
title: Field Filter (Dimension Type) Returns Null When Writing Condition Directly
type: note
permalink: gotchas/field-filter-dimension-type-null-direct-condition
tags:
- metabase
- field-filter
- dimension
- template-tags
- null
extraction_status: pending
---

# Field Filter (Dimension Type) Returns Null When Writing Condition Directly

## Observations

### Key Difference
- **text/date**: Only `{{variable}}` is replaced, condition written in SQL
- **dimension**: `{{variable}}` becomes complete condition itself
- **Gotcha**: Mixing them causes null return

### Field Filter (Dimension) Characteristics
- Metabase automatically generates condition statement
- `{{date_range}}` becomes "date BETWEEN '2025-01-01' AND '2025-12-31'" complete condition
- Writing condition directly causes double condition, returns null

### Incorrect Usage (Returns Null)
- `[[AND date >= {{date_range}}]]` - null if dimension type
- `[[AND date <= {{date_range}}]]` - also null

### Correct Usage
- `[[AND {{date_range}}]]` - dimension type (Metabase generates condition)
- `[[AND date >= {{start_date}}]]` - text/date type (only value replaced)

### When to Use What?
- Date range filter (between) → dimension + date/range widget
- Specific comparison (>=, <=, =) → text or date
- Dropdown with values → text + values_source
- Table column auto-complete → dimension

### Selection Criteria
- Complex condition (OR, subquery) → use text type
- Dashboard filter connection important → use dimension

## Relations
- Related: Metabase Optional Clause Syntax
- Related: Metabase Native Query Template Tags Required