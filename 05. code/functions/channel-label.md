---
title: channel-label
type: note
permalink: zettelkasten/05.-code/functions/channel-label
level: low
category: code/mot-dashboard/utils
semantic: label channel
path: /volume1/web/mot/includes/helpers.php
tags:
- function
- php
- utility
---

Return Korean label for channel code.

## Signature

```php
function channel_label(string $channel): string
```

## Observations

- [impl] Lookup table: maps 'ssen_info' → '쎈정보'; returns original if unmapped (#algo)
- [return] String: Korean label or fallback original channel code
- [usage] `channel_label('ssen_info')` → '쎈정보'
- [note] Single source for channel→label mapping; part of ssen_info↔쎈정보 alias system (see [[channel-filter-values]])

## Relations

- part_of [[helpers-php]]
- called_by [[channel-filter-values]]