---
title: invert-index-with-ranges
type: function
permalink: functions/invert-index-with-ranges
level: low
category: ai/spreadsheet/compression
semantic: create inverted index from dataframe
path: 99. resources/SpreadsheetLLM-compression/inverted_index_demo.py
tags:
- python
- spreadsheet
- compression
- inverted-index
---

# invert-index-with-ranges

DataFrame을 역인덱스(값→셀 주소 범위)로 변환하는 메인 함수. 빈 셀 제거 + 동일 값 병합.

## 📖 시그니처

```python
def invert_index_with_ranges(df: pd.DataFrame):
    """
    Create inverted index with proper range merging.
    Maps values to cell address ranges (e.g., "$100": "A1:A4", "$150": "B5,B7")
    """
```

## 핵심 코드

```python
index = defaultdict(list)

# Build value-to-addresses mapping
for r, c in itertools.product(range(df.shape[0]), range(df.shape[1])):
    val = df.iat[r, c]
    if pd.notna(val) and str(val).strip() != '':
        addr = create_cell_address(r, c, df)
        index[str(val)].append(addr)

# Merge addresses into ranges
result = {}
for val, addrs in index.items():
    result[val] = merge_cell_ranges(addrs)

return result
```

## Observations

- [impl] itertools.product로 (row, col) 전체 조합 순회 #iteration
- [impl] `pd.notna(val) and str(val).strip() != ''` — 빈 셀 필터링의 핵심 한 줄 #filter
- [impl] defaultdict(list)로 같은 값의 주소를 자동 누적 #defaultdict
- [impl] 최종적으로 merge_cell_ranges()로 연속 주소를 범위 표기로 축약 #range
- [return] dict — 값을 키로, 셀 주소 범위 문자열을 값으로 하는 딕셔너리
- [deps] pandas, collections.defaultdict, itertools #import

## 데이터 흐름

```
pd.DataFrame
    ↓ itertools.product(rows, cols) → 전체 셀 순회
    ↓ 빈 셀 스킵 (pd.notna + strip)
    ↓ create_cell_address(r, c, df) → 주소 변환
defaultdict: {"Q1": ["A2","A3","A4"], "$100K": ["C2","C4","C6"]}
    ↓ merge_cell_ranges(addrs) → 범위 병합
dict: {"Q1": "A2:A4", "$100K": "C2,C4,C6"}
```

## Relations

- part_of [[inverted-index-demo]] (소속 모듈)
- calls [[create-cell-address]] (셀 주소 변환)
- calls [[merge-cell-ranges]] (범위 병합)