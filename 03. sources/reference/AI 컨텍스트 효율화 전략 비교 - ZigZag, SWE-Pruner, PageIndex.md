---
title: AI 컨텍스트 효율화 전략 비교 - ZigZag, SWE-Pruner, PageIndex
type: doc-summary
permalink: sources/reference/ai-context-optimization-comparison
tags:
- llm
- attention
- context-optimization
- rag
- comparison
---

# AI 컨텍스트 효율화 전략 비교

긴 컨텍스트를 효율적으로 읽기 위한 3가지 전략(ZigZag, SWE-Pruner, PageIndex)을 비교합니다.

## 📖 핵심 아이디어

Transformer의 Self-Attention은 O(n²) 복잡도로, 컨텍스트가 길어지면 연산량이 폭발합니다 (4K→256K = 4,096배). 해결책은 **전부 다 읽지 말고 선택적으로 주의(Selective Attention)**하는 것.

## 🛠️ 3가지 전략 비교

| 방식 | 비유 | 기준 | 적용 시점 |
|------|------|------|----------|
| **ZigZag Attention** | 책 훑어보기 (처음+끝) | 📍 위치 | 모델 내부 |
| **SWE-Pruner** | Ctrl+F 검색 | 🎯 내용 관련성 | 모델 외부 (전처리) |
| **PageIndex** | 목차 보고 찾아가기 | 🌳 문서 구조 | 모델 외부 (RAG) |

## 🔧 각 전략 상세

### ZigZag Attention
> "처음이랑 끝만 꼼꼼히 보고, 중간은 건너뛰자"

- Prefix 토큰: 문서 첫 B개는 항상 참조
- 로컬 윈도우: 최근 W개는 항상 참조
- 레이어 교대: 50% Sparse + 50% Full Attention
- **성능**: 최대 1M tokens, 1.5배 속도 향상

### SWE-Pruner
> "목표와 관련된 라인만 남기자"

- Goal Hint Generation: 에이전트가 "뭘 찾는지" 명시
- Neural Skimmer: 0.6B 경량 모델로 라인별 점수 계산
- CRF Head: 코드 블록 문법 유지하며 필터링
- **성능**: 평균 23~38% 압축, 최대 14.8배

### PageIndex
> "목차 보고 관련 섹션으로 찾아가자"

- 문서를 계층적 트리로 색인화
- 트리 탐색하며 관련 섹션 추론
- 벡터 RAG와 달리 관련성 기반, 구조 유지, 추적 가능
- **성능**: 금융 문서 분석 98.7% 정확도

## 💡 전략 선택 가이드

| 상황 | 추천 전략 |
|------|----------|
| 모델 자체 개선 | ZigZag Attention |
| 코딩 에이전트 최적화 | SWE-Pruner |
| 대용량 문서 QA | PageIndex |
| 실시간 처리 필요 | ZigZag (내장) |
| 구조화된 문서 | PageIndex |
| 코드 파일 | SWE-Pruner |

## 🔗 관련 개념

- [[SWE-Pruner 논문 리뷰]] - SWE-Pruner 상세
- [[Paper Review - LongCat-Flash-Thinking-2601]] - ZigZag 출처
- [[RAG]] - 기존 검색 증강 생성

## 📎 리소스

- ZigZag: LongCat-Flash-Thinking 논문
- SWE-Pruner: https://github.com/Ayanami1314/swe-pruner
- PageIndex: https://github.com/VectifyAI/PageIndex

---

**작성일**: 2026-02-05
**분류**: Paper Comparison / Context Optimization