---
title: merge-cell-ranges
type: function
permalink: functions/merge-cell-ranges
level: low
category: ai/spreadsheet/compression
semantic: merge consecutive cell addresses into ranges
path: 99. resources/SpreadsheetLLM-compression/inverted_index_demo.py
tags:
- python
- spreadsheet
- compression
---

# merge-cell-ranges

연속된 셀 주소를 범위 표기(A2:A4)로 병합하고, 비연속은 쉼표(C2,C4,C6)로 나열하는 함수

## 📖 시그니처

```python
def merge_cell_ranges(addresses):
    """
    Merge consecutive cell addresses into ranges like A1:A4, B5:B7, etc.
    This implements the range merging.
    """
```

## 핵심 코드

```python
if not addresses:
    return ""

# Parse addresses into (column, row) tuples
parsed = []
for addr in addresses:
    col = addr[0]  # Assume single letter column for simplicity
    row = int(addr[1:])
    parsed.append((col, row, addr))

# Sort by column then row
parsed.sort()

ranges = []
current_range_start = None
current_range_end = None
current_col = None

for col, row, addr in parsed:
    if current_col != col:
        # New column, finish previous range
        if current_range_start:
            if current_range_start == current_range_end:
                ranges.append(current_range_start)
            else:
                ranges.append(f"{current_range_start}:{current_range_end}")
        
        # Start new range
        current_col = col
        current_range_start = addr
        current_range_end = addr
    else:
        # Same column, check if consecutive
        prev_row = int(current_range_end[1:])
        if row == prev_row + 1:
            # Consecutive, extend range
            current_range_end = addr
        else:
            # Not consecutive, finish current range and start new one
            if current_range_start == current_range_end:
                ranges.append(current_range_start)
            else:
                ranges.append(f"{current_range_start}:{current_range_end}")
            current_range_start = addr
            current_range_end = addr

# Finish last range
if current_range_start:
    if current_range_start == current_range_end:
        ranges.append(current_range_start)
    else:
        ranges.append(f"{current_range_start}:{current_range_end}")

return ','.join(ranges)
```

## Observations

- [impl] 열 기준 정렬 후 행 번호 비교로 연속 여부 판단 #algo
- [impl] 연속 행이면 current_range_end 확장, 비연속이면 새 범위 시작 #state-machine
- [impl] addr[0]으로 단일 문자 열만 파싱 — AA 이상은 미지원 #caveat
- [return] 범위 문자열 (예: "A2:A4,C2,C4,C6")
- [deps] 없음 (순수 파이썬)

## Relations

- part_of [[inverted-index-demo]] (소속 모듈)
- called_by [[invert-index-with-ranges]] (메인 함수에서 호출)