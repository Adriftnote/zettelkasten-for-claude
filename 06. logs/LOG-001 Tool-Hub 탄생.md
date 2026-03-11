---
title: Tool-Hub 탄생 — defer_loading 한계에서 Progressive Disclosure까지
type: changelog
permalink: logs/tool-hub-birth-progressive-disclosure
tags:
- tool-hub
- progressive-disclosure
- claude-code
- mcp-cli
- lazy-loading
- clean-architecture
date: 2025-12-23
---

# Tool-Hub 탄생 — defer_loading 한계에서 Progressive Disclosure까지

> Claude Code의 defer_loading 미지원 → mcp-cli 발견 → LazyToolLoader 버그 수정 → 클린 아키텍처 학습 → Tool-Hub + Chainer 통합까지 5단계 진화.

## 흐름
```
Phase 1: Claude Code 한계 발견 (2025-12-23)
  ├── defer_loading 미지원 (GitHub #7336 OPEN)
  ├── 89개 도구 = 89,000+ 토큰 고정 로드
  └── 초기 대안: Memory 스키마 저장 + @wong2/mcp-cli 호출
        └── 토큰은 절약되지만 느림 🐢

Phase 2: thedotmack/mcp-client-cli 발견 (2025-12-30)
  ├── @wong2(절차적) vs thedotmack(다형성) 비교 → thedotmack 선택
  ├── "Client not initialized" 버그 발견
  │     └── 원인: 등록 시점 client를 실행 시점에 재사용 (클로저 참조)
  ├── LazyToolLoader 패턴으로 해결
  │     └── 등록=캐시에서 / 실행=새 연결
  └── ToolCache로 속도 개선 (디스크 캐시)

Phase 3: 클린 아키텍처 학습 (2026-01-02)
  ├── Command + Strategy 패턴 식별
  ├── 서버 타입 다형성 (uvx/Python/Node.js 투명 호출)
  └── 4계층 레이어 구조 (Presentation→Application→Domain→Infrastructure)

Phase 4: Tool-Hub 구현 (2026-01-02)
  ├── Progressive Disclosure 패턴
  ├── Vector(ChromaDB) + Graph 하이브리드 검색
  └── 토큰 89,000 → 4,000 (95.5% 절감)

Phase 5: Chainer 흡수
  ├── 문제: MCP 서버 간 직접 통신 불가 → AI 매번 왕복
  ├── Tool-Hub가 Tool-Chainer 로직 흡수
  │     └── toolhub_execute: Knowledge Graph → 자동 체이닝
  └── Bash 이스케이핑 문제 해결 (CLI → JSON 파라미터)
```

## Observations
- [decision] @wong2(절차적)가 아닌 thedotmack(다형성) CLI 선택 — 서버 타입 추상화로 확장성 확보 #design-choice
- [decision] Tool-Hub가 Tool-Chainer 흡수 → toolhub_execute로 통합 #architecture
- [decision] Bash mcp-cli 대신 toolhub_execute로 JSON 파라미터 사용 — 이스케이핑 문제 해결 #parameter-safety
- [result] 토큰 절감: 89,000 → 4,000 (95.5%) #performance
- [pattern] 제약이 혁신을 낳음: defer_loading 미지원 → 자체 Progressive Disclosure 구현 #constraint-driven
- [method] LazyToolLoader: 등록 시점(캐시)과 실행 시점(새 연결) 분리 #lazy-loading
- [method] CHAIN_RESULT 플레이스홀더로 MCP 서버 간 데이터 자동 전달 #chainer

## Relations
- learned_from [[lazy-tool-loader]] (Phase 2: 버그 발견 및 해결)
- learned_from [[다형성 (Polymorphism)]] (Phase 3: 클린 아키텍처 분석)
- relates_to [[dynamic-tool-fetching]] (MCP CLI의 동적 도구 로딩 철학)
- relates_to [[tool-hub-vs-tool-chainer]] (아키텍처 분석)
