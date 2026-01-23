---
title: MCP Tool Search Implementation Limitations Claude Code
type: note
permalink: architecture/mcp-tool-search-implementation-limitations-claude-code
tags:
- mcp
- tool-search
- claude-code
- architecture
- limitation
extraction_status: pending
---

# MCP Tool Search Architecture: Claude Code 한계와 대안

## Observations

### Anthropic Cookbook 패턴 (이론적 설계)
```
대화 시작
  ↓
tools = [tool_search] (도구 1개만 로드)
  ↓
Claude: "sqlite query 도구 필요해"
  ↓
tool_search 호출 → 검색 결과 (input_schema 포함)
  ↓
동적 추가: tools = [tool_search, read_query]
  ↓
Claude: read_query 호출 가능
```

**핵심**: 대화 중간에 도구가 동적으로 추가됨

### Claude Code에서 구현 불가 이유

#### 1. Tool Search Tool 미지원
- GitHub Issue: [#12836](https://github.com/anthropics/claude-code/issues/12836) (OPEN)
- 필요 기능: `tool_search_tool_bm25`, `tool_search_tool_regex`
- 현재 상태: 사용 불가

#### 2. defer_loading 미지원
- GitHub Issue: [#7336](https://github.com/anthropics/claude-code/issues/7336) (OPEN)
- 필요 설정: `defer_loading: true`
- 현재 상태: 사용 불가

#### 3. 동적 도구 추가 불가
```
Claude Code 구조:
- 세션 시작 시 MCP 서버 연결
- 도구 목록 고정 (모두 컨텍스트에 로드)
- 대화 중 변경 불가능 (API 없음)
```

#### 4. 스킬 Progressive Reading과의 차이
| 항목 | 스킬 Progressive Reading | Tool Search defer_loading |
|------|--------------------------|--------------------------|
| 대상 | 스킬 콘텐츠 (지식/가이드) | 도구 스키마 (input_schema) |
| 로드 시점 | 스킬 호출 시 | 검색으로 발견 시 |
| 호출 가능성 | 항상 가능 (스킬 자체) | **검색 전엔 불가능** |

스킬은 "콘텐츠"만 lazy load, **도구는 "호출 자격" 자체가 lazy load되어야 함**

### 현재 mcp-tool-search 스킬의 한계

#### 구현된 것
- 66개 도구 임베딩 검색
- 유사도 기반 도구 추천

#### 한계
| 문제 | 설명 |
|------|------|
| input_schema 없음 | tools_cache.json에 파라미터 정보 부재 |
| 텍스트 출력만 | 도구 동적 추가 안 됨 |
| 호출 불가 | 검색 결과로 MCP 도구 호출 못함 |

```json
// 현재 tools_cache.json - 불완전
{
  "server": "sqlite_dashboard_atomic",
  "name": "read_query",
  "description": "Execute a SELECT query"
  // ❌ input_schema 없음!
}
```

## 대안: Memory + mcp-cli-tool 패턴

### 설계
```
1. Memory (세션 시작 시 로드)
   - MCP 도구 스키마 저장 (input_schema 포함)
   - search_nodes로 검색 가능

2. 도구 필요할 때
   mcp__memory__search_nodes("sqlite query")
   → 스키마 반환 (파라미터 정보 포함)

3. 실제 호출
   mcp-cli-tool (Bash)로 직접 MCP 서버 호출
   npx @wong2/mcp-cli call-tool server:tool --args '{}'
```

### 장점
| 항목 | 효과 |
|------|------|
| 토큰 절약 | MCP 서버 연결 안 함 (46k+ 절약) |
| 스키마 검색 | Memory에서 필요할 때만 로드 |
| 호출 가능 | Bash로 직접 MCP 서버 호출 |
| 유지보수 | 기존 인프라 활용 |

### 구현 순서
1. Memory에 도구 스키마 저장 (input_schema 포함)
2. mcp-cli-tool 활성화
3. 워크플로우 테스트

## 비교 요약

| 항목 | Anthropic Cookbook | 현재 mcp-tool-search | Memory + mcp-cli-tool |
|------|-------------------|---------------------|----------------------|
| 검색 | defer_loading | 임베딩 검색 | Memory search_nodes |
| 스키마 | 자동 로드 | 없음 | Memory에 저장 |
| 호출 | API 직접 | 불가 | Bash로 호출 |
| 토큰 | 95% 절약 | 절약 없음 | 46k+ 절약 |
| Claude Code | 미지원 | 참고용 | 가능 |

## 결론
1. **Cookbook 패턴은 Claude Code에서 불가능** (defer_loading, Tool Search Tool 미지원)
2. **현재 mcp-tool-search 스킬은 참고용** (검색만 가능)
3. **대안: Memory + mcp-cli-tool** 조합으로 유사한 효과 달성 가능
4. **GitHub Issue 모니터링** (#7336, #12836) - 향후 지원 시 전환

## Observations

- [fact] Claude Code는 defer_loading, Tool Search Tool 미지원으로 Cookbook 패턴 구현 불가 #claude-code #limitation
- [architecture] 스킬 Progressive Reading은 콘텐츠만 lazy load, Tool Search는 호출 자격 자체를 lazy load #pattern #difference
- [decision] 대안: Memory에 도구 스키마 저장 + mcp-cli-tool로 Bash 호출 #workaround #alternative
- [tech] 현재 mcp-tool-search 스킬은 input_schema 없어 실제 호출 불가 (참고용) #limitation #incomplete
- [fact] GitHub Issues #7336, #12836 모니터링 - 향후 지원 시 전환 고려 #future #tracking

## 관련 문서
- [[Tool-Hub Architecture Philosophy]]
- [[Tool-Hub Birth Background]]