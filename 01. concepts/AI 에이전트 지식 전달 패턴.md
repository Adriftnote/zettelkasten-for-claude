---
title: AI 에이전트 지식 전달 패턴
type: note
permalink: knowledge/concepts/ai-agent-knowledge-transfer-pattern
tags:
- llm
- agents
- context
- skills
- claude-code
- concept
---

# AI 에이전트 지식 전달 패턴

모델 학습 이후 업데이트된 지식을 에이전트에게 전달하는 두 가지 접근법 (AGENTS.md vs Skills)

## 📖 개요

AI 에이전트는 학습 데이터 이후의 새로운 프레임워크, API 변경 등을 모릅니다. 이 문제를 해결하는 두 가지 패턴이 있습니다: **수동적 컨텍스트 로딩**(AGENTS.md)과 **능동적 도구 호출**(Skills).

## 🎭 비유

- **Skills**: 필요할 때 도서관 가서 책 찾기
- **AGENTS.md**: 책을 미리 읽고 머릿속에 넣어둠

## ✨ 두 방식 비교

| 방식 | 작동 방식 | 장점 | 단점 |
|------|----------|------|------|
| **AGENTS.md** | 대화 시작 시 자동 로드 | 결정 포인트 없음, 100% 일관성 | 컨텍스트 소비, 150줄 제한 |
| **Skills** | 에이전트가 필요시 호출 | 대용량 가능, 동적 데이터 | 호출 결정 실패 가능 |

## 💡 Vercel 실험 결과

| 방식 | 통과율 |
|------|--------|
| 기본 (아무것도 없음) | 53% |
| Skills (명시적 지시 없음) | 53% |
| Skills (명시적 지시 있음) | 79% |
| **AGENTS.md** | **100%** |

### Skills가 실패한 이유
- **Unknown Unknowns**: 에이전트는 자기가 모르는 것을 모름
- 호출 결정 포인트에서 실패 → 구버전 코드 생성
- 지시 문구에 민감 (Fragile)

## ✨ 용도별 적합한 방식

| 상황 | 추천 방식 | 이유 |
|------|----------|------|
| 프레임워크 새 API | AGENTS.md | 범용 지식, 항상 필요 |
| 코딩 컨벤션 | AGENTS.md | 프로젝트 전반 적용 |
| `/commit`, `/review` | Skills | 명시적 트리거 |
| 대용량 문서 검색 | Skills (RAG) | 컨텍스트 제한 |
| 실시간 외부 API | Skills | 동적 데이터 |

## Observations

- [fact] AGENTS.md 방식이 Skills 대비 100% vs 53% 통과율로 압도적 우위 #agents #experiment
- [principle] 에이전트의 "호출 결정"을 제거하면 일관성 향상 #pattern
- [guideline] AGENTS.md는 150줄 이하, 프로젝트 전반 반복 사용 지식만 #best-practice

## Relations

- solves [[Model Knowledge Cutoff]] (문제 해결)
- relates_to [[RAG]] (유사 개념)
- applies_to [[Claude Code]] (적용처)
- different_from [[SKILL]] (대비되는 접근)

---

**출처**: Vercel 실험 - https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals
**작성일**: 2026-01-30