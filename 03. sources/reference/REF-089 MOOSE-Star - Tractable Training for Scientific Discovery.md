---
title: REF-089 MOOSE-Star - Tractable Training for Scientific Discovery
type: paper-review
permalink: sources/reference/moose-star-tractable-training-scientific-discovery
tags:
- scientific-discovery
- LLM-training
- combinatorial-complexity
- hypothesis-generation
- hierarchical-search
date: 2026-03-09
---

# MOOSE-Star: Tractable Training for Scientific Discovery

P(hypothesis|background) 직접 학습이 O(N^k) 조합 폭발로 수학적으로 불가능함을 증명하고, 4단계 분해로 O(1 + log(Nm/M))까지 복잡도를 낮추는 프레임워크.

## 📖 핵심 아이디어

과학적 발견 — "배경 지식 b에서 가설 h를 생성" — 을 LLM에 직접 학습시키면 N^k 조합 폭발이 발생한다 (N≈10^7 논문, k개 영감). 인지과학 근거(Koestler 1964): 역전파 = "다층 로지스틱 회귀" + 미적분의 "연쇄법칙" 조합. MOOSE-Star는 이 과정을 **Motivation→Retrieval→Composition** 3단계로 분해하여 지수적 복잡도를 로그 수준으로 감소시킨다.

## 🛠️ 4단계 복잡도 감소

| Method | 복잡도 | 핵심 기법 |
|--------|--------|-----------|
| End-to-end | O(N^k) ≈ 10^21 | 불가능 (brute-force k=3에서 통과율 0%) |
| I. Sequential Decomposition | O(k×N) | Cartesian product → 선형 합으로 분해 |
| II. Bounded Composition | O(k×[N/M + M]) | Semantic Tolerance Space M — 정확한 논문 대신 의미적 근방 허용 |
| III. Hierarchical Search | O(k×[log(N/M) + M]) | K-means 클러스터링 트리 + best-first search |
| IV. Motivation Planning | O(k×[1 + log(Nm/M) + M]) | 검색 전 동기 생성 → 유효 검색 공간 Nm < N |

## 🔧 작동 방식

```
Background b
    ↓ [O(1)] Motivation Planning
Motivation m  ← "어떤 방향의 영감이 필요한가?"
    ↓ [O(log(Nm/M))] Hierarchical Search
Inspiration i* (from 108K papers)
    ↓ [O(M)] Bounded Composition
Δh = f(b, hj-1, mj, ij)  ← 점진적 가설 업데이트
    ↓ (k번 반복)
Final Hypothesis h
```

**핵심 가정 2가지**:
- Uniqueness: 각 가설은 고유한 최소 동기-영감 쌍에 대응
- Fixed-Order: 통합은 시간순/논리 의존성 순서를 따름

## 📊 실험 결과

| 메트릭 | Baseline (7B) | MOOSE-Star (7B) |
|--------|--------------|-----------------|
| IR 정확도 | 28.42% | **54.37%** |
| HC 품질 (M3/12) | 4.34 | **5.16** |
| 검색 호출 수 | 218 | **67.78** (~3× 감소) |
| Brute-force k=3 통과율 | **0.00%** | — |
| Decomposed HC 통과율 | — | **47.33%** |

**Test-time scaling**: MOOSE-Star는 ~6,000 inference call로 100% 커버리지 도달. Brute-force는 ~41.3%에서 포화.

**TOMATO-Star 데이터셋**: NCBI 108,717편, ~38,400 A800 GPU시간, Biology/Chemistry/CogSci.

## 💡 실용적 평가

**강점**:
- 조합 폭발 문제를 이론적으로 분석한 첫 연구
- 7B 모델로도 유의미한 과학적 가설 생성 가능
- 로그 스케일링으로 논문 수 증가에도 실용적

**한계**:
- Uniqueness/Fixed-Order 가정이 모든 발견에 성립하지 않을 수 있음
- Hierarchical search의 O(log N)은 IR 모델이 이상적 라우팅을 할 때만 달성
- 테스트 109건으로 제한적 검증

**실용적 의미**: 과학적 발견의 "검색 → 조합" 패턴을 분해하는 접근법은 일반적인 창의적 문제 해결에도 적용 가능. 복잡한 조합 문제를 계층적 분해 + 동기 기반 가지치기로 접근하는 패턴.

## 🔗 관련 개념

- [[Dep-Search- Dependency-Aware Reasoning with Persistent Memory]] - (의존성 인식 추론이라는 유사한 문제 분해 접근)
- [[Task 분해 (Task Decomposition)]] - (N^k→k×N 분해가 task decomposition의 수학적 정당화)
- [[강화학습 (Reinforcement Learning)]] - (Rejection Sampling Fine-Tuning으로 학습 데이터 큐레이션)

---

**작성일**: 2026-03-09
**분류**: Scientific Discovery / LLM Training
**원문**: arXiv 2603.03756v1
**코드**: https://github.com/ZonglinY/MOOSE-Star
**데이터**: https://huggingface.co/datasets/ZonglinY/TOMATO-Star