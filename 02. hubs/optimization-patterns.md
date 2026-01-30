---
title: 최적화 패턴
type: hub
tags:
- hub
- optimization
- token
- performance
- pattern
permalink: hubs/optimization-patterns-1
---

# 최적화 패턴 (Optimization Patterns)

LLM 사용에서의 **효율성**을 높이는 패턴들. 토큰 비용, 응답 속도, 안정성을 최적화한다.

---

## Observations

- [fact] 최적화의 3대 축: 비용, 속도, 안정성 #optimization #performance
- [fact] 토큰 절감 > KV 캐시 활용 > 장애 복구 순서로 우선순위 설정 #token #strategy
- [fact] 토큰은 돈이다 - 같은 결과를 더 적은 토큰으로 얻는 것이 핵심 #cost

## Relations

- organizes [[token-optimization-strategy]] (1. 토큰 비용 절감의 종합 전략 (시작점)
  - extends [[prompt-compression]] (1a. 프롬프트 길이 감축 기법)
  - extends [[output-format-optimization]] (1b. 출력 형식 최적화)
- organizes [[kv-cache-optimization]] (2. KV 캐시 재사용으로 처리 속도 향상)
  - part_of [[cache-reuse-strategy]] (2a. 캐시 재사용 전략)
- organizes [[graceful-degradation]] (3. 실패 시 우아한 후퇴 전략)
  - part_of [[fallback-patterns]] (3a. 대체 경로 패턴)
  - part_of [[retry-logic]] (3b. 재시도 로직)
- connects_to [[context-engineering]] (컨텍스트 최적화 기법)
- connects_to [[mcp-tool-patterns]] (도구 로딩 최적화)
- connects_to [[architectures]] (아키텍처 수준 최적화)
- connects_to [[memory-systems]] (KV 캐시와 메모리 계층)
- connects_to [[general-cs]] (기본 알고리즘과 트레이드오프)