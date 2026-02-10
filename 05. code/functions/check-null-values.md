---
title: check-null-values
type: function
level: low
category: "validation/db/integrity"
semantic: "check null values"
permalink: functions/check-null-values
path: "working/projects/dashboard/02-a-multi-channel-dashboard/outputs/validate_db_integrity.py"
tags:
- python
- sqlite
---

# check-null-values

모든 컬럼의 NULL 값 개수를 검사하는 함수

## 📖 시그니처

```python
def check_null_values(
    cursor: sqlite3.Cursor, 
    table_name: str
) -> dict
```

## Observations

- [impl] PRAGMA table_info로 컬럼 목록 조회 후 각각 NULL 검사 #algo
- [return] NULL이 있는 컬럼과 개수 딕셔너리 (dict[str, int])
- [usage] `nulls = check_null_values(cursor, 'daily_channel_summary')`
- [deps] sqlite3 #import

## 로직

```python
cursor.execute(f"PRAGMA table_info({table_name})")
columns = [row[1] for row in cursor.fetchall()]

for col in columns:
    cursor.execute(f"SELECT COUNT(*) FROM {table_name} WHERE {col} IS NULL")
```

## Relations

- part_of [[validate-db-integrity]] (소속 모듈)
- data_flows_to [[main-validate-db-integrity]] (NULL 정보 → 결과 출력)