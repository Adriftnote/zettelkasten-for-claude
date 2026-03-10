---
title: Entire - AI 시대의 차세대 개발자 플랫폼
type: doc-summary
permalink: sources/reference/entire-developer-platform
tags:
- entire
- developer-platform
- agent
- git
- checkpoints
- context
date: 2026-02-11
---

# Entire - AI 시대의 차세대 개발자 플랫폼

Thomas Dohmke가 설립한 Entire — 에이전트와 인간이 협업하는 차세대 개발자 플랫폼. $60M 시드 라운드, 첫 제품은 에이전트 컨텍스트를 Git에 기록하는 오픈소스 CLI.

## 📖 핵심 아이디어

현재 소프트웨어 개발 라이프사이클은 인간-인간 협업 시대에 설계된 것으로, AI 에이전트가 코드의 주요 생산자가 된 시대에는 병목이 된다. Issue, PR, Git 리포지토리 모두 에이전트 시대에 맞게 재설계가 필요하다. Entire은 자동차 산업의 조립 라인 혁명처럼, 소프트웨어 개발의 전체 라이프사이클을 에이전트 시대에 맞게 재구축하는 것을 목표로 한다.

## 🛠️ 구성 요소 / 주요 내용

| 항목 | 설명 |
|------|------|
| **Git 호환 데이터베이스** | 코드, 의도(intent), 제약조건(constraints), 추론(reasoning)을 단일 버전 관리 시스템에 통합 |
| **범용 시맨틱 추론 레이어** | Context Graph를 통한 멀티 에이전트 조율 |
| **AI 네이티브 SDLC** | 에이전트-인간 협업을 위한 소프트웨어 개발 라이프사이클 재발명 |
| **Checkpoints (첫 제품)** | 에이전트 컨텍스트를 Git 커밋에 첨부하는 CLI |

### 현재 개발 생태계의 문제점

| 문제 | 설명 |
|------|------|
| 에이전트 세션의 휘발성 | 프롬프트, 추론이 세션 종료 시 소멸 |
| Git의 한계 | "무엇이 변했는지"만 기록, "왜 변했는지"는 누락 |
| 컨텍스트 손실 누적 | 에이전트가 같은 추론을 반복, 토큰 낭비 |
| 멀티 에이전트 협업 불가 | 공유 컨텍스트 없이 에이전트 간 조율 불가 |
| PR 스케일 한계 | 대형 모노레포에서 PR 프로세스가 확장 불가 |

### 투자 및 팀

| 항목 | 내용 |
|------|------|
| 시드 라운드 | $60M |
| 리드 투자자 | Felicis |
| 추가 투자자 | Madrona, M12, Basis Set, 20VC, Cherry Ventures, Picus Capital, Global Founders Capital |
| 엔젤 투자자 | Gergely Orosz, Theo Browne, Jerry Yang, Olivier Pomel, Garry Tan 등 |
| 창업자 | Thomas Dohmke (전 GitHub CEO) |

## 🔧 작동 방식 / 적용 방법

### Checkpoints 아키텍처

```
에이전트 세션 (Claude Code, Gemini CLI 등)
    │
    ▼
git commit (코드 변경)
    │
    ▼
Checkpoint 자동 캡처
├── 트랜스크립트 (전체 대화)
├── 프롬프트
├── 수정된 파일 목록
├── 토큰 사용량
├── 도구 호출 내역
    │
    ▼
git push 시 메타데이터도 함께 push
→ entire/checkpoints/v1 브랜치에 append-only 기록
```

### 설치 및 사용

```bash
# 설치
curl -fsSL https://entire.io/install.sh | bash
# 또는
brew install entire

# 프로젝트 활성화
cd your-repo
entire enable
# → 이후 에이전트 세션이 자동으로 캡처됨
```

### 지원 에이전트

| 에이전트 | 상태 |
|----------|------|
| Claude Code (Anthropic) | 지원 |
| Gemini CLI (Google) | 지원 |
| Codex (OpenAI) | 예정 |
| Cursor CLI | 예정 |

### Checkpoints 활용

| 활용 | 설명 |
|------|------|
| 추적성 (Traceability) | 에이전트가 생성한 변경의 추론 과정 검사 |
| 빠른 리뷰 | diff가 아닌 의도와 제약조건 기반 리뷰 |
| 핸드오프 | 이전 세션을 다시 재생하지 않고 작업 재개 |
| 토큰 절약 | 과거 세션에서 수정한 실수를 반복하지 않음 |
| 멀티 세션 | 동시 에이전트 세션 지원 |

## 💡 실용적 평가 / 적용

**의미:**
- "코드 + 컨텍스트"를 함께 버전 관리하는 새로운 패러다임
- Git의 근본적 한계(what만 기록, why는 누락)를 보완하는 레이어
- 에이전트가 코드 생산의 주체가 되는 시대에서 필수적인 인프라

**강점:**
- 기존 Git 워크플로우와 호환 — 코드는 그대로, 메타데이터만 추가
- 오픈소스 CLI로 특정 벤더 종속 없음
- append-only 로그로 감사 추적(audit trail) 가능
- 설치 2단계로 즉시 사용 가능

**한계/관찰:**
- 아직 첫 제품(Checkpoints)만 출시 — 전체 플랫폼 비전은 로드맵 단계
- 시맨틱 추론 레이어, AI 네이티브 SDLC는 미래 계획
- `entire/checkpoints/v1` 브랜치가 리포에 추가됨 — 리포 크기/관리 고려 필요
- 경쟁: GitHub Copilot Workspace 등 기존 플랫폼의 유사 기능 진화 가능성

**우리 환경 적용 가능성:**
- Claude Code 세션을 자동 캡처 → 작업 추적성 확보 (orchestration.db 보완)
- 멀티 에이전트 세션 추적 → Agent Teams 활용 시 컨텍스트 보존
- 코드 리뷰 시 "왜 이렇게 변경했는지" 추론 과정 참조 가능

## 🔗 관련 개념

- [[컨텍스트 엔지니어링 (Context Engineering)]] - 에이전트 컨텍스트 관리의 핵심 과제
- [[메모리 시스템 (Memory Systems)]] - 에이전트의 장기 기억/컨텍스트 보존
- [[Git]] - Checkpoints가 확장하는 기반 시스템
- [[agentic-coding]] - 에이전트 주도 코딩 패러다임
- [[Claude Code]] - 지원되는 첫 번째 에이전트 중 하나

---

**작성일**: 2026-02-11
**출처**: https://entire.io/blog/hello-entire-world/
**저자**: Thomas Dohmke
**발행일**: 2026-02-10
**분류**: Developer Platform / AI / Agent Infrastructure