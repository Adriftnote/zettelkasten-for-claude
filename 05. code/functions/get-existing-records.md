---
title: get-existing-records
type: function
level: low
category: "dashboard/feedback/sync"
semantic: "get db records for comparison"
permalink: functions/get-existing-records
path: "working/worker-data/scripts/sync_feedback_gui.py"
tags:
- python
- sqlite
- paramiko
---

# get-existing-records

NAS DB에서 feedback_raw 전체 레코드를 조회하여 키→레코드 딕셔너리로 반환

## 시그니처

```python
def get_existing_records(nas: NAS) -> dict[tuple, dict]
```

## Observations

- [impl] SSH로 sqlite3 실행, separator "||"로 파싱 #algo
- [impl] 키: (collected_date, channel, customer_name, content) 4-tuple #context
- [return] dict[tuple, dict] - 키로 O(1) 검색 가능
- [usage] `db_records = get_existing_records(nas)`

## Relations

- part_of [[sync-feedback-gui]] (소속 모듈)
- data_flows_to [[verify-existing]] (DB 데이터 → 검증)
- data_flows_to [[insert-feedback-records]] (기존 키셋 → 증분 판별)
