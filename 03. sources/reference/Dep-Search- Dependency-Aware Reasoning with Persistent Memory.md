---
title: 'Dep-Search: Dependency-Aware Reasoning with Persistent Memory'
type: paper-review
permalink: sources/reference/dep-search-persistent-memory
tags:
- paper-review
- multi-hop-qa
- agent-memory
- reinforcement-learning
- rag
- qdmr
---

# Dep-Search: Learning Dependency-Aware Reasoning Traces with Persistent Memory

## 메타데이터
- **저자**: Yanming Liu (Zhejiang Univ), Xinyue Peng (Intel) 외 8명
- **소속**: Zhejiang University, Intel, Tsinghua, MIT
- **페이지**: 26p

## 핵심 문제

기존 search 프레임워크의 한계:
- sub-question 간 의존성 관리 실패
- reasoning step 간 지식 손실
- RL 기반 최적 검색 전략 학습 필요

## 핵심 아이디어

### Control Tokens

| 토큰             | 기능                                       |
| -------------- | ---------------------------------------- |
| `<decompose>`  | 질문을 K개 sub-question으로 분해, DAG 구조로 의존성 표현 |
| `<retrieve>`   | 2단계 검색 (dense retrieval → re-ranking)    |
| `<memory>`     | 저장된 지식 접근 (embedding similarity)         |
| `<conclusion>` | 추론 결과를 fact sentences로 요약하여 메모리에 저장      |

### Persistent Memory System

- LRU buffer with fixed capacity 사용
- fact sentences in natural language 저장
- cross-step knowledge reuse 가능

**특징**:
- 학습 파라미터 없음 (environment transition의 일부)
- 최적 용량: 15 entries
- 용량 초과 시 LRU 방식으로 eviction

### QDMR Decomposition

- adaptive dependency modeling 생성
- sequential decomposition보다 우수
- topological ordering of sub-questions 가능

Sequential → Two-step → **QDMR (Best)**

### GRPO 학습

```
Objective: max_θ E[R(τ)]
State: S_t = (T_t, C_t, M_t)  // trace, context, memory
Reward: R(τ) = R_ans - R_ret - R_dec
```

- Trajectory 단위 학습으로 credit assignment 개선
- Group-relative advantage로 질문 난이도 차이 보정

## 실험 결과

### 벤치마크 성능 (7B 모델)

| Dataset | Score |
|---------|-------|
| NQ | 53.80 |
| TriviaQA | 72.00 |
| HotpotQA | 44.40 |
| 2WikiMHQA | 45.20 |
| Musique | 22.20 |
| **Average** | **49.77** |

vs HierSearch +3점, vs O²-Searcher +4점

### Ablation (3B 모델)

| Component | Impact |
|-----------|--------|
| Memory Module | **-5.25** (가장 중요) |
| QDMR Decomposition | -3.32 |
| Conclusion Summarization | -1.99 |

### Memory Capacity 분석

- 1 entry: 38.1 (부족)
- **15 entries: 42.3** (최적)
- 50 entries: 40.8 (노이즈)

## 핵심 인사이트

1. Persistent Memory가 multi-hop reasoning에서 가장 중요한 컴포넌트
2. QDMR이 sequential decomposition보다 유의미하게 우수
3. 적정 memory capacity가 reuse efficiency와 noise 균형 유지
4. Memory access는 선택적 (retrieval 빈도의 40-50%)
5. 큰 모델일수록 structured reasoning에서 더 큰 절대적 향상

## 적용 가능성

- **Agent Memory 설계**: LRU + fact sentence 방식 참고
- **Task Decomposition**: QDMR의 DAG 기반 의존성 모델링
- **RAG 개선**: retrieve/memory 분리로 효율성 향상

## 한계 및 Future Work

- QA 외 broader reasoning scenarios 확장 필요
- Dynamic memory management 전략 개발
- Wikipedia 외 다양한 knowledge source 통합
- Cross-question memory sharing 탐색

## Relations

- relates_to [[Agentic RL]] (강화학습 기반 에이전트)
- relates_to [[RAG]] (검색 증강 생성)
- extends [[Search-R1]] (기존 검색 프레임워크 확장)
- relates_to [[Agent Memory Systems]] (에이전트 메모리 시스템)
