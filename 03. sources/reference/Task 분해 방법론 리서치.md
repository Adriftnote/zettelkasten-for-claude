---
title: Task 분해 방법론 리서치
type: doc-summary
permalink: sources/reference/task-decomposition-research
tags:
- task-decomposition
- subagent
- claude-code
- orchestration
- best-practices
---

# Task 분해 방법론 리서치

Anthropic 공식 문서와 최신 연구 기반으로 Task 분해 방법론을 정리합니다.

## 📖 핵심 아이디어

Claude Code에서 Task를 효과적으로 분해하는 핵심은 **독립성, 병렬성, 측정 가능성**을 기준으로 작업을 나누고, **3가지 패턴(Pipeline, Parallel, Swarm)**을 상황에 맞게 적용하는 것입니다.

## 🛠️ Built-in Subagent 종류

| Subagent | 모델 | 도구 | 용도 |
|----------|------|------|------|
| **Explore** | Haiku (빠름) | Read-only | 파일 검색, 코드 분석 |
| **Plan** | 상속 | Read-only | Plan 모드에서 코드베이스 리서치 |
| **General-purpose** | 상속 | 모든 도구 | 복잡한 멀티스텝 작업 |

## 🔧 Task 분해 3가지 패턴

### Pipeline (순차적 의존성)
```
Research → Plan → Implement → Test
```
- 멀티 단계 워크플로우
- 각 단계가 이전 결과를 입력으로 사용

### Parallel Specialists (병렬 전문가)
```
Security Review
Performance Analysis    (동시 실행)
Code Simplicity Check
```
- 서로 독립적인 검토/분석 작업
- 다른 전문 영역

### Self-Organizing Swarms (자율 조직 스웜)
- 동일한 유형의 작업이 많을 때
- 작업 간 의존성이 없을 때

## 📊 Task 분해 5가지 기준

| 기준 | 질문 |
|------|------|
| **독립성** | 다른 작업과 최소한의 인터페이스만 필요한가? |
| **병렬 가능성** | 선행 작업 결과 없이 시작 가능한가? |
| **측정 가능성** | 완료 기준이 검증 가능한가? |
| **작업 크기** | 8~80시간 범위인가? |
| **전문성 매칭** | 적절한 Subagent가 있는가? |

## 💡 제약 사항

- **Subagent는 Subagent 생성 불가** (1 레벨만)
- **20k 토큰 오버헤드** - Task 실행 전 컨텍스트 로딩
- **병렬 처리 최대 10개**
- **Background Subagent는 MCP 도구 사용 불가**

## 🔗 관련 개념

- [[Task 분해 프레임워크 - 경영학 관점]] - 조직론 기반 분석
- [[Task 분해 통합 프레임워크]] - AI + 경영학 통합

## 📎 리소스

- Anthropic 공식: Create custom subagents - Claude Code Docs
- mcp-task-orchestrator: `claude mcp add -s user task-orchestrator uvx mcp-task-orchestrator`

---

**작성일**: 2026-01-30
**분류**: Research / Task Decomposition / Claude Code