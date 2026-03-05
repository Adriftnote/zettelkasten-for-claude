---
title: REF-073 Agent Memory Retrieve Gap Analysis - ALMA × Blind Test × Usage Report
type: guide
permalink: sources/reference/agent-memory-retrieve-gap-analysis
tags:
- agent-memory
- retrieve-pipeline
- meta-learning
- context-engineering
date: 2026-03-05
---

# 에이전트 메모리 Retrieve Gap 분석 — ALMA × 블라인드 테스트 × Usage Report

ALMA 논문(REF-071)의 5-Layer 메모리 구조를 현재 Claude Code 시스템에 매핑하고, 블라인드 테스트(REF-072)와 Usage Report 데이터로 교차 검증한 결과, **retrieve(호출) 파이프라인의 구조적 부재**가 핵심 갭으로 확인됨.

## 📖 핵심 아이디어

현재 시스템은 데이터 저장(update)은 충분히 갖추고 있으나, 상황에 맞게 기존 지식을 선제적으로 꺼내오는(retrieve) 메커니즘이 없다. 세 가지 독립적 분석 소스가 동일한 결론을 가리킴:

1. **ALMA 5-Layer 매핑** — StrategyLibrary와 RiskAndInteraction 레이어에 대응하는 능동적 검색 시스템 부재
2. **블라인드 테스트(REF-072)** — 3개 모델 합의: "다단계 검색 파이프라인 부재", "검색이 Claude 판단에 의존"
3. **Usage Report** — Wrong Approach 31건, 동일 실수 반복 = 과거 경험이 새 세션에 전달되지 않음

## 🛠️ ALMA 5-Layer 매핑 결과

### 대응 관계

| ALMA (MiniHack) | 우리 시스템 | 대응도 |
|------------------|------------|:------:|
| **TaskSchemaLayer** — 입력을 구조화된 스키마로 파싱 | orchestration.db (태스크 구조화) | ✅ |
| **StrategyLibrary** — 전략/계획을 DB에서 검색·요약 | MEMORY.md 패턴 섹션 (정적 텍스트) | ⚠️ |
| **SpatialPrior** — 엔티티 관계 지식 그래프 (NetworkX) | basic-memory 지식 그래프 | ✅ |
| **RiskAndInteraction** — 위험 관리 휴리스틱 (Chroma) | 트러블슈팅 섹션 + workcase | ⚠️ |
| **ReflexRules** — 즉각적 무상태 조언 | .claude/rules/ (조건부 트리거) | ✅ |

### 차이 분석

**StrategyLibrary 매핑이 약한 이유**: ALMA의 StrategyLibrary는 DB에서 과거 전략을 능동적으로 검색·요약·합성하는 시스템. 우리 MEMORY.md는 정적 텍스트로 패턴을 나열할 뿐 검색·합성 기능이 없음. 실제 대응하려면 orchestration.db의 과거 태스크를 전략적으로 쿼리하는 절차가 필요하나, 이 절차가 명시되어 있지 않음.

**RiskAndInteraction 매핑이 약한 이유**: ALMA는 Chroma 벡터DB 기반으로 새 상황에서 과거 위험 사례를 자동 매칭. 우리는 workcase에 기록은 하지만, 새 상황에서 자동 매칭되지 않음. 블라인드 테스트에서 "트러블슈팅 구조화 미흡", "메타데이터(발생일, 재발 횟수) 부재" 지적과 일치.

## 🔧 Usage Report 교차 검증

### 도구 사용 패턴 (167 sessions, 3,226 messages)

| 도구 | 호출 수 | 성격 |
|------|---------|------|
| Bash | 2,441 | 실행/저장 |
| Read | 1,113 | 파일 읽기 |
| Edit | 655 | 파일 수정 |
| Glob | 349 | 파일 찾기 (이름 기반) |
| WebFetch | 212 | 외부 정보 |
| Write | 181 | 파일 저장 |

**관찰**: 저장(Write/Edit 836건)은 활발하나, 기존 지식의 시맨틱 검색을 통한 능동적 retrieve는 도구 사용 패턴에서 거의 보이지 않음.

### 마찰 유형과 retrieve 부재의 관계

| 마찰 유형                 | 건수  | retrieve 부재와의 관계                     |
| --------------------- | --- | ------------------------------------ |
| Wrong Approach        | 31  | 과거에 "이 도구를 쓰라"고 한 경험이 새 세션에서 검색되지 않음 |
| Misunderstood Request | 24  | 사용자의 과거 선호/패턴이 선제적으로 로드되지 않음         |
| Buggy Code            | 12  | 과거 트러블슈팅 경험이 자동 매칭되지 않아 같은 실수 반복     |

