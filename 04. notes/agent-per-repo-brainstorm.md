---
title: 레포 하나 = 에이전트 하나 = 클로드 하나 시스템
type: note
permalink: notes/agent-per-repo-brainstorm
tags:
- multi-agent
- architecture
- brainstorm
- derived
- yar
- episodic-memory
- compound-engineering
- kimoring
source_facts:
- YAR MCP Server (SQLite WAL 기반 에이전트 간 채팅)
- 기모링 AI Skills (worktree merge + 세션 훅)
- Compound Engineering Plugin (지식 복리 + Swarm Mode)
- Episodic Memory (Git 기반 장기 기억)
---

# 레포 하나 = 에이전트 하나 = 클로드 하나 시스템

Git 레포 하나가 인격 있는 전문 에이전트가 된다. 네 개의 기존 프로젝트를 합쳐 수평적 멀티 에이전트 협업 시스템을 만든다.

## 도출 근거

다음 프로젝트들의 조합에서 도출됨:

1. **YAR MCP Server** - 에이전트 간 실시간 대화 채널 (SQLite WAL, MCP 도구)
2. **기모링 AI Skills** - worktree 기반 안전한 작업 + 세션 훅 자동화
3. **Compound Engineering Plugin** - 지식 복리 사이클 + Swarm Mode 자동 판단
4. **에피소딕 메모리** - Git 커밋 기반 PDCA 경험 기록/회고

→ 따라서: **각 레포가 CLAUDE.md + 스킬 + 메모리 + knowledge base를 갖추면 "에이전트"가 되고, YAR 채널로 협업하면 팀이 된다.**

---

## 1. 핵심 아키텍처: 에이전트의 정의

### 레포 안에 뭐가 있어야 "에이전트"인가

```
my-agent-repo/
├── CLAUDE.md              # 정체성: 이름, 성격, 전문성, 규칙
├── .claude/
│   ├── settings.local.json
│   └── commands/          # 에이전트 전용 슬래시 커맨드
├── .skills/               # 기모링 스킬 (merge-worktree, verify 등)
├── .episodic-memory/      # 에피소딕 메모리 저장소
│   ├── episodes/          # PDCA 포맷 경험 기록
│   └── .git/              # 메모리도 Git으로 버전 관리
├── docs/solutions/        # Compound 지식 복리 (과거 학습 축적)
├── src/                   # 이 에이전트가 담당하는 실제 코드
└── yar.config.json        # YAR 채널 설정 (어떤 채널에 참여할지)
```

### 에이전트의 세 가지 층

| 층 | 역할 | 제공자 |
|---|---|---|
| **정체성** | 누구인지, 뭘 잘하는지, 어떤 규칙을 따르는지 | CLAUDE.md |
| **능력** | 무엇을 할 수 있는지 | .skills/ + .claude/commands/ |
| **기억** | 무엇을 경험했고 배웠는지 | .episodic-memory/ + docs/solutions/ |

### 에이전트 vs 그냥 레포

에이전트로 인정받으려면 최소한:
- CLAUDE.md에 `role`, `expertise`, `personality` 섹션이 있어야 함
- YAR에 join할 수 있는 설정이 있어야 함
- 에피소딕 메모리가 초기화되어 있어야 함

→ **`claude-agent init` 같은 스캐폴딩 커맨드**가 이걸 한 번에 만들어줘야 한다.

---

## 2. MVP 범위: 가장 먼저 돌아가게 할 것

### MVP 목표

> "두 개의 Claude Code 터미널이 각각 다른 레포에서 열리고, YAR로 대화하며 하나의 태스크를 협업한다"

### MVP 구성

```
[터미널 1: frontend-agent]     [터미널 2: backend-agent]
     │                              │
     ├── CLAUDE.md (프론트 전문)      ├── CLAUDE.md (백엔드 전문)
     ├── YAR join #project-x        ├── YAR join #project-x
     │                              │
     └──── YAR 채널 ────────────────┘
           (SQLite WAL 공유 DB)
```

### MVP에 필요한 것 (이것만 먼저)

1. **CLAUDE.md 템플릿** - 에이전트 정체성 정의 포맷
2. **YAR 연결** - 이미 v2.0.0으로 동작함. 그대로 사용
3. **에피소딕 메모리 초기화** - 레포별 .episodic-memory/ 세팅
4. **세션 훅 통합** - 시작 시 메모리 로드 + 종료 시 회고 자동 기록

### MVP에서 빼는 것

- Compound Engineering의 전체 사이클 (Phase 2)
- 기모링 worktree merge (Phase 2, 에이전트 혼자서도 가능)
- Swarm Mode 자동 판단 (Phase 3)
- 에이전트 자동 생성/스캐폴딩 CLI (Phase 2)

---

## 3. 통합 포인트: 네 프로젝트가 어디서 만나는가

### 흐름도: 태스크 하나의 생명주기

