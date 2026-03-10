---
title: REF-088 Codified Context - Infrastructure for AI Agents in a Complex Codebase
type: paper-review
permalink: sources/reference/codified-context-infrastructure-ai-agents
tags:
- context-engineering
- multi-agent
- AI-assisted-development
- knowledge-infrastructure
date: 2026-03-09
---

# Codified Context: Infrastructure for AI Agents in a Complex Codebase

108,000줄 C# 분산 시스템 개발 중 구축한 3계층 코드화 컨텍스트 인프라 — hot memory(constitution) + 19 전문 에이전트 + cold memory(34개 사양 문서)로 AI 에이전트의 세션 간 지식 지속성 문제를 해결.

## 📖 핵심 아이디어

LLM 기반 코딩 에이전트는 세션 간 persistent memory가 없어 매번 같은 실수를 반복한다. 이 논문은 프로젝트 지식을 **3계층으로 코드화**하여 에이전트가 자동으로 관련 지식을 로딩하는 인프라를 제안한다. 283개 개발 세션, 2,801개 인간 프롬프트, 1,197회 에이전트 호출에 걸친 실증 데이터를 제공한다.

## 🛠️ 구성 요소

| 계층 | 이름 | 규모 | 설명 |
|------|------|------|------|
| Tier 1 (Hot) | Project Constitution | ~660줄 (0.6%) | 매 세션 자동 로딩. 코드 품질, 네이밍, 아키텍처 패턴, 오케스트레이션 프로토콜 |
| Tier 2 (Warm) | 19 Specialized Agents | ~9,300줄 (8.6%) | 도메인 전문가 페르소나. 50%+ 프로젝트 고유 지식 포함 |
| Tier 3 (Cold) | 34 Knowledge Base Docs | ~16,250줄 (15.0%) | MCP 서버로 5개 검색 도구 제공. 서브시스템 상세 사양 |

**Knowledge-to-Code Ratio**: 24.2% (인프라 코드 / 전체 코드)

## 🔧 작동 방식

```
[세션 시작]
    ↓ 자동 로딩
[Tier 1: Constitution] ← 모든 세션에 항상 포함
    ↓ Trigger Table 매칭
[Tier 2: Agent 선택] ← 키워드/도메인 기반 자동 라우팅
    ↓ MCP 검색
[Tier 3: Knowledge Base] ← 필요 시 온디맨드 검색 (1,478회 호출/218세션)
```

**핵심 메커니즘**: Trigger Table로 자동 라우팅 — "인간 기억에 의존하면 스케일 안 됨"

## 📊 실증 데이터

| 메트릭 | 값 |
|--------|-----|
| 개발 기간 | 70일 (파트타임) |
| 총 세션 | 283 |
| 인간 프롬프트 | 2,801 (평균 9.9/세션) |
| 에이전트 호출 | 1,197 (57%가 프로젝트 전문가) |
| 자율 에이전트 턴 | 16,522 (프롬프트당 평균 6턴) |
| 유지비용 | 주 1-2시간 |

**최다 호출 에이전트**: code-reviewer(154회), network-protocol-designer(85회)

## 💡 실용적 평가

**Case Study 하이라이트**:
- Save System: 283줄 사양 문서 → 이후 5개 기능이 4주간 save 버그 0
- UI Sync: 126줄 패턴 문서 → 다음 UI 기능이 첫 시도에 올바른 패턴 적용
- Drop System: 검색 결과 없음(null) → 리팩터 전 문서화 트리거 → 오류 예방
- Deterministic RNG: 915줄 에이전트(65% 도메인 지식) → 5번 컨텍스트 소진 후 3개 이슈 식별

**주요 실패 모드**: Specification Staleness — 구현 변경 시 사양 미업데이트로 인한 silent failure

**실천 가이드라인**:
- Constitution은 일찍 시작 (최소한의 파일도 에러 한 클래스를 통째로 예방)
- 두 번 설명했으면 문서화
- 세션이 길어지면 에이전트 새로 만들고 재시작
- Spec을 load-bearing으로 취급 — 에이전트는 문서를 절대적으로 신뢰

**한계**: 단일 개발자/단일 프로젝트 관찰 연구, 통제 실험 아님. 실시간 분산 시뮬레이션 도메인 특성상 문서화 요구량이 높음.

## 🔗 관련 개념

- [[컨텍스트 엔지니어링 (Context Engineering)]] - (이 논문이 제안하는 3계층 구조가 컨텍스트 엔지니어링의 구체적 실천 사례)
- [[Multi-Agent Patterns]] - (19개 전문 에이전트 + trigger table 라우팅이 멀티에이전트 오케스트레이션 패턴)
- [[AI 에이전트 지식 전달 패턴]] - (hot/warm/cold memory 분류가 지식 전달 패턴의 실증적 구현)
- [[메모리 시스템 (Memory Systems)]] - (세션 간 persistent memory 부재 문제를 인프라로 해결)

---

**작성일**: 2026-03-09
**분류**: AI-Assisted Development / Context Engineering
**원문**: arXiv 2602.20478v1
**코드**: https://github.com/arisvas4/codified-context-infrastructure