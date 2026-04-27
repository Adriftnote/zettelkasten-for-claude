---
title: fmt-diff
type: note
permalink: zettelkasten/05.-code/functions/fmt-diff
level: low
category: code/mot-dashboard/utils
semantic: format diff
path: /volume1/web/mot/includes/helpers.php
tags:
- function
- php
- utility
---

Format integer difference with sign prefix and thousands separator.

## Signature

```php
function fmt_diff(mixed $n): string
```

## Observations

- [impl] Coerces to int, prepends '+' if positive (else '−' or nothing for zero), applies `number_format()` (#algo)
- [return] String: signed formatted number (e.g. '+1,000' or '−500')
- [usage] `fmt_diff(500)` → '+500'; `fmt_diff(-300)` → '−300'
- [note] Follows numeral visual convention: positive green, negative blue (see [[diff-class]])

## Relations

- part_of [[helpers-php]]