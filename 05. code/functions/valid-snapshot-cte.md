---
title: valid-snapshot-cte
type: function
permalink: zettelkasten/05.-code/functions/valid-snapshot-cte
level: low
category: data/sns/dashboard
semantic: build cte to filter invalid partial snapshots
path: projects/sns-dashboard/internal/store/overview.go
tags:
- go
- sql
- cte
---

# validSnapshotCTE

불량 스냅샷(부분 수집)을 필터하는 CTE SQL 조각을 생성. 최다 rows 대비 50% 미만인 captured_at를 제외.

## 시그니처

```go
func validSnapshotCTE(table string) string
```

## Observations

- [impl] 3단계 CTE: snap_counts(시점별 row수) → max_cnt(최대) → valid_snaps(50% 이상만) #algo
- [impl] 문자열 연결로 테이블명 주입 — parameterized query 불가(CTE 구조상) #caveat
- [return] string — WITH ... valid_snaps AS (...) CTE 텍스트
- [note] overview 모듈 내 4곳에서 재사용 (가장 많이 호출되는 헬퍼) #context

## Relations

- part_of [[overview]] (소속 모듈)
- called_by [[get-overview]] (line 233)
- called_by [[query-latest-valid]] (line 122)
- called_by [[query-mini-cumulative]] (line 71)
- called_by [[query-today-diff]] (line 139)
