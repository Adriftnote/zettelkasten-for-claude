---
title: API Governance — Flow 연동 업무 자동화 설계
type: note
permalink: 03.-sources/workcases/api-governance-flow-yeondong-eobmu-jadonghwa-seolgye
tags:
- flow
- api
- governance
- automation
- kpi
---

# API Governance — Flow 연동 업무 자동화 설계

## 상황
- 현행 업무 흐름(As-Is)을 먼저 디지털화한 뒤, Flow API로 자동화(To-Be)하는 2단계 전략
- 6개 Phase 구조로 설계

## Phase 구조

```
Phase 01: 현행 업무 흐름 구현 (As-Is)
├── 01-a-workflow-mapping    → 업무 흐름 파악
├── 01-b-api-definition      → KPI 정의 (원래 01-b-kpi-definition이었으나 api-definition으로 변경)
└── 01-c-process-rollout     → 프로세스 롤아웃

Phase 02: FLOW API 연동 자동화 (To-Be)
├── 02-a-flow-api-research   → API 조사
├── 02-b-flow-integration    → API 연동
└── 02-c-auto-dashboard      → 자동 대시보드
```

## 핵심 원칙
1. 현행 먼저 — 현재 엑셀 보고 흐름을 그대로 디지털화
2. 자동화는 그 다음 — Phase 01 완료 후 Flow API로 Migration
3. 레이아웃 일관성 — 수동 대시보드 → 자동 대시보드 (같은 형식)

## 결과
- Phase 구조 설계까지 완료, 실행은 미착수 상태에서 종료
- 이후 flow-task-creator 확장프로그램과 Flow 업무처리 자동화 프로젝트로 발전

## 소스
- `C:\Projects\api-governance\` (archive 대상)
