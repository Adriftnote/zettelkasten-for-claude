---
title: query-channel-names
type: note
permalink: zettelkasten/05.-code/functions/query-channel-names
level: low
category: code/mot-dashboard/queries
semantic: list channel names
path: /volume1/web/mot/includes/queries/channel.php
tags:
- function
- php
- mariadb
- sql
---

# query-channel-names

Autocomplete wrapper for channel names (simple passthrough).

## 시그니처

```php
function query_channel_names(PDO $pdo, string $platform): array
```

## Observations

- [impl] Complete passthrough to `query_channel_list()` — no additional logic (line 95). #pattern
- [return] Identical to `query_channel_list()` output.
- [usage] `$names = query_channel_names($pdo, $platform); // same as query_channel_list`
- [note] Exists as semantic alias for UI context (autocomplete vs dropdown). Consider removing to avoid duplication. #caveat

## Relations

- part_of [[queries-channel]]
- calls [[query-channel-list]] (line 95)