---
title: SQLite Dynamic Period Grouping (Daily/Weekly/Monthly)
type: note
permalink: patterns/sqlite-dynamic-period-grouping-daily-weekly-monthly
tags:
- metabase
- sql
- sqlite
- strftime
- grouping
- period
- dynamic
extraction_status: pending
---

# SQLite Dynamic Period Grouping (Daily/Weekly/Monthly)

## Observations

### Dynamic Grouping Pattern
- [pattern] CASE statement applies different strftime format based on user selection
- [pattern] Use identical CASE expression in both SELECT and GROUP BY
- [example] CASE WHEN {{period}} = '일별' THEN date

### strftime Formats
- [reference] `%Y-%m-%d` - 2025-12-22 (daily, same as default date format)
- [reference] `%Y-W%W` - 2025-W51 (weekly, year-week)
- [reference] `%Y-%m` - 2025-12 (monthly, year-month)
- [gotcha] `%q` (quarter) not supported in SQLite

### Model Dropdown Source
- [pattern] Create period options with UNION ALL
- [example] Set as Korean: '일별', '주별', '월별'
- [gotcha] Model values display directly in card title so use Korean

### Dynamic Card Title Configuration
- [pattern] Include `{{period}}` in card name
- [example] "{{period}} Views Trend"
- [result] Auto-converts to "Daily Views Trend", "Weekly Views Trend" etc.

## Relations
- Metabase Field Filter Configuration: Related setup (2026-01-09)
- Using Variables in Card Titles: Title implementation (2026-01-09)