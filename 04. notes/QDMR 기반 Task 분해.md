---
title: QDMR 기반 Task 분해
type: note
permalink: notes/qdmr-task-decomposition
tags:
- task-management
- decomposition
- dependency-modeling
- agent-orchestration
- derived
source_facts:
- Dep-Search 논문의 QDMR (Question Decomposition Meaning Representation)
- 기존 Orchestrator Task 분해 시스템 (blockedBy 방식)
---

# QDMR 기반 Task 분해

Task 분해 시 sub-task의 intent 안에 선행 task를 `#N`으로 명시 참조하여, 의존 관계와 사용 방식을 동시에 표현해야 한다.

## 도출 근거

다음 facts의 조합에서 도출됨:

1. **QDMR은 Sequential 분해의 일반형이다** - Sequential은 DAG가 선형 체인으로 퇴화한 특수 케이스 (path graph ⊂ DAG). QDMR은 `#N` 참조로 임의의 의존성을 표현하며, 표현력이 높을수록 실제 구조를 더 정확히 반영한다 (Dep-Search 논문 ablation: QDMR 제거 시 -3.32점).

2. **기존 blockedBy는 "무엇에" 의존하는지만 표현한다** - `blockedBy: [a, b]`는 실행 순서만 제약할 뿐, 선행 task의 산출물이 후속 task에서 어떻게 사용되는지 알 수 없다. 나중에 task 흐름만으로 맥락을 복원하기 어렵다.

→ 따라서: **intent 안에 `#N`의 산출물이 어떻게 사용되는지를 자연어로 녹여 쓰면, blockedBy의 "무엇에" + QDMR의 "어떻게"가 결합되어 task 흐름만으로 전체 맥락을 복원할 수 있다.**

## Observations

- [method] intent에 `#a의 스키마`, `#b의 체크리스트`처럼 선행 task 산출물을 명시 참조한다 #task-decomposition
- [fact] Sequential은 QDMR의 부분집합이다 (path graph ⊂ DAG) #graph-theory
- [fact] 의존성의 "어떻게"까지 표현하면 중개 제거 원칙과 자연스럽게 호환된다 #orchestration
- [example] 기존: `task-c: 검증 쿼리 작성, blockedBy: [a, b]` → QDMR: `#c: #a의 스키마 + #b의 체크리스트로 검증 쿼리 작성` #example
- [example] PDCA 태깅과 결합: `#d: [Check] #c의 쿼리로 #a의 데이터 검증 실행` #example
- [question] Orchestrator DB의 intent 필드에 `#N` 참조를 파싱하여 자동으로 blockedBy를 생성할 수 있는가? #future-work

## Relations

- derived_from [[Dep-Search- Dependency-Aware Reasoning with Persistent Memory]] (QDMR 개념 출처)
- mitigates [[Task 맥락 손실]] (task 흐름만으로 맥락 복원 가능)
- extends [[Task 분해 (Task Decomposition)]] (blockedBy에 "어떻게" 차원 추가)
- relates_to [[DAG (Directed Acyclic Graph)]] (의존성 구조)

---

**도출일**: 2026-02-09
**출처**: Dep-Search 논문의 QDMR + Orchestrator Task 시스템 blockedBy 방식 비교에서 도출