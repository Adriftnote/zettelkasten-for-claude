---
title: Context-Memory Integration
type: note
permalink: 02.-hubs/context-memory-integration
tags:
- hub
- context-engineering
- memory
- integration
- fast-slow
- three-layer
---

# Context-Memory Integration

**컨텍스트 엔지니어링 = AI 메모리 관리의 다른 이름**. 두 분야는 같은 문제를 다른 관점에서 바라본다. 이 허브는 둘을 통합하는 뷰를 제공한다.

---

## Observations

### 핵심 인사이트
- [insight] Context Engineering과 Memory Architecture는 **동일한 문제의 양면** - 토큰 최적화 vs 정보 저장/검색
- [insight] **Fast-Slow 프랙탈**이 통합의 열쇠 - 인간 사고(시스템1/2), AI 메모리, 컴퓨터 캐시 모두 같은 구조
- [insight] Context 문제마다 대응하는 Memory 해결책이 있다 - Poisoning→격리, Distraction→분리, Lost-in-Middle→캐시

### 진입점
- [entry] [[03. sources/notes/Fast-Slow 프랙탈 - 도메인을 관통하는 구조|Fast-Slow 프랙탈]] - 이 허브의 이론적 기반

### 인덱싱 (루만식)

**Context 문제 → Memory 해결책**
- [index:1] Context 문제 유형 (컨텍스트 품질을 저해하는 문제들)
  - [index:1a] [[context-poisoning]] → STM 격리 + 세션 재시작
  - [index:1b] [[context-distraction]] → LTM 분리 (불필요한 건 저장)
  - [index:1c] [[context-confusion]] → Task 기반 STM 분리
  - [index:1d] [[context-clash]] → 명시적 충돌 해결
  - [index:1e] [[lost-in-middle]] → Knowledge Cache (핵심만 유지)
    - [index:1e1] [[anchored-iterative-summarization]] → 앵커 기반 요약 (해결책)

**Memory 계층**
- [index:2] 3계층 메모리 구조 (AI 메모리의 물리적 계층)
  - [index:2a] Working Memory (컨텍스트 윈도우, VRAM)
    - [index:2a1] Knowledge Cache - Fast Path, 핵심 트리플만
  - [index:2b] STM (단기기억, SQLite orchestration.db)
  - [index:2c] LTM (장기기억, Obsidian/Basic Memory)

**패턴 매핑**
- [index:3] Context-Memory 패턴 매핑 (동일 패턴의 다른 이름)
  - [index:3a] [[progressive-disclosure]] = Memory 계층 로딩 (Cache → STM → LTM)
  - [index:3b] [[four-bucket-optimization]] = Memory 관리 전략 (Write/Select/Compress/Isolate)
  - [index:3c] [[observation-masking]] = Memory 압축

---

## 📊 문제-해결책 대응표

| Context 문제 | 증상 | Memory 해결책 |
|-------------|------|--------------|
| **Poisoning** | 오류 축적/강화 | STM 격리 + `/forget` |
| **Distraction** | 무관한 정보가 주의 분산 | LTM 분리 + `/remember` |
| **Confusion** | 여러 작업 맥락 혼동 | Task 기반 STM + `/log` |
| **Lost-in-Middle** | 중간 정보 회수율 저하 | Knowledge Cache + `/load-cache` |
| **Clash** | 상충하는 정보 존재 | 명시적 충돌 해결 |

## 🔮 Fast-Slow 프랙탈

| 도메인 | Fast (빠름/저렴) | Slow (느림/정확) |
|--------|-----------------|-----------------|
| 인간 사고 | 시스템1 (직관) | 시스템2 (분석) |
| AI 메모리 | Knowledge Cache | LTM 검색 |
| 컨텍스트 최적화 | Progressive Disclosure | Full Context Load |
| 컴퓨터 | CPU Cache | Main Memory |

**공통 메커니즘**: Fast 먼저 → 필요시 Slow로 전환

---

## Relations

### 이 허브가 관리하는 노트들
- organizes [[context-poisoning]]
- organizes [[context-distraction]]
- organizes [[context-confusion]]
- organizes [[context-clash]]
- organizes [[lost-in-middle]]
- organizes [[progressive-disclosure]]
- organizes [[four-bucket-optimization]]
- organizes [[observation-masking]]
- organizes [[anchored-iterative-summarization]]

### 다른 허브와의 연결
- connects_to [[context-engineering]] (Context 문제 정의)
- connects_to [[memory-systems]] (Memory 계층 구조)
- connects_to [[optimization-patterns]] (최적화 전략)
- connects_to [[architectures]] (시스템 아키텍처)

### 참조 소스
- references [[03. sources/architectures/Three-Layer Memory Architecture]]
- references [[03. sources/notes/Fast-Slow 프랙탈 - 도메인을 관통하는 구조]]
- references [[03. sources/reviews/AgeMem-paper-review]]