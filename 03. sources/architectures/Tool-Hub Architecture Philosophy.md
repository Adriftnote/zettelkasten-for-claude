---
title: Tool-Hub Architecture Philosophy
type: note
permalink: architecture/tool-hub-architecture-philosophy
tags:
- tool-hub
- architecture
- decision
- mcp
- token-optimization
extraction_status: pending
---

# Tool-Hub Architecture Philosophy

## 핵심 목적

Tool-hub는 **AI가 사용할 수 있는 모든 도구의 중앙 저장소**로 설계됨.

- [tool-hub] [is] [centralized AI tools repository]
- [tool-hub] [implements] [on-demand tool discovery]
- [tool-hub] [reduces] [context token consumption by 90%+]

## 설계 철학

### ReAct + 토큰 최적화

Tool-hub 탄생 배경:
1. **ReAct 패러다임**: Thought → Action → Observation 사이클
2. **토큰 폭발 문제**: MCP 도구 설명이 컨텍스트에 로드되면 토큰 대량 소비
3. **해결책**: 필요한 도구만 on-demand 검색

- [ReAct paradigm] [drives] [tool-hub design]
- [token optimization] [motivates] [progressive disclosure pattern]

### 도구 등록을 MCP 도구로 구현

초기 도구 등록 프로세스가 불완전하여 MCP 도구로 전환 결정:
- `toolhub_register`: 새 도구 등록
- `toolhub_delete`: 도구 삭제
- `toolhub_list`: 등록된 도구 목록

- [tool registration] [implemented as] [MCP tool interface]
- [MCP tool pattern] [improves] [registration reliability]

## 통합 구조

```
┌─────────────────────────────────────────────────────┐
│                   tool-hub                          │
├─────────────────────────────────────────────────────┤
│  ChromaDB (Vector Search)                           │
│    - 의미 기반 도구 검색                              │
│    - MCP 서버, Skill, Command 메타데이터              │
├─────────────────────────────────────────────────────┤
│  Knowledge Graph (Relationship)                     │
│    - 도구 간 관계 (REQUIRES, WORKS_WITH 등)          │
│    - 의존성 그래프 탐색                              │
└─────────────────────────────────────────────────────┘
```

## 핵심 API

| 도구                 | 용도             |
| ------------------ | -------------- |
| `toolhub_search`   | 의미 기반 도구 검색    |
| `toolhub_expand`   | 관계 그래프 확장      |
| `toolhub_cluster`  | 작업에 필요한 전체 도구셋 |
| `toolhub_register` | 새 도구 등록        |
| `toolhub_delete`   | 도구 삭제          |
| `toolhub_list`     | 등록 도구 목록       |

## Observations

- [architecture] Tool-Hub는 AI 사용 가능한 모든 도구의 중앙 저장소로 설계 #tool-hub #centralization
- [decision] ReAct 패러다임 + 토큰 최적화 조합으로 on-demand 도구 검색 구현 #react #token-optimization
- [pattern] Progressive Disclosure 패턴으로 90%+ 컨텍스트 토큰 절감 #progressive-disclosure #optimization
- [tech] ChromaDB 벡터 검색 + Knowledge Graph 관계 탐색 하이브리드 #hybrid-search #architecture
- [decision] 도구 등록 프로세스 불완전으로 MCP 도구 인터페이스로 전환 #tool-registration #reliability