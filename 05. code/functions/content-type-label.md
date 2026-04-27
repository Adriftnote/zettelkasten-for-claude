---
title: content-type-label
type: note
permalink: zettelkasten/05.-code/functions/content-type-label
level: low
category: code/mot-dashboard/utils
semantic: label content type
path: /volume1/web/mot/includes/helpers.php
tags:
- function
- php
- utility
---

Return Korean label for content type (영상 or 일반).

## Signature

```php
function content_type_label(mixed $type): string
```

## Observations

- [impl] Checks whitelist ['VIDEO', '영상']; returns '영상' if match, else '일반' (#algo)
- [return] String: '영상' (video) or '일반' (general)
- [usage] `content_type_label('VIDEO')` → '영상'; `content_type_label('text')` → '일반'
- [note] Accepts both English 'VIDEO' and Korean '영상' variants for DB consistency

## Relations

- part_of [[helpers-php]]