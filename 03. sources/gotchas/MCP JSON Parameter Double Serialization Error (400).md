---
title: MCP JSON Parameter Double Serialization Error (400)
type: note
permalink: gotchas/mcp-json-parameter-double-serialization-error-400
tags:
- metabase
- mcp
- json-serialization
- 400-error
- parameter-handling
extraction_status: pending
---

## Observation

MCP 도구의 `object` 타입 파라미터에 JSON 문자열을 전달하면 이중 직렬화되어 400 Bad Request 발생.

### Symptom

```
Metabase API error: Request failed with status code 400
```

`create_card` 또는 `update_card` 호출 시 발생.

### Root Cause

MCP 도구와 REST API의 파라미터 처리 방식 차이:

**REST API 습관 (잘못된 호출)**:
```javascript
visualization_settings: "{\"column_settings\": ...}"  // JSON 문자열
```

**MCP 도구 처리**:
- 파라미터 타입: `object`
- 내부 처리: 자동으로 `JSON.stringify()` 수행
- 문자열 전달 시: `JSON.stringify("{...}")` → 이중 직렬화 → 잘못된 JSON → 400 에러

### Solution

**Object를 직접 전달**:

```javascript
visualization_settings: {
  "column_settings": {
    "[\"name\",\"총조회수\"]": {
      "number_style": "decimal"
    }
  }
}
```

### Prevention Checklist

1. ✅ MCP 도구 파라미터 타입 확인 (`object` vs `string`)
2. ✅ 이스케이프 문자(`\"`) 보이면 이중 직렬화 의심
3. ✅ 복잡한 설정은 변수로 분리하여 가독성 확보
4. ✅ MCP 도구 호출 시 항상 Object 형태 사용

---

## Relations

- **Category**: MCP Parameter Type Handling
- **Affects**: Metabase Integration (create_card, update_card)
- **Date**: 2025-12-10

## Observations

- [bug] MCP 도구의 object 타입 파라미터에 JSON 문자열 전달 시 이중 직렬화로 400 Bad Request 발생 #mcp #json-serialization #400-error
- [cause] MCP 도구가 object 타입 파라미터를 자동으로 JSON.stringify() 처리하므로 문자열 전달 시 이중 직렬화됨 #parameter-handling
- [pattern] REST API 습관으로 JSON 문자열 전달하면 MCP에서 실패 - 파라미터 타입 확인 필수 #api-difference
- [solution] MCP 도구 호출 시 항상 Object 형태로 직접 전달하고 JSON 문자열 사용 금지 #prevention
- [tip] 이스케이프 문자(\")가 보이면 이중 직렬화 의심하고 Object로 변환 #debugging