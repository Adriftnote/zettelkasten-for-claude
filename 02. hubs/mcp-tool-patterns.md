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

### 핵심 인사이트
- [insight] 도구가 많아지면 LLM은 **선택 장애**를 겪는다. 필요한 도구만 보여주는 것이 핵심
- [insight] 도구는 **구조화된 인덱싱**으로 관리해야 스케일링 가능해진다
- [insight] **Hook 기반 자동활성화**는 수동 관리의 복잡성을 제거한다

### 학습 경로
- [path] **문제 인식** (도구 선택 장애) → **로딩 최적화** (lazy-loading) → **동적 구성** (dynamic-fetching) → **자동화** (hook-based)

### 인덱싱 (루만식)

**1. 도구 로딩 전략**
- [index:1] [[lazy-tool-loader]] - 필요할 때만 로드하기 (시작점)
- [index:1a] [[dynamic-tool-fetching]] - 요청에 따라 동적으로 도구 목록 구성
- [index:1b] [[hook-based-mcp-auto-activation]] - 훅으로 자동 활성화

**2. 도구 발견 및 설계**
- [index:2] [[tool-discovery-pattern]] - 도구를 자동으로 발견하는 패턴
- [index:2a] [[consolidation-principle]] - 비슷한 도구는 하나로 통합

**3. 컨텍스트 최적화**
- [index:3] [[context-engineering]] - 도구 설명도 컨텍스트의 일부
- [index:3a] [[optimization-patterns]] - 토큰 최적화 기법

---

## Relations

### 관리하는 노트들
- organizes [[lazy-tool-loader]]
- organizes [[dynamic-tool-fetching]]
- organizes [[hook-based-mcp-auto-activation]]
- organizes [[tool-discovery-pattern]]
- organizes [[consolidation-principle]]

### 다른 허브와의 연결
- connects_to [[context-engineering]] (도구 설명의 컨텍스트 최적화)
- connects_to [[architectures]] (MCP Tool Hub 아키텍처)
- connects_to [[optimization-patterns]] (토큰 효율성)