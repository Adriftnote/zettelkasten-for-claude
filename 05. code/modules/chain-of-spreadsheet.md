---
title: chain-of-spreadsheet
type: module
permalink: modules/chain-of-spreadsheet
level: high
category: ai/spreadsheet/reasoning
semantic: two-stage spreadsheet reasoning pipeline
path: 99. resources/Spreadsheet_LLM_Encoder/chain_of_spreadsheet.py
tags:
- python
- spreadsheet
- LLM
- CoS
- reasoning
---

# chain-of-spreadsheet

SpreadsheetLLM의 Chain of Spreadsheet(CoS) — "테이블 찾기 → 답 구하기" 2단계 추론 파이프라인 구현

## 📖 개요

하나의 시트에 여러 표가 있을 때, 질문에 바로 답하면 엉뚱한 표를 참조할 수 있다. CoS는 Stage 1에서 LLM에게 "어떤 테이블을 봐야 하는지"를 먼저 식별시키고, Stage 2에서 해당 테이블만으로 답을 생성하게 한다. 논문 Appendix L.3의 프롬프트 템플릿을 그대로 구현하며, 대형 테이블은 Table Split 알고리즘(Algorithm 2)으로 청크 분할 처리한다.

## Observations

- [impl] Stage 1: 압축된 인코딩 + 질문 → LLM이 테이블 범위 반환 (예: `A1:F9`) #stage1
- [impl] Stage 2: 식별된 테이블 + 질문 → LLM이 셀 주소로 답변 (예: `[B3]`) #stage2
- [impl] 시트 선택: 키워드 매칭으로 가장 관련 높은 시트 먼저 필터링 #find-sheet
- [impl] Table Split: 토큰 한도 초과 시 헤더 + 본문 청크로 분할하여 각각 질의 #split
- [impl] 프롬프트 템플릿: 논문 Appendix L.3의 Stage 1/Stage 2 프롬프트 그대로 사용 #prompt
- [deps] json, re, logging, typing #import
- [usage] `identify_table(encoding, query)` → 테이블 범위 문자열
- [usage] `generate_response(sheet_data, query)` → 답변 문자열
- [usage] `table_split_qa(sheet_data, table_range, query, token_limit)` → 대형 테이블 분할 QA
- [note] `_call_llm()`은 placeholder — 실제 사용 시 OpenAI/Anthropic API로 교체 필요 #placeholder
- [note] Stage 2에서 비압축 재인코딩은 미구현 (원본 파일 접근 필요) #limitation

## 동작 흐름

```
사용자 질문 + 압축된 인코딩
    ↓ _find_relevant_sheet(): 키워드 매칭으로 시트 선택
    ↓ identify_table(): QA_STAGE1_PROMPT_TEMPLATE + LLM 호출
    ↓ 정규식으로 테이블 범위 파싱 (예: "A1:F9")
테이블 범위 문자열
    ↓ _calculate_token_size(): 토큰 한도 체크
    ├─ ≤ limit → generate_response(): QA_STAGE2_PROMPT_TEMPLATE + LLM
    └─ > limit → table_split_qa(): 헤더 + 본문 청크 분할 → 각각 Stage 2
최종 답변 (셀 주소 형태: "[B3]" 또는 "[SUM(A2:A10)]")
```

## 프롬프트 구조

### Stage 1 — 테이블 식별
- 압축된 인코딩을 `(값|셀주소)` 튜플 형태로 전달
- LLM에게 "답이 있는 테이블 범위만 반환하라" 지시
- 반환 형식: `['range': 'A1:F9']`

### Stage 2 — 답변 생성
- 식별된 테이블을 `A1,Year|A2,Profit` 행 단위 인코딩으로 전달
- LLM에게 "답의 셀 주소만 반환하라" 지시
- 반환 형식: `[B3]` 또는 `[SUM(A2:A10)]`

## 핵심 함수 구조

| 함수 | 역할 | Stage |
|------|------|-------|
| identify_table | 질문에 관련된 테이블 범위 식별 | Stage 1 |
| _find_relevant_sheet | 키워드 매칭으로 시트 선택 | Stage 1 보조 |
| generate_response | 테이블에서 답변 생성 | Stage 2 |
| table_split_qa | 대형 테이블 분할 처리 | Stage 2 확장 |
| _call_llm | LLM API 호출 (placeholder) | 공통 |
| _calculate_token_size | 토큰 크기 추정 | 공통 |
| _predict_header | 테이블 헤더 영역 예측 | Split 보조 |

## Relations
- part_of [[SpreadsheetLLM 구현 로직]] (소속 프로젝트)
- relates_to [[Chain of Spreadsheet (CoS)]] (이 코드가 구현하는 개념)
- relates_to [[SpreadsheetLLM - LLM을 위한 스프레드시트 인코딩 (SpreadsheetLLM Encoding)]] (논문의 CoS 파이프라인 구현)
- contains [[identify-table]] (Stage 1: 테이블 범위 식별)
- contains [[generate-response]] (Stage 2: 답변 생성)
- contains [[table-split-qa]] (대형 테이블 분할 QA)
- contains [[find-relevant-sheet]] (키워드 기반 시트 선택)
