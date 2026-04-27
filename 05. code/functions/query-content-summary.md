---
title: query-content-summary
type: note
permalink: zettelkasten/05.-code/functions/query-content-summary
level: low
category: code/mot-dashboard/queries
semantic: summarize content metrics
path: /volume1/web/mot/includes/queries/content.php
tags:
- function
- php
- mariadb
- sql
---

# query-content-summary

Summarize content metrics at a single snapshot date from `content_daily_cache` (platform-neutral).

## 시그니처

```php
function query_content_summary(PDO $pdo, array $params): array
```

## Observations

- [impl] Snapshot fixed to $params['date_to']. Builds dynamic WHERE with optional filters: platform, channel (via channel_filter_values() multi-value expansion), content_id, keyword. #algo
- [impl] Direct SELECT from `content_daily_cache` — no platform-specific branching. naver_blog likes/comments already arrive as cumulative values via the collector (`cumulative_likes/cumulative_comments`) exposed through `v_content_snapshots_raw`. #pattern
- [return] Rows with snapshotted views, likes, comments (+ prev_* and _diff fields) — uniform schema across platforms.
- [usage] `$summary = query_content_summary($pdo, $params); // Top 20 by views_diff`

## Relations

- part_of [[queries-content]]
- uses [[channel-filter-values]] (line 117, helpers.php)