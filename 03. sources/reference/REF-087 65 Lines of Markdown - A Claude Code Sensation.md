---
title: REF-087 65 Lines of Markdown - A Claude Code Sensation
type: doc-summary
permalink: sources/reference/65-lines-markdown-claude-code-sensation-1
tags:
- claude-code
- CLAUDE-md
- prompt-engineering
- developer-experience
date: 2026-02-12
---

# 65 Lines of Markdown — A Claude Code Sensation

Karpathy 영감의 65줄짜리 CLAUDE.md 가이드라인이 4,000+ GitHub 스타를 받으며 Claude Code 커뮤니티에서 화제가 된 사례 분석.

## 📖 핵심 아이디어

AI 워크숍에서 소개된 "Karpathy-Inspired Claude Code Guidelines" — 단 65줄의 마크다운 파일로 Claude Code의 행동을 제어하는 접근법. 핵심 원칙 중 첫 번째는 **"Think Before Coding"**(코딩 전에 생각하기)으로, LLM이 바로 코드 생성에 뛰어들지 않고 먼저 계획을 세우도록 유도한다.

## 🛠️ 주요 내용

| 항목        | 설명                                 |     |
| --------- | ---------------------------------- | --- |
| 파일 형식     | 65줄 마크다운 (CLAUDE.md)               |     |
| 영감        | Andrej Karpathy의 코딩 철학             |     |
| 핵심 원칙     | "Think Before Coding" 등 4가지 원칙     |     |
| GitHub 반응 | ~4,000 스타                          |     |
| 확장        | VS Code + Cursor 확장 프로그램으로 변환      |     |
| 배포 이슈     | VS Code 마켓플레이스 "검증된 발행자" 인증 6개월 대기 |     |

## 🔧 작동 방식

```
CLAUDE.md (65줄)
├── 원칙 1: Think Before Coding (계획 우선)
├── 원칙 2~4: (추가 가이드라인)
└── Claude Code가 세션 시작 시 자동 로딩
```

저자는 Codex CLI를 사용하여 마크다운 파일을 VS Code/Cursor 확장 프로그램으로 변환. 확장 프로그램이 에디터에서 가이드라인을 자동 적용하도록 함.

## 💡 실용적 평가

**시사점**:
- 짧고 명확한 CLAUDE.md가 커뮤니티에서 큰 호응 — 복잡한 설정보다 간결한 원칙이 효과적
- "Think Before Coding"은 우리 시스템의 `EnterPlanMode`/brainstorming 스킬과 동일한 철학
- 65줄이라는 분량은 컨텍스트 효율 관점에서 이상적 (우리 CLAUDE.md 3-tier는 ~113줄)

**한계**:
- 저자 본인도 인정: LLM의 비결정론적 특성으로 효과 측정이 어려움
- 실제 리팩토링 테스트에서 명확한 개선 효과 판단 불가
- 가이드라인의 효과는 모델·태스크·컨텍스트에 따라 달라짐

## 🔗 관련 개념

- [[Claude Code Overview - 공식 문서]] - (CLAUDE.md의 공식 스펙과 로딩 메커니즘)
- [[Claude Code Best Practice - Reports 분석]] - (우리의 3-tier CLAUDE.md 구조와 비교)
- [[Claude File Perception]] - (Claude가 파일을 인식하는 방식과 CLAUDE.md 자동 로딩의 관계)

---

**출처**: https://tildeweb.nl/~michiel/65-lines-of-markdown-a-claude-code-sensation.html
**작성일**: 2026-03-09
**분류**: Claude Code / Developer Experience