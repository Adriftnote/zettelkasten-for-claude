---
title: generate-response
type: function
permalink: functions/generate-response
level: low
category: ai/spreadsheet/reasoning
semantic: generate answer from table
path: 99. resources/Spreadsheet_LLM_Encoder/chain_of_spreadsheet.py
tags:
- python
- spreadsheet
- LLM
- CoS
---

# generate-response

CoS Stage 2 — 식별된 테이블 데이터와 질문을 LLM에 넘겨 답변을 생성하는 함수

## 📖 시그니처

```python
def generate_response(sheet_data: Dict, query: str) -> str:
    """
    Generates a response for a query using an LLM and the identified table data.
    (CoS Stage 2)

    Note: This implementation is simplified. It doesn't re-encode the table
    without compression as suggested in the paper. A full implementation would
    require access to the original spreadsheet file to extract and re-encode
    the identified table range.
    """
```

## 핵심 코드

```python
# For now, we use the already encoded (compressed) data.
prompt_input = json.dumps(sheet_data, ensure_ascii=False)

prompt = QA_STAGE2_PROMPT_TEMPLATE.replace("[Encoded Spreadsheet without compression]", prompt_input)
prompt = prompt.replace("[Question]", query)

llm_response = _call_llm(prompt)

return llm_response
```

## Observations

- [impl] 논문에서는 Stage 2에서 비압축 재인코딩을 권장하나, 이 구현은 압축 데이터 그대로 사용 #simplification
- [impl] QA_STAGE2_PROMPT_TEMPLATE의 행 단위 인코딩 형식: `A1,Year|A2,Profit` #format
- [note] 원본 스프레드시트 파일 접근 없이는 비압축 재인코딩 불가 #limitation
- [return] LLM 답변 문자열 (셀 주소 형태: "[B3]" 등)
- [deps] json #import

## Relations

- part_of [[chain-of-spreadsheet]] (소속 모듈)
- called_by [[identify-table]] (Stage 1 결과를 받아 Stage 2 실행)
- called_by [[table-split-qa]] (분할된 청크별로 호출됨)