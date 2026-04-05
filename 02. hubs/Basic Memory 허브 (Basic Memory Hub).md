---
title: Basic Memory Hub
type: hub
permalink: hubs/basic-memory
tags:
- hub
- basic-memory
- knowledge-management
- mcp
---

# Basic Memory Hub

Obsidian과 통합되는 로컬 우선 지식 관리 시스템 Basic Memory 관련 지식을 조직화합니다.

## Observations

- [fact] Basic Memory는 마크다운 파일을 SQLite FTS5로 인덱싱하여 검색 #architecture
- [fact] Entity, Relation, Observation 세 요소로 지식 그래프 구성 #structure
- [fact] MCP 프로토콜을 통해 Claude Code, Claude Desktop과 통합 #integration
- [method] Observations는 `[category]` 마커로 사실 기반 정보 구조화 #usage
- [method] Relations는 `- type [[target]] (context)` 형식으로 연결 #usage
- [method] wikilink 후 괄호 `(설명)`로 context DB 저장 #parsing
- [decision] Relations 섹션에서만 wikilink 사용하는 규칙 채택 #convention
- [decision] 6개 표준 Observation 카테고리 (fact, method, decision, example, reference, question) #convention

## Relations

- organizes [[Concept Note]] (1. 노트 유형)
  - extends [[Hub Note]] (1a. 조직화 노트)
- organizes [[Basic Memory MCP 완전 가이드]] (2. 완전 가이드)
  - extends [[Basic Memory MCP 올바른 사용법]]] (2a. 사용법)
  - extends [[Basic Memory Setup Complete]] (2b. 설정 완료)
- organizes [[knowledge-refinement-pipeline]] (3. 지식 정제)
  - extends [[Three-Layer Memory Architecture]] (3a. 3계층 메모리)
- organizes [[MCP (Model Context Protocol)]] (4. 프로토콜 기반)
- connects_to [[Zettelkasten Hub]] (제텔카스텐 방법론)
- connects_to [[Obsidian Hub]] (Obsidian 에디터)