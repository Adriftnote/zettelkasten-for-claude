---
title: get-data-distribution
type: function
level: low
category: "validation/db/analysis"
semantic: "get data distribution"
permalink: functions/get-data-distribution
path: "working/projects/dashboard/02-a-multi-channel-dashboard/outputs/validate_db_integrity.py"
tags:
- python
- sqlite
---

# get-data-distribution

채널별 데이터 분포(행 수, 날짜 범위)를 조회하는 함수

## 📖 시그니처

```python
def get_data_distribution(
    cursor: sqlite3.Cursor, 
    table_name: str, 
    channel_col: str
) -> list
```

## Observations

- [impl] GROUP BY로 채널별 행 수와 날짜 범위 집계 #algo
- [return] 튜플 리스트 (channel, count, min_date, max_date)
- [usage] `dist = get_data_distribution(cursor, 'daily_channel_summary', 'platform')`
- [deps] sqlite3 #import

## SQL 쿼리

```sql
SELECT {channel_col}, COUNT(*), MIN(date), MAX(date)
FROM {table_name}
GROUP BY {channel_col}
ORDER BY COUNT(*) DESC
```

## Relations

- part_of [[validate-db-integrity]] (소속 모듈)
- data_flows_to [[main-validate-db-integrity]] (분포 정보 → 결과 출력)