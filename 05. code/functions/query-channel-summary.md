---
title: query-channel-summary
type: note
permalink: zettelkasten/05.-code/functions/query-channel-summary
level: low
category: code/mot-dashboard/queries
semantic: summarize channel followers
path: /volume1/web/mot/includes/queries/channel.php
tags:
- function
- php
- mariadb
- sql
---

# query-channel-summary

Fetch channel list sorted by follower_diff DESC (status dashboard view).

## 시그니처

```php
function query_channel_summary(PDO $pdo, array $params): array
```

## Observations

- [impl] Calls `build_where_clause($params)` to build dynamic WHERE + bind params (line 31). #pattern
- [impl] Uses `v_channel_follower_summary` view; orders by `follower_diff DESC, snap_date DESC` (line 39).
- [impl] Respects `$params['limit']`; if 0 uses PHP_INT_MAX (line 33). #caveat
- [return] PDOStatement::fetchAll() result: array of `{snap_date, platform, channel_name, followers, followers_diff}` rows.
- [usage] `$rows = query_channel_summary($pdo, $params); foreach($rows as $r) echo $r['followers_diff'];`
- [note] Cache hook placeholder at line 30 (not implemented). #caveat

## Relations

- part_of [[queries-channel]]
- uses [[build-where-clause]] (line 31, helpers.php)