---
title: MCP document-edit Excel Tool Usage Patterns
type: note
permalink: knowledge/mcp-document-edit-excel-tool-usage-patterns
tags:
- mcp
- document-edit
- excel
- gotcha
- tool-chainer
- pydantic
extraction_status: pending
---

# MCP document-edit Excel Tool Usage Patterns

document-edit MCP 서버의 `create_excel_file` 도구 사용 시 자주 발생하는 실수와 올바른 패턴.

## Parameter Name Gotcha

파라미터 이름에 언더스코어가 없다.

```json
// BAD - 에러 발생
{
  "file_path": "/path/to/file.xlsx",
  "content": "..."
}

// GOOD
{
  "filepath": "/path/to/file.xlsx",
  "content": "..."
}
```

- [gotcha] Parameter is `filepath`, NOT `file_path`
- [error] Pydantic validation: "field 'filepath' is required"

## Content Must Be JSON String

content 파라미터는 반드시 **JSON 문자열**이어야 한다. 배열을 직접 전달하면 안 됨.

```javascript
// BAD - Pydantic validation error
{
  "filepath": "/tmp/test.xlsx",
  "content": [["Date", "Views"], ["2025-12-18", 499]]  // array 직접 전달
}

// GOOD - JSON.stringify로 문자열화
{
  "filepath": "/tmp/test.xlsx",
  "content": "[[\"Date\", \"Views\"], [\"2025-12-18\", 499]]"  // string
}
```

- [gotcha] Content expects string type, not array
- [error] "Input should be a valid string [type=string_type, input_value=array, input_type=list]"
- [solution] Always `JSON.stringify()` the 2D array before passing

## Tool Chain에서 사용 시

sqlite→2d transform 결과를 Excel로 전달할 때:

```javascript
// Tool-Chainer mcpPath 설정
{
  "mcpPath": [
    {
      "toolName": "sqlite_db_read_query",
      "toolArgs": "{\"query\": \"SELECT date, views FROM daily_stats LIMIT 5\"}",
      "outputTransform": "sqlite→2d"
    },
    {
      "toolName": "document_edit_create_excel_file",
      "toolArgs": "{\"filepath\": \"/tmp/report.xlsx\", \"content\": \"CHAIN_RESULT\"}"
    }
  ]
}
```

- [pattern] Use `outputTransform: "sqlite→2d"` to convert DB results to 2D array
- [pattern] Tool-Chainer automatically JSON-stringifies CHAIN_RESULT for string parameters

## 관련 에러 히스토리

| 날짜 | 에러 | 원인 |
|------|------|------|
| 2026-01-07 | field 'filepath' is required | `file_path` 사용 |
| 2026-01-07 | Input should be a valid string | array 직접 전달 |
| 2026-01-07 | content must be string type | transform 후 stringify 누락 |

- [learned_from] 5회 반복 발생한 에러 패턴
- [applies_to] document-edit MCP, Tool-Chainer, Tool-Hub chain execution
