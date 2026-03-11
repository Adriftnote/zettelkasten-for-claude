---
title: REF-095 LangChain Skills — Claude Code 통과율 25%에서 95%로 개선한 방법
type: guide
permalink: sources/reference/langchain-skills-claude-code-performance
tags:
- LangChain
- Claude-Code
- coding-agent
- skills
- LangSmith
- agent-evaluation
date: 2026-03-10
---

# LangChain Skills — Claude Code 통과율 25%에서 95%로 개선한 방법

LangChain이 코딩 에이전트용 스킬을 공개하여 Claude Code의 LangChain 관련 작업 통과율을 25%→95%로, LangSmith 작업은 17%→92%로 끌어올림.

## 📖 핵심 아이디어

스킬(Skills)은 코딩 에이전트의 성능을 높이기 위한 큐레이션된 가이드라인+실행 스크립트 묶음이다. **Progressive Disclosure** 원칙을 적용하여 초기 컨텍스트를 오염시키지 않고, 필요한 시점에만 관련 정보를 로딩한다. 마크다운 문서와 실행 가능 스크립트로 구성되어 에이전트 시스템 간 이식 가능.

## 🛠️ 구성 요소 / 주요 내용

| 항목 | 설명 |
|------|------|
| LangChain Skills (11세트) | 에이전트 루프 기초, LangGraph Human-in-the-Loop 패턴, Deep Agents 구현 |
| LangSmith Skills (3세트) | 트레이싱, 데이터셋 생성, 평가 워크플로우 |
| LangSmith CLI | 에이전트가 터미널에서 trace/dataset/experiment 직접 관리 |
| 통과율 개선 | LangChain 25%→95%, LangSmith 17%→92% |

## 🔧 작동 방식 / 적용 방법

```
[스킬 기반 에이전트 루프]

코딩 에이전트 (Claude Code)
    │
    ├── 작업 인식 → 관련 스킬 로딩 (Progressive Disclosure)
    │       ├── 마크다운 가이드라인 (패턴, 규칙)
    │       └── 실행 가능 스크립트 (CLI 도구)
    │
    ├── 작업 수행 → 스킬 지침에 따라 코드 작성
    │
    └── [자기 개선 루프 (미래 비전)]
            ├── 성능 트레이스 분석
            ├── 실패 패턴 식별
            └── 테스트 데이터셋 자동 생성
```

**스킬 개수 최적화**: 유사한 스킬 20개 이상이면 잘못 선택하는 문제 발생. 12개 수준이 정확도 유지에 최적.

## 💡 실용적 평가 / 적용

- **검증된 접근**: 스킬 없는 베이스라인 vs 스킬 적용을 통제된 환경에서 비교 평가 — 정량적 개선 확인
- **이식성**: 마크다운+스크립트 구성이라 특정 에이전트에 종속되지 않음
- **스킬 과부하 주의**: 스킬 수가 많아지면(20+) 선택 오류 발생 → 적절한 수 관리 필요
- **자기 개선 가능성**: 에이전트가 자신의 실패를 트레이싱하고 개선하는 피드백 루프 제시
- **우리 환경 적용**: 현재 `.claude/skills/` 체계와 동일 방향. Progressive Disclosure, 스킬 개수 제한(12개 최적)은 직접 참고할 만함

## 🔗 관련 개념

- [[Superpowers - Claude Code 개발 워크플로우 프레임워크]] - (동일하게 스킬 기반으로 코딩 에이전트 성능을 높이는 프레임워크)
- [[Claude Code - Anthropic 공식 CLI 에이전트]] - (스킬이 적용되는 대상 에이전트)
- [[Codified Context - Infrastructure for AI Agents in a Complex Codebase]] - (에이전트에게 코드베이스 맥락을 체계적으로 전달하는 인프라 접근)

---

**작성일**: 2026-03-11
**분류**: AI 개발 가이드
**원문**: https://aisparkup.com/posts/9881