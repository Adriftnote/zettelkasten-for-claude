---
title: AOrchestra - 동적 서브에이전트 생성 오케스트레이션
type: paper-review
permalink: sources/reference/aorchestra-dynamic-subagent
tags:
- multi-agent
- orchestration
- dynamic-agent
- model-selection
- 4-tuple
date: 2026-02-09
---

# AOrchestra - 동적 서브에이전트 생성 오케스트레이션

멀티 에이전트 시스템에서 서브에이전트를 미리 정의하지 않고, 작업마다 4-tuple로 동적 생성하는 프레임워크. 모델 선택 자동화 관점이 핵심.

## 📖 핵심 아이디어

기존 멀티 에이전트 시스템은 "연구원", "코더" 등 역할을 미리 고정하지만, AOrchestra는 에이전트를 `⟨Instruction, Context, Tools, Model⟩` 4-tuple로 추상화하여 작업마다 오케스트레이터(LLM)가 자동으로 최적 조합을 결정하고 서브에이전트를 즉석 생성한다.

특히 Model 선택을 LLM이 작업 난이도에 따라 자동 결정하는 것이 새로운 관점. 간단한 작업에는 경량 모델, 복잡한 작업에는 고성능 모델을 배정하여 비용-성능 Pareto 최적을 달성.

## 🛠️ 구성 요소

| 항목 | 설명 |
|------|------|
| **논문** | arXiv 2602.03786 (2026-02-03) |
| **레포** | https://github.com/FoundationAgents/AOrchestra |
| **성능** | Gemini-3-Flash 기준 최강 베이스라인 대비 16.28% 향상 |
| **벤치마크** | GAIA, SWE-Bench, Terminal-Bench |

### 4-Tuple 정의

```
Agent = ⟨I, C, T, M⟩

I (Instruction): 작업 지시문
C (Context):     작업에 필요한 맥락 정보
T (Tools):       사용 가능한 도구 목록
M (Model):       실행할 LLM 모델
```

### 주요 구성요소
| 컴포넌트 | 역할 |
|---------|------|
| MainAgent | 작업 분석 → 4-tuple 결정 → delegate_task 호출 |
| delegate_task | 4-tuple 파라미터로 SubAgent 인스턴스 생성 |
| SubAgent (ReActAgent) | 실제 작업 실행 (GAIA, TerminalBench용) |
| SubAgent (SWEBenchAgent) | 코드 수정 실행 (SWE-Bench용) |

## 🔧 작동 방식

```
사용자 요청
  ↓
MainAgent (LLM)
  ├→ 작업 난이도 분석
  ├→ 필요한 Context 큐레이션
  ├→ 적절한 Tools 선택
  ├→ 비용 대비 적절한 Model 선택
  └→ Instruction 작성
  ↓
delegate_task(I, C, T, M)  ← Python 함수 호출 (MCP 아님)
  ↓
SubAgent 즉석 생성 (Python 객체)
  ↓
실행 → 결과 반환 → 다음 단계 반복
```

### 주입 방식 (MCP 아님)

```python
# LLM이 tool call로 delegate_task 호출
delegate_task(
    task_instruction="데이터 검증해",     # I
    context="DB 스키마: ...",             # C
    tools=["sql_executor", "web_search"], # T
    model="gemini-3-flash"               # M
)

# 내부에서 Python 객체로 서브에이전트 생성
sub_agent = ReActAgent(instruction, context, tools, llm)
result = sub_agent.run()
```

### 정적 vs 동적 비교

| | 정적 (우리 현재) | 동적 (AOrchestra) |
|--|--|--|
| 에이전트 | Worker 6종 미리 정의 | 작업마다 즉석 생성 |
| Model | 수동 선택 (또는 기본값) | LLM이 자동 선택 |
| Context | 프롬프트에 수동 포함 | 자동 큐레이션 |
| Tools | Worker 타입별 고정 | 작업별 자동 선택 |

## 💡 실용적 평가

**바로 적용 가능한 것 - Model 선택 자동화:**

| 작업 유형 | 적합 모델 | 이유 |
|----------|----------|------|
| DB 쿼리, 파일 복사 | haiku | 판단 불필요, 속도/비용 우선 |
| CSV 분석, 데이터 검증 | sonnet | 중간 수준 판단 |
| 아키텍처 설계, 복합 분석 | opus | 깊은 추론 필요 |
| 웹 검색, 정보 수집 | haiku | 수집만 하면 됨 |
| 코드 리팩토링, 버그 분석 | sonnet/opus | 맥락 이해 필요 |

Claude Code Task tool에서 `model: "haiku"` 파라미터 이미 지원하지만 활용하지 않고 있음.

**완전 동적 주입은 어려움:**
- Claude Code의 subagent_type이 미리 정의된 에이전트에 묶여 있음
- Tools 자유 조합하려면 별도 프레임워크 필요 → 오버엔지니어링
- 현실적으로는 Model 선택 자동화가 즉시 적용 가능한 개선점

## 🔗 관련 개념

- [[Superpowers - Claude Code 개발 워크플로우 프레임워크]] - 서브에이전트 분리 리뷰 패턴
- [[Shannon - AI 자율형 펜테스팅 도구]] - Claude Code 기반 에이전트 자동화

---

**작성일**: 2026-02-09
**분류**: AI 에이전트 아키텍처