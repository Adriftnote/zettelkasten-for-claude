---
title: 아키텍처
type: hub
tags:
- hub
- architecture
- system-design
- agent
- tool
permalink: hubs/architectures-1
---

# 아키텍처 (Architectures)

시스템의 **전체 구조**를 설계하는 방법. 도구 관리, 지식 관리, 에이전트 설계의 아키텍처 패턴들.

---

## Observations

### 핵심 인사이트
- [insight] "아키텍처는 **변경하기 어려운 결정**이다. 처음에 잘 설계해야 나중에 고생하지 않는다."
- [insight] 도구, 지식, 에이전트의 **3계층 아키텍처** 필요
- [insight] 중앙 집중식 관리가 확장성과 유지보수성을 결정

### 학습 경로
- [path] **기초** (철학) → **구현** (패턴) → **최적화** (선택 가이드)
- [path] 도구관리 → 지식관리 → 에이전트설계

### 인덱싱 (루만식)

#### 1. 도구 관리 아키텍처
- [index:1] [[tool-hub-philosophy]] - 도구 중앙 관리 철학 (시작점)
- [index:1a] [[progressive-loader]] - 점진적 도구 로딩 (효율화)
- [index:1a1] [[mcp-cli-polymorphism]] - MCP CLI 다형성 구현
- [index:1b] [[tool-hub-vs-tool-chainer]] - 허브 vs 체이너 비교

#### 2. 지식 관리 아키텍처
- [index:2] [[knowledge-refinement-pipeline]] - 지식 정제 파이프라인 (프로세스)
- [index:2a] [[hybrid-search-architecture]] - 하이브리드 검색 (구현체)
- [index:2b] [[jarvis-lite-architecture]] - 경량 어시스턴트 아키텍처

#### 3. 에이전트 아키텍처
- [index:3] [[01. concepts/agent-architecture-guide]] - 에이전트 설계 가이드 (원칙)
- [index:3a] [[knowledge-agent-architecture]] - 지식 에이전트 (구체 사례)

---

## Relations

### 관리하는 노트들 (organizes)
- organizes [[tool-hub-philosophy]]
- organizes [[progressive-loader]]
- organizes [[mcp-cli-polymorphism]]
- organizes [[tool-hub-vs-tool-chainer]]
- organizes [[knowledge-refinement-pipeline]]
- organizes [[hybrid-search-architecture]]
- organizes [[jarvis-lite-architecture]]
- organizes [[01. concepts/agent-architecture-guide]]
- organizes [[knowledge-agent-architecture]]

### 다른 허브와의 연결
- connects_to [[mcp-tool-patterns]] (도구 패턴 구현 수준)
- connects_to [[context-engineering]] (컨텍스트 설계)
- connects_to [[optimization-patterns]] (성능 최적화)

---

## 아키텍처 선택 가이드

| 상황 | 추천 아키텍처 | 인덱스 |
|------|---------------|-------|
| 도구가 많음 | [[tool-hub-philosophy]] | 1 |
| 도구 로딩이 느림 | [[progressive-loader]] | 1a |
| MCP 구현 다형성 | [[mcp-cli-polymorphism]] | 1a1 |
| 도구 전략 비교 | [[tool-hub-vs-tool-chainer]] | 1b |
| 지식 처리 흐름 | [[knowledge-refinement-pipeline]] | 2 |
| 검색 품질 중요 | [[hybrid-search-architecture]] | 2a |
| 경량 어시스턴트 | [[jarvis-lite-architecture]] | 2b |
| 에이전트 원칙 | [[01. concepts/agent-architecture-guide]] | 3 |
| 지식 기반 에이전트 | [[knowledge-agent-architecture]] | 3a |
