---
title: Task-Level Granularity (Emergent Mind)
type: doc-summary
permalink: sources/reference/task-level-granularity
tags:
- granularity
- task-decomposition
- AI
- LLM
- parallel-computing
---

# Task-Level Granularity (Emergent Mind)

작업 수준 granularity의 학술적 정의와 AI/LLM 응용을 정리합니다.

## 📖 핵심 정의

> "Task-level granularity denotes the explicit degree of detail or abstraction at which computational, linguistic, or perceptual tasks are defined, executed, or evaluated within a system."

작업이 정의, 실행, 평가되는 **세부 수준 또는 추상화 정도**

**적용 분야**: AI, ML, 분산 시스템, 알고리즘, 컴퓨터 비전, HCI

## 🛠️ 유형

| 유형 | 특성 |
|------|------|
| **Coarse Granularity** | 적은 수의 큰 작업, 오버헤드 ↓, 병렬 제한 |
| **Fine Granularity** | 많은 수의 작은 작업, 병렬성 ↑, 오버헤드 ↑ |

## 📊 핵심 Trade-off

### METG (Minimum Effective Task Granularity)

> **최소 효과적 작업 입도**: 현대 시스템에서 약 100μs 이상 권장

이보다 작으면 스케줄링 오버헤드가 실행 시간을 초과

## 🔧 AI/LLM 관련 응용

| 응용 | 설명 |
|------|------|
| **다중 입도 학습** | 다양한 granularity 수준에서 학습 → 일반화 능력 증가 |
| **설명성 강화** | CoT 추론에서 다중 수준 안내 → 할루시네이션 감소 |
| **RAG** | 문장/명제 수준의 세밀한 검색 |

## 💡 Agent Task 분해 시사점

| 개념 | Agent 적용 |
|------|-----------|
| METG | 20k 토큰 오버헤드 대비 의미 있는 작업 크기 |
| Coarse/Fine trade-off | Level 1 (의도 보존) / Level 2 (실행 가능) |
| 다중 입도 | 계층적 분해 (전체 → 단계 → 세부 작업) |

## 🔗 관련 개념

- [[Task 분해 통합 프레임워크]]
- [[Task 분해와 AI Attention의 관계]]

## 📎 리소스

- 원본: https://www.emergentmind.com/topics/task-level-granularity

---

**작성일**: 2026-02-02
**분류**: Article / AI Research / Granularity