```
[사용자] "검색 API를 만들고 프론트에 연결해줘"
    │
    ▼
[Coordinator Agent] ← 사용자가 직접 대화하는 에이전트
    │ YAR say #project-x "검색 API 태스크 시작. @backend 검색 엔드포인트, @frontend 검색 UI 부탁"
    │
    ├───── YAR ─────┐
    ▼                ▼
[Backend Agent]   [Frontend Agent]
    │                │
    │ ① 세션 시작     │ ① 세션 시작
    │   → episodic   │   → episodic memory 로드
    │     memory 로드 │   → "지난번 검색 UI는 debounce 빠뜨렸었지"
    │                │
    │ ② 작업 수행     │ ② 대기 (backend 완료 필요)
    │   → worktree   │
    │     에서 개발   │
    │   → compound   │
    │     solutions  │
    │     검색       │
    │                │
    │ ③ 완료 보고     │
    │   YAR say      │
    │   "@frontend   │
    │   API 준비됨,  │
    │   GET /search  │
    │   ?q={query}"  │
    │       │        │
    │       └────────┤
    │                │ ③ 작업 수행
    │                │   → API 연동 구현
    │                │
    │ ④ 세션 종료     │ ④ 세션 종료
    │   → 회고 기록   │   → 회고 기록
    │   → WIP 커밋   │   → WIP 커밋
    │                │
    └────────────────┘
              │
              ▼
    [Coordinator] "완료. PR 2개 올렸습니다"
```

### 통합 매트릭스

| 시점 | YAR | 기모링 | Compound | Episodic |
|------|-----|--------|----------|----------|
| **세션 시작** | join 채널 | 최근 변경사항 로드 | - | 최근 에피소드 로드 |
| **태스크 수신** | listen으로 수신 | - | solutions/ 검색 | 관련 경험 recall |
| **작업 중** | 진행 상황 공유 | worktree 격리 작업 | 학습 축적 | - |
| **작업 완료** | say로 결과 보고 | merge-worktree | solution 저장 | 회고 기록 |
| **세션 종료** | leave | WIP 자동 커밋 | - | 자동 회고 push |

### 핵심 접착제: 세션 훅

```jsonc
// .claude/hooks.json — 모든 에이전트 공통
{
  "SessionStart": [
    "episodic-memory load",      // 최근 경험 로드
    "yar join #my-channel",      // 채널 입장
    "git log --oneline -5"       // 최근 변경사항
  ],
  "SessionEnd": [
    "episodic-memory reflect",   // 회고 기록
    "yar leave",                 // 채널 퇴장
    "git add -A && git commit -m 'WIP'"  // 기모링 스타일
  ],
  "PostToolUse": [
    "yar listen --check"         // 새 메시지 확인 (YAR 기존 기능)
  ]
}
```

---

## 4. 해결해야 할 질문들

### 아키텍처 결정

- [question] **Coordinator는 별도 레포인가, 사용자가 열어둔 터미널인가?** 별도 레포면 항상 떠 있어야 하고, 사용자 터미널이면 사용자가 직접 분배해야 한다. MVP에서는 사용자가 직접 조율하는 게 현실적 #architecture
- [question] **에피소딕 메모리를 레포 안에 넣을까, 별도 레포로 뺄까?** 레포 안에 넣으면 간단하지만 메모리가 코드 히스토리를 오염시킨다. 별도 레포(git submodule?)면 깔끔하지만 복잡도 증가 #memory-architecture
- [question] **YAR DB 위치는?** 모든 에이전트가 접근 가능한 공유 경로 필요. `~/.yar/messages.db` 같은 글로벌 경로 vs 프로젝트별 경로 #infrastructure
- [question] **에이전트 간 의존성을 어떻게 표현하나?** "backend 완료 후 frontend 시작" 같은 순서. YAR 메시지 기반 자연어 조율 vs 명시적 DAG(ClawTeam 스타일) #coordination

### 실행 결정

- [question] **CLAUDE.md 포맷 표준화가 필요한가?** 자유 형식 vs 정해진 섹션. 표준화하면 자동 파싱 가능, 자유 형식이면 유연하지만 일관성 없음 #standardization
- [question] **Compound의 solutions/를 에이전트 간에 공유할까?** 공유하면 팀 전체 학습, 격리하면 전문성 보존. 아마 둘 다 필요: 로컬 solutions/ + 공유 solutions/ #knowledge-sharing
- [question] **기모링의 worktree 생성 스킬이 없다.** merge만 있으므로 create-worktree 스킬을 만들거나, Claude Code의 기본 `--worktree` 플래그를 활용하거나 #tooling-gap

### 스케일 질문

- [question] **에이전트가 5개 이상이면?** SQLite WAL이 10개 동시 접속을 감당하는가. YAR의 현재 한계 테스트 필요 #scalability
- [question] **에이전트 자동 생성이 가능한가?** "이 태스크에 필요한 에이전트를 자동으로 만들어 배포"까지 가려면 Phase 3 이후 #automation

