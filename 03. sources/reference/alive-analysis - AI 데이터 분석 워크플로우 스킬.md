---
title: alive-analysis - AI 데이터 분석 워크플로우 스킬
type: doc-summary
permalink: sources/reference/alive-analysis-workflow-skill
tags:
- data-analysis
- claude-code
- cursor
- skill
- workflow
- ALIVE-loop
date: 2026-02-23
---

# alive-analysis - AI 데이터 분석 워크플로우 스킬

AI 코딩 에이전트(Claude Code, Cursor)에서 데이터 분석을 구조화·추적·공유 가능하게 만드는 SKILL.md 기반 워크플로우 도구.

## 📖 핵심 아이디어

AI가 대신 분석하는 게 아니라, **질문을 통해 구조화된 사고를 유도**하는 접근. "AI as Exoskeleton" 철학과 맥이 같다 — AI를 자율 에이전트가 아닌 인간 분석 역량의 증폭 도구로 사용. 분석 대화가 채팅 기록에 묻히지 않도록 마크다운 파일로 구조화하여 Git 추적.

## 🛠️ 구성 요소 / 주요 내용

### ALIVE 루프 (5단계 프레임워크)

| 단계 | 의미 | 역할 |
|------|------|------|
| **A**sk | 질문 정의 | 분석 범위·목표 설정 |
| **L**ook | 데이터 관찰 | 데이터 품질 검증, EDA |
| **I**nvestigate | 가설 검증 | 분석 수행, 통계 검정 |
| **V**oice | 커뮤니케이션 | 대상별 결과 전달 |
| **E**volve | 후속 추적 | 영향도·후속 질문 관리 |

### 실행 모드

| 모드 | 파일 수 | 용도 |
|------|---------|------|
| **Full** | 6개 (단계별 5 + summary) | 심화 분석, Git 추적에 유리 |
| **Quick** | 1개 | 한 파일에 전부, 빠른 분석용 |

### 주요 기능 (20개 명령어)

- 분석, A/B 테스트, 메트릭 모니터링, ML 모델 추적
- 교육 모드: 7개 실습 시나리오 + 채점 시스템 + 3단계 힌트

## 🔧 작동 방식 / 적용 방법

### Full 모드 파일 구조

```
.analysis/{분석명}/
├── 01_ask.md          # 질문 정의, 범위 설정
├── 02_look.md         # 데이터 관찰, 품질 검증
├── 03_investigate.md  # 가설 검증, 분석 수행
├── 04_voice.md        # 대상별 결과 커뮤니케이션
├── 05_evolve.md       # 후속 질문, 영향 추적
└── summary.md         # 전체 요약 통합본
```

### Quick 모드

단일 마크다운 파일에 5단계 모두 포함 (예: `quick-investigation.md`)

### 설치

```bash
# Claude Code
git clone https://github.com/with-geun/alive-analysis
# .claude/skills/ 또는 프로젝트 루트에 SKILL.md 배치

# Cursor 2.4+
# platforms/ 디렉토리의 Cursor용 SKILL.md 사용
```

## 💡 실용적 평가 / 적용

**장점:**
- 분석 이력이 Git 커밋으로 남아 재현·공유 가능
- ALIVE 루프가 분석의 빠뜨리기 쉬운 단계(특히 Voice, Evolve)를 강제
- SKILL.md 표준 기반으로 플랫폼 독립적
- 교육 모드로 팀 온보딩에 활용 가능

**한계:**
- 마크다운 기반이라 복잡한 시각화는 별도 도구 필요
- SKILL.md 1,660줄로 상당히 큰 편 (컨텍스트 소모)

**적용 방안:**
- 우리 Flow 업무 분석 시 ALIVE 루프 구조 차용 가능
- 특히 Voice(대상별 커뮤니케이션) 단계가 보고서 작성에 유용

## 🔗 관련 개념

- [[AI as Exoskeleton]] - AI를 동료가 아닌 외골격으로 접근하는 철학 (kasava.dev 블로그)
- [[Task 분해 Hub]] - ALIVE 루프도 일종의 분석 Task 분해 프레임워크
- [[SKILL.md 표준]] - Claude Code/Cursor 스킬 정의 표준

---

**작성일**: 2026-02-23
**분류**: data-analysis / workflow
**출처**: https://github.com/with-geun/alive-analysis