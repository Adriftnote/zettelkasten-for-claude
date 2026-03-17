---
title: REF-110 Hindsight — 생체모방 에이전트 장기 기억 시스템
type: note
permalink: zettelkasten/03.-sources/reference/ref-110-hindsight-saengcemobang-eijeonteu-janggi-gieog-siseutem
date: '2026-03-13'
tags:
- agent-memory
- long-term-memory
- retrieval
- biomimetic
- PostgreSQL
- vectorize
---

# Hindsight — 생체모방 에이전트 장기 기억 시스템

> 대화 이력 "회상"이 아니라 시간이 지나며 "학습"하는 에이전트 메모리. 인간 인지를 모방한 3경로 구조(World/Experiences/Mental Models)로 장기 기억을 조직화한다.

## 📖 핵심 아이디어

Hindsight는 AI 에이전트의 장기 기억을 위한 오픈소스 시스템으로, 단순 대화 기록 저장이 아니라 인간 기억 구조를 모방한 3경로(World 사실지식, Experiences 경험, Mental Models 학습된 이해)로 정보를 조직화한다. 핵심 연산 3가지: Retain(저장 시 엔터티/관계/시간 추출), Recall(4종 검색을 병렬 실행 후 역순위 융합), Reflect(기존 기억에서 새 인사이트 생성). LongMemEval 벤치마크 SOTA.

## 🛠️ 구성 요소 / 주요 내용

| 항목 | 설명 |
|------|------|
| 메모리 3경로 | **World**(환경 사실) · **Experiences**(에이전트 상호작용) · **Mental Models**(반성으로 형성된 이해) |
| Retain | LLM으로 엔터티, 관계, 시간, 메타데이터 추출 → 정규화 표현 저장 |
| Recall | 4종 병렬 검색: Semantic(벡터) + BM25(키워드) + Graph(엔터티/시간 관계) + Time-range → 역순위 융합(RRF)으로 병합 |
| Reflect | 기존 기억 분석 → 새로운 연결/인사이트 생성 (Mental Models 형성) |
| 멀티유저 | 메타데이터 기반 per-user 격리 |
| Bank | 논리적 기억 그룹핑 (에이전트별 분리) |

## 🔧 작동 방식 / 적용 방법

```
정보 입력 → Retain
             ├── LLM 추출: 엔터티, 관계, 시간, 메타데이터
             └── 정규화 → PostgreSQL 저장
                          ↓
             3경로 분류: World | Experiences | Mental Models

질의 → Recall
        ├── Semantic Search (벡터 유사도)
        ├── BM25 (키워드 매칭)
        ├── Graph (엔터티/시간 관계 탐색)
        └── Time-range (시간 필터)
             ↓ 병렬 실행
        역순위 융합 (Reciprocal Rank Fusion)
             ↓
        최종 결과

주기적 → Reflect
          기존 기억 분석 → Mental Models 갱신
```

**배포 옵션:** Docker(내장 PostgreSQL) / Docker Compose / Embedded Python / Helm(K8s)
**LLM 지원:** OpenAI, Anthropic, Gemini, Groq, Ollama, LM Studio
**클라이언트:** Python SDK, Node.js SDK, REST API, CLI

## 💡 실용적 평가 / 적용

**강점:**
- 4종 검색 병렬 + RRF 융합 → 단일 검색 방식보다 robust
- Reflect 연산으로 원시 기억에서 상위 이해를 자동 생성 → 수동 정리 불필요
- 멀티유저 격리가 내장 → SaaS 시나리오에 적합
- Embedded Python 모드 → 서버 없이 프로세스 내 사용 가능

**우리 환경과 비교:**
- 우리 basic-memory: Markdown 파일 기반, wikilink 관계, 벡터 검색(vecsearch) + 키워드(build_context) 2단계
- Hindsight: PostgreSQL 기반, LLM 추출 관계, 4종 검색 + RRF 융합
- 공통점: 관계 그래프 + 벡터 검색 조합, 반성/메타인지 레이어
- 차이점: 우리는 인간이 Markdown으로 직접 편집 가능 (지식 관리), Hindsight는 에이전트 전용 (자동 축적)
- 참고: Reflect 연산의 "기존 기억에서 인사이트 생성" 패턴은 우리 build_context → 관련 노트 탐색과 유사하나, Hindsight는 이를 자동화함

**한계:**
- PostgreSQL 의존 → 우리 환경(SQLite 선호)과 미스매치
- LLM 호출이 Retain/Recall 모두에 필요 → 비용/지연
- 3.1k stars, MIT → 활발하지만 Vectorize.io 상용화 기반

## 💬 도입 검토 — orchestration.db + logs 대체 가능성 (2026-03-13 대화)

### 질문: "우리 logs와 orchestration DB를 대체할 수 있을까?"

#### Hindsight 3경로 ↔ 현재 시스템 매핑

