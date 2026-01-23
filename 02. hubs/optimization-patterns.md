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

### 핵심 인사이트

> "토큰은 **돈**이다. 같은 결과를 더 적은 토큰으로 얻는 것이 최적화의 핵심."

- [insight] 최적화의 3대 축: **비용**, **속도**, **안정성**
- [insight] 토큰 절감 > KV 캐시 활용 > 장애 복구 순서로 우선순위 설정
- [tip] 작은 개선의 적립: 1% 절감 × 100회 = 거대한 효율 향상

### 학습 경로

[path] 기초 개념 (비용 인식) → 토큰 최적화 → KV 캐시 활용 → 안정성 구축

### 인덱싱 (루만식)

- [index:1] [[token-optimization-strategy]] - 토큰 비용 절감의 종합 전략 (시작점)
- [index:1a] [[prompt-compression]] - 프롬프트 길이 감축 기법
- [index:1b] [[output-format-optimization]] - 출력 형식 최적화
- [index:2] [[kv-cache-optimization]] - KV 캐시 재사용으로 처리 속도 향상
- [index:2a] [[cache-reuse-strategy]] - 캐시 재사용 전략
- [index:3] [[graceful-degradation]] - 실패 시 우아한 후퇴 전략
- [index:3a] [[fallback-patterns]] - 대체 경로 패턴
- [index:3b] [[retry-logic]] - 재시도 로직

---

## Relations

### 관리하는 노트들

- organizes [[token-optimization-strategy]]
- organizes [[kv-cache-optimization]]
- organizes [[graceful-degradation]]
- organizes [[prompt-compression]]
- organizes [[output-format-optimization]]
- organizes [[cache-reuse-strategy]]
- organizes [[fallback-patterns]]
- organizes [[retry-logic]]

### 다른 허브와의 연결

- connects_to [[context-engineering]] (컨텍스트 최적화 기법)
- connects_to [[mcp-tool-patterns]] (도구 로딩 최적화)
- connects_to [[architectures]] (아키텍처 수준 최적화)
- connects_to [[memory-systems]] (KV 캐시와 메모리 계층)
- connects_to [[general-cs]] (기본 알고리즘과 트레이드오프)