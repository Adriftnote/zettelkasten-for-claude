---
title: channel-filter-values
type: note
permalink: zettelkasten/05.-code/functions/channel-filter-values
level: low
category: code/mot-dashboard/utils
semantic: expand channel alias values
path: /volume1/web/mot/includes/helpers.php
tags:
- function
- php
- utility
---

Expand channel alias to include both variants for filtering.

## Signature

```php
function channel_filter_values(string $channel): array
```

## Observations

- [impl] Calls [[channel-label]], detects '쎈정보' label, returns both variants ['쎈정보', 'ssen_info'] for bilingual DB queries; else returns singleton array [$channel] (#pattern)
- [return] Array of strings: all matching channel values (typically 1 or 2 items)
- [usage] `channel_filter_values('ssen_info')` → ['쎈정보', 'ssen_info']; used in WHERE...IN(...)
- [note] Enables single filter to match both Korean and English DB entries; critical for unified query (#caveat)

## Relations

- part_of [[helpers-php]]
- calls [[channel-label]]
- called_by [[build-where-clause]]