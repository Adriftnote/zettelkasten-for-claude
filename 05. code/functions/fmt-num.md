---
title: fmt-num
type: note
permalink: zettelkasten/05.-code/functions/fmt-num
level: low
category: code/mot-dashboard/utils
semantic: format number
path: /volume1/web/mot/includes/helpers.php
tags:
- function
- php
- utility
---

Format integer with Korean-style thousand separators.

## Signature

```php
function fmt_num(mixed $n): string
```

## Observations

- [impl] Coerces to int, applies `number_format()` for thousands separator (e.g. 1000000 → '1,000,000'); null/empty returns '0' (#algo)
- [return] String: formatted number with commas
- [usage] `fmt_num(1234567)` → '1,234,567'
- [note] Handles null/empty by defaulting to '0'; strict int conversion truncates floats

## Relations

- part_of [[helpers-php]]