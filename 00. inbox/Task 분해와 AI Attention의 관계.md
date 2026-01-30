---
title: Task 분해와 AI Attention의 관계
type: insight
tags:
- task-decomposition
- attention-mechanism
- LLM
- transformer
- claude-code
- cognitive-architecture
created: 2026-01-30
permalink: 00.-inbox/task-bunhaewa-ai-attentionyi-gwangye
---

# Task 분해와 AI Attention의 관계

**핵심 인사이트**: Task 분해 방법론과 Transformer의 Attention 메커니즘은 **같은 문제를 다른 층위에서 해결**하는 것이다.

---

## 1. 연결고리: 왜 관계가 있는가?

### 컨텍스트 윈도우 = Attention의 물리적 한계

Transformer Attention은 `O(n²)` 복잡도를 가진다.
- 토큰이 많아질수록 각 토큰에 할당되는 attention이 **희석**됨
- "Lost in the Middle" 현상: 긴 컨텍스트의 중간 정보를 놓침

**Task 분해의 본질**:
- 큰 작업 하나 → 긴 컨텍스트 → attention 분산 → 품질 저하
- 작은 작업 여러 개 → 짧은 컨텍스트 → attention 집중 → 품질 유지

> 20k 토큰 오버헤드 제약은 단순한 기술적 한계가 아니라 **attention 효율의 임계점**이다.

---

## 2. 분해 원칙과 Attention의 대응

### 독립성 = Attention 간섭 제거

```
[나쁜 예] 하나의 컨텍스트에 모든 것
┌─────────────────────────────────────┐
│ 보안 리뷰 + 성능 분석 + 코드 품질   │  ← Attention이 세 영역을 왔다갔다
└─────────────────────────────────────┘

[좋은 예] 독립적 컨텍스트
┌────────────┐ ┌────────────┐ ┌────────────┐
│ 보안 리뷰  │ │ 성능 분석  │ │ 코드 품질  │  ← 각자 100% 집중
└────────────┘ └────────────┘ └────────────┘
```

독립적 분해 → 각 Agent의 attention이 해당 작업에만 집중

### 측정 가능성 = Attention Anchor

명확한 완료 조건이 중요한 이유:

| 조건 | Attention 관점 |
|------|----------------|
| ❌ "성능 개선해줘" | 모호한 개념에 attention 분산 |
| ✅ "Lighthouse 90점, FCP < 1.5초" | 구체적 숫자가 **anchor** 역할 |

구체적인 기준 = 모델이 "이 조건을 만족하는가?"에 집중할 수 있는 **고정점**

### 작업 크기 = Attention 용량

"8-80시간" 권장 크기의 의미:
- 너무 작으면 → 오버헤드 대비 비효율
- 너무 크면 → attention 희석으로 품질 저하
- **적정 크기** = attention이 집중 가능하면서 의미 있는 작업 단위

---

## 3. 분해 패턴과 Attention 구조

| 패턴 | Attention 관점 | 설명 |
|------|----------------|------|
| **Pipeline** | Sequential Attention | 이전 단계 출력이 다음 단계의 attention key |
| **Parallel** | Multi-head Attention | 독립적 관점에서 동시 처리 |
| **Swarm** | Parallel Document Scan | 같은 query로 여러 document 병렬 스캔 |

---

## 4. 실용적 함의

### Task 분해 = Attention 배분 전략

> **"AI의 attention을 어떻게 효율적으로 배분할 것인가?"**

| 분해 전략 | Attention 효과 |
|-----------|----------------|
| 작게 쪼개기 | 각 조각에 attention 집중 → 품질 ↑ |
| 독립적으로 | attention 간섭 제거 → 일관성 ↑ |
| 명확하게 | attention anchor 존재 → 완료 판단 ↑ |

### 설계 원칙

1. **컨텍스트 예산 관리**: 각 Subagent에게 "attention 예산"을 할당한다고 생각
2. **간섭 최소화**: 서로 다른 작업이 같은 attention 공간을 두고 경쟁하지 않도록
3. **Anchor 설정**: 모든 Task에 attention이 고정될 수 있는 구체적 기준 포함

---

## 5. 확장: RAG Chunking과의 연결

> **RAG의 chunk 크기 결정도 정확히 같은 원리다.**

### Task 크기 vs Chunk 크기

| Task 분해 | RAG Chunking |
|-----------|--------------|
| 너무 작으면 → 오버헤드 낭비 | 너무 작으면 → 맥락 끊김, semantic coherence 붕괴 |
| 너무 크면 → attention 희석 | 너무 크면 → 노이즈 섞임, "needle in haystack" |
| 8-80시간 권장 | 256-1024 토큰 권장 (도메인마다 다름) |

### 공통 원칙

**1. 의미적 완결성**
- Task: "하나의 담당자가 완료할 수 있는 단위"
- Chunk: "하나의 의미 단위로 이해 가능한 범위"

**2. Attention 집중 가능 크기**
- Task: Subagent가 컨텍스트 내에서 집중할 수 있는 범위
- Chunk: Retrieve된 후 LLM이 "여기서 답을 찾아라"할 때 집중 가능한 범위

**3. 경계의 중요성**
- Task: 의존성 경계가 명확해야 병렬 가능
- Chunk: 문장/문단/섹션 경계에서 자르면 의미 보존

### 통합 프레임워크

```
[공통 원리]
"정보 처리 단위의 적정 크기 = Attention 효율의 최적점"

Task 분해    →  Agent의 attention 배분
RAG Chunk    →  Retrieval + Generation attention 배분
프롬프트 구조 →  In-context attention 배분
```

> **"LLM에게 뭔가를 시킬 때 얼마나 쪼갤 것인가"는 전부 같은 문제의 변주**

---

## 6. 확장 가능한 질문

- [x] RAG에서 chunk 크기 결정도 같은 원리인가? → **Yes, 위 섹션 참고**
- [ ] 프롬프트 엔지니어링의 "구체적으로 써라"도 attention anchor 관점?
- [ ] Human의 주의력 관리와 LLM attention 관리의 유사성?
- [ ] Sparse Attention이 Task 분해 패턴에 주는 시사점?

---

## 관련 노트

- [[Task 분해 방법론 리서치 - task-20260130-011]]

---

**출처**: 대화 중 발견한 인사이트
**작성일**: 2026-01-30