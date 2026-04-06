---
title: REF-132 cq — Stack Overflow for Agents (Mozilla.ai)
type: guide
permalink: sources/reference/cq-stack-overflow-for-agents
tags:
- agent-knowledge-sharing
- collective-intelligence
- mozilla
date: 2026-03-23
---

# cq — Stack Overflow for Agents

Mozilla.ai가 발표한 에이전트 간 지식 공유 플랫폼. Stack Overflow가 개발자에게 했던 역할을 AI 에이전트에게 제공한다.

## 📖 핵심 아이디어

Stack Overflow는 2014년 월 20만 질문 피크 → 2025년 12월 3,862건으로 급감. 개발자들이 LLM에 의존하면서 공유 지식 플랫폼이 쇠퇴했지만, 에이전트들은 동일한 문제를 반복적으로 격리 상태에서 해결하고 있다. 학습 데이터가 stale하기 때문. cq는 에이전트가 풀어본 문제의 해결책을 공유 저장소에 축적하고, 다른 에이전트가 재활용하는 구조를 제안한다.

## 🛠️ 구성 요소 / 주요 내용

| 항목 | 설명 |
|------|------|
| Knowledge Commons | 에이전트가 공유하는 해결책 저장소 |
| Query-before-solve | 작업 전 기존 해결책 조회 → 중복 방지 |
| Contribute-back | 새 해결책 발견 시 저장소에 기여 |
| Cross-agent validation | 다른 에이전트가 실제 사용하며 정확성 검증 |
| Trust by utility | 권위가 아닌 실제 유용성 기반 신뢰 축적 |

## 🔧 작동 방식 / 적용 방법

```
Agent가 문제 발생
  → cq Knowledge Commons 조회
  → 기존 해결책 있으면 적용
  → 없으면 자체 해결 후 기여
  → 다른 에이전트가 사용하며 검증 → 신뢰도 상승
```

**실제 예시**: Stripe API에서 rate-limit 시 200 + error body를 반환하는 비직관적 동작. 한 에이전트가 발견 → cq에 기록 → 다른 에이전트는 디버깅 없이 즉시 대응.

**현재 구현체 (PoC)**:
- Claude Code, OpenCode 플러그인
- MCP 서버 (로컬 지식 관리)
- Team API (조직 내 지식 공유)
- Human-in-the-loop 리뷰 인터페이스
- 컨테이너 배포 옵션

## 💡 실용적 평가 / 적용

**핵심 통계**: 개발자 84%가 AI 도구 사용 중이지만 46%는 출력 정확성을 신뢰하지 않음. 다수 에이전트 + 다수 코드베이스에서 검증된 지식은 단일 모델 예측보다 신뢰도 높음.

**강점**:
- 에이전트 간 중복 작업 제거 → 컴퓨팅 자원 절감
- "earned trust" 모델 — 정적 지침이 아닌 실사용 기반 신뢰
- MCP 서버 + 플러그인으로 기존 에이전트 워크플로우에 통합 가능

**한계/고려사항**:
- PoC 단계 — 대규모 적용 시 지식 품질 관리 미검증
- 에이전트 간 지식 충돌 해결 메커니즘 불명확
- 조직 간 지식 공유 시 보안/IP 이슈

**우리 맥락**: ryu-memory의 retain → reflect 파이프라인과 유사한 철학. 차이점은 cq가 multi-agent 간 공유를 다루는 반면, ryu-memory는 단일 에이전트의 시간 축적 학습에 집중.

## 🔗 관련 개념

- [[REF-090 SkillNet - Create, Evaluate, and Connect AI Skills]] - (에이전트 간 스킬 공유 플랫폼 — cq의 지식 공유와 유사하나 SkillNet은 실행 가능한 스킬 단위)
- [[REF-129 Memento-Skills — Let Agents Design Agents (Skill 기반 자기진화)]] - (에이전트가 스스로 스킬을 설계하는 자기진화 — cq의 collective learning과 대비되는 individual learning)
- [[REF-120 Why AI Systems Don't Learn — 인지과학 기반 자율 학습 아키텍처 (System A-B-M)]] - (에이전트 학습 불가 문제 진단 — cq가 제안하는 해결 방향의 배경)

---

**작성일**: 2026-04-02
**분류**: Agent Infrastructure
**출처**: https://blog.mozilla.ai/cq-stack-overflow-for-agents/