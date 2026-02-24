---
title: Memory.md Compaction 전략 - Attention Matching에서 배운 것
type: workcase
permalink: sources/workcases/memory-compaction-from-attention-matching
tags:
- memory-management
- prompt-caching
- compaction
- attention-matching
- claude-code
---

# Memory.md Compaction 전략 - Attention Matching에서 배운 것

> CLAUDE.md, Memory.md 등 최상위 주입 문서의 프롬프트 캐싱 전략을 운영하면서, Attention Matching 논문(REF-058)의 KV 압축 기법에서 사람이 관리하는 메모리 문서 압축에 적용할 수 있는 원칙을 도출.

## 1. 전체 흐름

```
[Memory.md 항목이 누적]
        │
        ▼
┌─────────────────────────────────┐
│ 1. Reference Queries 정의       │  "나는 주로 어떤 작업을 시키는가?"
│    → 활용 빈도 > 참조 빈도      │
└─────────┬───────────────────────┘
          ▼
┌─────────────────────────────────┐
│ 2. Key Selection                │
│    빈도(1차 필터)               │
│    + 커버리지/직교성(2차 필터)   │  ← OMP 방식
│    + 도메인별 최소 1개 보존      │
└─────────┬───────────────────────┘
          ▼
┌─────────────────────────────────┐
│ 3. β Fitting (가중치 조정)      │  합쳐진 항목에 대표성 표시
│    "이 항목은 N개를 대표"        │
└─────────┬───────────────────────┘
          ▼
┌─────────────────────────────────┐
│ 4. Value Fitting (Rewrite)      │  ← 손실 최소화의 핵심
│    남은 항목을 다시 써서         │
│    삭제된 항목의 정보 흡수       │
└─────────────────────────────────┘
```

## 2. 핵심 개념

### 빈도 기반 vs 커버리지 기반

논문은 두 가지 key selection을 비교한다:

| 방법      | 논문 용어             | Memory.md 대응     | 품질  |
| ------- | ----------------- | ---------------- | --- |
| 빈도 기반   | Highest-Attn Keys | 자주 참조된 항목 남기기    | 좋음  |
| 커버리지 기반 | OMP               | 서로 다른 영역을 골고루 커버 | 최고  |

빈도만 보면 자주 쓰이는 항목끼리 **중복이 많고**, 드물지만 유일한 항목이 소실된다. OMP 방식은 선택된 subset이 전체 query 공간을 최대한 커버하도록 보장.

### 참조 빈도 vs 활용 빈도

```
참조 빈도: "이 항목이 컨텍스트에 몇 번 포함되었나"
활용 빈도: "이 항목이 실제 응답 생성에 영향을 줬나"

→ 활용 빈도가 더 정확한 compaction 기준
→ 논문의 Reference Queries = "모델이 실제로 생성할 법한 query"
```

### Value Refit이 핵심

논문 결론: **"뭘 남기느냐"보다 "남긴 걸 어떻게 다시 쓰느냐"가 품질 손실을 더 크게 좌우한다.**

```
❌ 5개 중 1개만 남기고 4개 삭제 (원본 유지)
✅ 5개를 1개로 합치면서 rewrite (삭제분 흡수)

예:
Before (5 entries):
  - prefix caching은 prefix matching 방식
  - 도구 순서 변경하면 캐시 미스
  - 모델 전환 시 subagent 사용
  - compaction buffer 미리 확보
  - 캐시 TTL 5분

After (1 entry, refitted):
  "프롬프트 캐싱: prefix matching 방식이므로 도구/모델 불변 유지,
   전환 필요시 subagent 위임. compaction시 buffer 확보. TTL 5분."
```

### Nonuniform Budget → CLAUDE.md / MEMORY.md 이원화

논문에서 attention head별 민감도가 다르듯, 최상위 주입 문서도 역할에 따라 압축 전략이 달라야 한다.

**논문 원문**: head마다 압축 민감도가 다르므로 budget을 불균등 배분.
**실무 적용**: CLAUDE.md와 MEMORY.md에 서로 다른 압축 강도 적용.

```
CLAUDE.md = 민감한 head = 덜 공격적 압축
  - 에이전트 규칙, 폴더 구조, 도구 정의 등
  - 바뀌면 전체 동작이 흔들림
  - 카테고리/구조 중심 — "뼈대"

MEMORY.md = 둔감한 head = 공격적 압축 + 자주 refit
  - 작업 중 학습한 선호, 패턴, 컨텍스트
  - 빈도 추적 → 넘치면 refit으로 합치기
  - 항목 단위 — "살"
```

| | CLAUDE.md | MEMORY.md |
|---|-----------|-----------|
| **변경 빈도** | 거의 안 바뀜 | 자주 바뀜 |
| **캐시 효율** | prefix 앞쪽 → 캐시 히트↑ | 뒤쪽 or 세션 간 변경 |
| **압축 전략** | 카테고리 유지, 구조 보존 | 항목 합치기, rewrite 허용 |
| **손실 허용** | 낮음 (규칙 빠지면 오작동) | 높음 (디테일 하나 빠져도 동작) |

