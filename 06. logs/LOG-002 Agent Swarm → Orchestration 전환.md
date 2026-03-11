---
title: Claude Agent Swarm에서 Orchestration으로
type: changelog
permalink: logs/agent-swarm-to-orchestration
tags:
- claude-code
- agent
- architecture
- swarm
date: 2026-01-15
---

# Claude Agent Swarm에서 Orchestration으로

> Claude Code의 에러 분석 자동화를 위해 Agent Swarm을 설계했으나, orchestration.db + basic-memory 체계로 발전.

## 흐름
```
에러 분석 자동화 필요
  ├── Agent Swarm 설계 (Main + Subagent 팀)
  │     ├── error-analyzer: 에러 분석 + review 저장 + 과거 해결책 검색
  │     ├── knowledge-curator: 새 개념 FLEETING 저장
  │     └── flow-sync.json: 워크플로우 정의
  │
  ├── Node.js 기반 구현
  │     ├── changes.json으로 변경 추적
  │     └── run-error-analyzer.bat으로 실행
  │
  └── 한계 인식 → orchestration.db + basic-memory로 전환
        ├── 에러 분석 → orchestration_log의 도메인별 추적으로 대체
        └── 지식 축적 → basic-memory 제텔카스텐으로 통합
```

## Observations
- [decision] Context 오염 방지가 subagent 분리의 핵심 동기 — 에러 분석을 메인 에이전트에서 분리 #agent #context
- [decision] Agent Swarm → orchestration.db 전환: 별도 Node.js 프로세스 대신 Claude Code 내장 체계로 통합 #architecture
- [pattern] 에러 → 분석 → 패턴 저장 파이프라인 — 자동 지식 축적의 초기 형태 #knowledge-management

## Relations
- led_to [[Orchestrator의 의도 보존 분해 역할]] (Swarm에서 발전한 오케스트레이션 패턴)