### Report의 처방 vs 실제 필요

| Report 처방                 | 접근 방식          | 한계                |
| ------------------------- | -------------- | ----------------- |
| CLAUDE.md에 규칙 추가          | ReflexRules 강화 | Claude 판단 의존은 여전  |
| 프롬프트에 제약 조건 선행 명시         | 사용자 부담 전가      | 매번 사용자가 조건을 붙여야 함 |
| 자율 파이프라인 (On the Horizon) | 장기 비전          | 구체적 설계 없음         |

**Report의 한계**: 증상(Wrong Approach 31건)은 정확히 포착했으나, 처방이 "규칙 추가"에 머묾. StrategyLibrary + RiskAndInteraction 레이어가 통째로 빠진 **구조적 문제**를 ReflexRules 강화로만 접근.

## 💡 종합 진단 및 개선 방향

### 현재 상태 요약

```
저장(update):   ✅ 충분 — DB, vault, workcase, rules 모두 갖춤
호출(retrieve): ⚠️ 부재 — 데이터는 있으나 "언제, 어디서, 뭘 꺼낼지" 결정 시스템 없음
```

부품(orchestration.db, vecsearch, basic-memory, workcase)은 다 있으나 **배선(검색 의사결정 트리)**이 없는 상태.

### 필요한 검색 파이프라인 설계

```
새 태스크 진입 시:
  ├─ 1단계: orchestration.db → 같은 도메인 최근 태스크?
  │         있으면 → output_summary 로드
  │
  ├─ 2단계: workcase/ → 관련 트러블슈팅 경험?
  │         있으면 → 실패 패턴 선제 회피
  │
  ├─ 3단계: vecsearch → 관련 컨셉/레퍼런스 노트?
  │         있으면 → 컨텍스트에 추가
  │
  └─ 4단계: 없으면 → 새로 시작
```

### 구현 옵션

| 방식 | 장점 | 단점 |
|------|------|------|
| rules/에 검색 규칙 추가 | 가장 빠름, 비용 없음 | Claude 판단 의존 여전 |
| Hook으로 세션 시작 시 자동 실행 | 무조건 실행, 누락 없음 | 스크립트 개발 필요 |
| ALMA 방식 메타학습 | 최적 구조를 AI가 발견 | 실험 환경 구축 필요 |

### ALMA 적용 가능성

ALMA의 핵심 인터페이스(`general_update`, `general_retrieve`)를 Claude Code 맥락에 적용하면:
- `general_update(experience)` — 세션 종료 시 태스크 결과를 구조화하여 저장 (이미 일부 작동)
- `general_retrieve(query)` — 세션 시작 시 관련 지식을 자동 로드 (**이 부분이 빠짐**)

Claude Code가 retrieve 함수의 구현을 직접 설계·테스트·반복하는 ALMA 루프를 돌릴 수 있으며, 평가 기준은 "Wrong Approach 감소율"로 측정 가능.

## 🔗 관련 개념

- [[REF-071 ALMA - Automated Meta-Learning of Memory Designs for Agentic Systems]] - (5-Layer 메모리 구조의 원본, 매핑 분석의 기준 프레임워크)
- [[REF-072 Memory System Blind Test - Multi-Persona Verification]] - (3개 모델 독립 검증, 검색 파이프라인 부재 합의 도출)
- [[컨텍스트 엔지니어링 (Context Engineering)]] - (retrieve 파이프라인은 곧 컨텍스트 엔지니어링의 핵심 구현)
- [[포인터 기반 메모리 설계 (Pointer-Based Memory Design)]] - (현재 구조의 강점, retrieve 파이프라인 추가 시에도 경량 원칙 유지 필요)
- [[A-Mem - LLM 에이전트를 위한 자율 메모리 시스템 (Agentic Memory)]] - (자율 메모리의 retrieve 전략 참고)
- [[MemSkill - 자기진화 메모리 스킬]] - (PPO 기반 retrieve 최적화 접근, ALMA와 비교 대상)

---

**작성일**: 2026-03-05
**분류**: Agent Memory / Retrieve Pipeline / Gap Analysis
**분석 소스**: REF-071 (ALMA 논문), REF-072 (블라인드 테스트), Usage Report (167 sessions)
