---
title: read-feedback-excel
type: function
level: low
category: "dashboard/feedback/sync"
semantic: "read excel feedback data"
permalink: functions/read-feedback-excel
path: "working/worker-data/scripts/sync_feedback_gui.py"
tags:
- python
- openpyxl
---

# read-feedback-excel

Excel 피드백 리스트에서 데이터를 파싱하는 함수

## 시그니처

```python
def read_excel(filepath: Path) -> list[dict]
```

## Observations

- [impl] openpyxl.load_workbook(data_only=True)로 수식 결과값 읽기 #algo
- [impl] 첫 번째 시트(index 0), 5행부터 데이터 시작 #context
- [impl] B열(수집일)이 None이면 빈 행으로 판단하여 스킵 #algo
- [impl] datetime → strftime("%Y-%m-%d") 변환 #pattern
- [return] list[dict] - 각 dict는 DB 컬럼명을 키로 사용
- [note] 컬럼 매핑: B=collected_date, C=channel, D=customer_name, E=content, F=category, G=keywords, H=response_status, I=department, J=action_status, K=note #caveat

## Relations

- part_of [[sync-feedback-gui]] (소속 모듈)
- data_flows_to [[verify-existing]] (Excel 데이터 → 검증)
- data_flows_to [[insert-feedback-records]] (Excel 데이터 → INSERT)
