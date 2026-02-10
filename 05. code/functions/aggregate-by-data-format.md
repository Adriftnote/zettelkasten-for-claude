---
title: aggregate-by-data-format
type: function
permalink: functions/aggregate-by-data-format
level: low
category: ai/spreadsheet/compression
semantic: group cells by data type
path: 99. resources/SpreadsheetLLM-compression/data_format_aggregation_demo.py
tags:
- python
- spreadsheet
- compression
- data-type
---

# aggregate-by-data-format

전체 셀을 데이터 타입별로 그룹화하는 메인 함수. 숫자/날짜 타입은 그룹으로, 텍스트는 개별 보존.

## 📖 시그니처

```python
def aggregate_by_data_format(df):
    """
    Aggregate cells by data format using rule-based recognition
    For well-defined formats, group by type. For text, preserve individual values.
    """
```

## 핵심 코드

```python
recognizer = create_rule_based_recognizer()

# Analyze each cell using rule-based recognition
rule_groups = defaultdict(list)

for i in range(df.shape[0]):
    for j in range(df.shape[1]):
        value = df.iat[i, j]
        cell_addr = f"{df.columns[j]}{i+1}"
        
        # Rule-based data type recognition
        data_type = recognizer(value)
        
        # For well-defined formats, group by type
        if data_type in ['Year', 'Integer', 'Float', 'Percentage', 'ScientificNotation', 
                       'Date', 'Time', 'Currency', 'Email', 'Empty']:
            rule_groups[data_type].append({
                'address': cell_addr,
                'value': value,
                'type': data_type
            })
        else:
            # For text content (Others), preserve individual values
            # Group by the actual text value to maintain structure
            text_key = f'"{str(value)}"'
            rule_groups[text_key].append({
                'address': cell_addr,
                'value': value,
                'type': 'Text'
            })

return rule_groups
```

## Observations

- [impl] 9가지 정의된 타입은 타입명을 키로 그룹화 (예: "Currency": [{addr, val, type}]) #grouping
- [impl] 텍스트(Others)는 실제 값을 따옴표로 감싸서 키로 사용 → 헤더/라벨 정보 보존 #text-preserve
- [impl] 각 엔트리에 address, value, type 3가지 메타데이터 저장 #metadata
- [return] defaultdict — 타입명(또는 텍스트값)을 키로, 셀 정보 리스트를 값으로 하는 딕셔너리
- [deps] collections.defaultdict #import

## 데이터 흐름

```
pd.DataFrame
    ↓ create_rule_based_recognizer() → recognizer 함수
    ↓ 전체 셀 순회, recognizer(value) → 타입 판별
    ├─ 정의된 타입 → rule_groups["Currency"].append({...})
    └─ Others → rule_groups['"텍스트값"'].append({...})
defaultdict: {"Currency": [{addr,val,type}], '"Header"': [{...}]}
```

## Relations

- part_of [[data-format-aggregation-demo]] (소속 모듈)
- calls [[create-rule-based-recognizer]] (타입 판별 함수 생성)