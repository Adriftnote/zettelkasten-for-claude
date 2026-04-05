---
title: calc-delta-pct
type: function
permalink: zettelkasten/05.-code/functions/calc-delta-pct
level: low
category: data/sns/dashboard
semantic: calculate percentage delta between two values
path: projects/sns-dashboard/internal/store/overview.go
tags:
- go
- math
- helper
---

# calcDeltaPct

두 값의 % 변화율 계산. prev가 0이면 0 반환.

## 시그니처

```go
func calcDeltaPct(cur, prev int64) float64
```

## Observations

- [impl] (cur-prev)/prev*100, 소수 둘째 자리 반올림 (math.Round) #algo
- [return] float64 — % 변화율 (prev=0이면 0)

## Relations

- part_of [[overview]] (소속 모듈)
- called_by [[get-overview]] (line 310)
