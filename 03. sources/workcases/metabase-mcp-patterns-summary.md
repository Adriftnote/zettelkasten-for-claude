---
title: Metabase & MCP 패턴 요약
type: workcase
tags:
- metabase
- mcp
- pattern
- summary
permalink: sources/workcases/metabase-mcp-patterns-summary
created: 2026-01-30
---

# Metabase & MCP 패턴 요약

11개 패턴 문서에서 **핵심만 추출**.

---

## Metabase 패턴 (7개)

### 1. 텍스트 카드 추가
```json
{
  "card_id": null,
  "visualization_settings": { "text": "제목" },
  "virtual_card": { "display": "heading" }
}
```
- `card_id: null` 필수
- `display`: "heading" 또는 "text"

### 2. 제목에 변수 사용
```sql
-- 카드 제목: {{period}} 매출 현황
SELECT * FROM sales WHERE period = {{period}}
```
- 제목에 `{{variable}}` 문법으로 필터값 자동 반영

### 3. 동적 기간 그룹화 (SQLite)
```sql
SELECT
  CASE
    WHEN {{period}} = '일별' THEN strftime('%Y-%m-%d', date)
    WHEN {{period}} = '주별' THEN strftime('%Y-W%W', date)
    WHEN {{period}} = '월별' THEN strftime('%Y-%m', date)
  END as period_label,
  SUM(amount)
FROM sales
GROUP BY 1
```
- SELECT와 GROUP BY에 **동일한 CASE 표현식** 사용

### 4. API 드롭다운 설정 (필수 이중 설정)
```json
{
  "dataset_query": {
    "native": {
      "template-tags": {
        "period": { "type": "text", "default": "day" }
      }
    }
  },
  "parameters": [{
    "id": "period",
    "type": "category",
    "values": ["day", "week", "month"]
  }]
}
```
- **template-tags** (SQL 변수) + **parameters** (UI 드롭다운) 둘 다 필요
- `template-tags.id` = `parameters.id` 일치 필수

### 5. MCP 서버 선택
| 서버 | 용도 | 주의 |
|------|------|------|
| `metabase-server` | 카드/대시보드 생성 | ✅ 사용 권장 |
| `metabase-ai-assistant` | 자연어 쿼리 | ❌ 많은 함수 미구현 |

### 6-7. 드롭다운 필터 구현 (Model 필수)
```sql
-- Step 1: UNION ALL로 옵션 생성
SELECT 'day' as value, '일별' as label UNION ALL
SELECT 'week', '주별' UNION ALL
SELECT 'month', '월별'

-- Step 2: Saved Question → Model 변환 (필수!)
-- Step 3: 메타데이터 설정에서 Field Type 지정
```
- **Saved Question은 불가**, Model만 메타데이터 설정 가능
- default 값은 배열 형식: `["day"]`

---

## MCP 패턴 (4개)

### 1. LazyToolLoader 패턴
```
문제: 등록 시점에 서버 연결 → 실행 시점에 이미 단절

해결:
1. 등록: 캐시에서 도구 목록만 조회 (연결 X)
2. 실행: 새 클라이언트 생성 → 연결 → 실행 → 단절

성능: 0.983s → 0.475s (2.1배 향상)
```

### 2. Hook 기반 자동 활성화
```json
{
  "hooks": {
    "matcher": "mcp|MCP|도구|tool",
    "action": "toolhub_search"
  }
}
```
- 키워드 감지 시 자동으로 tool-hub 활성화

### 3. 동적 도구 Fetching
- 매 명령 실행마다 동적 fetch (영속적 캐시 없음)
- Lazy loading: 필요한 서버의 도구만 런타임 로드

### 4. CLI 네이밍 규칙
```bash
# 올바른 형식
mcp-cli list_tables      # ✅ 언더스코어

# 잘못된 형식
mcp-cli list-tables      # ❌ 하이픈
```
- 도구 이름은 **언더스코어 규칙** 필수

---

## 핵심 인사이트

| 도메인 | 핵심 |
|--------|------|
| **Metabase 드롭다운** | Model 기반 + template-tags/parameters 이중 설정 |
| **Metabase 변수** | `{{variable}}` 문법으로 제목/쿼리에 자동 반영 |
| **MCP 성능** | 등록/실행 분리 → LazyToolLoader |
| **MCP 규칙** | 언더스코어 네이밍 필수 |

---

## Relations

- relates_to [[01. concepts/mcp-architecture]] (MCP 개념)
- relates_to [[metabase-skill]] (Metabase 스킬)

---

**정리일**: 2026-01-30
**원본**: `03. sources/patterns/` 폴더 11개 문서에서 추출
