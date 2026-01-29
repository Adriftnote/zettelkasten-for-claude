---
title: MCP & Tool 패턴
type: hub
tags:
- hub
- mcp
- tool
- agent
- pattern
- lazy-loading
permalink: hubs/mcp-tool-patterns-1
---

# MCP & Tool 패턴

LLM이 **도구(Tool)**를 사용하는 방식을 체계화한 패턴들. MCP(Model Context Protocol)는 도구를 **표준화된 방식**으로 연결하며, **선택 장애 회피**와 **토큰 최적화**가 핵심이다.

---

## Observations

- [insight] 도구가 많아지면 LLM은 선택 장애를 겪는다 - 필요한 도구만 보여주는 것이 핵심 #mcp #tool #choice-overload
- [insight] 도구는 구조화된 인덱싱으로 관리해야 스케일링 가능해진다 #indexing #scalability
- [insight] Hook 기반 자동활성화는 수동 관리의 복잡성을 제거한다 #automation #hook
- [path] 문제 인식 (도구 선택 장애) → 로딩 최적화 (lazy-loading) → 동적 구성 (dynamic-fetching) → 자동화 (hook-based) #learning

## Relations

- organizes [[lazy-tool-loader]] (1. 필요할 때만 로드하기 (시작점)
  - extends [[dynamic-tool-fetching]] (1a. 요청에 따라 동적으로 도구 목록 구성
  - extends [[hook-based-mcp-auto-activation]] (1b. 훅으로 자동 활성화
- organizes [[tool-discovery-pattern]] (2. 도구를 자동으로 발견하는 패턴
  - part_of [[consolidation-principle]] (2a. 비슷한 도구는 하나로 통합
- connects_to [[context-engineering]] (도구 설명도 컨텍스트의 일부)
  - connects_to [[optimization-patterns]] (토큰 최적화 기법)
- connects_to [[architectures]] (MCP Tool Hub 아키텍처)