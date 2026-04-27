---
title: query-content-url
type: note
permalink: zettelkasten/05.-code/functions/query-content-url
level: low
category: code/mot-dashboard/queries
semantic: lookup content source url
path: /volume1/web/mot/includes/queries/content.php
tags:
- function
- php
- mariadb
- sql
---

# query-content-url

Lookup canonical source URL for a content piece by platform and content ID.

## 시그니처

```php
function query_content_url(PDO $pdo, string $platform, string $content_id): ?string
```

## Observations

- [impl] Platform-to-table mapping (hardcoded map): youtube→yt_m_videos, tiktok→tt_m_items, meta_fb/meta_ig→meta_m_posts, naver_tv→ntv_m_clips, naver_blog→nb_m_contents. #pattern
- [impl] Queries primary key column (video_id, item_id, post_id, item_no, content_id) and returns URL column (or 'uri' for naver_blog). #type
- [impl] Converts naver_blog http:// → https:// for HTTPS compliance. #caveat
- [return] String URL or null if not found.
- [usage] `$url = query_content_url($pdo, 'youtube', 'dQw4w9WgXcQ');`

## Relations

- part_of [[queries-content]]