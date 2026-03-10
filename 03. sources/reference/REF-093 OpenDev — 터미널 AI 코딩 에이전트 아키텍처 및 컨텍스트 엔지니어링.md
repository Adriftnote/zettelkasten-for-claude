---
title: REF-093 OpenDev — 터미널 AI 코딩 에이전트 아키텍처 및 컨텍스트 엔지니어링
type: doc-summary
permalink: sources/reference/opendev-terminal-ai-coding-agent
tags:
- AI-agent
- coding-agent
- context-engineering
- ReAct
- MoE-routing
- safety
- memory
date: 2026-03-10
---

# OpenDev — 터미널 AI 코딩 에이전트 아키텍처 및 컨텍스트 엔지니어링

터미널 네이티브 AI 코딩 에이전트(OpenDev)의 설계 공간을 체계적으로 분석한 81쪽 기술 보고서. Scaffolding(조립), Harness(실행), Context Engineering(컨텍스트 관리)의 세 축으로 에이전트 아키텍처를 분해.

## 📖 핵심 아이디어

AI 코딩 에이전트를 세 계층으로 분해한다: (1) **Scaffolding** — 에이전트가 첫 프롬프트를 받기 전 완전히 조립되는 팩토리 과정, (2) **Harness** — 런타임 ReAct 루프, 도구 디스패치, 안전 시행, (3) **Context Engineering** — 장기 세션에서 컨텍스트를 예산으로 관리하는 적응형 압축·리마인더·메모리 파이프라인. 핵심 교훈: 컨텍스트는 버퍼가 아니라 예산이며, 안전은 차단이 아니라 비가시화로 구현해야 한다.

## 🛠️ 구성 요소 / 주요 내용

### 4계층 시스템 아키텍처

| 계층             | 역할            | 구성요소                                                   |
| -------------- | ------------- | ------------------------------------------------------ |
| Entry & UI     | 사용자 입력/출력     | CLI, TUI(Textual), Web UI(FastAPI+WebSockets)          |
| Agent          | 추론/의사결정       | MainAgent, 5개 모델 역할, Extended ReAct Loop               |
| Tool & Context | 도구 실행/컨텍스트 관리 | 35개 빌트인 도구, MCP, Skills, PromptComposer                |
| Persistence    | 상태 영속/롤백      | Session(JSON/JSONL), Shadow Git, Undo(50개), Config 4계층 |

### 5가지 모델 역할 (Compound AI)

| 역할       | 용도                    | 폴백                |
| -------- | --------------------- | ----------------- |
| Action   | 도구 기반 추론 (주 실행)       | —                 |
| Thinking | 도구 없는 확장 추론           | Action            |
| Critique | 자기 평가 (self-critique) | Thinking → Action |
| Vision   | 스크린샷/이미지              | Action (비전 가능 시)  |
| Compact  | 컨텍스트 압축 요약            | Action            |

### 5계층 안전 아키텍처

1. 프롬프트 가드레일 (시스템 프롬프트에 정책 인코딩)
2. 스키마 필터링 (서브에이전트에서 쓰기 도구 제거)
3. 런타임 승인 (Manual/Semi-Auto/Auto 3단계)
4. 도구 레벨 검증 (stale-read 검증, 위험 명령 차단)
5. 사용자 정의 훅 (외부 스크립트로 차단/수정)

## 🔧 작동 방식 / 적용 방법

### Extended ReAct Loop (6단계)

```
Phase 0: 사전 체크 (주입 메시지 처리, 메모리 압박 시 압축)
    ↓
Phase 1: Thinking (도구 없이 추론, 4단계 깊이: OFF/LOW/MED/HIGH)
    ↓
Phase 1.5: Self-Critique (HIGH에서만, 추론 트레이스 평가)
    ↓
Phase 2: Action (전체 도구 스키마로 LLM 호출)
    ↓
Phase 3: Tool Execution (읽기=병렬, 쓰기=순차)
    ↓
Phase 4: Post-processing (반복 또는 종료)
```

