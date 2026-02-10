---
title: Anthropic Engineering Blog 2025-2026 주요 글 정리
type: doc-summary
permalink: sources/reference/anthropic-engineering-blog-2025-2026
tags:
- anthropic
- AI-agent
- eval
- compiler
- engineering
date: 2026-02-10
---

# Anthropic Engineering Blog 2025-2026 주요 글 정리

Anthropic 엔지니어링 블로그의 최신 5개 글 요약. AI 에이전트의 자율 개발, 평가(eval), 장기 실행 등 실무적 주제를 다룸.

## 📖 핵심 아이디어

Anthropic은 AI 에이전트가 단순 코드 생성을 넘어 **자율적 팀 협업, 장기 프로젝트 수행, 신뢰할 수 있는 평가**까지 가능한 시대로 진입하고 있음을 보여준다. 동시에 벤치마크 인프라 노이즈, 채용 평가의 AI 저항성 등 새로운 과제도 제기한다.

## 🛠️ 주요 글 요약

### 1. Quantifying Infrastructure Noise in Agentic Coding Evals (2026-02-05)

| 항목 | 내용 |
|------|------|
| 저자 | Gian Segato 외 |
| 핵심 | 벤치마크 점수가 인프라 설정에 따라 6%p까지 변동 |
| 문제 | 컨테이너 리소스 제한 방식(guaranteed vs hard kill)이 결과를 왜곡 |
| 권고 | 리더보드 3%p 미만 차이는 신뢰 불가, 리소스 설정을 실험 변수로 명시해야 |
| URL | https://www.anthropic.com/engineering/infrastructure-noise |

### 2. Building a C Compiler with a Team of Parallel Claudes (2026-02-05)

| 항목 | 내용 |
|------|------|
| 저자 | Nicholas Carlini |
| 핵심 | Claude 16개가 병렬 협업으로 C 컴파일러 자율 개발 |
| 규모 | 10만 줄 Rust, ~2,000세션, API 비용 $20,000 |
| 성과 | Linux 6.9를 x86/ARM/RISC-V에서 컴파일, 테스트 99% 통과 |
| 방법 | Git 기반 파일 락으로 동기화, 역할 분담(최적화/문서화/버그픽스) |
| 한계 | 16비트 x86은 GCC 의존, 독립 어셈블러/링커 없음, 코드 효율 낮음 |
| 시사점 | AI가 "코드 한 줄" 수준에서 "자율적 대규모 소프트웨어 개발 팀"으로 도약 |
| URL | https://www.anthropic.com/engineering/building-c-compiler |

### 3. Designing AI-Resistant Technical Evaluations (2026-01-21)

| 항목 | 내용 |
|------|------|
| 저자 | Tristan Hume |
| 핵심 | AI가 채용 코딩 테스트를 풀게 되면서 문제 재설계 필요 |
| 경과 | Opus 4가 대부분 지원자 능가 → Opus 4.5가 최상위 인간 수준 달성 |
| 대응 | 시간 단축(4h→2h), Zachtronics 스타일 퍼즐, 시각화 도구 의도적 제거 |
| 교훈 | 충분히 참신하거나 긴 작업에서만 인간이 우위 |
| URL | https://www.anthropic.com/engineering/AI-resistant-technical-evaluations |

### 4. Demystifying Evals for AI Agents (2026-01-09)

| 항목 | 내용 |
|------|------|
| 저자 | Mikaela Grace 외 |
| 핵심 | AI 에이전트 평가(eval) 설계·구현·유지 종합 가이드 |
| Grader 3종 | 코드 기반(객관적), 모델 기반(유연), 인간(최고 품질) |
| 구분 | Capability eval(새 기능) vs Regression eval(기존 유지) |
| 로드맵 | 실패 사례 20~50개부터 시작 → 점진적 확장 (8단계) |
| 교훈 | eval 없으면 반응적 디버깅에 빠짐, 일찍 투자하면 개발 가속 |
| URL | https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents |

### 5. Effective Harnesses for Long-Running Agents (2025-11-26)

| 항목 | 내용 |
|------|------|
| 저자 | Justin Young 외 |
| 핵심 | 여러 컨텍스트 윈도우에 걸쳐 작업을 지속시키는 하네스 설계 |
| 구조 | Initializer Agent(환경 세팅) + Coding Agent(점진적 진행) |
| 방법 | 200+ 피처 JSON 관리, Git 커밋 추적, Puppeteer 테스트 |
| 실패 모드 | 한번에 너무 많이 시도, 조기 완료 선언, 테스트 부족 |
| URL | https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents |

## 🔧 공통 패턴

```
┌─────────────────────────────────────────┐
│          AI Agent 실무 적용 스택          │
├─────────────────────────────────────────┤
│  평가(Eval)     ← #1 인프라 노이즈 주의  │
│       ↓              #4 eval 설계 가이드  │
│  하네스(Harness) ← #5 장기 실행 하네스    │
│       ↓                                  │
│  멀티에이전트    ← #2 병렬 Claude 협업    │
│       ↓                                  │
│  인간과의 경계   ← #3 AI-resistant 평가   │
└─────────────────────────────────────────┘
```

5개 글이 하나의 흐름을 형성:
- **어떻게 평가할 것인가** (#1, #4) → **어떻게 오래 돌릴 것인가** (#5) → **어떻게 팀으로 확장할 것인가** (#2) → **인간의 역할은 무엇인가** (#3)

## 💡 실용적 평가

**우리 작업에 적용 가능한 점:**
- #2의 병렬 에이전트 패턴은 현재 우리 orchestrator-worker 구조와 유사
- #5의 Initializer + Coding Agent 패턴은 장기 프로젝트에 직접 적용 가능
- #4의 eval 가이드는 Worker 결과 검증 체계에 참고 가치

**한계:**
- #2는 $20,000 비용이 소요되어 소규모 팀에는 비현실적
- #1이 경고하듯 벤치마크 결과를 액면 그대로 신뢰하면 안 됨
- #3의 AI-resistant 평가도 결국 한시적 — 모델이 발전하면 다시 뚫림

## 🔗 관련 개념

- [[AI Agent (인공지능 에이전트)]] - 자율적 작업 수행 AI 시스템
- [[Claude Code]] - Anthropic의 CLI 기반 코딩 에이전트
- [[LLM Evaluation]] - 대규모 언어 모델 평가 방법론
- [[Multi-Agent System]] - 다수 에이전트 협업 아키텍처
- [[Context Window]] - LLM의 입력 토큰 제한과 장기 작업의 관계

---

**작성일**: 2026-02-10
**분류**: AI Engineering / Agent Development