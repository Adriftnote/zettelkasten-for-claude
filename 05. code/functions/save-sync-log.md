---
title: save-sync-log
type: function
level: low
category: "dashboard/feedback/sync"
semantic: "save sync history to db"
permalink: functions/save-sync-log
path: "working/worker-data/scripts/sync_feedback_gui.py"
tags:
- python
- sqlite
---

# save-sync-log

동기화 이력을 sync_log 테이블에 저장하는 함수

## 시그니처

```python
def ensure_sync_log(nas: NAS)        # 테이블 생성 (IF NOT EXISTS)
def save_sync_log(nas: NAS, log: dict)  # 이력 INSERT
```

## Observations

- [impl] sync_log 테이블: sync_date, excel_filename, excel_total, db_before, new_inserted, verified_count, mismatch_count, mismatch_detail(JSON), db_after #context
- [impl] mismatch_detail을 JSON으로 직렬화하여 TEXT 컬럼에 저장 #pattern
- [usage] `save_sync_log(nas, {"sync_date": "...", "excel_filename": "...", ...})`

## Relations

- part_of [[sync-feedback-gui]] (소속 모듈)
- data_flows_from [[verify-existing]] (불일치 결과)
