---
title: query-int
type: function
permalink: zettelkasten/05.-code/functions/query-int
level: low
category: data/sns/dashboard
semantic: query single int value from sql
path: projects/sns-dashboard/internal/store/overview.go
tags:
- go
- sql
- helper
---

# queryInt

SQL 쿼리 실행 후 단일 int 반환. NULL이거나 에러 시 0 반환.

## 시그니처

```go
func queryInt(db *sql.DB, query string, args ...interface{}) int
```

## Observations

- [impl] sql.NullInt64 → int 캐스팅 #pattern
- [return] int — 실패/NULL 시 0

## Relations

- part_of [[overview]] (소속 모듈)
- called_by [[get-overview]] (line 235)
