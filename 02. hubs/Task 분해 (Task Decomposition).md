---
title: Task 분해 Hub
type: hub
permalink: hubs/task-decomposition
tags:
- hub
- task-decomposition
- attention
- organizational-theory
- dependency-modeling
- framework
---

# Task 분해 Hub

AI Agent와 조직론 관점에서 Task 분해에 관한 지식을 조직화합니다.

## Observations

- [fact] Task 분해는 "정보 처리 단위의 적정 크기"를 찾는 문제 #core-principle
- [fact] AI 관점에서는 Attention 효율의 최적점, 조직론에서는 조정 비용 vs 실행 비용의 균형점 #convergence
- [decision] Reciprocal 의존성이 있으면 분리하지 않는다 (Thompson) #decision-rule
- [decision] 안정적 중간 형태가 정의 가능하면 분리한다 (Simon) #decision-rule
- [method] Level 1은 의도 보존 (Orchestrator), Level 2는 실행 가능 (Subagent) #hierarchy
- [fact] 최소: 20k 오버헤드 대비 의미 있는 크기, 최대: 컨텍스트 80% 이하 #sizing
- [fact] 의존성 표현의 명시성이 높을수록 분해 품질이 향상된다 (QDMR > Two-step > Sequential) #dependency

## Relations

### 핵심 개념
- organizes [[Task 분해와 AI Attention의 관계]] (1. AI 관점 - Attention 메커니즘과의 연결)

### 이론적 배경 (Reference)
- organizes [[Task 분해 방법론 리서치]] (2. Claude Code 공식 방법론)
- organizes [[Task 분해 프레임워크 - 경영학 관점]] (3. Thompson/Simon 조직론)
  - extends [[Granularity in Project Management (Meegle)]] (3a. PM 관점 granularity)
  - extends [[Granularity, Abstraction & Coherence (Cynefin)]] (3b. 복잡계 관점)
  - extends [[Task-Level Granularity (Emergent Mind)]] (3c. AI/학술 정의)
- organizes [[Dep-Search- Dependency-Aware Reasoning with Persistent Memory]] (4. QDMR + Persistent Memory 논문)

### 의존성 모델링
- organizes [[DAG (Directed Acyclic Graph)]] (5. 구조적 기반 - 의존성을 표현하는 그래프)
- organizes [[QDMR (Question Decomposition Meaning Representation)]] (6. 의존성 표현 형식 - #N 참조로 DAG 생성)
  - specializes [[Sequential Decomposition (순차 분해)]] (6a. QDMR의 특수 케이스 - 선형 체인)

### 패턴
- organizes [[Pipeline Pattern]] (7. 순차적 의존성 - Sequential)
- organizes [[Parallel Specialists Pattern]] (8. 병렬 전문가 - Pooled)
- organizes [[Swarm Pattern]] (9. 자율 조직 - 동일 유형 반복)

### 적용
- connects_to [[AI 에이전트 지식 전달 패턴]] (관련 - AGENTS.md vs Skills)
- connects_to [[QDMR 기반 Task 분해]] (관련 - QDMR을 Orchestrator Task 분해에 적용)

---

**생성일**: 2026-02-05
**최종 수정**: 2026-02-09
**버전**: 1.1 - 의존성 모델링 섹션 추가 (QDMR, DAG, Sequential Decomposition)
