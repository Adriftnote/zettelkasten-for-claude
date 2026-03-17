---
title: query-int64
type: function
permalink: zettelkasten/05.-code/functions/query-int64
level: low
category: data/sns/dashboard
semantic: query single int64 value from sql
path: projects/sns-dashboard/internal/store/overview.go
tags:
- go
- sql
- helper
---

# queryInt64

SQL 쿼리 실행 후 단일 int64 반환. NULL이거나 에러 시 0 반환.

## 시그니처

```go
func queryInt64(db *sql.DB, query string, args ...interface{}) int64
```

## Observations

- [impl] sql.NullInt64 사용 — NULL-safe 단일 값 조회 #pattern
- [return] int64 — 실패/NULL 시 0 (에러 무시)

## Relations

- part_of [[overview]] (소속 모듈)
- called_by [[get-overview]] (line 231)
- called_by [[query-today-diff]] (line 147)
