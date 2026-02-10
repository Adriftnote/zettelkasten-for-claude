---
title: verify-existing
type: function
level: low
category: "dashboard/feedback/sync"
semantic: "verify existing data integrity"
permalink: functions/verify-existing
path: "working/worker-data/scripts/sync_feedback_gui.py"
tags:
- python
- validation
---

# verify-existing

Excel의 기존 레코드와 DB 레코드의 정합성을 검증하는 함수

## 시그니처

```python
def verify_existing(
    excel_rows: list[dict],
    db_records: dict[tuple, dict]
) -> list[dict]
```

## Observations

- [impl] 중복 판별 키(수집일+채널+고객명+내용)로 매칭 후, 6개 필드 값 비교 #algo
- [impl] 비교 필드: category, keywords, response_status, department, action_status, note #context
- [return] 불일치 목록 - 각 항목에 date, channel, name, diffs(필드별 excel/db 값) 포함
- [usage] `mismatches = verify_existing(excel_rows, db_records)`

## Relations

- part_of [[sync-feedback-gui]] (소속 모듈)
- data_flows_from [[read-feedback-excel]] (Excel 데이터)
- data_flows_from [[get-existing-records]] (DB 데이터)
- data_flows_to [[save-sync-log]] (불일치 결과 → 이력 저장)
