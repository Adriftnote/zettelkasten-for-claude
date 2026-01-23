---
title: AI/ML 개념
type: hub
tags:
- hub
- ai
- ml
- search
- knowledge-graph
permalink: hubs/ai-ml-concepts-1
---

# AI/ML 개념

인공지능과 머신러닝의 **기초 개념**들을 체계적으로 정리. 검색 알고리즘, 어텐션 메커니즘, 지식 표현 방법을 루만식 인덱싱으로 관리합니다.

## Observations

### 핵심 인사이트

- [insight] 검색의 본질은 **관련성 점수**를 매기는 것. BM25는 단어 빈도 기반, 시맨틱 검색은 의미 기반
- [insight] 트랜스포머와 현대 AI의 핵심은 **Attention** - "어디에 집중할까?"를 학습하는 메커니즘
- [insight] 지식 표현의 구조: 개체(Entity) → 트리플(관계) → 그래프(네트워크)로 점진적 복잡화
- [insight] 하이브리드 검색 = BM25(정확도) + 시맨틱(의미) 결합으로 최고 품질 달성

### 학습 경로

- [path] **검색 기초**: TF-IDF → BM25 → 문맥 검색 → 시맨틱 → 하이브리드
- [path] **AI 기초**: Attention → 임베딩 → 트랜스포머 아키텍처
- [path] **지식 표현**: 개체 → 트리플 → 그래프 → 엔티티 해결

### 인덱싱 (루만식)

#### 1. 검색 알고리즘
- [index:1] [[TF-IDF]] - 단어 빈도 기반 검색의 기초. 용어 빈도와 역문서 빈도의 곱
  - [index:1a] [[BM25]] - TF-IDF를 개선한 확률적 모델. 실무 표준
  - [index:1b] [[Contextual Retrieval]] - 문맥 정보를 추가로 고려

#### 2. AI 핵심 메커니즘
- [index:2] [[Attention]] - 트랜스포머의 핵심. 입력 요소 간 관련성 학습
  - [index:2a] 어텐션 점수 계산 - Query, Key, Value를 이용한 가중치 생성

#### 3. 지식 표현 시스템
- [index:3] [[Knowledge Graph (지식 그래프)]] - 개체와 관계를 그래프 구조로 표현
  - [index:3a] [[Triple (트리플)]] - 주어-서술어-목적어 형식의 기본 단위
  - [index:3b] [[Entity Resolution (엔티티 해결)]] - 동일 개체의 중복 식별 및 통합

#### 4. 검색 아키텍처
- [index:4] 하이브리드 검색 - BM25 + 시맨틱 검색의 결합으로 최적 결과 도출

#### 5. AI 에이전트 패러다임
- [index:5] [[ReAct Paradigm]] - Reasoning + Acting 결합. 생각→행동→관찰 루프
  - [index:5a] [[agent-architecture-guide]] - 에이전트 아키텍처 가이드

---

## Relations

### 관리하는 노트들

- organizes [[TF-IDF]]
- organizes [[BM25]]
- organizes [[Contextual Retrieval]]
- organizes [[Attention]]
- organizes [[Knowledge Graph (지식 그래프)]]
- organizes [[Triple (트리플)]]
- organizes [[Entity Resolution (엔티티 해결)]]
- organizes [[ReAct Paradigm]]

### 다른 허브와의 연결

- connects_to [[architectures]] - 하이브리드 검색 아키텍처 구현
- connects_to [[context-engineering]] - LLM 컨텍스트와 Attention의 관계
- connects_to [[encoding-systems]] - 텍스트 표현의 기초로 검색 구현

---

## 개념 간 관계도

```
[1] TF-IDF (기초)
    └─ [1a] BM25 (개선)
    └─ [1b] Contextual Retrieval

[2] Attention (핵심 메커니즘)
    └─ 트랜스포머 아키텍처

[3] Knowledge Graph (지식 표현)
    ├─ [3a] Triple (기본 단위)
    └─ [3b] Entity Resolution (통합)

[4] Hybrid Search (결합)
    = [1a] + [2] + 의미 임베딩
```

---

## 검색 방식 비교

| 방식 | 기반 | 장점 | 단점 |
|------|------|------|------|
| [[TF-IDF]] | 단어 빈도 | 단순, 빠름 | 문맥 무시 |
| [[BM25]] | 확률 모델 | 정확도 향상 | 여전히 키워드 중심 |
| 시맨틱 검색 | 임베딩 | 의미 이해 | 느림, 비용 증가 |
| 하이브리드 | BM25 + 시맨틱 | 최고 품질 | 복잡도 증가 |