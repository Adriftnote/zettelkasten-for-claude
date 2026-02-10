---
title: data-format-aggregation-demo
type: module
permalink: modules/data-format-aggregation-demo
level: high
category: ai/spreadsheet/compression
semantic: classify cell data types for compression
path: 99. resources/SpreadsheetLLM-compression/data_format_aggregation_demo.py
tags:
- python
- spreadsheet
- compression
- data-type
- regex
---

# data-format-aggregation-demo

SpreadsheetLLM Module 3 — 정규식으로 셀 값의 데이터 타입을 판별하고 같은 타입끼리 그룹화하는 데모

## 📖 개요

숫자/날짜/통화 등 형식이 있는 셀을 개별 값 대신 타입명으로 추상화하여 토큰을 줄이는 기법. `$1,234.56`을 `[Currency]`로, `2024-01-15`를 `[Date]`로 치환하면 AI는 "이 열이 뭘 담는지"만 이해하면 되므로 구체적 수치 없이도 구조 파악이 가능해진다. 텍스트(Others) 값은 개별 보존하여 구조 정보를 유지한다.

## Observations

- [impl] 정규식 매칭 순서가 핵심: 구체적 패턴(Year)을 일반적 패턴(Integer)보다 먼저 배치 #regex
- [impl] 9가지 타입 인식: Year, Integer, Float, Percentage, Currency, Date, Time, Scientific, Email #types
- [impl] 텍스트(Others)는 타입 그룹이 아닌 개별 값 키로 보존하여 헤더/라벨 정보 유지 #pattern
- [impl] 클로저 패턴: `create_rule_based_recognizer()`가 내부 함수 `recognize_data_type`을 반환 #closure
- [deps] pandas, re, collections.defaultdict #import
- [usage] `aggregate_by_data_format(df)` → 타입별 셀 그룹 딕셔너리
- [note] Module 1+2에 추가하면 24.79배 압축, 단 유손실 (숫자 구체값 손실) #tradeoff
- [note] 논문에서도 Module 3 제외 시 정확도가 약간 상승하는 경우 있음 #caveat

## 동작 흐름

```
DataFrame (원본 스프레드시트)
    ↓ create_rule_based_recognizer() → 클로저 함수 생성
    ↓ 전체 셀 순회, 각 셀에 recognize_data_type() 적용
    ↓ 정규식 매칭 순서: Year → Email → Percentage → Currency
    ↓   → Scientific → Date → Time → Float → Integer → Others
defaultdict(list): 타입명 → [{address, value, type}]
    ↓ 숫자/날짜 타입은 타입명으로 그룹화
    ↓ 텍스트(Others)는 개별 값을 키로 보존
dict: 타입별 셀 그룹 딕셔너리
```

## 타입 인식 정규식 맵

| 타입 | 정규식 핵심 | 매칭 예시 |
|------|-----------|----------|
| Year | `^(19\|20\|21)\d{2}$` | 2024, 2026 |
| Email | `^[a-zA-Z0-9._%+-]+@...` | user@example.com |
| Percentage | `^-?\d+\.?\d*%$` | 75%, 12.5% |
| Currency | `^[\$£€¥₹]\s*-?\d{1,3}(,\d{3})*` | $1,234.56 |
| Scientific | `^-?\d+\.?\d*[eE][+-]?\d+$` | 6.022e23 |
| Date | 3가지 패턴 (YYYY-MM-DD 등) | 2024-01-15 |
| Time | `^\d{1,2}:\d{2}(:\d{2})?` | 14:30, 2:30 PM |
| Float | `^-?\d+\.\d+$` | 3.14159 |
| Integer | `^-?\d+$` | 42, 1000 |

## 핵심 함수 구조

| 함수 | 역할 | 입력 → 출력 |
|------|------|------------|
| create_rule_based_recognizer | 타입 판별 함수를 생성(클로저) | () → recognize_data_type 함수 |
| (inner) recognize_data_type | 셀 값의 데이터 타입 판별 | "$1,234.56" → "Currency" |
| aggregate_by_data_format | 전체 셀을 타입별로 그룹화 | DataFrame → 타입별 셀 그룹 딕셔너리 |
| create_sample_dataframe | 데모용 샘플 데이터 생성 | () → DataFrame |

## Relations
- part_of [[SpreadsheetLLM 구현 로직]] (소속 프로젝트)
- relates_to [[NFS 타입 인식 (Number Format String Recognition)]] (이 코드가 구현하는 개념)
- relates_to [[SpreadsheetLLM - LLM을 위한 스프레드시트 인코딩 (SpreadsheetLLM Encoding)]] (논문의 Module 3 구현)
- contains [[create-rule-based-recognizer]] (정규식 기반 타입 판별 함수 팩토리)
- contains [[aggregate-by-data-format]] (타입별 셀 그룹화 메인 함수)
- contains [[create-sample-dataframe]] (데모용 샘플 데이터 생성)
