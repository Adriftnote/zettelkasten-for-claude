---
title: query-content-titles
type: note
permalink: zettelkasten/05.-code/functions/query-content-titles
level: low
category: code/mot-dashboard/queries
semantic: list content titles
path: /volume1/web/mot/includes/queries/content.php
tags:
- function
- php
- mariadb
- sql
---

# query-content-titles

List unique content titles for search autocomplete, optionally filtered by platform and channel.

## 시그니처

```php
function query_content_titles(PDO $pdo, string $platform, string $channel): array
```

## Observations

- [impl] Builds dynamic WHERE: platform via PDO::quote(), channel expanded via channel_filter_values() into IN (...) clause with quoted placeholders. #algo
- [return] Array of up to 200 distinct content_title strings, ordered alphabetically.
- [usage] `$titles = query_content_titles($pdo, 'youtube', ''); // Typeahead options`
- [note] Filters content_title IS NOT NULL. Hard limit 200 rows to prevent autocomplete bloat. #caveat

## Relations

- part_of [[queries-content]]
- uses [[channel-filter-values]] (line 221, helpers.php)