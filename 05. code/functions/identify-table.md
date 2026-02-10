---
title: identify-table
type: function
permalink: functions/identify-table
level: low
category: ai/spreadsheet/reasoning
semantic: identify relevant table range
path: 99. resources/Spreadsheet_LLM_Encoder/chain_of_spreadsheet.py
tags:
- python
- spreadsheet
- LLM
- CoS
---

# identify-table

CoS Stage 1 — 압축된 인코딩과 질문을 LLM에 넘겨 관련 테이블 범위를 식별하는 함수

## 📖 시그니처

```python
def identify_table(encoding: Dict, query: str) -> Optional[str]:
    """
    Identifies the most relevant table for a query using an LLM.
    (CoS Stage 1)
    """
```

## 핵심 코드

```python
sheet_name = _find_relevant_sheet(encoding, query)
if not sheet_name:
    logger.warning("Could not identify a relevant sheet for the query.")
    return None

compressed_sheet_data = encoding["sheets"][sheet_name]

# Format the compressed data for the prompt
prompt_input = json.dumps(compressed_sheet_data, ensure_ascii=False)

prompt = QA_STAGE1_PROMPT_TEMPLATE.replace("[Encoded Spreadsheet with compression]", prompt_input)
prompt = prompt.replace("[Question]", query)

llm_response = _call_llm(prompt)

# Parse the response to get the table range
match = re.search(r"\'([A-Z]+\d+:[A-Z]+\d+)\'", llm_response)
if match:
    return match.group(1)

logger.warning(f"Could not parse table range from LLM response: {llm_response}")
return None
```

## Observations

- [impl] 먼저 _find_relevant_sheet()으로 시트 선택 후, 해당 시트만 LLM에 전달 #two-step
- [impl] json.dumps(ensure_ascii=False)로 비ASCII 문자 보존 #encoding
- [impl] 정규식 `'([A-Z]+\d+:[A-Z]+\d+)'`로 LLM 응답에서 셀 범위 파싱 #regex
- [impl] 파싱 실패 시 None 반환 + 로깅 #error-handling
- [return] 테이블 범위 문자열 (예: "A1:F9") 또는 None
- [deps] json, re, logging #import

## Relations

- part_of [[chain-of-spreadsheet]] (소속 모듈)
- calls [[find-relevant-sheet]] (시트 선택)
- data_flows_to [[generate-response]] (식별된 범위가 Stage 2 입력으로 전달)