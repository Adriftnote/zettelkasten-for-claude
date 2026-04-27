---
title: is-video-content
type: note
permalink: zettelkasten/05.-code/functions/is-video-content
level: low
category: code/mot-dashboard/utils
semantic: check video content
path: /volume1/web/mot/includes/helpers.php
tags:
- function
- php
- utility
---

Check if content type is video (영상).

## Signature

```php
function is_video_content(mixed $type): bool
```

## Observations

- [impl] Whitelist check: returns true iff $type is in ['VIDEO', '영상']; else false (#algo)
- [return] Boolean: true for video, false for other types
- [usage] `if (is_video_content($row['type'])) { ... }` for conditional rendering
- [note] Accepts both 'VIDEO' and '영상' variants; used for content-specific UI logic

## Relations

- part_of [[helpers-php]]