**Doom Loop Detection**: MD5 해시로 도구 호출 지문 → 20개 윈도우에서 동일 지문 3회 이상 시 경고/일시 중지.

### Adaptive Context Compaction (ACC) — 5단계 점진적 축소

| 단계 | 트리거 | 작업 |
|------|--------|------|
| Stage 1 | 70% | 경고 로깅 |
| Stage 2 | 80% | 오래된 도구 결과 → 참조 포인터로 교체 |
| Stage 2.5 | 85% | 보호 예산 외 결과 → [pruned] 마커 |
| Stage 3 | 90% | 보존 윈도우를 최근 출력만으로 축소 |
| Stage 4 | 99% | LLM 기반 전체 압축 |

효과: 피크 컨텍스트 소비 ~54% 감소. 프롬프트 캐싱으로 입력 토큰 비용 ~88% 절감.

### Agentic Context Engineering (ACE) — 경험 축적 파이프라인

```
BulletSelector (효과성·최신성·유사성으로 불릿 선택)
    → Reflector (5개 메시지마다 경험 분석)
    → Curator (플레이북 변형 계획: 추가/업데이트/태그/제거)
    → Playbook (JSON 파일에 영속화)
```

### 이중 메모리 아키텍처

- **에피소딕 메모리**: 전체 대화의 LLM 요약 (5개 메시지마다 재생성)
- **작업 메모리**: 최근 6개 메시지 쌍 그대로 보존

### 시스템 리마인더 (8가지 이벤트 감지기)

장기 세션에서 모델 주의 이탈 방지. 재시도 없는 도구 실패, 탐색 스파이럴(5회+), 미완료 todo로 조기 완료 등 감지 → 의사결정 지점에 타겟팅 리마인더 주입. 가드레일 예산: 에러 복구 3회, todo 불완전 2회.

## 💡 실용적 평가 / 적용

**핵심 설계 교훈**
- 컨텍스트를 버퍼가 아닌 **예산**으로 취급 — 대용량 출력은 파일시스템 오프로드
- 안전은 차단이 아닌 **비가시화** — 서브에이전트 스키마에서 쓰기 도구 제거
- 리마인더는 사전이 아닌 **결정 시점**에 주입
- LLM 부정확성을 **흡수**하도록 도구 설계 (9-pass 퍼지 매칭 등)
- 세션 길이에 따라 증가하는 모든 리소스에 **경험적 임계값** 적용

**한계**
- SWE-bench 등 정량적 벤치마크 평가 미실시
- 단일 에이전트 계층 구조 — 다중 에이전트 P2P 조정 미탐색
- 메모리 파이프라인의 프로젝트 간 지식 전달 미구현

## 🔗 관련 개념

- [[REF-088 Codified Context - Infrastructure for AI Agents in a Complex Codebase]] - (AI 에이전트 인프라의 또 다른 접근 — Codified Context는 코드베이스 측 구조화, OpenDev는 에이전트 측 컨텍스트 관리에 초점)
- [[ReAct Paradigm]] - (OpenDev가 확장한 Extended ReAct Loop의 원형 — Thinking/Critique 단계 추가)
- [[Claude Code - Anthropic 공식 CLI 에이전트]] - (같은 터미널 AI 코딩 에이전트 카테고리 — 아키텍처 비교 대상)
- [[Task 분해 프레임워크 - 경영학 관점]] - (약한 연결 — Thompson Sequential↔쓰기 순차는 부분적 유사하나, 대부분의 대응은 보편적 CS 원리에서 파생된 것이며 조직론 고유의 통찰은 아님)
- [[Task 분해와 AI Attention의 관계]] - (약한 연결 — ACC의 컨텍스트 예산 관리가 "적정 크기" 문제와 추상적으로 유사하나, 메커니즘은 다름)

---

**작성일**: 2026-03-10
**분류**: AI Agent / Software Engineering
**저자**: Nghi D. Q. Bui (OpenDev)
**원본**: https://github.com/opendev-to/opendev