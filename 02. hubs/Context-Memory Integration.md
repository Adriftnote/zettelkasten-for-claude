---
title: Context-Memory Integration
type: hub
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

- [insight] Context Engineering과 Memory Architecture는 동일한 문제의 양면 - 토큰 최적화 vs 정보 저장/검색 #context-engineering #memory
- [insight] Fast-Slow 프랙탈이 통합의 열쇠 - 인간 사고(시스템1/2), AI 메모리, 컴퓨터 캐시 모두 같은 구조 #fast-slow #architecture
- [insight] Context 문제마다 대응하는 Memory 해결책이 있다 - Poisoning→격리, Distraction→분리, Lost-in-Middle→캐시 #pattern-matching
- [path] Context 문제 정의 → Memory 계층 매핑 → Fast-Slow 프랙탈 이해 → 통합 솔루션 #learning

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

- organizes [[context-poisoning]] (1a. 오류 축적/강화 문제와 STM 격리 해결책
- organizes [[context-distraction]] (1b. 무관한 정보 분산 문제와 LTM 분리 해결책
- organizes [[context-confusion]] (1c. 여러 작업 혼동 문제와 Task 기반 STM 해결책
- organizes [[context-clash]] (1d. 상충 정보 문제와 명시적 충돌 해결
- organizes [[lost-in-middle]] (1e. 중간 정보 회수율 저하와 Knowledge Cache 해결책
  - part_of [[anchored-iterative-summarization]] (1e1. 앵커 기반 요약 기법 (해결책)
- organizes [[three-layer-memory-architecture]] (2. AI 메모리의 물리적 계층
  - part_of [[working-memory]] (2a. 컨텍스트 윈도우, VRAM
    - part_of [[knowledge-cache]] (2a1. Fast Path, 핵심 트리플만
  - part_of [[short-term-memory]] (2b. 단기기억, SQLite orchestration.db
  - part_of [[long-term-memory]] (2c. 장기기억, Obsidian/Basic Memory
- organizes [[progressive-disclosure]] (3a. Memory 계층 로딩 패턴 (Cache → STM → LTM)
- organizes [[four-bucket-optimization]] (3b. Memory 관리 전략 (Write/Select/Compress/Isolate)
- organizes [[observation-masking]] (3c. Memory 압축 기법
- connects_to [[context-engineering]] (Context 문제 정의와 최적화 기법)
- connects_to [[memory-systems]] (Memory 계층 구조와 관리 전략)
- connects_to [[optimization-patterns]] (최적화 전략과 패턴)
- connects_to [[architectures]] (시스템 아키텍처 설계)
- references [[03. sources/architectures/Three-Layer Memory Architecture]] (3계층 메모리 아키텍처)
- references [[03. sources/notes/Fast-Slow 프랙탈 - 도메인을 관통하는 구조]] (Fast-Slow 프랙탈 이론)
- references [[03. sources/reviews/AgeMem-paper-review]] (Age Memory 논문 리뷰)