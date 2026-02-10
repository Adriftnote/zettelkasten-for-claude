---
title: check-date-gaps
type: function
level: low
category: "validation/db/continuity"
semantic: "check date gaps"
permalink: functions/check-date-gaps
path: "working/projects/dashboard/02-a-multi-channel-dashboard/outputs/validate_db_integrity.py"
tags:
- python
- sqlite
---

# check-date-gaps

채널별 날짜 연속성을 검사하는 함수

## 📖 시그니처

```python
def check_date_gaps(
    cursor: sqlite3.Cursor, 
    table_name: str, 
    date_col: str, 
    channel_col: str
) -> dict
```

## Observations

- [impl] 채널별 날짜 정렬 후 연속성 검사 #algo
- [return] 채널별 갭 정보 딕셔너리 (dict[str, list])
- [usage] `gaps = check_date_gaps(cursor, 'daily_channel_summary', 'date', 'platform')`
- [deps] sqlite3, datetime #import
- [note] 빠진 날짜는 데이터 수집 누락 의미 #context

## 로직

```python
for i in range(1, len(dates)):
    diff = (curr - prev).days
    if diff > 1:
        # 갭 발견: from, to, missing_days
```

## Relations

- part_of [[validate-db-integrity]] (소속 모듈)
- data_flows_to [[main-validate-db-integrity]] (갭 정보 → 결과 출력)