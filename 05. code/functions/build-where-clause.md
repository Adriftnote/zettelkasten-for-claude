---
title: build-where-clause
type: note
permalink: zettelkasten/05.-code/functions/build-where-clause
level: low
category: code/mot-dashboard/utils
semantic: build sql where clause
path: /volume1/web/mot/includes/helpers.php
tags:
- function
- php
- utility
---

Build common SQL WHERE conditions and parameter bindings from filter array.

## Signature

```php
function build_where_clause(array $filters): array
// Returns: [string $where_extra, array $params]
```

## Observations

- [impl] Constructs WHERE snippet + named params from $filters; calls [[channel-filter-values]] for bilingual channel matching; supports date_from/date_to (mandatory), platform/content_id/channel/keyword (optional); channel alias expands to IN(...) if multiple variants (#pattern)
- [return] Array tuple: [$where_clause (string), $params (assoc array with :placeholders)]
- [usage] `[$where, $params] = build_where_clause(['date_from'=>'2026-01-01', 'date_to'=>'2026-04-30', 'channel'=>'ssen_info'])` → WHERE + bindings ready for PDO
- [note] Single source for content/channel unified filtering; handles ssen_info↔쎈정보 aliasing; excludes content_id filter if keyword present (#caveat)

## Relations

- part_of [[helpers-php]]
- calls [[channel-filter-values]]