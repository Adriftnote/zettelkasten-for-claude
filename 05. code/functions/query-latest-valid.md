---
title: query-latest-valid
type: function
permalink: zettelkasten/05.-code/functions/query-latest-valid
level: low
category: data/sns/dashboard
semantic: find latest and previous valid snapshot timestamps
path: projects/sns-dashboard/internal/store/overview.go
tags:
- go
- sql
- snapshot
---

# queryLatestValid

정상 스냅샷 중 최신 captured_at과 약 1시간 전 captured_at을 반환.

## 시그니처

```go
func queryLatestValid(db *sql.DB, table string) (latest, prev string)
```

## Observations

- [impl] latest = valid_snaps DESC LIMIT 1 #pattern
- [impl] prev = 오늘 데이터 내 datetime(latest, '-1 hour') 이전 최신 스냅샷 #algo
- [return] (latest, prev) string 쌍 — 빈 문자열 가능

## Relations

- part_of [[overview]] (소속 모듈)
- calls [[valid-snapshot-cte]] (line 122)
- calls [[query-string]] (line 124)
- called_by [[get-overview]] (line 230)
