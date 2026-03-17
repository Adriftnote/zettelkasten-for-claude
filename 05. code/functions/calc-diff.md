---
title: calc-diff
type: function
permalink: zettelkasten/05.-code/functions/calc-diff
level: low
category: data/sns/dashboard
semantic: calculate absolute diff between snapshots
path: projects/sns-dashboard/internal/store/overview.go
tags:
- go
- math
- helper
---

# calcDiff

두 스냅샷 값의 절대 차이 (직전 대비 증가분).

## 시그니처

```go
func calcDiff(cur, prev int64) int64
```

## Observations

- [impl] 단순 cur - prev #algo
- [return] int64 — 음수 가능

## Relations

- part_of [[overview]] (소속 모듈)
- called_by [[get-overview]] (line 237)