| Hindsight | 현재 시스템 | 대체 가능? |
|-----------|------------|-----------|
| **World** (환경 사실) | LTM의 `[fact]` Observation + Concept 노트 | ✅ 가능 |
| **Experiences** (에이전트 상호작용) | STM의 `orchestration_log` | ⚠️ 부분적 |
| **Mental Models** (반성으로 형성된 이해) | LTM의 Note/Hub 노트 | ⚠️ 부분적 |

#### orchestration_log 대체 불가 사유

| 기능 | Hindsight | 판정 |
|------|-----------|------|
| PDCA 단계 추적 (Plan→Do→Check→Act) | 경험을 "기록"하지만 워크플로우 상태 머신이 아님 | 🔴 치명적 |
| QDMR 의존성 (`#a → #b → #c`) | 엔터티 관계는 있지만 task 간 실행 순서 표현 불가 | 🔴 치명적 |
| 상태 관리 (blocked, deferred, superseded) | 기억은 immutable, 상태 전이 개념 자체 없음 | 🔴 치명적 |
| 시간 기반 회고 | Time-range 검색 우수 | 🟢 |

**결론: 1:1 대체 불가. orchestration.db는 "작업 관리 도구", Hindsight는 "경험 기억 도구" — 역할이 다르다.**

#### 에피소딕 메모리 이관 검토

현재 에피소딕 메모리 3곳: `orchestration_log` (구조화 task) + `06. logs/LOG-NNN` (서사 에피소드) + `SYSTEM_CHANGELOG` (롤링 인덱스)

LOG-NNN을 Hindsight Experiences로 옮기면 wikilink 연결, 인간 편집, Obsidian 그래프뷰 통합이 깨진다. 제텔카스텐 철학과 충돌.

#### 도출된 도입 방향: "대체"가 아니라 "보강"

Hindsight는 **세세한 맥락의 자동 축적 레이어**로 도입한다:

```
orchestration_log  → "뭐 했다"     (한 줄 요약)
LOG-NNN            → "왜 그랬다"   (서사, 선별적)
Hindsight          → "그때 뭘 보고 뭘 느꼈다" (전체 맥락, 자동)
```

현재 사라지는 정보 — task 수행 중 비교한 것, 고민한 것, 결정 근거, 중간 판단 — 를 Hindsight가 자동 Retain하여 보존한다.

#### 이중 에피소딕 구조

| | 인간 에피소딕 (`06. logs/`) | 에이전트 에피소딕 (Hindsight) |
|---|---|---|
| **기록 대상** | 큰 결정, 시스템 변경, 교훈 | 모든 task completion의 전체 맥락 |
| **작성 주체** | 에이전트 초안 → 인간 검토 | 완전 자동 (Retain) |
| **독자** | 인간 + 에이전트 | 에이전트만 |
| **빈도** | 주 1-2건 (선별) | 매 task마다 |
| **검색** | Grep, build_context | 4종 Recall + RRF |

#### 지식 관리 환류 경로

```
매 task → Hindsight Retain (자동, 전부)
  → Experiences 축적 (세세한 맥락)
    → 주기적 Reflect
      → Mental Models 자동 생성 ("반복되는 패턴은 X다")
        → 유의미한 인사이트 → 04. notes/ 또는 02. hubs/로 승격
          (인간이 판단해서 제텔카스텐에 편입)
```

현재 Reflect 단계(Hub/Note 작성)를 사람이 수동으로 하고 있으나, Hindsight가 **원재료 축적 + 초벌 패턴 도출을 자동화**하고, 최종 판단과 볼트 편입은 인간이 담당하는 구조.

## 🔗 관련 개념

- [[Basic Memory MCP 완전 가이드]] - (동일 문제(에이전트 메모리)의 다른 접근 — Basic Memory는 Markdown+wikilink, Hindsight는 PostgreSQL+LLM 추출)
- [[컨텍스트-메모리 통합 (Context-Memory Integration)]] - (Hindsight의 3경로 구조가 이 허브의 "컨텍스트 엔지니어링 = 메모리 관리" 명제의 구현체)
- [[MCP (Model Context Protocol)]] - (Hindsight도 MCP 서버로 제공 가능 — 에이전트 메모리를 표준 프로토콜로 노출)
- [[Three-Layer Memory Architecture]] - (Hindsight 도입 시 3계층 아키텍처의 STM/LTM 사이에 에이전트 에피소딕 레이어 추가)
- [[_Vault Conventions]] - (시맨틱/에피소딕 분리 원칙 — Hindsight는 에피소딕의 해상도를 높이는 보강)

---

**작성일**: 2026-03-13
**분류**: Agent Memory, Knowledge Management, Retrieval
**출처**: https://github.com/vectorize-io/hindsight (Vectorize.io, MIT, 3.1k stars)