**주의**: 논문에서 head 민감도는 입력에 무관하다고 실험으로 확인됨. CLAUDE.md/MEMORY.md의 민감도 차이도 작업 종류와 무관할 가능성이 높지만, 이는 아직 검증 필요한 가정.

## 3. 실제 적용

### Compaction 판단 체크리스트

```
항목 삭제 전 3가지 확인:
  □ 이 항목의 영역을 대체하는 다른 항목이 있는가? (커버리지)
  □ 이 항목이 없으면 어떤 종류의 작업이 품질 하락하는가? (민감도)
  □ 남기는 항목에 이 정보를 흡수시킬 수 있는가? (value refit)
```

### Prompt Caching과의 시너지

| 캐싱 원칙 (Thariq) | Compaction 원칙 (이 workcase) |
|--------------------|-----------------------------|
| 정적 → 동적 배치 순서 | 압축 후에도 배치 순서 유지 |
| 시스템 프롬프트 변경 금지 | Memory.md 변경은 세션 간에만 |
| compaction buffer 확보 | compact된 항목이 buffer 내 수용되는지 확인 |

## 4. 실전 적용 결과 (2026-02-24)

### 적용 대상 및 성과

| 파일 | Before | After | 절감 | 주요 기법 |
|------|--------|-------|------|-----------|
| MEMORY.md | 71줄 | 56줄 | -21% | 도구경로 4→1, 스킬 3→1, WSL tmux→archive |
| CLAUDE.md Orchestrator | 59줄 | 37줄 | -37% | 에이전트 table→inline, 스킬 table→pointer |
| CLAUDE.md Worker | 57줄 | 35줄 | -39% | Task도구 table→inline, 체크리스트 merge |
| CLAUDE.md Global | 12줄 | 12줄 | — | 이미 compact |
| **합계** | **199줄** | **140줄** | **-30%** | **정보 손실 0** |

### 실제 Refit 사례

**가장 효과적**: 환경/설정 도구 경로 (4줄→1줄)
```
Before:
  - vecsearch → `...\vecsearch.py` (시맨틱 검색, e5-large 1024d)
  - winsearch → `...\winsearch` (bash 래퍼, Windows Search Index CLI...)
  - custom tools PATH → `~/.bashrc`에 `/c/claude-workspace/_system/tools` 등록됨
  - rpg-extract → `...\rpg-extract` (ast-grep 기반 RPG 관계 자동 추출...)

After:
  - **CLI 도구** → PATH: `_system/tools/` (`~/.bashrc` 등록).
    vecsearch(시맨틱, e5-large 1024d), winsearch(Windows Search Index),
    rpg-extract(ast-grep AST관계, py/js/ts). 상세: 스킬 `cli-guide.md`
```

**두 번째**: Orchestrator 스킬 table (10줄→2줄)
```
Before: 7행 table (스킬명 | 파일명 | 용도)
After: → `.claude/skills/` 참조. 주요: task-decomposition-guide, ...
이유: 스킬은 SKILL.md에서 자기기술적 → 중복 목록 불필요
```

### Nonuniform Budget 실측

| 도메인 | 민감도 | 실제 압축률 | 판단 근거 |
|--------|--------|-----------|-----------|
| 환경/설정 (경로) | **낮음** | 14→5 (64%) | 경로는 안 변함, 포인터만 유지 |
| 프로젝트/개념 도메인 | 중간 | 변경 없음 | 이미 1항목=1포인터, 압축 여지 없음 |
| 패턴/전략 | **높음** | 10→6 (40%) | 행동 규칙이라 보수적 접근 |
| 트러블슈팅 | 혼합 | 7→5 (29%) | 결론난 항목만 archive |

### 아카이브 정책
- 결론 완료 + 재사용 가능성 극저 → `archive.md`로 이동 (삭제 아님)
- 첫 아카이브: WSL tmux (결론: "실용성 낮아 in-process 권장")

## 발전 경로

```
[1] BrainDump Butler 코드 분석 (2026-02-10)
    │  frequency 카운터로 태그 중요도 판단하는 패턴 발견
    │  → "MEMORY.md에도 빈도 추적을 적용하자"
    │
    ▼
[2] MEMORY.md에 빈도 추적 도입
    │  자주 참조되는 도메인에 가중치 자동 조정
    │  → 추후 넘쳤을 때 compact 근거로 활용 목적
    │
    ▼
[3] Attention Matching 논문 (2026-02-24, REF-058)
    │  빈도만으로는 부족하다는 것을 발견:
    │  - 빈도 높은 항목끼리 중복 多 (커버리지 부족)
    │  - 드물지만 유일한 항목 소실 위험
    │  → 빈도(1차 필터) + 커버리지/직교성(2차 필터) 병행
    │  → 삭제 대신 refit (남은 항목 rewrite로 삭제분 흡수)
    │
    ▼
[현재] CLAUDE.md/MEMORY.md 이원화 전략
       - CLAUDE.md: 뼈대, 카테고리 중심, 덜 공격적 압축
       - MEMORY.md: 살, 항목 단위, 빈도+커버리지+refit으로 공격적 압축
```

