---
title: MCP Tool Search Token Optimization Strategy
type: note
permalink: architecture/mcp-tool-search-token-optimization-strategy
tags:
- mcp
- tool-search
- token-optimization
- defer-loading
extraction_status: pending
---

# MCP Tool Search: 토큰 효율화 기술

## 개요
MCP 도구 정의를 지연 로딩하여 토큰 소비를 95% 절약하는 Anthropic 공식 기능.

## 토큰 절약 효과
| 상황 | 토큰 | 절약률 |
|------|------|--------|
| 기존 (모든 도구 즉시 로드) | ~55,000 | - |
| Tool Search 사용 | ~8,700 | **95%** |

## 작동 원리 (Deferred Loading)

1. 도구 정의에 `defer_loading: true` 설정
2. Claude는 세션 시작 시 **Tool Search Tool만 로드**
3. 필요할 때 검색 → 관련 도구 3-5개 발견
4. 발견된 도구가 자동으로 전체 정의로 확장
5. Claude가 선택하여 호출

## 검색 타입

| 타입 | ID | 설명 | 사용 시기 |
|------|-----|------|----------|
| **Regex** | `tool_search_tool_regex_20251119` | 정규식 패턴 검색 | 도구명 정확히 알 때 |
| **BM25** | `tool_search_tool_bm25_20251119` | 자연어 쿼리 검색 | 기능으로 검색할 때 |

## 검색 쿼리 예시

### 도구명으로 직접 선택
```
query: "select:mcp__metabase-server__list_dashboards"
```

### 키워드로 검색
```
query: "metabase dashboard"
query: "slack message"
query: "excel export"
```

## 설정 규칙

| 규칙 | 설명 |
|------|------|
| Tool Search Tool은 defer 금지 | 항상 즉시 로드되어야 함 |
| 최소 1개 도구는 non-deferred | 모든 도구가 deferred면 400 에러 |
| 권장 전략 | 자주 쓰는 3-5개는 즉시 로드, 나머지 defer |

## 성능 향상 (내부 테스트)

| 모델 | 이전 | Tool Search 사용 후 |
|------|------|---------------------|
| Opus 4 | 49% | **74%** |
| Opus 4.5 | 79.5% | **88.1%** |

## 제한사항

| 항목 | 제한 |
|------|------|
| 최대 도구 수 | 10,000개 |
| 검색당 반환 | 3-5개 |
| 정규식 패턴 최대 길이 | 200자 |
| 지원 모델 | Claude Sonnet 4.0+, Opus 4.0+ |
| 미지원 | Haiku, Tool use examples |

## DO/DON'T

### DO
- 자주 쓰는 3-5개 도구는 즉시 로드
- 나머지는 defer_loading: true
- 10개+ 도구 사용 시 Tool Search 적극 활용
- BM25 검색으로 기능 기반 검색

### DON'T
- MCP 도구 호출 전 MCPSearch로 로드하기 (실패함)
- 모든 도구를 defer_loading으로 설정 (400 에러)
- Tool Search Tool 자체를 defer 설정

## Beta 헤더
| 제공자 | Header | 지원 모델 |
|--------|--------|----------|
| Claude API | `advanced-tool-use-2025-11-20` | Opus 4.5, Sonnet 4.5 |
| Google Vertex AI | `tool-search-tool-2025-10-19` | Opus 4.5, Sonnet 4.5 |
| Amazon Bedrock | `tool-search-tool-2025-10-19` | Opus 4.5 |

## Observations

- [tech] defer_loading으로 95% 토큰 절약 (55k → 8.7k) #token-optimization #defer-loading
- [decision] 자주 쓰는 3-5개 도구는 즉시 로드, 나머지 defer 설정 권장 #best-practice #strategy
- [fact] Tool Search Tool은 defer 금지, 최소 1개 도구는 non-deferred 필수 #limitation #requirement
- [tech] BM25 자연어 검색과 Regex 패턴 검색 제공 (각각 다른 tool ID) #search #types
- [decision] MCP 도구 호출 전 MCPSearch로 로드 시도는 실패함 (안티패턴) #anti-pattern #warning