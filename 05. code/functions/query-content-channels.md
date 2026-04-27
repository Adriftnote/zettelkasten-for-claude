---
title: query-content-channels
type: note
permalink: zettelkasten/05.-code/functions/query-content-channels
level: low
category: code/mot-dashboard/queries
semantic: list content channels
path: /volume1/web/mot/includes/queries/content.php
tags:
- function
- php
- mariadb
- sql
---

# query-content-channels

List unique channel labels for a platform, deduplicated by display text.

## 시그니처

```php
function query_content_channels(PDO $pdo, string $platform): array
```

## Observations

- [impl] Queries DISTINCT channel_name from content_daily_cache, optionally filtered by platform via PDO::quote(). Iterates to deduplicate by channel_label() output. #algo
- [return] Array of channel labels (formatted strings, not raw names).
- [usage] `$channels = query_content_channels($pdo, 'youtube'); // Show channel multiselect`
- [note] Filters channel_name IS NOT NULL to exclude incomplete rows. #caveat

## Relations

- part_of [[queries-content]]
- uses [[channel-label]] (line 208, helpers.php)