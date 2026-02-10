---
title: table-split-qa
type: function
permalink: functions/table-split-qa
level: low
category: ai/spreadsheet/reasoning
semantic: split large table for chunked QA
path: 99. resources/Spreadsheet_LLM_Encoder/chain_of_spreadsheet.py
tags:
- python
- spreadsheet
- LLM
- CoS
---

# table-split-qa

토큰 한도를 초과하는 대형 테이블을 청크로 분할하여 각각 QA를 수행하는 함수 (Algorithm 2)

## 📖 시그니처

```python
def table_split_qa(
    sheet_data: Dict,
    table_range: str,
    query: str,
    token_limit: int = 4096
) -> str:
    """
    Handles QA for large tables by splitting them into chunks.
    Implements Algorithm 2 from Appendix M.2.
    """
```

## 핵심 코드

```python
table_data = sheet_data # In a real scenario, we'd extract the sub-table

if _calculate_token_size(table_data) <= token_limit:
    return generate_response(table_data, query)

logger.info(f"Table is too large, applying Table Split QA Algorithm.")

header_data, header_range = _predict_header(table_data, table_range)

# In a real implementation:
# 1. Get all rows in the table body.
# 2. Create chunks of rows, where each chunk + header fits the token limit.
# 3. For each chunk, create a temporary sheet encoding.
# 4. Call generate_response on each chunk.

# Placeholder logic:
answers = []
# Pretend we split it into two chunks
for i in range(2):
    logger.info(f"Querying sub-table chunk {i+1}...")
    # In a real scenario, `chunk_data` would be `header_data` + a slice of the body
    chunk_data = table_data
    answer = generate_response(chunk_data, query)
    answers.append(answer)

# Aggregate answers
final_answer = "Aggregated answers from sub-tables:\n" + "\n".join(answers)
return final_answer
```

## Observations

- [impl] 토큰 한도 이하면 generate_response()로 직접 처리 (분할 불필요) #shortcut
- [impl] _predict_header()로 헤더 영역 분리 후, 본문을 청크로 분할하는 구조 #header-body
- [impl] 각 청크 = 헤더 + 본문 슬라이스 → 청크별로 Stage 2 실행 #chunking
- [impl] 모든 청크 답변을 취합하여 최종 답변 생성 #aggregation
- [note] 현재 구현은 placeholder — 실제 분할 로직은 원본 시트 접근 필요 #placeholder
- [note] 논문의 Algorithm 2 (Appendix M.2) 기반이나 간소화됨 #simplification
- [return] 최종 답변 문자열
- [deps] json, logging #import

## 데이터 흐름

```
sheet_data + table_range + query
    ↓ _calculate_token_size() → 토큰 체크
    ├─ ≤ token_limit → generate_response() 직접 호출
    └─ > token_limit
        ↓ _predict_header() → 헤더 분리
        ↓ 본문을 청크로 분할 (헤더 + body slice)
        ↓ 각 청크별 generate_response() 호출
        ↓ 답변 취합
최종 답변
```

## Relations

- part_of [[chain-of-spreadsheet]] (소속 모듈)
- calls [[generate-response]] (각 청크별 Stage 2 호출)