---
title: REF-071 ALMA - Automated Meta-Learning of Memory Designs for Agentic Systems
type: paper-review
permalink: sources/reference/alma-meta-learning-memory-designs
tags:
- meta-learning
- agent-memory
- continual-learning
- open-ended-evolution
- ICML2026
date: 2026-03-05
---

# ALMA: 에이전트 메모리 설계를 메타학습으로 자동 발견

ICML 2026 | Yiming Xiong, Shengran Hu, Jeff Clune | [코드](https://github.com/zksha/alma.git)

FM의 stateless 특성을 극복하기 위해, **Meta Agent가 코드 기반 탐색 공간에서 메모리 설계를 자동으로 발견**하는 프레임워크. 인간 설계 메모리를 평균 12.8% 능가.

## 📖 핵심 아이디어

에이전트 메모리를 사람이 직접 설계하는 대신, Python 코드로 표현된 메모리 설계를 **메타학습으로 자동 탐색**한다. 두 가지 추상 인터페이스(`general_update`, `general_retrieve`)만 정의하면, ALMA가 개방형 탐색(open-ended exploration)으로 도메인에 특화된 메모리 구조를 발견한다.

핵심 통찰: 탐욕적 선택(greedy)보다 **개방형 탐색이 더 우수** (ALFWorld GPT-5-mini: 87.1% vs 77.1%).

## 🛠️ 구성 요소

| 구성요소 | 역할 |
|----------|------|
| Meta Agent (GPT-5) | 메모리 설계를 코드로 제안·구현 |
| 평가 에이전트 (GPT-5-nano) | 제안된 설계를 벤치마크에서 평가 |
| 아카이브 | 발견된 메모리 설계 저장소 (성공률+빈도 기반 샘플링) |
| 추상 인터페이스 | `general_update()` (경험→메모리) + `general_retrieve()` (메모리→작업) |

## 🔧 작동 방식

```
초기화 (빈 템플릿으로 아카이브)
  ↓
아카이브에서 설계 샘플링 (성공률+빈도 기반)
  ↓
Meta Agent가 반영 → 새 아이디어/계획 → 코드 구현
  ↓
샌드박스에서 검증·평가 (오류 시 최대 3회 자기반성)
  ↓
아카이브에 추가
  ↓
반복 (11 단계, 43개 설계 발견)
```

**평가 2단계**: (1) 메모리 수집 단계 — 지식 축적 (2) 배포 단계 — 정적/동적 모드로 성능 측정

## 💡 주요 결과

### GPT-5-mini 전이 결과 (no-memory 대비)

| 벤치마크 | no-memory | ALMA | 향상 |
|----------|-----------|------|------|
| ALFWorld | 67.6% | **87.1%** | +19.5% |
| TextWorld | 60.5% | **75.0%** | +14.5% |
| Baba Is AI | 21.4% | **33.3%** | +11.9% |
| MiniHack | 15.0% | **20.0%** | +5.0% |

- **전체 평균 +12.8%**, 모든 벤치마크에서 인간 설계 기준선 능가
- 비용: 전체 메모리 비용 $0.09 (매우 효율적)
- 더 강력한 FM으로의 **전이 가능성** 입증 (nano에서 학습 → mini에서 테스트)

### 도메인별 자동 특화

| 도메인 유형 | 벤치마크 | 발견된 메모리 특징 |
|------------|----------|-------------------|
| 객체 상호작용 | ALFWorld, TextWorld | 객체 간 공간 관계, 방 레이아웃 저장 |
| 복잡한 추론 | Baba Is AI, MiniHack | 전략 라이브러리, 계획 합성, 추상 전략 |

### MiniHack에서 발견된 5-Layer 메모리 구조

1. **TaskSchemaLayer** — 게임 컨텍스트를 구조화된 스키마로 파싱
2. **StrategyLibraryLayer** — DB에서 전략/계획 검색·요약
3. **SpatialPriorLayer** — 엔티티-행동 관계 지식 그래프 (NetworkX)
4. **RiskAndInteractionLayer** — 위험 관리 휴리스틱 (Chroma DB)
5. **ReflexRulesLayer** — 즉각적 무상태 조언 생성

## 🔬 기술 세부사항

- DB: Chroma (벡터), NetworkX (그래프)
- 임베딩: text-embedding-3-small
- 비교 기준선: Trajectory Retrieval, ReasoningBank, Dynamic Cheatsheet, G-memory

## ⚠️ 한계

- 사전 정의된 학습 세트 사용 (온라인 학습 미지원)
- FM 코딩 능력에 의존 (네이티브 메모리 아키텍처 미탐색)
- 비용 효율성을 명시적으로 최적화하지 않음 (파레토 프론트 미탐색)
- 안전: 학습된 메모리에 의도치 않은 동작 가능 → 샌드박스+인간 감독 필요

## 🔗 관련 개념

- [[A-Mem - LLM 에이전트를 위한 자율 메모리 시스템 (Agentic Memory)]] - (A-Mem은 Zettelkasten 기반 자율 메모리, ALMA는 메타학습으로 메모리 구조 자체를 자동 발견 — 상호 보완적 접근)
- [[MemSkill - 자기진화 메모리 스킬]] - (MemSkill은 PPO로 컨트롤러 최적화, ALMA는 코드 기반 개방형 탐색 — 메모리 최적화의 다른 전략)
- [[Meta-Learning (메타러닝)]] - (ALMA의 핵심 패러다임, 학습하는 방법을 학습)

---

**작성일**: 2026-03-05
**분류**: AI Agent Memory / Meta-Learning