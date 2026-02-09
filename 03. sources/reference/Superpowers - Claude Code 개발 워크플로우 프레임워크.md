---
title: Superpowers - Claude Code 개발 워크플로우 프레임워크
type: guide
permalink: sources/reference/superpowers-claude-code-workflow
tags:
- claude-code
- workflow
- subagent
- tdd
- code-review
- plugin
date: 2026-02-09
---

# Superpowers - Claude Code 개발 워크플로우 프레임워크

코딩 에이전트가 체계적으로 일하게 만드는 스킬 모음. 7단계 워크플로우를 강제하여 계획→구현→리뷰→완료 흐름을 자동화.

## 📖 핵심 아이디어

Claude Code에게 바로 코드 작성하게 하지 않고, Brainstorming → Plan → TDD → Code Review → Branch Completion의 체계적 흐름을 강제. 핵심은 subagent-driven-development: 매 Task마다 fresh context의 새 서브에이전트를 띄워서 구현/스펙리뷰/품질리뷰 3단계를 거침.

Plan은 "판단력 없는 주니어가 따라할 수 있을 정도"로 상세하게 작성하고, Task는 2-5분짜리 단위로 분해.

## 🛠️ 구성 요소

| 항목 | 설명 |
|------|------|
| **레포** | https://github.com/obra/superpowers |
| **Stars** | 47.8k |
| **License** | MIT |
| **설치** | `/plugin install superpowers@superpowers-marketplace` |
| **스킬 수** | 14개 |

### 7단계 워크플로우
1. Brainstorming - 요구사항 대화형 추출
2. Git Worktrees - 격리 브랜치 작업
3. Plan Writing - 2-5분 청크로 분해
4. Execution - Subagent 배분 + 2단계 리뷰
5. TDD - RED→GREEN→REFACTOR
6. Code Review - 계획 대비 검증
7. Branch Completion - 머지/PR/정리

### Subagent 3역할 분리
- **Implementer**: 구현 + 테스트 + 셀프리뷰 + 커밋
- **Spec Reviewer**: 요구사항 대비 검증 (빠진 거/남는 거)
- **Code Quality Reviewer**: 코드 품질 자체 검증

## 🔧 작동 방식

```
Task마다 반복:
Implementer (fresh context) → 질문 확인 → 구현+테스트+커밋
  ↓
Spec Reviewer (fresh context) → 통과? No → Implementer 재수정
  ↓
Code Quality Reviewer (fresh context) → 통과? No → Implementer 재수정
  ↓
✅ Task 완료 → 다음 Task
  ↓
전체 완료 → 최종 Code Review → Branch Completion
```

### Task 분해 기준
- 2-5분짜리 atomic 단위
- 정확한 파일 경로 필수
- 완전한 코드 포함 ("validation 추가" ❌ → 실제 코드 ✅)
- 실행 커맨드 + 예상 결과 명시

## 💡 실용적 평가

**참고할 점:**
- 구현자 ≠ 리뷰어 분리 → 편향 방지
- fresh context per task → 컨텍스트 오염 방지
- verification-before-completion → 완료 전 별도 검증 단계
- Plan 상세도 기준이 명확

**우리 설정과의 차이:**
- 분해 단위: 2-5분 (Superpowers) vs 작업 단위 (우리, 더 큼)
- 리뷰: 3단계 분리 (Superpowers) vs 결과 마커+원본 직접 확인 (우리)
- Plan: 코드까지 포함 (Superpowers) vs 목표+완료조건 (우리)

## 🔗 관련 개념

- [[Shannon - AI 자율형 펜테스팅 도구]] - Claude Code 기반 자동화 사례
- [[Claude Code Best Practice]] - Claude Code 설정 모범 사례

---

**작성일**: 2026-02-09
**분류**: AI 에이전트 워크플로우