---
title: query-channel-daily
type: note
permalink: zettelkasten/05.-code/functions/query-channel-daily
level: low
category: code/mot-dashboard/queries
semantic: query channel daily metrics
path: /volume1/web/mot/includes/queries/channel.php
tags:
- function
- php
- mariadb
- sql
---

# query-channel-daily

Fetch channel details grouped by date (view/detail screen).

## 시그니처

```php
function query_channel_daily(PDO $pdo, array $params): array
```

## Observations

- [impl] Nearly identical to `query_channel_summary` except ORDER BY `snap_date DESC` only (no follower_diff sort, line 56). #algo
- [impl] Same `build_where_clause` + limit logic (lines 48–50). #pattern
- [return] Same structure as summary: `{snap_date, platform, channel_name, followers, followers_diff}` rows.
- [usage] `$daily = query_channel_daily($pdo, $params); // sorted chronologically DESC`
- [note] Differs from summary only in sort order; consider refactoring to single function with sort param. #caveat

## Relations

- part_of [[queries-channel]]
- uses [[build-where-clause]] (line 48, helpers.php)