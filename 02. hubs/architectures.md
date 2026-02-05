---
title: 아키텍처
type: hub
tags:
- hub
- architecture
- system-design
- agent
- tool
permalink: hubs/architectures
---

# 아키텍처 (Architectures)

시스템의 **전체 구조**를 설계하는 방법. 도구 관리, 지식 관리, 에이전트 설계의 아키텍처 패턴들.

---

## Observations

- [fact] 아키텍처는 변경하기 어려운 결정이다 - 처음에 잘 설계해야 나중에 고생하지 않는다 #system-design
- [fact] 도구, 지식, 에이전트의 3계층 아키텍처 필요 #architecture
- [fact] 중앙 집중식 관리가 확장성과 유지보수성을 결정 #tool-management

## Relations

- organizes [[tool-hub-philosophy]] (1. 도구 중앙 관리 철학)
  - extends [[progressive-loader]] (1a. 점진적 도구 로딩)
    - implements [[mcp-cli-polymorphism]] (1a1. MCP CLI 다형성 구현)
  - extends [[tool-hub-vs-tool-chainer]] (1b. 허브 vs 체이너 비교)
- organizes [[knowledge-refinement-pipeline]] (2. 지식 정제 파이프라인)
  - implements [[hybrid-search-architecture]] (2a. 하이브리드 검색 구현체)
  - implements [[jarvis-lite-architecture]] (2b. 경량 어시스턴트 아키텍처)
- organizes [[01. concepts/agent-architecture-guide]] (3. 에이전트 설계 가이드)
  - extends [[knowledge-agent-architecture]] (3a. 지식 에이전트 구체 사례)
- connects_to [[mcp-tool-patterns]] (도구 패턴 구현 수준)
- connects_to [[context-engineering]] (컨텍스트 설계)
- connects_to [[optimization-patterns]] (성능 최적화)

---

## 아키텍처 선택 가이드

| 상황 | 추천 아키텍처 | 인덱스 |
|------|---------------|-------|
| 도구가 많음 | tool-hub-philosophy | (1) |
| 도구 로딩이 느림 | progressive-loader | (1a) |
| MCP 구현 다형성 | mcp-cli-polymorphism | (1a1) |
| 도구 전략 비교 | tool-hub-vs-tool-chainer | (1b) |
| 지식 처리 흐름 | knowledge-refinement-pipeline | (2) |
| 검색 품질 중요 | hybrid-search-architecture | (2a) |
| 경량 어시스턴트 | jarvis-lite-architecture | (2b) |
| 에이전트 원칙 | agent-architecture-guide | (3) |
| 지식 기반 에이전트 | knowledge-agent-architecture | (3a) |
