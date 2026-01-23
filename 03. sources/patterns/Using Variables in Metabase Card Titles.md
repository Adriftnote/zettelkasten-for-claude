---
title: Using Variables in Metabase Card Titles
type: note
permalink: patterns/metabase-card-title-variable-usage
tags:
- metabase
- card
- title
- variable
- dynamic
extraction_status: pending
---

# Using Variables in Metabase Card Titles

## Observations

### Basic Usage
- [pattern] Card/Dashboard titles with `{{variable}}` display filter selection values
- [example] "{{period}} Views Trend"
- [result] Daily → "Daily Views Trend", Weekly → "Weekly Views Trend"

### Model Value Display
- [gotcha] Model values display as-is in title
- [gotcha] English values (day, week) look awkward
- [pattern] Set Model with Korean values ('일별', '주별') → natural title display

### Dashboard Title Application
- [pattern] Dashboard title also supports variables
- [example] "Content Marketing Channel {{period}} Performance"
- [result] "Content Marketing Channel Weekly Performance"

### Implementation Order
1. [step] Create Model with Korean values
2. [step] Add {{variable}} to Card/Dashboard title
3. [step] Dashboard filter selection automatically updates title

## Relations
- Metabase Model for Dropdown: Core implementation (2026-01-09)
- SQLite Dynamic Period Grouping: Related query pattern (2026-01-09)
- Metabase Field Filter Configuration: Related setup (2026-01-09)