---
title: h-php
type: note
permalink: zettelkasten/05.-code/functions/h-php
level: low
category: code/mot-dashboard/utils
semantic: escape html
path: /volume1/web/mot/includes/helpers.php
tags:
- function
- php
- utility
---

Escape HTML special characters (short name for template use).

## Signature

```php
function h(mixed $s): string
```

## Observations

- [impl] Coerces to string, applies `htmlspecialchars(..., ENT_QUOTES, 'UTF-8')` for 3-way escaping (tags, double quotes, single quotes) (#algo)
- [return] String: HTML-safe escaped text
- [usage] `<div><?= h($title) ?></div>` prevents XSS in templates
- [note] ENT_QUOTES mode escapes both " and ' to &#x27;; UTF-8 default handles multibyte safely (#caveat)

## Relations

- part_of [[helpers-php]]