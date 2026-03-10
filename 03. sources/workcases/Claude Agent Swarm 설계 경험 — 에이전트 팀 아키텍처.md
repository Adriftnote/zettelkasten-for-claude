---
title: Claude Agent Swarm 설계 경험 — 에이전트 팀 아키텍처
type: note
permalink: 03.-sources/workcases/claude-agent-swarm-seolgye-gyeongheom-eijeonteu-tim-akitegceo
tags:
- claude-code
- agent
- subagent
- swarm
- architecture
---

# Claude Agent Swarm 설계 경험 — 에이전트 팀 아키텍처

## 상황
- Claude Code의 Main Agent + 전문 Subagent 팀 구조 설계
- 에러 분석을 별도 subagent에서 처리하여 Context 오염 방지
- 에러 해결 패턴을 knowledge-base에 축적

## 설계한 구조

```
Main Agent (Orchestrator)
├── error-analyzer (Phase 1) — 에러 분석 + review 저장 + 과거 해결책 검색
├── knowledge-curator (Phase 2) — 새 개념 저장 (FLEETING)
└── flow-sync.json — 워크플로우 정의
```

## 구현 내용
- Node.js 기반 (package.json, dist/ 빌드)
- changes.json으로 변경 추적
- run-error-analyzer.bat으로 실행
- outputs/ 폴더에 산출물

## 교훈
- Context 오염 방지가 subagent 분리의 핵심 동기
- 지식 축적 자동화: 에러 → 분석 → 패턴 저장 파이프라인
- 이후 claude-workspace의 orchestration.db + basic-memory 체계로 발전

## 소스
- `C:\Projects\claude-agent-swarm\` (archive 대상)
- 관련: agent-sdk-test/ (SDK 테스트 단일 파일)
