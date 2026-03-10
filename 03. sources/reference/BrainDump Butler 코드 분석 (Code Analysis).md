---
title: BrainDump Butler 코드 분석 (Code Analysis)
type: guide
permalink: sources/reference/braindump-butler-code-analysis
tags:
- note-automation
- knowledge-base
- ai-pipeline
- obsidian
date: 2026-02-10
---

# BrainDump Butler 코드 분석

GitHub Copilot SDK 기반 노트 정리 도구. 비정형 메모를 Obsidian 볼트용 구조화된 Markdown으로 자동 변환.

## 📖 핵심 아이디어

BrainDump Butler는 "점진적 학습(Incremental Learning)" 철학에 기반한다. 사용할수록 컨텍스트가 풍부해지고, AI 실패 시 규칙 기반 fallback으로 안정성을 확보하며, 완벽한 한 번보다 대화형 점진적 개선을 추구한다.

기술 스택: Python 3.11+(FastAPI) 백엔드, Vanilla JS PWA 프론트엔드, GitHub Copilot SDK.

## 🛠️ 구성 요소 / 주요 내용

### 1. Knowledge Base 자동 학습

`vault/.ai/` 폴더에 JSON 4종 파일로 관리:

| 파일 | 구조 | 용도 |
|------|------|------|
| `tags.json` | `{ tag: { description, related, frequency } }` | 태그 연관성 + 빈도 추적 |
| `people.json` | `{ 약칭: { full_name, context } }` | 인물 자동 인덱싱 |
| `projects.json` | `{ 프로젝트명: { description, created } }` | 프로젝트 추적 |
| `abbreviations.json` | `{ 약어: 풀네임 }` | 약어 사전 |

- `update_from_note()`: 노트 처리 시마다 자동 학습
- `get_context_prompt()`: 모든 AI 호출 시 컨텍스트 주입
- **frequency 카운터**로 중요도 판단

### 2. 2단계 자동 분류

**Intake(타입 결정) → Structure(템플릿 적용)**

신뢰도 우선순위: 사용자 힌트(0.9) > AI(0.0~1.0) > 키워드 fallback(0.6)

| 타입 | 추출 필드 |
|------|----------|
| meeting | attendees, date, action_items |
| daily | done, in_progress, planned, mood |
| idea | category, feasibility, impact |
| project | status, priority, deadline, owner |

AI 실패 시 키워드 매칭 fallback (besprechung→meeting, heute→daily 등)

### 3. Refinement Mode (3모드 체인)

```
probe    → 숨겨진 인사이트를 끌어내는 질문 생성
extract  → 구조화된 데이터(액션 아이템, 의사결정) 추출
improve  → 내용 개선 제안
```

- Multi-turn 세션, 최대 5턴
- AI 실패 시 note_type별 정형 질문 fallback

### 4. Skill Orchestration 파이프라인

```
Intake(순차) → Clarify(조건부) → Structure(순차) → Tag+Link(병렬) → Finalize
```

- 병렬 가능한 건 `asyncio.gather()` 동시 실행
- `needs_clarification` 플래그로 사용자 개입 시점 결정
- `ProcessingResult`에 fallback 사용 여부, 토큰 수, 에러 기록

## 🔧 작동 방식 / 적용 방법

### 전체 처리 흐름

```
비정형 메모 입력
    │
    ▼
[Intake] AI 분류 (실패 시 키워드 fallback)
    │
    ▼
[Clarify] 불분명하면 질문 생성 (조건부)
    │
    ▼
[Structure] 타입별 메타데이터 추출 + YAML frontmatter
    │
    ├──[Tag]──┐
    │         │  (병렬 실행)
    ├──[Link]─┘
    │
    ▼
[Finalize] 파일 저장 + Knowledge Base 업데이트
```

### Knowledge Base 학습 사이클

```
노트 처리 → update_from_note() → JSON 업데이트 (frequency++)
    ▲                                      │
    │                                      ▼
다음 노트 처리 ← get_context_prompt() ← 풍부해진 컨텍스트
```

## 💡 실용적 평가 / 적용

### 우리 환경에 적용 가능한 패턴

| 순위 | 패턴 | 적용 대상 | 방법 |
|------|------|----------|------|
| 1 | **frequency 기반 중요도** | MEMORY.md | 자주 참조되는 도메인 가중치 자동 조정 |
| 2 | **AI + fallback 2단계** | inbox 자동 분류 | reference/workcase 외 meeting/daily/idea 타입 추가 |
| 3 | **probe→extract→improve** | Task 분해/검토 | 복잡한 요청에 clarify 단계 삽입 |
| 4 | **needs_clarification 플래그** | Agent Teams | 조건부 사용자 개입 시점 결정 |

### 장점
- AI 실패에 대한 graceful degradation (fallback 체계)
- 사용할수록 컨텍스트가 풍부해지는 선순환 구조
- 파이프라인 단계별 독립성 (순차/병렬/조건부 명확 분리)

### 한계
- 초기 단계 프로젝트 (커밋 7개, 스타 11개)
- 독일어/영어 이중 언어로 코드 가독성 혼재
- Knowledge Base가 JSON 파일 기반이라 대규모 확장에 한계

## 🔗 관련 개념

- [[메모리 시스템 (Memory Systems)]] - Knowledge Base 자동 학습은 메모리 시스템 설계의 구체적 구현 사례
- [[컨텍스트 엔지니어링 (Context Engineering)]] - get_context_prompt()는 컨텍스트 엔지니어링의 실전 패턴
- [[Task 분해 Hub]] - Skill Orchestration 파이프라인은 순차/병렬/조건부 분해의 코드 구현
- [[MCP Tool 패턴 (MCP Tool Patterns)]] - Refinement Mode의 multi-turn 패턴은 MCP 도구 상호작용에 참고

---

**작성일**: 2026-02-10
**분류**: AI 도구 분석
**출처**: https://github.com/SchwarziLukas/braindump-butler