---
title: Context Engineering
type: hub
tags:
- hub
- context
- llm
- prompt
- optimization
permalink: hubs/context-engineering-1
---

# Context Engineering

LLM에게 **어떤 정보를 어떻게 전달**하느냐가 응답 품질을 결정한다. Context의 구조, 순서, 양을 설계하는 것이 **Context Engineering**이다.

---

## Observations

### 핵심 인사이트
- [insight] LLM은 **컨텍스트 윈도우** 안에서만 세상을 본다 - 무엇을 넣고 빼느냐가 전부
- [insight] **정보 배치**가 이해도를 결정한다 - 중간은 잘 잊혀지므로 시작/끝이 중요
- [insight] **오염된 컨텍스트**는 전체 응답을 망친다 - 정확성과 관련성이 필수

### 학습 경로
- [path] 기초(필요한 정보 선별) → 배치(위치 최적화) → 정제(오류와 잡음 제거) → 고급(반복 요약, 마스킹)

### 인덱싱 (루만식)
- [index:1] [[progressive-disclosure]] - 필요할 때만 정보를 공개하는 핵심 전략
  - [index:1a] [[four-bucket-optimization]] - 컨텍스트를 4개 버킷으로 체계적 분류
  - [index:1b] [[observation-masking]] - 에이전트 환경에서 관찰 결과 선택적 노출
- [index:2] [[context-poisoning]] - 잘못된 정보의 오염 효과
  - [index:2a] [[context-distraction]] - 관련 없는 정보의 방해 효과
  - [index:2b] [[context-confusion]] - 모호한 컨텍스트의 혼란
  - [index:2c] [[context-clash]] - 상충하는 정보의 충돌
- [index:3] [[lost-in-middle]] - 긴 컨텍스트의 중간 정보 망각 현상
  - [index:3a] [[anchored-iterative-summarization]] - 앵커 기반 반복 요약으로 해결
- [index:4] [[Context Management Levels]] - 컨텍스트 관리의 수준별 분류 (메타 개념)

---

## Relations

### 이 허브가 관리하는 노트들
- organizes [[progressive-disclosure]]
- organizes [[four-bucket-optimization]]
- organizes [[observation-masking]]
- organizes [[context-poisoning]]
- organizes [[context-distraction]]
- organizes [[context-confusion]]
- organizes [[context-clash]]
- organizes [[lost-in-middle]]
- organizes [[anchored-iterative-summarization]]
- organizes [[Context Management Levels]]

### 다른 허브와의 연결
- connects_to [[optimization-patterns]] (토큰 최적화 전략)
- connects_to [[mcp-tool-patterns]] (도구 사용 시 컨텍스트 관리)
- connects_to [[architectures]] (에이전트 아키텍처에서의 컨텍스트)