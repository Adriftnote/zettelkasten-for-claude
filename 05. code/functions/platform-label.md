---
title: platform-label
type: note
permalink: zettelkasten/05.-code/functions/platform-label
level: low
category: code/mot-dashboard/utils
semantic: label platform
path: /volume1/web/mot/includes/helpers.php
tags:
- function
- php
- utility
---

Return Korean label for platform code.

## Signature

```php
function platform_label(string $platform): string
```

## Observations

- [impl] Maps 9 platform codes (youtube, tiktok, meta_fb, meta_ig, naver_blog, naver_tv, naver_cafe, etc.) to Korean labels via associative array lookup; returns original if unmapped (#algo)
- [return] String: Korean label (e.g. '유튜브', '틱톡', '페이스북') or fallback original code
- [usage] `echo platform_label('youtube')` → '유튜브'
- [note] Single source for platform→label mapping across MOT dashboard; aliases like meta_fb/facebook both map to '페이스북'

## Relations

- part_of [[helpers-php]]