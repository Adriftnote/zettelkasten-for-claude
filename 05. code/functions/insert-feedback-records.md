---
title: insert-feedback-records
type: function
level: low
category: "dashboard/feedback/sync"
semantic: "insert new records to db"
permalink: functions/insert-feedback-records
path: "working/worker-data/scripts/sync_feedback_gui.py"
tags:
- python
- sqlite
- paramiko
---

# insert-feedback-records

신규 레코드를 NAS feedback.db에 INSERT하는 함수

## 시그니처

```python
def insert_records(nas: NAS, records: list[dict]) -> int
```

## Observations

- [impl] 레코드 1건씩 SSH로 INSERT 실행 (배치 아님) #algo
- [impl] escape_sql로 싱글쿼트 이스케이프 처리 #pattern
- [return] 성공한 INSERT 건수 (int)
- [note] 건수가 적어서(수십 건) 1건씩 처리해도 성능 문제 없음 #caveat

## Relations

- part_of [[sync-feedback-gui]] (소속 모듈)
- data_flows_from [[read-feedback-excel]] (신규 레코드)
- data_flows_from [[get-existing-records]] (기존 키셋으로 증분 판별)
