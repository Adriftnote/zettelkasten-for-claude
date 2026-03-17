---
title: REF-107 Claude Skills — 177개 프로덕션 스킬 컬렉션 (Multi-Agent 호환)
type: note
permalink: zettelkasten/03.-sources/reference/ref-107-claude-skills-177gae-peurodeogsyeon-seukil-keolregsyeon-multi-agent-hohwan
date: '2026-03-13'
tags:
- claude-code
- skills
- multi-agent
- community
- repository
---

# Claude Skills — 177개 프로덕션 스킬 컬렉션 (Multi-Agent 호환)

> alirezarezvani/claude-skills: 9개 도메인, 254개 Python CLI 도구, 10개 AI 코딩 에이전트 호환 스킬 라이브러리

## 📖 핵심 아이디어

Claude Code뿐 아니라 Codex, Gemini CLI, Cursor, Aider 등 10개 AI 코딩 에이전트에서 공통으로 사용할 수 있는 177개 프로덕션 스킬 라이브러리. 각 스킬은 SKILL.md + scripts/ + references/ 구조로 자기 완결적이며, 변환 스크립트 하나로 타 도구 포맷으로 전환 가능. 스킬(실행 방법) · 에이전트(태스크 오케스트레이션) · 페르소나(도메인 횡단 사고 패턴)를 구분하는 3-tier 설계가 특징.

## 🛠️ 구성 요소 / 주요 내용

| 도메인 | 스킬 수 | 내용 |
|--------|---------|------|
| engineering/ | 49 (24 core + 25 POWERFUL) | 아키텍처, 보안, 테스트, 인프라 |
| marketing-skill/ | 43 (7개 pod) | SEO, 콘텐츠, 소셜, 분석 |
| product-team/ | 12 | PM 워크플로우, 스프린트 관리 |
| c-level-advisor/ | 28 | CTO/CMO/CFO 자문 역할 |
| ra-qm-team/ | 12 | 규제/품질 관리 |
| agents/personas/ | 3 | Startup CTO, Growth Marketer, Solo Founder |
| orchestration/ | - | 멀티 에이전트 조율 프로토콜 |
| scripts/ | 254 Python CLI | stdlib-only, pip 의존성 없음 |

## 🔧 작동 방식 / 적용 방법

```
스킬 구조 (단위 폴더)
├── SKILL.md          # 프론트매터 + 구조화된 지시
├── scripts/          # Python CLI 도구 (stdlib-only)
├── references/       # 템플릿, 체크리스트, 도메인 지식
└── assets/           # 지원 자료
```

**설치/변환 흐름:**
- Claude Code: `/plugin install` 또는 직접 복사
- 타 도구: `./scripts/convert.sh --tool [codex|cursor|aider|...]`

**오케스트레이션 프로토콜:**
- 스킬 체인 (순차 실행)
- 페르소나 핸드오프 (도메인 전환)
- 멀티 에이전트 리뷰 (복합 워크플로우)

**보안:** 내장 스킬 스캐너가 설치 전 악성 코드 탐지

## 💡 실용적 평가 / 적용
**강점:**
- 스킬 하나당 자기 완결적 → 필요한 것만 선택 가능
- stdlib-only Python → 환경 의존성 제로
- 멀티 도구 호환 → 도구 전환 시 스킬 재작성 불필요
- 3-tier(스킬/에이전트/페르소나) 분리 → 조합 유연성

**한계:**
- 177개 중 실제 필요한 것은 소수 → 큐레이션 필요
- 우리 환경(SKILL.md 커스텀 구조, basic-memory 연동)과 직접 호환은 안 됨
- engineering POWERFUL-tier가 구체적으로 뭐가 다른지 문서만으론 불명확

### 우리 작업 기준 큐레이션 (177개 → 7개)

**직접 참고 (패턴/체크리스트 차용):**

| 순위 | 스킬 | 경로 | 우리 도메인 | 활용 방안 |
|------|------|------|------------|----------|
| 1 | agent-workflow-designer | `engineering/` | 스킬/에이전트 시스템 | 워크플로우 패턴 5종(Sequential/Parallel/Router/Orchestrator/Evaluator) → task-decomposition 스킬 보강 |
| 2 | playwright-pro | `engineering-team/` | SNS 데이터 수집 | 55개 테스트 템플릿 + flaky test 디버거 → collect-posts.js 안정화 |
| 3 | agent-designer | `engineering/` | 스킬/에이전트 시스템 | 에이전트 패턴 5종 + 역할 정의 템플릿 → 오케스트레이터 설계 |
| 4 | ORCHESTRATION.md | `orchestration/` | 스킬/에이전트 시스템 | Skill Chain 패턴 = 우리 worker-dispatch 스킬 연쇄와 동일 개념 |

**아이디어 참고:**

| 스킬 | 경로 | 활용 시점 |
|------|------|----------|
| codebase-onboarding | `engineering/` | 새 프로젝트 진입 시 rpg-extract 보완재 |
| rag-architect | `engineering/` | vecsearch + basic-memory 검색 파이프라인 개선 시 |
| skill-security-auditor | `engineering/` | 스킬 수 늘어날 때 보안 감사 체크리스트 |

**관련 없음 (skip):** marketing(43), c-level(28), ra-qm(12), finance — 우리 도메인과 교차점 없음


## 🔗 관련 개념

- [[Claude Code Overview - 공식 문서]] - (스킬 시스템의 공식 기반 — 이 레포는 커뮤니티 확장)
- [[REF-095 LangChain Skills — Claude Code 통과율 25%에서 95%로 개선한 방법]] - (동일하게 Claude Code 스킬 컬렉션이나 LangChain 특화 vs 범용)
- [[REF-097 PM Skills — 65개 PM 스킬과 36개 체인 워크플로우 Claude Code 플러그인]] - (PM 도메인 특화 스킬 vs 9개 도메인 범용)
- [[REF-090 SkillNet - Create, Evaluate, and Connect AI Skills]] - (스킬 생성·평가·연결 프레임워크 — 이 레포는 실물 스킬 컬렉션)
- [[Skill Architecture Restructuring- Commands to Skills Migration]] - (우리 스킬 구조 설계 경험 — 이 레포의 SKILL.md 패턴과 비교 가능)

---

**작성일**: 2026-03-13
**분류**: AI Agent, Claude Code, Skills
**출처**: https://github.com/alirezarezvani/claude-skills