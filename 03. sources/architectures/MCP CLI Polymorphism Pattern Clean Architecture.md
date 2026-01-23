---
title: MCP CLI Polymorphism Pattern Clean Architecture
type: note
permalink: architecture/mcp-cli-polymorphism-pattern-clean-architecture
tags:
- mcp
- cli
- polymorphism
- clean-architecture
- design-pattern
extraction_status: pending
---

# MCP CLI의 다형성 패턴: 클린 아키텍처 관점

## Observations

### 설계 철학 비교
- [pattern] 절차적 (@wong2): 단일 커맨드, 문자열 파싱
- [pattern] 다형성 (thedotmack): 중첩 서브커맨드, 도구별 타입 체크
- [advantage-poly] 확장에 열려 있고 수정에 닫혀 있음 (OCP)
- [advantage-poly] 타입 안전한 파라미터 변환

### 다형성의 핵심 원리
- [concept] 런타임에 toolName에 따라 다른 동작 실행
- [concept] client.callTool(toolName, args) - 같은 메서드, 다른 동작
- [concept] 클라이언트 코드는 변경 없음 → OCP 준수

### Command Pattern 적용
- [pattern] 각 MCP 도구 = Command 객체
- [pattern] 도구 목록에서 동적으로 서브커맨드 생성
- [advantage] 도구 추가/제거가 데이터 변경만으로 가능

### Strategy Pattern (inputSchema)
- [pattern] 타입별 전략 선택: string/number/object/custom
- [pattern] 각 도구의 inputSchema가 서로 다른 전략 제시
- [advantage] 도구별로 필요한 옵션만 자동 생성

### 의존성 역전 원칙 (DIP)
- [pattern] 고수준: executeToolCommand (변하지 않음)
- [pattern] 저수준: MCPClient (MCP 프로토콜 구현)
- [gotcha] 의존성은 항상 안쪽(고수준)을 향해야 함

### LazyToolLoader와의 관계
- [concept] 다형성 구현을 위해 도구 목록 필요
- [concept] LazyToolLoader = 다형성의 성능 문제 해결
- [metric] 다형성 + 캐시 = 성능 2.1배, 타입 안전성, 확장성 모두 충족

### 레이어 구조
- [layer] Presentation: CLI Interface (index.ts)
- [layer] Application: Tool Generator (CLI 옵션 변환)
- [layer] Domain: Tool Cache (도구 목록 캐싱)
- [layer] Infrastructure: MCP Client (JSON-RPC 통신)

### DO
- [pattern] 새 MCP 도구 추가 시 코드 변경 불필요
- [pattern] Strategy Pattern으로 도구별 특수 처리
- [pattern] 도구별 if-else 분기 대신 다형성 사용

### DON'T
- [gotcha] 도구별 if-else 분기 금지 (OCP 위반)
- [gotcha] 캐시 없이 다형성 구현 금지 (성능 문제)
- [gotcha] Infrastructure가 Domain에 의존하는 구조 금지

## Relations
- [[MCP CLI LazyToolLoader Pattern]]