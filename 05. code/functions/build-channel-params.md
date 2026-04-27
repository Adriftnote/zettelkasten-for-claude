---
title: build-channel-params
type: note
permalink: zettelkasten/05.-code/functions/build-channel-params
level: low
category: code/mot-dashboard/queries
semantic: parse channel params
path: /volume1/web/mot/includes/queries/channel.php
tags:
- function
- php
- mariadb
- sql
---

# build-channel-params

Parse `$_GET` channel parameters with defaults (date range, platform, channel, keyword, limit).

## 시그니처

```php
function build_channel_params(PDO $pdo): array
```

## Observations

- [impl] Validates `$_GET['date']` against `^\d{4}-\d{2}-\d{2}$`; defaults to `CURDATE()`. Validates `$_GET['date_from']` same pattern; defaults to `$date_to - 6 days` (line 13). #algo
- [impl] Whitelist limit: only accepts 0, 20, 50, 100; coerces others to 0 (line 24). #pattern
- [return] Array: `{date_from, date_to, platform, channel, keyword, limit}` — all strings except limit (int).
- [usage] `$params = build_channel_params($pdo); $from = $params['date_from'];`
- [note] Default lookback is **6 days** (not 29 as in content.php). Regex prevents SQL injection via date params. #caveat

## Relations

- part_of [[queries-channel]]