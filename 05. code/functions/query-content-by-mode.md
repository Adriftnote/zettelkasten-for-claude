---
title: query-content-by-mode
type: note
permalink: zettelkasten/05.-code/functions/query-content-by-mode
level: low
category: code/mot-dashboard/queries
semantic: query content by view mode
path: /volume1/web/mot/includes/queries/content.php
tags:
- function
- php
- mariadb
- sql
---

# query-content-by-mode

Fetch content rows with view-mode-specific aggregation (date, time, or datetime with LAG windows).

## 시그니처

```php
function query_content_by_mode(PDO $pdo, array $params): array
```

## Observations

- [impl] Three branches by view_mode: (1) 'date' queries content_daily_cache directly (perf reason, avoids VIEW LAG overhead). (2) 'time' groups by snap_hour + MAX aggregates. (3) 'datetime' applies LAG window function over content_id/platform. #pattern
- [impl] Constructs WHERE clause via build_where_clause() helper. Enforces limit or PHP_INT_MAX. #algo
- [return] Flat array of rows with uniform schema: snap_date, snap_hour, platform, channel_name, content_id, views, views_diff, etc.
- [usage] `$rows = query_content_by_mode($pdo, ['date_from'=>'2026-04-01', 'date_to'=>'2026-04-20', 'limit'=>20, 'view_mode'=>'date']);`
- [note] 'datetime' mode uses v_content_snapshots_raw VIEW with expensive LAG; prefer content_daily_cache for large date ranges. #caveat

## Relations

- part_of [[queries-content]]
- uses [[build-where-clause]] (line 43, helpers.php)