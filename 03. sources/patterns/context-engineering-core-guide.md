---
title: Context Engineering 핵심 가이드
type: note
permalink: knowledge/context-engineering-haegsim-gaideu
tags:
- context-engineering
- llm
- token-optimization
- tool-design
- multi-agent
extraction_status: pending
---

# Context Engineering 핵심 가이드

## Observations

### 핵심 목표
- [goal] 가장 작은 고신호(high-signal) 토큰 집합으로 원하는 결과 가능성 최대화
- [concept] 프롬프트 엔지니어링과 달리 시스템 프롬프트/도구 정의/검색 문서/메시지 히스토리/도구 출력 등 모든 입력 정보를 종합적으로 관리

### Context Fundamentals
- [pattern] Progressive Disclosure - 처음엔 스킬 이름/설명만 로드, 필요시 전체 활성화
- [pattern] 시작/끝에 중요 정보 배치 (U자형 주의 곡선 활용)
- [pattern] 70-80% 사용 시 압축 트리거 (성능 저하 전에 대응)
- [gotcha] 컨텍스트 중간에 중요 정보 배치하면 안 됨 (Lost-in-Middle: 10-40% 낮은 회수율)

### 성능 저하 패턴
- [pattern] Lost-in-Middle - 중간 정보 10-40% 낮은 회수율
- [pattern] Context Poisoning - 오류가 컨텍스트에 누적
- [pattern] Context Distraction - 무관한 정보가 주의력 분산
- [pattern] Context Confusion - 다른 작업 컨텍스트와 혼동
- [pattern] Context Clash - 상충하는 정보 공존

### 토큰 사용 분석
- [statistic] Tool 출력: 전체 컨텍스트의 83.9%
- [statistic] 토큰 사용량: 성능 분산의 80% 설명
- [gotcha] 토큰 수 = 용량이라고 착각하지 말 것 (주의력이 진짜 제약)

### Compression 전략
- [pattern] tokens-per-request (요청당 토큰) ❌
- [pattern] tokens-per-task (작업 완료까지 총 토큰) ✅
- [method] Anchored Iterative - 98.6% 압축, 품질 3.70
- [method] Observation Masking - Tool 출력 80%+ 마스킹으로 절약

### Four-Bucket Optimization
- [pattern] Write - 외부 저장소에 컨텍스트 저장
- [pattern] Select - 관련 정보만 선별하여 로드
- [pattern] Compress - 토큰 줄이면서 정보 유지
- [pattern] Isolate - 서브에이전트로 컨텍스트 분리

### Tool Design 원칙
- [principle] Consolidation Principle - 포괄적인 단일 도구 선호
- [principle] 명확한 설명 (무엇을, 언제, 무엇을 반환하는지)
- [principle] 응답 형식 옵션 (concise/detailed)
- [principle] 복구 가능한 에러 (에이전트가 수정할 수 있도록)
- [example] Vercel d0: 도구 17개 → 2개, 성공률 80% → 100%

### Multi-Agent 패턴
- [pattern] Supervisor - 명확한 제어, 감독 용이 (병목 발생 가능)
- [pattern] Peer-to-Peer - 유연성, SPOF 없음 (조율 복잡)
- [pattern] Hierarchical - 관심사 분리 (레이어 간 오버헤드)
- [gotcha] 전화게임 문제 - 서브에이전트 응답을 사용자에게 직접 전달

## Relations