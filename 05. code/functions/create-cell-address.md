---
title: create-cell-address
type: function
permalink: functions/create-cell-address
level: low
category: ai/spreadsheet/compression
semantic: convert index to cell address
path: 99. resources/SpreadsheetLLM-compression/inverted_index_demo.py
tags:
- python
- spreadsheet
---

# create-cell-address

행/열 인덱스를 엑셀 스타일 셀 주소로 변환하는 유틸리티 함수

## 📖 시그니처

```python
def create_cell_address(row, col, df):
    """Convert row, col indices to Excel-style address like 'A1', 'B2', etc."""
    return f'{df.columns[col]}{row + 1}'
```

## Observations

- [impl] df.columns[col]로 열 이름, row+1로 1-indexed 행 번호 생성 #simple
- [note] 단일 문자 열(A~Z)만 지원하는 간소화 구현, 실제 엑셀 AA/AB 열은 미지원 #caveat
- [return] 엑셀 주소 문자열 (예: "C1", "A5")

## Relations

- part_of [[inverted-index-demo]] (소속 모듈)
- data_flows_to [[merge-cell-ranges]] (생성된 주소가 범위 병합 입력으로 전달)
- data_flows_to [[invert-index-with-ranges]] (메인 함수에서 호출)