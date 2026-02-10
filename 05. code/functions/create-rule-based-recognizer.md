---
title: create-rule-based-recognizer
type: function
permalink: functions/create-rule-based-recognizer
level: low
category: ai/spreadsheet/compression
semantic: create data type recognizer closure
path: 99. resources/SpreadsheetLLM-compression/data_format_aggregation_demo.py
tags:
- python
- spreadsheet
- regex
- data-type
---

# create-rule-based-recognizer

정규식 기반 9가지 데이터 타입 판별 함수를 생성하는 팩토리(클로저) 함수

## 📖 시그니처

```python
def create_rule_based_recognizer():
    """
    Create rule-based recognizer for predefined data types:
    Year, Integer, Float, Percentage, Scientific notation, Date, Time, Currency, Email
    """
```

## 핵심 코드

```python
def recognize_data_type(value):
    """Recognize data type based on cell value using rules"""
    if pd.isna(value) or str(value).strip() == '':
        return 'Empty'
    
    value_str = str(value).strip()
    
    # Year (4-digit number between reasonable range)
    if re.match(r'^(19|20|21)\d{2}$', value_str):
        return 'Year'
    
    # Email
    if re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', value_str):
        return 'Email'
    
    # Percentage (ends with %)
    if re.match(r'^-?\d+\.?\d*%$', value_str):
        return 'Percentage'
    
    # Currency (starts with currency symbol)
    if re.match(r'^[\$£€¥₹]\s*-?\d{1,3}(,\d{3})*(\.\d{2})?$', value_str):
        return 'Currency'
    
    # Scientific notation
    if re.match(r'^-?\d+\.?\d*[eE][+-]?\d+$', value_str):
        return 'ScientificNotation'
    
    # Date (various formats)
    date_patterns = [
        r'^\d{4}[-/]\d{1,2}[-/]\d{1,2}$',  # YYYY-MM-DD or YYYY/MM/DD
        r'^\d{1,2}[-/]\d{1,2}[-/]\d{4}$',  # MM-DD-YYYY or MM/DD/YYYY
        r'^\d{1,2}[-/]\d{1,2}[-/]\d{2}$',  # MM-DD-YY or MM/DD/YY
    ]
    for pattern in date_patterns:
        if re.match(pattern, value_str):
            return 'Date'
    
    # Time (HH:MM or HH:MM:SS)
    if re.match(r'^\d{1,2}:\d{2}(:\d{2})?(\s*(AM|PM))?$', value_str, re.IGNORECASE):
        return 'Time'
    
    # Float (decimal number)
    if re.match(r'^-?\d+\.\d+$', value_str):
        return 'Float'
    
    # Integer (whole number)
    if re.match(r'^-?\d+$', value_str):
        return 'Integer'
    
    # Others (everything else)
    return 'Others'

return recognize_data_type
```

## Observations

- [impl] 클로저 패턴: 외부 함수가 내부 함수 recognize_data_type을 반환 #closure
- [impl] 매칭 순서가 핵심 — Year(4자리)가 Integer보다 앞에 와야 "2024"가 Year로 분류됨 #order
- [impl] Date는 3가지 패턴을 for 루프로 순회 매칭 #multi-pattern
- [impl] Currency에 5가지 통화 기호 지원: $, £, €, ¥, ₹ #i18n
- [impl] Others는 텍스트 catch-all — 어떤 패턴에도 안 걸리면 여기로 #fallback
- [return] recognize_data_type 함수 객체
- [deps] pandas, re #import

## Relations

- part_of [[data-format-aggregation-demo]] (소속 모듈)
- data_flows_to [[aggregate-by-data-format]] (반환된 함수가 aggregate에서 사용됨)