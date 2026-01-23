---
title: Metabase Default Values Must Be Set in Both Template-Tags and Parameters
type: note
permalink: gotchas/metabase-default-values-both-template-parameters
tags:
- metabase
- api
- default-value
- template-tags
- parameters
extraction_status: pending
---

# Metabase Default Values Must Be Set in Both Template-Tags and Parameters

## Observations

### Problem Symptoms
- Default value in template-tags only → Dashboard default selection doesn't appear
- Default value in parameters only → SQL query default not applied

### Role Division
- `template-tags.default` → Default when SQL query executes
- `parameters.default` → Default selection in filter widget UI

### Correct Implementation
- Set default value in **both** template-tags and parameters
- Both must have same value for consistency
- Dashboard loads with default filter selection

### Operation Principle
- `template-tags.default` = SQL default when user doesn't select filter
- `parameters.default` = Filter widget shows this value selected on dashboard load
- Both required for dashboard default filter display with consistency

### Cautions
- Setting in only one location causes incomplete behavior
- Must update both when changing default

## Relations
- Related: Metabase Dropdown API Template Tags Parameters

## Observations

- [gotcha] Default values must be set in both `template-tags.default` and `parameters.default` for proper dashboard behavior #metabase #default-value
- [pattern] `template-tags.default` controls SQL query execution default, `parameters.default` controls UI widget display #metabase #architecture
- [warning] Setting default in only one location causes incomplete behavior - dashboard won't show default selection or query won't use default value #metabase #bug-prevention
- [tip] Both values must be identical to maintain consistency between UI and query execution #metabase #best-practice