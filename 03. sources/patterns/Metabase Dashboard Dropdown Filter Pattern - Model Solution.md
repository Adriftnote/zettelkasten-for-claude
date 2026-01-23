---
title: Metabase Dashboard Dropdown Filter Pattern - Model Solution
type: note
permalink: patterns/metabase-dashboard-dropdown-filter-pattern-model-solution
tags:
- metabase
- model
- dropdown-filter
- field-filter
- pattern
- dashboard
extraction_status: pending
---

## Observation

Metabase에서 실제 DB 테이블 없이 드롭다운 필터를 구현하려면 **Model**을 사용해야 함.

### Problem Context

Native Query에서 변수(`{{period}}`)를 사용하되, 드롭다운 UI가 필요한 경우:
- Field Filter는 실제 테이블 또는 Model에만 매핑 가능
- Saved Question은 메타데이터 설정 불가능
- Metabase는 BI 도구 (DDL 불가)

### Pattern: Virtual Data with Model

#### Step 1: Create Virtual Data Question

```sql
SELECT 'day' AS period, '오늘' AS label, 1 AS sort_order
UNION ALL
SELECT 'week', '이번 주', 2
UNION ALL
SELECT 'month', '이번 달', 3
ORDER BY sort_order
```

#### Step 2: Convert Question to Model

Question → ⋮ menu → "Turn into a model"

#### Step 3: Configure Model Metadata

Model 열기 → ⚙️ (metadata edit)
- Select column: `period`
- "Database column this maps to": set
- Filter widget type: "A list of all values"

#### Step 4: Use in Dashboard Query

```sql
SELECT SUM(views) AS total_views
FROM daily_channel_summary
WHERE {{period}}
```

Dashboard setting:
- Variable type: **Field Filter**
- Field to map to: **Model의 period 컬럼**

### Why This Works

| 구분 | 실제 테이블 | Model | Saved Question |
|------|------------|-------|----------------|
| Field Filter 매핑 | ✅ | ✅ | ❌ |
| 드롭다운 필터 | ✅ | ✅ | ❌ |
| 메타데이터 설정 | ✅ | ✅ | ❌ |

**Key Point**: Model = Saved Question + Metadata + Table-like Properties

### Common Mistakes Avoided

❌ `CASE {{period}} WHEN ...`: Metabase가 변수 치환 안 함
❌ template-tags type `text`: 드롭다운 불가, 자유 텍스트만 가능
❌ template-tags type `category`: 여전히 실제 테이블/Model 필요
❌ CREATE TABLE in Metabase: DDL 미지원

### Application Guide

**드롭다운 필터 필요하면 처음부터 Model 검토**:
- 자주 변경되지 않는 정적 옵션 → UNION ALL + Model
- DB 기반 동적 옵션 → 실제 테이블 사용
- Saved Question → 필터 UI 불가능 (대시보드용 쿼리만 가능)

---

## Relations

- **Category**: Dashboard Filter Implementation
- **Module**: data-analytics/dashboard
- **Module Version**: Metabase (version-agnostic)
- **Related Patterns**: Template Tags, Native Query Variables
- **Date**: 2025-12-10

## Observations

- [solution] Metabase에서 실제 테이블 없이 드롭다운 필터 구현하려면 Model 사용 필수 #metabase #model #workaround
- [pattern] UNION ALL로 가상 데이터 생성 → Model 변환 → 메타데이터 설정 파이프라인 #virtual-data #pattern
- [fact] Saved Question은 메타데이터 설정 불가, Model만 Field Filter 매핑 가능 #metabase-limitation
- [tech] Field Filter는 실제 테이블 또는 Model에만 매핑되는 구조적 제약 #architecture #field-filter
- [tip] 드롭다운 필터 필요하면 처음부터 Model 설계 검토 권장 #best-practice