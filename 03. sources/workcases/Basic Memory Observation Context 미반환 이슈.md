---
title: Basic Memory Observation Context 미반환 이슈
type: note
permalink: 03.-sources/workcases/basic-memory-observation-context-mibanhwan-isyu
tags:
- basic-memory
- mcp
- bug
- observation
---

# Basic Memory Observation Context 미반환 이슈

> RPG 프로젝트 구축하면서 발견한 Basic Memory MCP의 동작 특성

## 문제 상황

`#tag (컨텍스트)` 형식으로 observation을 작성했을 때, 컨텍스트가 DB에는 저장되지만 MCP API 응답에서 반환되지 않음.

```markdown
- [example] instagram_views = parse_csv_column_sum(...) #example (테스트1)
```

## 근본 원인

```
┌─────────────────────────────────────────────────────────┐
│  observation 테이블                                      │
│  ├── id: 7727                                           │
│  ├── content: "instagram_views = ..." #example"         │
│  ├── category: "example"                                │
│  ├── context: "테스트1"  ← DB에 저장됨!                  │
│  └── tags: ["example"]                                  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  MCP API 응답 (search_notes, build_context)             │
│  ├── content: ✅                                        │
│  ├── category: ✅                                       │
│  ├── context: ❌ 반환 안 함                             │
│  └── metadata.tags: ✅                                  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  search_index (FTS5)                                    │
│  ├── title: "example: instagram_views = ..."            │
│  ├── content_snippet: (context 미포함)                  │
│  └── context 필드가 인덱싱되지 않음                      │
└─────────────────────────────────────────────────────────┘
```

## 확인 방법

```bash
# DB에서 직접 확인 - context 저장됨
sqlite3 "C:\claude-workspace\_system\basic-memory\memory.db" \
  "SELECT id, category, context, tags FROM observation WHERE id = 7727"

# 결과: 7727|example|테스트1|["example"]
```

## 현재 상태

| 기능 | 상태 |
|------|:----:|
| `#tag (컨텍스트)` 파싱 | ✅ |
| DB observation.context 저장 | ✅ |
| MCP API context 반환 | ❌ |
| FTS 검색 인덱싱 | ❌ |

## 적용

- observation의 context 기능은 **현재 사용 불가**
- 컨텍스트가 필요하면 **Relations 섹션**에서 `- type [[target]] (context)` 형식 사용
- 또는 observation 본문에 직접 작성

## 관련 Task

- task-20260205-011: RPG 프로젝트 설정

## Observations

- [fact] observation.context 컬럼은 DB에 존재하고 파싱도 됨 #basic-memory
- [fact] MCP API(search_notes, build_context)가 context 필드를 응답에 포함하지 않음 #bug
- [fact] FTS search_index에 context가 인덱싱되지 않아 검색 불가 #limitation
- [warning] Relations의 context는 정상 작동, Observations의 context는 미구현 #difference
- [solution] context가 필요하면 Relations 섹션 또는 본문에 직접 작성 #workaround