---
title: Metabase Model for Dropdown Filter Implementation
type: note
permalink: patterns/metabase-dropdown-filter-model-implementation
tags:
- metabase
- dropdown-filter
- model
- pattern
extraction_status: pending
---

# Metabase Dropdown Filter Implementation Pattern

## Problem
Dashboard needs dropdown filter (e.g., day/week/month selection) but CREATE TABLE unavailable in Metabase.

## Solution: UNION ALL + Model Pattern

### Step 1: Create Options Data Question
```sql
SELECT 'day' AS period, '오늘' AS label, 1 AS sort_order
UNION ALL
SELECT 'week', '이번 주', 2
UNION ALL
SELECT 'month', '이번 달', 3
ORDER BY sort_order
```

### Step 2: Convert to Model
1. Save Question
2. ⋮ menu → "Turn into a model" click
3. (Optional) Edit metadata

### Step 3: Configure Dropdown in Target Question

**SQL variable definition (template-tags):**
```json
"period": {
  "id": "period",
  "name": "period",
  "display-name": "기간",
  "type": "text",
  "required": false,
  "default": ["day"]
}
```

**UI dropdown configuration (parameters):**
```json
{
  "id": "period",
  "type": "string/=",
  "values_source_type": "card",
  "values_source_config": {
    "card_id": 121,
    "value_field": ["field", "period", {"base-type": "type/Text"}]
  },
  "default": ["day"]
}
```

### Step 4: Connect Dashboard Filter
1. Dashboard edit mode
2. Add + filter
3. Connect to each Question's variable

## Core Pattern Template
```sql
-- Dropdown Options Model Template
SELECT 'value1' AS value, '표시명1' AS label, 1 AS sort_order
UNION ALL
SELECT 'value2', '표시명2', 2
UNION ALL
SELECT 'value3', '표시명3', 3
ORDER BY sort_order
```

## DO/DON'T

### DO
- Create virtual options table using UNION ALL + Model
- Leverage "options from another model or question" in variable settings
- Use meaningful names when creating Model
- Separate label column for display from value column for actual values

### DON'T
- Attempt CREATE TABLE in Metabase (not possible)
- Use Field Filter without actual DB table or Model
- Set default in one location only (both places needed)
- Set `default` as string (array form required: `["day"]`)

## Related Tools
- Metabase Native Query
- Metabase Model
- Metabase API (template-tags, parameters)

## Observations

- [pattern] UNION ALL 쿼리로 가상 옵션 테이블 생성 → Model 변환하는 템플릿 패턴 #metabase #virtual-table
- [tech] template-tags와 parameters에 default 값을 모두 설정해야 함 (중복 설정 필요) #configuration #metabase-api
- [tip] default 값은 배열 형식 필수 (["day"]), 문자열 불가 #config-format #gotcha
- [solution] CREATE TABLE 불가능한 BI 도구에서 데이터 없이 드롭다운 구현하는 실용적 방법 #workaround #bi-tool