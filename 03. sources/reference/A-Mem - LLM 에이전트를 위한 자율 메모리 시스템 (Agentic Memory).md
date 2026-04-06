---
title: A-Mem - LLM 에이전트를 위한 자율 메모리 시스템 (Agentic Memory)
type: paper-review
permalink: sources/reference/a-mem-agentic-memory
tags:
- AI
- LLM
- memory
- Zettelkasten
- agent
- RAG
date: 2026-02-10
---

# A-Mem - LLM 에이전트를 위한 자율 메모리 시스템

Rutgers University 연구팀이 Zettelkasten 방법론에서 영감받아 만든 LLM 에이전트용 메모리 시스템. 메모리가 스스로 조직화되고 진화하며, 사전 정의된 스키마 없이 동적으로 지식 네트워크를 형성한다.

## 📖 핵심 아이디어

기존 LLM 메모리 시스템(MemGPT, MemoryBank 등)은 사전 정의된 구조와 고정 워크플로우에 의존하여 새로운 환경에 적응하기 어렵다. A-Mem은 Zettelkasten의 3원칙(원자적 노트, 유연한 링킹, 지속적 진화)을 적용하여 메모리 자체가 능동적으로 조직화되고 진화하는 "에이전틱 메모리"를 구현했다. 핵심은 "에이전트가 메모리 구조를 정의하는 게 아니라, 메모리가 스스로 구조를 만들어간다"는 패러다임 전환.

## 🛠️ 구성 요소

### 메모리 노트 구조

각 메모리 노트 `m_i = {c_i, t_i, K_i, G_i, X_i, e_i, L_i}`

| 구성요소 | 기호 | 설명 |
|----------|------|------|
| 원본 콘텐츠 | c_i | 원래 상호작용 내용 |
| 타임스탬프 | t_i | 상호작용 시간 |
| 키워드 | K_i | LLM이 생성한 핵심 개념 |
| 태그 | G_i | LLM이 생성한 카테고리 |
| 맥락 설명 | X_i | LLM이 생성한 풍부한 의미론적 설명 |
| 벡터 표현 | e_i | dense vector (검색용) |
| 링크 집합 | L_i | 의미론적으로 연결된 메모리들 |

### 4대 핵심 프로세스

| 프로세스 | 설명 |
|----------|------|
| **1. Note Construction** | 상호작용 → 키워드(K), 태그(G), 맥락 설명(X) 자동 생성 + 벡터 임베딩 |
| **2. Link Generation** | 코사인 유사도로 top-k 관련 메모리 검색 → LLM이 공통 속성 분석 → 연결 설정 |
| **3. Memory Evolution** | 새 메모리 통합 시 기존 메모리의 맥락/키워드/태그 업데이트 여부 결정 |
| **4. Memory Retrieval** | 쿼리의 dense vector로 코사인 유사도 계산 → k개 관련 메모리 반환 |

## 🔧 작동 방식

```
[새로운 상호작용 발생]
        │
        ▼
┌─── 1. Note Construction ───┐
│  원본 콘텐츠 c_i 저장       │
│  LLM → 키워드 K_i 생성      │
│  LLM → 태그 G_i 생성        │
│  LLM → 맥락 설명 X_i 생성   │
│  Encoder → 벡터 e_i 생성    │
└─────────────────────────────┘
        │
        ▼
┌─── 2. Link Generation ──────┐
│  코사인 유사도로 top-k 검색   │
│  s = (e_n · e_j) / |e_n||e_j| │
│  LLM이 공통 속성 분석        │
│  → 의미 있는 연결 L_i 설정   │
└──────────────────────────────┘
        │
        ▼
┌─── 3. Memory Evolution ─────┐
│  각 연결된 메모리에 대해:     │
│  - 맥락 설명 업데이트?       │
│  - 키워드 업데이트?          │
│  - 태그 업데이트?            │
│  → 기존 메모리가 '진화'     │
└──────────────────────────────┘
        │
        ▼
  [지식 네트워크에 통합 완료]

        ... 나중에 쿼리 시 ...

┌─── 4. Memory Retrieval ─────┐
│  쿼리 → 벡터 변환            │
│  코사인 유사도 → top-k 반환  │
└──────────────────────────────┘
```

## 📊 실험 결과

### 데이터셋

| 데이터셋 | 설명 | 규모 |
|----------|------|------|
| LoCoMo | 장기 대화 QA | 9K tokens, 35 sessions, 7,512 QA pairs |
| DialSim | 다자간 장기 대화 (Friends, Big Bang Theory 등) | 350K tokens, 1,300 sessions |