---

## 5. 단계별 로드맵

### Phase 1: MVP — "두 에이전트가 대화하며 일한다" (1-2주)

```
목표: 수동으로 두 터미널을 열고, 각각 에이전트 역할을 주고, YAR로 소통하며 하나의 태스크 완수
```

**할 일:**
1. CLAUDE.md 에이전트 템플릿 작성 (role, expertise, personality, yar-channel)
2. 테스트용 에이전트 2개 세팅 (frontend-agent, backend-agent)
3. 에피소딕 메모리를 각 레포에 초기화
4. 세션 훅 구성 (SessionStart/End에 메모리 + YAR 연결)
5. 실제 태스크 하나로 end-to-end 테스트

**성공 기준:** 두 에이전트가 YAR 메시지만으로 태스크를 분담하고 완료

### Phase 2: 자동화 — "에이전트가 스스로 학습하고 기억한다" (2-4주)

```
목표: 수동 개입 최소화. 에이전트가 과거 경험을 활용하고, 작업을 안전하게 격리
```

**할 일:**
1. Compound Engineering의 solutions/ 패턴 통합 (작업 후 학습 자동 저장)
2. 기모링 merge-worktree 통합 (격리 작업 → 안전한 머지)
3. create-worktree 스킬 추가 제작
4. `claude-agent init` CLI 또는 스킬 제작 (에이전트 스캐폴딩 자동화)
5. CLAUDE.md 표준 포맷 확정 + 파싱 유틸리티
6. 에이전트 간 공유 solutions/ 저장소 설계

**성공 기준:** 에이전트가 "지난번에 이렇게 해서 실패했으니 이번엔 다르게" 판단

### Phase 3: 오케스트레이션 — "팀이 스스로 조직된다" (4-8주)

```
목표: Coordinator가 태스크를 분석하고 적절한 에이전트에게 자동 분배
```

**할 일:**
1. Coordinator 에이전트 설계 (태스크 분석 → 에이전트 매칭 → 분배)
2. Compound의 Swarm Mode 아이디어 차용 (태스크 복잡도에 따라 단독/팀 자동 판단)
3. 에이전트 레지스트리 (어떤 에이전트가 있고 뭘 잘하는지 목록)
4. 태스크 의존성 표현 (간단한 DAG 또는 YAR 프로토콜 확장)
5. 에이전트 동적 생성 (필요한 전문성의 에이전트가 없으면 새로 만들기)

**성공 기준:** "이거 해줘" 한마디에 Coordinator가 팀을 구성하고 완료까지 조율

---

## ClawTeam/Agent Teams와의 차별점

| 관점 | ClawTeam | Agent Teams | 이 시스템 |
|------|----------|-------------|----------|
| **소통** | CLI 명령 | 위→아래 | 자연어 대화 (YAR) |
| **인격** | 없음 (worker) | 없음 (subagent) | 있음 (CLAUDE.md) |
| **기억** | 없음 | 없음 | 에피소딕 + 복리 지식 |
| **격리** | worktree (강제) | worktree | worktree (선택) |
| **확장** | DAG 기반 | 계층적 | 채널 기반 수평 |
| **진입장벽** | 높음 | 낮음 | 중간 (MVP는 낮음) |

핵심 차이: **기억하고, 대화하고, 성장하는** 에이전트.

## Observations

- [method] 에이전트 정의 = CLAUDE.md(정체성) + skills(능력) + memory(기억)의 삼중 구조 #agent-definition
- [pattern] 세션 훅이 접착제 역할: 시작(로드) → 작업(격리) → 종료(기록)의 일관된 생명주기 #lifecycle
- [decision] MVP는 YAR + CLAUDE.md + 에피소딕 메모리 3개만으로 시작 #mvp-scope
- [fact] 기존 4개 프로젝트가 각각 다른 층을 담당하므로 중복 없이 합성 가능 #integration
- [question] Coordinator를 별도 에이전트로 만들지 사용자 역할로 둘지가 Phase 3의 핵심 결정 #open-question

## Relations

- derived_from [[YAR MCP Server]] (에이전트 간 소통 인프라)
- derived_from [[기모링 AI Skills]] (worktree 격리 + 세션 훅 패턴)
- derived_from [[Compound Engineering Plugin]] (지식 복리 + Swarm Mode 아이디어)
- derived_from [[에피소딕 메모리]] (Git 기반 경험 기록 시스템)
- relates_to [[Orchestrator의 의도 보존 분해 역할]] (Coordinator 설계 시 참고)
- relates_to [[ClawTeam]] (비교 대상: worktree DAG 방식)

---

**도출일**: 2026-03-21
**출처**: YAR + 기모링 + Compound Engineering + Episodic Memory 프로젝트 조합 브레인스토밍