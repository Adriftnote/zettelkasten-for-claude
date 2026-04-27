---
title: query-channel-platforms
type: note
permalink: zettelkasten/05.-code/functions/query-channel-platforms
level: low
category: code/mot-dashboard/queries
semantic: list channel platforms
path: /volume1/web/mot/includes/queries/channel.php
tags:
- function
- php
- mariadb
- sql
---

# query-channel-platforms

Fetch deduplicated platform list (dropdown/filter options).

## 시그니처

```php
function query_channel_platforms(PDO $pdo): array
```

## Observations

- [impl] Queries DISTINCT platform from `v_channel_follower_summary`, then deduplicates via `platform_label()` (lines 65–71). #pattern
- [impl] Deduplication: transforms platform value via label, skips if label already seen, appends original platform (line 69–70). #algo
- [return] Array of original platform codes (deduplicated by label).
- [usage] `$platforms = query_channel_platforms($pdo); // ['youtube','tiktok','instagram',...]`
- [note] Deduplication layer protects against platform value variations that map to same label (e.g., 'YT' vs 'youtube'). #caveat

## Relations

- part_of [[queries-channel]]
- uses [[platform-label]] (line 69, helpers.php)