### 성능 비교 (DialSim F1)

| 시스템 | F1 Score | vs A-Mem |
|--------|----------|----------|
| MemGPT | 1.18 | -192% |
| LoCoMo | 2.55 | -35% |
| **A-Mem** | **3.45** | - |

### 비용 효율성

| 항목 | A-Mem | 기존 (LoCoMo, MemGPT) |
|------|-------|----------------------|
| 토큰 사용량 | ~1,200/작업 | ~16,900/작업 |
| 비용 절감 | **85-93%** | - |
| 작업당 비용 | < $0.0003 | - |
| 처리 시간 (GPT-4o-mini) | 5.4초 | - |
| 처리 시간 (Llama 3.2 1b) | 1.1초 | - |

### Ablation Study

| 구성 | 결과 |
|------|------|
| Link Generation + Memory Evolution 모두 제거 | Multi-Hop, Open Domain에서 상당한 성능 저하 |
| Memory Evolution만 제거 | 중간 수준 (Link Generation만으로도 효과적) |
| **Full A-Mem** | **모든 카테고리 최고 성능** |

→ Link Generation이 기반, Memory Evolution이 보완. 둘 다 필수적이며 상호 보완적.

### 확장성

| 메모리 수 | 검색 시간 |
|-----------|----------|
| 1,000 | 0.31 μs |
| 1,000,000 | 3.70 μs |

공간 복잡도 O(N), 100만 엔트리에서도 마이크로초 단위 검색.

## 💡 실용적 평가

### 강점
- **Zettelkasten 원칙의 AI 적용**: 원자적 노트 + 유연한 링킹 + 지속적 진화 — 검증된 지식관리 방법론을 메모리 시스템으로
- **사전 정의 스키마 불필요**: 그래프 DB처럼 스키마를 미리 정하지 않아도 동적으로 구조 형성
- **극적인 비용 절감**: 토큰 85-93% 절감, 작업당 $0.0003 미만
- **Multi-Hop에서 압도적**: 여러 정보를 종합해야 하는 질문에서 기존 대비 2배 이상 성능
- **GitHub 코드 공개**: 벤치마크용 + 프로덕션용 레포 모두 제공

### 한계
- **LLM 의존성**: 메모리 품질이 기반 LLM 능력에 좌우됨 — 모델마다 다른 결과
- **텍스트 전용**: 이미지, 오디오 등 멀티모달 미지원
- **검증 범위**: 대화형 QA 위주 — 코드 생성, 에이전트 계획 등 다른 태스크에서의 검증 부족

### 적용 방안
- Basic Memory(우리 Obsidian 시스템)와 컨셉이 매우 유사 — 비교 연구 가치 있음
- 장기 대화 기반 AI 어시스턴트에 메모리 레이어로 적용 가능
- Compound Engineering Plugin의 Knowledge Capture 단계와 결합 가능성

## 📋 논문 메타데이터

| 항목 | 내용 |
|------|------|
| 제목 | A-Mem: Agentic Memory for LLM Agents |
| 저자 | Wujiang Xu, Zujie Liang, Kai Mei, Hang Gao, Juntao Tan, Yongfeng Zhang |
| 소속 | Rutgers University, AIOS Foundation |
| 페이지 | 28 |
| 벤치마크 코드 | https://github.com/WujiangXu/AgenticMemory |
| 프로덕션 코드 | https://github.com/WujiangXu/A-mem-sys |
| 임베딩 모델 | all-minilm-l6-v2 |
| 검색 k값 | 10 |

## 🔗 관련 개념

- [[Zettelkasten]] - A-Mem의 영감 원천, 원자적 노트 + 유연한 링킹 + 지속적 진화
- [[RAG (Retrieval-Augmented Generation)]] - A-Mem은 Agentic RAG보다 근본적 수준에서 agency 구현
- [[MemGPT]] - 캐시 아키텍처 기반 메모리, A-Mem 대비 F1 192% 낮음
- [[basic-memory]] - 우리가 사용하는 Obsidian 기반 메모리, A-Mem과 컨셉 유사
- [[Compound Engineering Plugin]] - Knowledge Capture 단계와 결합 가능성

---

**작성일**: 2026-02-10
**분류**: AI / LLM / 에이전트 메모리
**원본 GitHub**: https://github.com/WujiangXu/AgenticMemory