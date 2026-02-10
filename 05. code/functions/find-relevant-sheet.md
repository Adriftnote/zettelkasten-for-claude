---
title: find-relevant-sheet
type: function
permalink: functions/find-relevant-sheet
level: low
category: ai/spreadsheet/reasoning
semantic: find sheet by keyword matching
path: 99. resources/Spreadsheet_LLM_Encoder/chain_of_spreadsheet.py
tags:
- python
- spreadsheet
- CoS
---

# find-relevant-sheet

키워드 매칭으로 질문에 가장 관련 높은 시트를 선택하는 헬퍼 함수

## 📖 시그니처

```python
def _find_relevant_sheet(encoding: Dict, query: str) -> Optional[str]:
    """Helper to find the most relevant sheet using simple keyword matching."""
```

## 핵심 코드

```python
query_tokens = {t.lower() for t in query.split()}
best_score = 0
best_sheet = None

for sheet_name, sheet_data in encoding.get("sheets", {}).items():
    score = 0
    for value in sheet_data.get("cells", {}):
        lower_val = str(value).lower()
        if any(token in lower_val for token in query_tokens):
            score += 1
    if score > best_score:
        best_score = score
        best_sheet = sheet_name
return best_sheet
```

## Observations

- [impl] 질문을 공백 split → 소문자 set으로 토큰화 #tokenize
- [impl] 각 시트의 셀 값에서 질문 토큰이 포함된 횟수를 score로 집계 #scoring
- [impl] 가장 높은 score의 시트를 반환, 매칭 없으면 None #best-match
- [note] 단순 키워드 매칭이라 의미적 유사도는 미지원 — TF-IDF나 임베딩으로 개선 가능 #limitation
- [return] 시트 이름 문자열 또는 None

## Relations

- part_of [[chain-of-spreadsheet]] (소속 모듈)
- called_by [[identify-table]] (Stage 1에서 호출)