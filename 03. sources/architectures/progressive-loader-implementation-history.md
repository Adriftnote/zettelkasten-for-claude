---
title: Progressive Loader Implementation History
type: note
permalink: knowledge/progressive-loader-implementation-history
tags:
- progressive-loader
- mcp
- architecture
- chromadb
- optimization
extraction_status: pending
---

# Progressive Loader Implementation History

## Overview
Progressive Loader MCP Server의 핵심 구현 과정과 개선 사항을 기록합니다.

## Key Decisions

### 노이즈 제거 우선 전략 (#1052)
- [Decision] Noise removal first, then user confirmation
- 노이즈 제거를 1순위로 처리
- 완료 후 AskUserQuestion으로 스킬 선택 확인 추가
- 자동 실행 방지 → 사용자가 선택한 스킬만 Skill() 호출

## Refactoring

### Knowledge Graph → ChromaDB 직접 쿼리 (#1058)
- [Refactor] Replaced graph traversal with direct ChromaDB queries
- Before: Knowledge Graph traversal (69줄)
- After: ChromaDB relatedTo 직접 쿼리 (41줄)
- 파일: hybrid-search.ts

### Related Skills 노이즈 수정 (#1061)
- [Bugfix] Fixed noise by excluding dependencies from skill search
- 문제: primary + dependencies 배열 모두에서 tool name 추출
- depth=2 그래프 확장으로 무관한 스킬 표시됨
- 해결: primary 배열에서만 tool name 추출

## Test Results (#1066)

### Query: "n8n workflow creation"
- Primary: n8n-workflow-builder (84% similarity)
- Tools: 9개 (list, create, execute 등)
- Dependencies: 3개 (mcp-cli, sqlite_tiktok, sqlite_instagram)
- Related Skills: 2개 (n8n-expressions, n8n-node-templates)
- Token Savings: **93.26%**

## Architecture
- [Progressive Loader] implements [Token Optimization]
- [ChromaDB] stores [Skill Metadata]
- [HybridSearchService] uses [Vector Search] and [relatedTo Queries]

## Observations

- [decision] Noise removal first strategy: 노이즈 제거 후 AskUserQuestion으로 사용자 확인 추가 #ux #noise-removal
- [tech] Knowledge Graph 순회 제거, ChromaDB relatedTo 직접 쿼리로 69줄→41줄 단순화 #refactoring #simplification
- [fact] n8n workflow creation 쿼리로 93.26% 토큰 절감 달성 (primary 84% similarity) #benchmark #token-optimization
- [architecture] HybridSearchService가 Vector Search + relatedTo 조합으로 스킬 메타데이터 관리 #hybrid-search #chromadb
- [decision] Primary 배열에서만 tool name 추출하여 무관한 스킬 표시 방지 #bugfix #related-skills
