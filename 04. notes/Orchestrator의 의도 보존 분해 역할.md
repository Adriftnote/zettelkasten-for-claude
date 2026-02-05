---
title: Orchestrator의 의도 보존 분해 역할
type: note
permalink: notes/orchestrator-intent-preserving-decomposition
tags:
- orchestrator
- task-decomposition
- derived
- system-improvement
- granularity
---

# Orchestrator의 의도 보존 분해 역할

Orchestrator는 사용자 요청을 패스스루하지 않고, Level 1에서 **의도를 보존하며 분해**해야 한다.

## 도출 근거

다음 facts의 조합에서 도출됨:

1. **Granularity Trade-off** - 추상적이면 의도는 보존되지만 실행이 모호하고, 구체적이면 실행은 명확하지만 의도가 사라진다
2. **계층적 분해** - Level 1(Coarse, 의도 보존) + Level 2(Fine, 실행 가능)로 해결
3. **현재 문제** - Orchestrator가 패스스루만 하여 역할이 "붕 뜸", Worker가 Level 1+2 모두 담당하여 부담 과중

→ 따라서: **Orchestrator가 Level 1 분해를 담당하여 의도를 보존하고, Worker는 Level 2 분해에 집중**해야 한다.

## 개선 구조

```
[Level 0] 사용자
"SNS 정합성 검증 시스템 구축해줘"
          ↓
[Level 1] Orchestrator ← 의도 보존 분해
├─ task-001: "데이터 현황 파악" → worker-research
├─ task-002: "검증 기준 정의" → worker-research
└─ task-003: "자동화 구현" → worker-automation
          ↓
[Level 2] Worker Main ← 실행 가능 분해
          ↓
[Level 3] Subagent ← 실제 실행
```

## Observations

- [method] 분해 후 검증: "이 subtask들의 제목만 보고 원래 요청이 뭐였는지 알 수 있나?" #validation
- [pattern] what/how/do 패턴: 무엇을 파악 → 어떻게 할지 정의 → 실제 구현 #decomposition-pattern
- [decision] Orchestrator는 Level 1, Worker Main은 Level 2 담당으로 역할 분리 #architecture

## Relations

- derived_from [[Task 분해 Hub]] (Granularity Trade-off, 계층적 분해 원칙에서 도출)
- derived_from [[Task 분해와 AI Attention의 관계]] (Attention 배분 관점)
- mitigates [[Orchestrator 역할 불명확]] (문제 해결)
- part_of [[Task 분해 Hub]] (적용 사례)

---

**도출일**: 2026-02-02
**출처**: Task 분해 프레임워크 + 현재 시스템 분석