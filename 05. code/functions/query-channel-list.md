---
title: query-channel-list
type: note
permalink: zettelkasten/05.-code/functions/query-channel-list
level: low
category: code/mot-dashboard/queries
semantic: list channels
path: /volume1/web/mot/includes/queries/channel.php
tags:
- function
- php
- mariadb
- sql
---

# query-channel-list

Fetch channel names with optional platform filter (dropdown/autocomplete options).

## 시그니처

```php
function query_channel_list(PDO $pdo, string $platform): array
```

## Observations

- [impl] Queries DISTINCT channel_name from `v_channel_follower_summary`, optionally filtered by platform (line 78–80). #algo
- [impl] Deduplicates via `channel_label()` same as platforms (lines 84–88). #pattern
- [impl] Platform filter uses `$pdo->quote()` to prevent SQL injection (line 77). #pattern
- [return] Array of deduplicated channel label strings.
- [usage] `$channels = query_channel_list($pdo, 'youtube'); // ['MBC', 'SBS', ...]`

## Relations

- part_of [[queries-channel]]
- uses [[channel-label]] (line 84, helpers.php)
- called_by [[query-channel-names]] (line 95)