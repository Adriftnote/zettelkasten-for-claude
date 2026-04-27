---
title: diff-class
type: note
permalink: zettelkasten/05.-code/functions/diff-class
level: low
category: code/mot-dashboard/utils
semantic: select diff css class
path: /volume1/web/mot/includes/helpers.php
tags:
- function
- php
- utility
---

Select CSS class name for difference display (color + num base).

## Signature

```php
function diff_class(mixed $n): string
```

## Observations

- [impl] Coerces to int, returns 'cred num' if n > 0 (red/positive), 'cblue num' if n < 0 (blue/negative), 'num' if n == 0 (#algo)
- [return] String: CSS class selector (one of: 'cred num', 'cblue num', 'num')
- [usage] `<span class="<?= diff_class($diff) ?>">` applies conditional coloring
- [note] Base class 'num' provides number styling; cred/cblue override color for positive/negative pairs

## Relations

- part_of [[helpers-php]]