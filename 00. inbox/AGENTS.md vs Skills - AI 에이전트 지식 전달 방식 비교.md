---
title: AGENTS.md vs Skills - AI 에이전트 지식 전달 방식 비교
type: note
permalink: notes/agents-md-vs-skills-ai-ejienteu-jisig-jeondal-bangsig-bigyo
tags:
- llm
- agents
- context
- skills
- claude-code
- vercel
---

# AGENTS.md vs Skills - AI 에이전트 지식 전달 방식 비교

> **핵심 질문**: 모델 학습 이후 업데이트된 프레임워크 지식을 에이전트에게 어떻게 전달할 것인가?

## 배경: 모델의 지식 한계

```
모델 학습 데이터 (예: 2024년 5월까지)
         ↓
Next.js 15 출시 (2024년 10월)
         ↓
모델이 새 API 모름 → 구버전 코드 생성
```

**문제**: 에이전트는 자기가 뭘 모르는지 모름 (Unknown Unknowns)

---

## 2가지 접근법 비교

| 방식 | 비유 | 작동 방식 |
|------|------|----------|
| **Skills** | 필요할 때 도서관 가서 책 찾기 | 에이전트가 호출 결정 → 검색 → 결과 활용 |
| **AGENTS.md** | 책을 미리 읽고 머릿속에 넣어둠 | 대화 시작 시 자동 로드 → 항상 참조 가능 |

---

## Vercel 실험 결과

| 방식 | 통과율 |
|------|--------|
| 기본 (아무것도 없음) | 53% |
| Skills (명시적 지시 없음) | 53% (개선 없음) |
| Skills (명시적 지시 있음) | 79% |
| **AGENTS.md** | **100%** |

---

## Skills가 실패한 이유

### 1. 호출 결정 실패
```
에이전트: "이 작업에 Skills를 써야 하나? 일단 내가 아는 걸로 해보자"
→ Skills 호출 안 함 → 구버전 코드 생성
```

### 2. Unknown Unknowns 문제
- 에이전트는 자기가 **모르는 것을 모름**
- "검색해야겠다"는 판단 자체를 못 함
- 확신을 가지고 **틀린 답변** 생성

### 3. 지시 문구에 민감 (Fragile)
```
"먼저 Skills 호출해" → 79% 통과
"먼저 프로젝트 탐색해" → 더 낮은 통과율
```
미세한 문구 차이로 결과가 크게 흔들림

---

## AGENTS.md가 성공한 이유

### 1. 결정 포인트 제거
```
Skills 방식:
1. 질문 받음
2. "Skills 호출할까?" ← 여기서 실패 가능
3. Skills 호출
4. 결과로 답변

AGENTS.md 방식:
1. 대화 시작 시 자동 로드
2. 질문 받음
3. 이미 알고 있는 정보로 답변
```

### 2. 항상 가용
| Skills | AGENTS.md |
|--------|-----------|
| 필요할 때 호출해야 함 | 항상 컨텍스트에 있음 |
| 호출 타이밍 중요 | 타이밍 무관 |
| 잊어버릴 수 있음 | 잊어버릴 수 없음 |

### 3. 일관성 유지
- Skills: 대화 중간에 호출 → 앞뒤 문맥과 단절 가능
- AGENTS.md: 처음부터 끝까지 같은 지식 유지

---

## 용도별 적합한 방식

| 상황 | 추천 방식 | 이유 |
|------|----------|------|
| 프레임워크 새 API | AGENTS.md | 범용 지식, 항상 필요 |
| 코딩 컨벤션 | AGENTS.md | 프로젝트 전반 적용 |
| `/commit`, `/review` | Skills | 명시적 트리거, 특정 워크플로우 |
| 대용량 문서 검색 | Skills (RAG) | 8KB 컨텍스트에 안 들어감 |
| 실시간 외부 API | Skills | 동적 데이터 필요 |

---

## 실무 적용

### AGENTS.md/CLAUDE.md에 넣으면 좋은 것
```markdown
# 최신 업데이트 (모델 학습 이후)
- Next.js 15: 'use cache' 디렉티브 사용
- React 19: use() 훅 추가
- TypeScript 5.5: infer 타입 개선

# 프로젝트 컨벤션
- ES modules 사용, CommonJS 금지
- 함수형 컴포넌트 + hooks
```

### 작성 원칙
- **150줄 이하** 유지 (길면 무시됨)
- 프로젝트 **전반에서 반복 사용**되는 지식만
- 한 번만 필요한 특정 지식은 Skills로

---

## CLAUDE.md vs AGENTS.md

| | CLAUDE.md | AGENTS.md |
|---|-----------|-----------|
| **호환성** | Claude Code 전용 | 여러 에이전트 공통 표준 |
| **지원 도구** | Claude Code | Cursor, Copilot, v0 등 |
| **유래** | Anthropic | Vercel + OpenAI + Google 등 공동 제안 |

본질적으로 같은 역할. Claude Code만 쓰면 CLAUDE.md, 여러 도구 쓰면 AGENTS.md로 통일.

---

## 관계 정리

- [solves:: Model Knowledge Cutoff Problem]
- [compares:: Skills vs Passive Context]
- [related_to:: RAG]
- [related_to:: Prompt Engineering]
- [applies_to:: Claude Code]
- [applies_to:: AI Coding Agents]

## 참고 자료

- Vercel Blog: https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals
- AGENTS.md 공식: https://agents.md/
- AGENTS.md GitHub: https://github.com/agentsmd/agents.md
- GitHub Blog (2,500개 리포 분석): https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/
- Anthropic CLAUDE.md 가이드: https://www.anthropic.com/engineering/claude-code-best-practices
