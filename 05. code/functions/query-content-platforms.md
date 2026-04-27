---
title: query-content-platforms
type: note
permalink: zettelkasten/05.-code/functions/query-content-platforms
level: low
category: code/mot-dashboard/queries
semantic: list content platforms
path: /volume1/web/mot/includes/queries/content.php
tags:
- function
- php
- mariadb
- sql
---

# query-content-platforms

List unique platform codes, deduplicated by display label.

## 시그니처

```php
function query_content_platforms(PDO $pdo): array
```

## Observations

- [impl] Fetches DISTINCT platform from content_daily_cache, then filters duplicates by calling platform_label() on each and checking label uniqueness. #pattern
- [return] Array of platform codes (e.g., ['youtube', 'tiktok', 'meta_fb', 'naver_blog']).
- [usage] `$platforms = query_content_platforms($pdo); // Render dropdown options`

## Relations

- part_of [[queries-content]]
- uses [[platform-label]] (line 193, helpers.php)