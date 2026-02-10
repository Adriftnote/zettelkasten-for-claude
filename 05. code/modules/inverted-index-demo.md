---
title: inverted-index-demo
type: module
permalink: modules/inverted-index-demo
level: high
category: ai/spreadsheet/compression
semantic: compress spreadsheet via inverted index
path: "99. resources/SpreadsheetLLM-compression/inverted_index_demo.py"
tags:
- python
- spreadsheet
- compression
- inverted-index
---

# inverted-index-demo

SpreadsheetLLM Module 2 — 빈 셀 제거 + 동일 값 병합으로 무손실 압축하는 역인덱스 변환 데모

## 📖 개요

행 단위 직렬화(A1, A2, A3...) 대신 "값 → 셀 주소 목록" 딕셔너리로 변환하는 기법의 구현체. 빈 셀은 아예 스킵하고, 같은 값이 여러 셀에 있으면 한 번만 기록하고 주소를 병합한다. 연속된 주소는 `A2:A4` 범위 표기로 축약. 정보 손실 없이 14.91배 압축 달성.

## Observations

- [impl] defaultdict로 값→주소 매핑 구축, itertools.product로 전체 셀 순회 #algo
- [impl] 빈 셀 필터링: `pd.notna(val) and str(val).strip() != ''` 한 줄로 처리 #pattern
- [impl] 연속 주소 범위 병합: 같은 열의 연속 행을 `A2:A4` 형태로 축약 #range-merge
- [impl] 비연속 주소는 쉼표로 나열: `C2,C4,C6` #addressing
- [deps] pandas, collections.defaultdict, itertools #import
- [usage] `invert_index_with_ranges(df)` → 값-주소 딕셔너리 반환
- [note] 단일 문자 열(A~Z)만 지원하는 간소화 구현, 실제 엑셀은 AA, AB 등 다중 문자 열 존재 #caveat

## 동작 흐름

```
DataFrame (원본 스프레드시트)
    ↓ itertools.product로 전체 셀 순회
    ↓ pd.notna(val) and str(val).strip() != '' → 빈 셀 스킵
defaultdict(list): 값 → [셀 주소 목록]
    ↓ merge_cell_ranges()
    ↓ 같은 열 연속 행 → 범위(A2:A4), 비연속 → 개별(C2,C4,C6)
dict: 값 → 주소 범위 문자열
```

## 압축 결과 예시

```
기존 행 단위 (55 토큰):         역인덱스 변환 후 (25 엔트리):
  A1:"Quarter", A2:"Q1"...      "Q1": A2:A4
  (빈 셀도, 중복도 전부 인코딩)    "$100K": C2,C4,C6
                                 (빈 셀 0, 중복 0)
```

## 핵심 함수 구조

| 함수 | 역할 | 입력 → 출력 |
|------|------|------------|
| create_cell_address | 행/열 인덱스를 엑셀 주소로 변환 | (0, 2) → "C1" |
| merge_cell_ranges | 연속 주소를 범위로 병합 | ["A2","A3","A4"] → "A2:A4" |
| invert_index_with_ranges | 전체 파이프라인 (메인 함수) | DataFrame → 값-주소 딕셔너리 |

## Relations

- part_of [[SpreadsheetLLM 구현 로직]] (소속 프로젝트)
- relates_to [[역인덱스 변환 (Inverted-Index Translation)]] (이 코드가 구현하는 개념)
- relates_to [[SpreadsheetLLM - LLM을 위한 스프레드시트 인코딩 (SpreadsheetLLM Encoding)]] (논문의 Module 2 구현)
- contains [[create-cell-address]] (행/열 → 엑셀 주소 변환)
- contains [[merge-cell-ranges]] (연속 주소 범위 병합)
- contains [[invert-index-with-ranges]] (역인덱스 변환 메인 함수)
