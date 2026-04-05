---
title: Context-Memory Integration
type: hub
permalink: hubs/context-memory-integration
tags:
- hub
- context-engineering
- memory
- integration
- three-layer
---

# Context-Memory Integration

**컨텍스트 엔지니어링 = AI 메모리 관리의 다른 이름**. 두 분야는 같은 문제를 다른 관점에서 바라본다. 이 허브는 둘을 통합하는 뷰를 제공한다.

---

## Observations

- [fact] Context Engineering과 Memory Architecture는 동일한 문제의 양면 #context-engineering #memory
- [fact] 컨텍스트 윈도우는 LLM의 Working Memory에 대응한다 — 인지 부하 이론의 용량 제한이 토큰 최적화의 원리를 설명 #working-memory #cognitive-load
- [fact] 사용자 레벨에서 컨텍스트 조절 가능 (/compact, /clear, build_context) #boundary
- [fact] 서비스 레벨 KV-Cache는 직접 제어 불가 #limitation
- [method] 토픽 기반 압축: `/compact Focus on [topic]` - 특정 주제 보존 #compact

---

## 📊 문제-해결책 대응표

| Context 문제 | 증상 | Memory 해결책 |
|-------------|------|--------------|
| **Poisoning** | 오류 축적/강화 | STM 격리 + `/forget` |
| **Distraction** | 무관한 정보가 주의 분산 | LTM 분리 + `/remember` |
| **Confusion** | 여러 작업 맥락 혼동 | Task 기반 STM + `/log` |
| **Lost-in-Middle** | 중간 정보 회수율 저하 | Knowledge Cache + `/load-cache` |
| **Clash** | 상충하는 정보 존재 | 명시적 충돌 해결 |

## Relations

- organizes [[context-poisoning]] (1a. 오류 축적/강화 문제와 STM 격리 해결책)
- organizes [[context-distraction]] (1b. 무관한 정보 분산 문제와 LTM 분리 해결책)
- organizes [[context-confusion]] (1c. 여러 작업 혼동 문제와 Task 기반 STM 해결책)
- organizes [[context-clash]] (1d. 상충 정보 문제와 명시적 충돌 해결)
- organizes [[lost-in-middle]] (1e. 중간 정보 회수율 저하와 Knowledge Cache 해결책)
  - part_of [[anchored-iterative-summarization]] (1e1. 앵커 기반 요약 기법)
- organizes [[Three-Layer Memory Architecture]] (2. AI 메모리의 물리적 계층)
  - part_of [[working-memory]] (2a. 컨텍스트 윈도우, VRAM)
    - part_of [[knowledge-cache]] (2a1. Fast Path, 핵심 트리플만)
  - part_of [[short-term-memory]] (2b. 단기기억, SQLite orchestration.db)
  - part_of [[long-term-memory]] (2c. 장기기억, Obsidian/Basic Memory)
- organizes [[progressive-disclosure]] (3a. Memory 계층 로딩 패턴)
- organizes [[four-bucket-optimization]] (3b. Memory 관리 전략)
- organizes [[observation-masking]] (3c. Memory 압축 기법)
- connects_to [[컨텍스트 엔지니어링 (Context Engineering)]] (Context 문제 정의와 최적화 기법)
- connects_to [[메모리 시스템 (Memory Systems)]] (Memory 계층 구조와 관리 전략)
- connects_to [[최적화 패턴 (Optimization Patterns)]] (최적화 전략과 패턴)
- connects_to [[아키텍처 (Architectures)]] (시스템 아키텍처 설계)
- references [[03. sources/architectures/Three-Layer Memory Architecture]] (3계층 메모리 아키텍처)

- references [[03. sources/reviews/AgeMem-paper-review]] (Age Memory 논문 리뷰)