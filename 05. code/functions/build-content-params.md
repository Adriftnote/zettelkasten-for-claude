---
title: build-content-params
type: note
permalink: zettelkasten/05.-code/functions/build-content-params
level: low
category: code/mot-dashboard/queries
semantic: parse content params
path: /volume1/web/mot/includes/queries/content.php
tags:
- function
- php
- mariadb
- sql
---

# build-content-params

Parse `$_GET` parameters into normalized content query object with validation and defaults.

## 시그니처

```php
function build_content_params(PDO $pdo): array
```

## Observations

- [impl] Validates date format (YYYY-MM-DD regex). Falls back to DB MAX(snap_date) if missing. Computes date_from as 29 days prior to date_to. #algo
- [impl] Enforces whitelist on view_mode (date/time/datetime) and limit (0/20/50/100). #pattern
- [return] Returns assoc array: date_from, date_to, platform, channel, content_id, keyword, view_mode, limit.
- [usage] `$params = build_content_params($pdo); $rows = query_content_by_mode($pdo, $params);`

## Relations

- part_of [[queries-content]]