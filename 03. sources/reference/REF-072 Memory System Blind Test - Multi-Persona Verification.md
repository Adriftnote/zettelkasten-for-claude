---
title: REF-072 Memory System Blind Test - Multi-Persona Verification
type: guide
permalink: sources/reference/memory-blind-test-multi-persona
tags:
- memory-system
- blind-test
- meta-learning
- agent-design
date: 2026-03-05
---

# Memory System Blind Test - Multi-Persona Verification

ALMA 논문의 메타학습 접근법을 축소 적용하여, 3개 모델(Opus/Sonnet/Haiku)이 독립적으로 메모리 시스템을 설계한 뒤 현재 구조와 비교한 블라인드 검증 실험.

## 📖 핵심 아이디어

현재 Claude Code 메모리 시스템이 최적인지 검증하기 위해, orchestration.db의 실제 태스크 이력 50건(10개 도메인 × 5건)을 3개 모델에 블라인드로 제공하고 각각 독립적으로 메모리 설계를 요청. 현재 구조 정보를 제공하지 않음으로써 편향 없는 제안을 유도하고, 4개 구조(3개 제안 + 현재)를 다차원 비교.

## 🛠️ 실험 설계

| 항목 | 설명 |
|------|------|
| 방법론 | ALMA(ICML 2026) 축소 적용 — 게임 벤치마크 대신 실제 태스크 이력 기반 1회 블라인드 |
| 데이터 | orchestration.db에서 도메인별 대표 완료 태스크 5개 × 10개 도메인 = 50건 |
| 도메인 | code, docs, research, data, figma, automation, chrome, backend, environment, orchestrator |
| 블라인드 조건 | 현재 메모리 구조 정보 미제공 (태스크 이력 JSON만 제공) |
| 모델 | Opus (5-Layer) / Sonnet (4-Tier) / Haiku (3-Layer) — 동일 프롬프트 병렬 실행 |

## 🔧 비교 결과 매트릭스

### 3개 모델 합의점 (검증된 패턴)

| 패턴 | 현재 상태 |
|------|-----------|
| 항상 로드되는 영구 코어 레이어 | ✅ CLAUDE.md 3개 + MEMORY.md 자동 로드 — 이미 충족 |
| 프로젝트 상태/환경 사실 분리 | ⚠️ MEMORY.md 단일 파일에 혼재 — 개선 가능 |
| 트러블슈팅 독립 관리 | ⚠️ 섹션 존재하나 구조화 미흡 |
| 다단계 검색 파이프라인 | ⚠️ 암묵적 운영 중, 명시적 파이프라인 부재 |
| 완료 정보 아카이브 분리 | ⚠️ archive.md 존재하나 eviction 기준 불명확 |

### 현재 구조 고유 강점 (3개 모델 모두 미제안)

| 강점                                       | 가치                                         |
| ---------------------------------------- | ------------------------------------------ |
| SQL 기반 Task 이력 (orchestration.db)        | 50+ 기록 복합 쿼리 2초 이내. Markdown 제안은 이 규모에서 느림 |
| 실제 시맨틱 검색 (vecsearch + basic-memory MCP) | 제텔카스텐 전체 시맨틱 검색 실제 운영                      |
| 코드 문서화 파이프라인 (rpg-extract → 05.code)     | AST 자동 추출 → 지식 그래프 자동 반영                   |
| 포인터 기반 경량 설계                             | MEMORY.md 67줄. 실데이터는 DB/볼트에                |
| 조건부 규칙 자동 트리거 (.claude/rules/)           | path 기반 필요 시에만 컨텍스트 추가 → 토큰 절약             |
| 자기진화 이력                                  | 메모리 시스템 변화 추적으로 회귀 방지                      |

### 차이점 (개선 후보)

| 차이점 | 모델 제안 | 현재 | 격차 |
|--------|-----------|------|------|
| 컨텍스트 예산 | Opus 3,500토큰 / Sonnet 4KB | 줄 수 150줄 트리거 | 레이어별 토큰 할당 없음 |
| 프로젝트 상태 분리 | 독립 레이어/파일 | MEMORY.md 혼재 | 갱신 주기 다른 정보 혼합 |
| 검색 파이프라인 | 명시적 단계 정의 | 암묵적 DB-first | 도구 선택이 Claude 판단 의존 |
| 폐기 기준 | 수식/confidence 기반 | "재사용 극저" 주관 | 객관적 기준 부재 |
| 세션 시작 프로토콜 | 체크인 절차 명시 | 자동 로드만 | 초기 맥락 파악 속도 의존적 |

## 💡 실행 가능한 개선안

**P1 — 즉시 실행 가능:**
1. **세션 시작 체크인** — MEMORY.md에 pending Task 확인 + 최근 도메인 확인 절차 5줄 추가
2. **검색 파이프라인 명시** — Working CLAUDE.md에 검색 의사결정 트리 10줄 추가
3. **프로젝트 상태 분리** — MEMORY.md의 도메인 포인터를 `memory/projects.md`로 분리

**P2 — 중기 설계 변경:**
- 컨텍스트 예산 명시 (toktrack 연동)
- 폐기 기준 정량화 (30일+미참조, 관련 Task 0건)
- 트러블슈팅 메타데이터 추가 (발생일, 재발 횟수)

**P3 — 장기 검토:**
- Task Dependency Graph JSON (현재 병렬 작업 적어 필요성 낮음)
- confidence 레벨 관리 (태깅 비용 대비 효과 불확실)

## 🔗 관련 개념

- [[REF-071 ALMA - Automated Meta-Learning of Memory Designs for Agentic Systems]] - (이 실험의 이론적 토대, general_update/general_retrieve 인터페이스 참고)
- [[컨텍스트 엔지니어링 (Context Engineering)]] - (메모리 시스템이 곧 컨텍스트 설계이며, 검색 파이프라인이 핵심)
- [[메모리 시스템 (Memory Systems)]] - (에이전트 메모리의 상위 허브, 이 실험이 검증한 패턴들의 분류 체계)
- [[포인터 기반 메모리 설계 (Pointer-Based Memory Design)]] - (현재 구조의 핵심 원칙, 3개 모델과 차별화되는 경량 설계 방식)

---

**작성일**: 2026-03-05
**분류**: Memory System / Agent Design / Experiment
**산출물 경로**: `outputs/memory-blind-test/`