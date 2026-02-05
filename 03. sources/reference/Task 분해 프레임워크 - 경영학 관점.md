---
title: Task 분해 프레임워크 - 경영학 관점
type: doc-summary
permalink: sources/reference/task-decomposition-management
tags:
- task-decomposition
- organizational-theory
- management
- simon
- thompson
---

# Task 분해 프레임워크 - 경영학 관점

AI Agent 오케스트레이션에 적용 가능한 경영학/조직론 연구를 정리합니다.

## 📖 핵심 아이디어

Thompson의 상호의존성 유형과 Simon의 Near-Decomposability 이론을 AI Agent에 적용합니다.

## 🛠️ Thompson의 상호의존성 유형 (1967)

| 유형 | 특성 | 조정 방법 | Agent 패턴 |
|------|------|----------|-----------|
| **Pooled** | 독립 작업, 결과만 합침 | Standardization | 병렬 subagent |
| **Sequential** | A출력→B입력 | Planning | 순차 실행 |
| **Reciprocal** | A↔B 양방향 의존 | Mutual Adjustment | **분리 안 함** |

> **핵심**: Reciprocal 의존성이 있으면 분리하지 마라

## 🔧 Simon의 Near-Decomposability (1962)

### 시계공 비유
- **Tempus**: 1000개 부품 한 번에 → 중단 시 처음부터 → 망함
- **Hora**: 10개씩 모듈화 → 중단돼도 부분만 손실 → 번창

> **"안정적인 중간 형태(stable intermediate forms)"가 있으면 복잡한 시스템이 훨씬 빠르게 구축된다**

### 금고 열기 예시
- 모든 조합 시도: 100^10 = 10^20
- 각 다이얼 검증: 100×10 = 1,000

> **중간 검증점이 탐색 공간을 기하급수적으로 줄임**

## 📊 병렬 vs 순차 판단

| 병렬 조건 | 순차 조건 |
|----------|----------|
| 입력이 독립적으로 분할 가능 | 이전 출력이 다음 입력에 영향 |
| 출력 merge가 단순 | 출력 간 충돌/모순 조정 필요 |
| latency 감소가 중요 | 일관된 톤/스타일 유지 필요 |

## 💡 실용 원칙

1. **"기본 단위"는 맥락에 따라 달라짐** - 절대적 기준 없음
2. **모듈 간 상호작용은 "요약된 형태"로** - 세부사항 전달 불필요
3. **중간 검증점이 효율을 극적으로 향상**

## 🔗 관련 개념

- [[Task 분해 방법론 리서치]] - Claude Code 기반 방법론
- [[Task 분해 통합 프레임워크]] - AI + 경영학 통합

---

**작성일**: 2026-01-30
**분류**: Research / Organizational Theory / Task Decomposition