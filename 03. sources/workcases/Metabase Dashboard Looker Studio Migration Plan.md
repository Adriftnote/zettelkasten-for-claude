---
title: Metabase Dashboard Looker Studio Migration Plan
type: workcase
extraction_status: pending
permalink: sources/workcases/metabase-dashboard-looker-studio-migration-plan
tags:
- metabase
- dashboard
- looker-migration
- work-case
---

# Metabase Dashboard Migration Project

## Overview
Building a Metabase dashboard to visualize SNS channel data (YouTube, Instagram, TikTok) and replace Looker Studio.

## Core Objectives
- Remove Google Sheets intermediate layer
- Direct SQLite connection
- Complete dashboard matching Looker Studio metrics

## Learned Patterns

### MCP Tool Usage Patterns
- `mb_question_create`: Create SQL-based Question
- `mb_dashboard_create`: Create dashboard
- `mb_dashboard_add_card`: Add card (set position + parameter_mappings simultaneously)
- `mb_dashboard_add_filter`: Add filter

### Metabase Grid System
- 24-column base
- 4 per line: 6x size
- 3 per line: 8x size
- 2 per line: 12x size

### Data Transformation Cautions
- Vertical data → Horizontal with CASE WHEN pivot (for series recognition)
- NULL vs 0: NULL = line break, 0 = bottom
- `[[AND condition]]` syntax: Ignore condition if no parameter

## Things to Avoid
- Creating multiple Questions at once
- Using `update_dashboard_card` (card gets deleted)
- Proceeding to next step without validation

## Status
In Progress (Phase 01-a-main-overview)

## Related Tools
- Metabase API
- MCP Metabase Server
- SQLite

## Observations

- [pattern] Metabase grid uses 24-column system: 4 cards per row = 6x width, 3 per row = 8x, 2 per row = 12x #metabase #layout
- [warning] Using update_dashboard_card causes card deletion; must use add_card instead #metabase #bug
- [solution] Vertical data must be pivoted to horizontal using CASE WHEN for series recognition in charts #data-transformation
- [tip] In Metabase filters, [[AND condition]] syntax ignores condition when parameter is empty #metabase #filtering
- [method] For successful Metabase development: create one Question at a time and validate before proceeding #workflow
