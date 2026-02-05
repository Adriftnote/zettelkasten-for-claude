---
title: Multi-Agent Patterns
type: note
permalink: knowledge/concepts/multi-agent-patterns
tags:
- multi-agent
- architecture
- pattern
- orchestration
---

# Multi-Agent Patterns

## 📖 개요

복잡한 작업을 여러 에이전트가 협력하여 처리하는 아키텍처 패턴들입니다. 단일 에이전트의 컨텍스트 한계를 극복하고, 병렬화와 전문화를 통해 성능을 향상시킵니다.

## 🎭 비유

회사 조직 구조와 같습니다. CEO 혼자 모든 일을 할 수 없으니, 부서를 나누고 팀장을 두어 업무를 분담합니다. 조직 구조에 따라 수직적(Hierarchical), 수평적(Peer-to-Peer), 중앙집중적(Supervisor) 형태가 있습니다.

## ✨ 특징

- **Context 병목 해결**: 단일 에이전트의 토큰 한계 극복
- **병렬 처리**: 독립 작업 동시 실행으로 속도 향상
- **전문화**: 도메인별 최적화된 에이전트 구성
- **토큰 비용 증가**: 단일 대비 ~15× 토큰 사용 (트레이드오프)

## 💡 예시

### 패턴 1: Supervisor/Orchestrator

```
User → Supervisor → [Worker A, Worker B, Worker C] → Aggregation → Output
```

**특징**:
- 중앙 조율자가 작업 분배 및 결과 통합
- 명확한 분해가 있는 복잡한 작업에 적합
- 주의: "전화 게임" 문제 - supervisor가 응답 왜곡 가능
- 해결: `forward_message` 도구로 직접 전달

**적용 사례**: 코드 리뷰 시스템, 문서 분석 파이프라인

### 패턴 2: Peer-to-Peer (Swarm)

```python
def transfer_to_agent_b():
    return agent_b  # 핸드오프

# 에이전트 간 직접 통신
agent_a → agent_b → agent_c
```

**특징**:
- 단일 실패점 없음
- 유연한 탐색, 창발적 요구사항에 적합
- 조정 복잡도 증가 (단점)

**적용 사례**: 탐색적 연구, 브레인스토밍

### 패턴 3: Hierarchical

```
Strategy Layer (장기 목표)
    ↓
Planning Layer (단계별 계획)
    ↓
Execution Layer (실제 작업 수행)
```

**특징**:
- 대규모 프로젝트, 기업 워크플로우에 적합
- 각 레이어가 추상화 수준 담당
- 복잡도 높음

**적용 사례**: 대규모 코드베이스 리팩토링, 기업 자동화

## 🛠️ 패턴 선택 기준

```
작업 유형                    권장 패턴
─────────────────────────────────────
명확한 분해 가능            Supervisor
탐색적/창발적               Peer-to-Peer
대규모/장기 프로젝트        Hierarchical
단순 작업                   단일 에이전트
```

### 토큰 경제학

| 아키텍처 | 토큰 배수 | 용도 |
|----------|----------|------|
| 단일 에이전트 | 1× | 단순 쿼리 |
| 단일 + 도구 | ~4× | 도구 사용 작업 |
| 멀티에이전트 | ~15× | 복잡한 연구/조정 |

> 💡 모델 업그레이드가 토큰 2배보다 더 큰 성능 향상 제공하는 경우 많음

## Relations

- requires [[context-isolation]] - 멀티에이전트의 핵심 목적
- relates_to [[tool-hub-philosophy]] - 도구 관리 전략과 연계
- relates_to [[progressive-disclosure]] - 정보 공개 전략