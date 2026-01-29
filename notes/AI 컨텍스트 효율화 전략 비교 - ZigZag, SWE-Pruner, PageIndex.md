---
title: AI 컨텍스트 효율화 전략 비교 - ZigZag, SWE-Pruner, PageIndex
type: note
permalink: notes/ai-keontegseuteu-hyoyulhwa-jeonryag-bigyo-zig-zag-swe-pruner-page-index
tags:
- llm
- attention
- context-optimization
- rag
- comparison
---

# AI 컨텍스트 효율화 전략 비교

> **핵심 질문**: 긴 컨텍스트를 어떻게 효율적으로 읽을 것인가?

## 공통 배경: 어텐션의 한계

Transformer의 Self-Attention은 모든 토큰이 다른 모든 토큰을 참조합니다.
- 연산 복잡도: **O(n²)**
- 컨텍스트가 길어질수록 연산량 폭발
- 4K → 256K = **4,096배** 연산량 증가

**해결책**: 전부 다 읽지 말자! → 선택적 주의(Selective Attention)

---

## 3가지 전략 비교

| 방식 | 비유 | 기준 | 적용 시점 |
|------|------|------|----------|
| **ZigZag Attention** | 책 훑어보기 (처음+끝) | 📍 위치 | 모델 내부 |
| **SWE-Pruner** | Ctrl+F 검색 | 🎯 내용 관련성 | 모델 외부 (전처리) |
| **PageIndex** | 목차 보고 찾아가기 | 🌳 문서 구조 | 모델 외부 (RAG) |

---

## 1. ZigZag Attention

- [is_part_of:: LongCat-Flash-Thinking-2601]
- [type:: Sparse Attention]

### 핵심 아이디어
> "처음이랑 끝만 꼼꼼히 보고, 중간은 건너뛰자"

### 작동 방식
```
[처음 B개 토큰] ← 항상 참조 (지시문, 문서 시작)
     ...
     ...       ← 건너뜀
     ...
[최근 W개 토큰] ← 항상 참조 (현재 맥락)
```

### 설계
- Prefix 토큰: 문서 첫 B개는 항상 참조
- 로컬 윈도우: 최근 W개는 항상 참조
- 레이어 교대: 50% Sparse + 50% Full Attention

### 성능
- 최대 컨텍스트: **1M tokens**
- 속도 향상: **1.5배**
- 복잡도: Sub-quadratic

---

## 2. SWE-Pruner

- [type:: Context Pruning]
- [model_size:: 0.6B]

### 핵심 아이디어
> "목표와 관련된 라인만 남기자"

### 작동 방식
```
"auth.py 읽어줘" + Goal Hint ("로그인 함수 찾기")
          │
          ▼
    Neural Skimmer (0.6B)
    → 라인별 관련성 점수 계산
          │
          ▼
    관련 라인만 반환 (500줄 → 150줄)
```

### 구성 요소
- **Goal Hint Generation**: 에이전트가 "뭘 찾는지" 명시
- **Neural Skimmer**: 0.6B 경량 모델로 라인별 점수 계산
- **CRF Head**: 코드 블록 문법 유지하며 필터링

### 성능
- 평균 압축률: **23~38%**
- 최대 압축: **14.8배** (구체적 질문 시)
- 성능 유지: Claude Sonnet 70.6 → 70.2%

---

## 3. PageIndex

- [type:: Reasoning-based RAG]
- [replaces:: Vector RAG]

### 핵심 아이디어
> "목차 보고 관련 섹션으로 찾아가자"

### 작동 방식
```
1000페이지 PDF
      │
      ▼
  계층적 트리 생성 (색인화)
      │
      ▼
   [루트]
   ├─ 1장. 개요
   ├─ 2장. 방법론 ← "여기가 관련 있겠다" 
   └─ 3장. 결론
      │
      ▼
  트리 탐색하며 관련 섹션 추론
```

### 기존 RAG와 차이
| 벡터 RAG | PageIndex |
|----------|-----------|
| 유사성 기반 | **관련성** 기반 |
| 문서 임의 분할 | 자연스러운 구조 유지 |
| 블랙박스 | 추적 가능 (몇 장 몇 절) |

### 성능
- 금융 문서 분석: **98.7% 정확도**

---

## 전략 선택 가이드

| 상황 | 추천 전략 |
|------|----------|
| 모델 자체 개선 | ZigZag Attention |
| 코딩 에이전트 최적화 | SWE-Pruner |
| 대용량 문서 QA | PageIndex |
| 실시간 처리 필요 | ZigZag (내장) |
| 구조화된 문서 | PageIndex |
| 코드 파일 | SWE-Pruner |

---

## 관계 정리

- [solves:: Long Context Problem]
- [based_on:: Selective Attention]
- [related_to:: Transformer Architecture]
- [related_to:: RAG]
- [compared_with:: Full Attention]

## 참고 자료

- ZigZag: [[Paper Review - LongCat-Flash-Thinking-2601]]
- SWE-Pruner: https://github.com/Ayanami1314/swe-pruner
- PageIndex: https://github.com/VectifyAI/PageIndex