## 관련 Task

- 대화 기반 도출 (2026-02-24): REF-058 논문 리뷰 → 개념 추출 → 실무 적용 논의
- 1차 실전 적용 (2026-02-24): MEMORY.md 71→56줄, CLAUDE.md 3-tier 128→84줄 compaction 실행

## 영감 출처

- BrainDump Butler의 `tags.json` → `{ tag: { description, related, frequency } }` 구조에서 frequency 카운터로 중요도를 판단하는 패턴을 발견하여 MEMORY.md 빈도 추적에 착안
- 출처: [[BrainDump Butler 코드 분석 (Code Analysis)]] (2026-02-10)

## Observations

- [pattern] 빈도 기반 pruning은 1차 필터로 유효하나, 커버리지(직교성) 없이는 "드물지만 유일한" 항목이 소실된다 #compaction #frequency
- [pattern] 손실 최소화의 핵심은 삭제가 아니라 refit — 남은 항목을 다시 써서 삭제분을 흡수하는 것 #value-fitting #rewrite
- [method] 도메인별 최소 1개 보존 규칙으로 커버리지 보장 #budget #coverage
- [method] 참조 빈도가 아닌 활용 빈도(실제 응답에 영향)를 compaction 기준으로 사용 #frequency #metric
- [fact] Attention Matching의 4단계(Reference Query → Key Selection → β Fitting → Value Fitting)가 사람의 메모리 문서 관리에도 그대로 대응됨 #attention-matching #analogy
- [tech] Memory.md 변경은 prefix cache를 무효화하므로 세션 간에만 수행 #prompt-caching #ttl

- [pattern] frequency 기반 중요도는 BrainDump Butler에서 착안 → Attention Matching 논문에서 커버리지+refit으로 보완 — 단일 논문이 아니라 누적 학습의 결과 #evolution #learning-path
- [method] CLAUDE.md(뼈대/카테고리)는 덜 공격적, MEMORY.md(살/항목)는 공격적 압축 — Nonuniform Budget의 실무 적용 #nonuniform-budget #two-file-strategy
- [result] 1차 실전 적용: 199→140줄(-30%) 정보 손실 0. Value Refit이 가장 효과적 기법 (도구경로 4→1줄이 대표 사례) #compaction #실전
- [result] Nonuniform Budget 실측: 환경/설정(경로)이 민감도 최저→압축률 최고(64%), 패턴/전략이 민감도 최고→보수적(40%) #budget #sensitivity
- [result] table→inline 변환이 CLAUDE.md에서 가장 큰 절감 (스킬 table 10→2줄, Task도구 7→1줄). 자기기술적 항목의 중복 목록은 포인터로 대체 가능 #table-to-inline #self-descriptive
- [insight] 아카이브 ≠ 삭제. "결론 완료 + 재사용 극저" 항목만 archive.md로 이동하면 복구 가능성 유지 #archive #reversibility
- [insight] CLAUDE.md와 MEMORY.md는 압축 전략이 달라야 함 — CLAUDE.md는 구조 보존+밀도 증가(table→inline), MEMORY.md는 항목 merge+rewrite. 이 차이가 prefix caching 구조(앞=안정, 뒤=유연)와 정확히 대응 #prompt-caching #compaction-strategy

## Prompt Caching과의 시너지
### Prompt Caching과의 시너지

캐시 구조: `[시스템 프롬프트] → [CLAUDE.md 3-tier] → [MEMORY.md] → [대화]`
prefix matching이므로 앞쪽이 안정적일수록 캐시 히트율↑.

|  | CLAUDE.md | MEMORY.md |
|--|-----------|-----------|
| **변경 빈도** | 거의 안 바뀜 | 자주 바뀜 |
| **캐시 역할** | prefix 앞쪽 → 캐시 히트↑ | 뒤쪽 or 세션 간 변경 |
| **압축 전략** | 카테고리 유지, 구조 보존 (table→inline OK, 섹션 삭제 NO) | 항목 합치기, rewrite 허용 |
| **손실 허용** | **낮음** — 규칙 빠지면 오작동 | **높음** — 디테일 하나 빠져도 동작 |
| **실전 압축률** | -34% (구조 보존하며 inline화) | -21% (Value Refit 중심) |

→ CLAUDE.md는 **구조를 건드리지 않고 밀도만 올리는** 압축 (table→inline, 중복 목록→pointer).
→ MEMORY.md는 **항목을 합치고 rewrite하는** 압축 (4→1 merge, archive 이동).
→ 이 차이가 프롬프트 캐싱과 정확히 맞물림: 앞쪽(CLAUDE.md)은 안정, 뒤쪽(MEMORY.md)은 유연.

