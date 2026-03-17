---
title: query-string
type: function
permalink: zettelkasten/05.-code/functions/query-string
level: low
category: data/sns/dashboard
semantic: query single string value from sql
path: projects/sns-dashboard/internal/store/overview.go
tags:
- go
- sql
- helper
---

# queryString

SQL 쿼리 실행 후 단일 string 반환. NULL이거나 에러 시 "" 반환.

## 시그니처

```go
func queryString(db *sql.DB, query string, args ...interface{}) string
```

## Observations

- [impl] sql.NullString 사용 — NULL-safe #pattern
- [return] string — 실패/NULL 시 빈 문자열

## Relations

- part_of [[overview]] (소속 모듈)
- called_by [[get-overview]] (line 233)
- called_by [[query-latest-valid]] (line 124)
