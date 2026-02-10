---
title: check-duplicates
type: function
level: low
category: "validation/db/integrity"
semantic: "check duplicates"
permalink: functions/check-duplicates
path: "working/projects/dashboard/02-a-multi-channel-dashboard/outputs/validate_db_integrity.py"
tags:
- python
- sqlite
---

# check-duplicates

복합 키 중복 여부를 검사하는 함수

## 📖 시그니처

```python
def check_duplicates(
    cursor: sqlite3.Cursor, 
    table_name: str, 
    keys: list
) -> list
```

## Observations

- [impl] GROUP BY HAVING으로 중복 검출 #algo
- [return] 중복된 키 조합 리스트 (list[tuple])
- [usage] `duplicates = check_duplicates(cursor, 'daily_channel_summary', ['date', 'platform'])`
- [deps] sqlite3 #import

## SQL 쿼리

```sql
SELECT {key_cols}, COUNT(*) as cnt
FROM {table_name}
GROUP BY {key_cols}
HAVING COUNT(*) > 1
```

## Relations

- part_of [[validate-db-integrity]] (소속 모듈)
- data_flows_to [[main-validate-db-integrity]] (중복 리스트 → 결과 출력)