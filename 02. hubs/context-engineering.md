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

- [fact] LLM은 컨텍스트 윈도우 안에서만 세상을 본다 #context #llm
- [fact] 토큰 수 ≠ 용량, 주의력이 진짜 제약 #attention
- [fact] 정보 배치가 이해도를 결정한다 - U자형 주의 곡선 #optimization
- [fact] 중간 위치 정보는 10-40% 낮은 회수율 (Lost-in-Middle 현상) #lost-in-middle
- [fact] Tool 출력이 전체 컨텍스트의 83.9% 차지 #tool-output
- [fact] 도구 통합 시 80%→100% 성공률 향상 (17→2 도구) #tool-design

## Relations

- organizes [[progressive-disclosure]] (1. 필요할 때만 정보를 공개하는 핵심 전략)
  - extends [[four-bucket-optimization]] (1a. 컨텍스트를 4개 버킷으로 체계적 분류)
  - extends [[observation-masking]] (1b. 에이전트 환경에서 관찰 결과 선택적 노출)
- organizes [[context-poisoning]] (2. 잘못된 정보의 오염 효과)
  - extends [[context-distraction]] (2a. 관련 없는 정보의 방해 효과)
  - extends [[context-confusion]] (2b. 모호한 컨텍스트의 혼란)
  - extends [[context-clash]] (2c. 상충하는 정보의 충돌)
- organizes [[lost-in-middle]] (3. 긴 컨텍스트의 중간 정보 망각 현상)
  - extends [[anchored-iterative-summarization]] (3a. 앵커 기반 반복 요약으로 해결)
- organizes [[Context Management Levels]] (4. 컨텍스트 관리의 수준별 분류)
- connects_to [[optimization-patterns]] (토큰 최적화 전략과 연결)
- connects_to [[mcp-tool-patterns]] (도구 사용 시 컨텍스트 관리)
- connects_to [[architectures]] (에이전트 아키텍처의 컨텍스트)