---
title: AI/ML 개념
type: hub
tags:
- hub
- ai
- ml
- search
- knowledge-graph
permalink: hubs/ai-ml-concepts
---

# AI/ML 개념

인공지능과 머신러닝의 **기초 개념**들을 체계적으로 정리. 검색 알고리즘, 어텐션 메커니즘, 지식 표현 방법을 루만식 인덱싱으로 관리합니다.

## Observations

- [fact] 검색의 본질은 관련성 점수를 매기는 것 #search #bm25 #semantic
- [fact] 트랜스포머와 현대 AI의 핵심은 Attention - 어디에 집중할까를 학습하는 메커니즘 #attention #ai
- [fact] 지식 표현의 구조: 개체 → 트리플 → 그래프로 점진적 복잡화 #knowledge-graph
- [fact] (주체-관계-대상) 3항 구조는 KG, 온톨로지, 카테고리 이론, 제텔카스텐에서 반복되는 보편 패턴이다 #triple #ontology #category-theory
- [fact] 하이브리드 검색 = BM25 + 시맨틱 검색 결합으로 최고 품질 달성 #hybrid-search

## Relations

- organizes [[TF-IDF]] (1. 단어 빈도 기반 검색의 기초. 용어 빈도와 역문서 빈도의 곱)
  - extends [[BM25]] (1a. TF-IDF를 개선한 확률적 모델. 실무 표준)
  - extends [[Contextual Retrieval]] (1b. 문맥 정보를 추가로 고려)
- organizes [[Attention]] (2. 트랜스포머의 핵심. 입력 요소 간 관련성 학습)
  - part_of [[어텐션 점수 계산]] (2a. Query, Key, Value를 이용한 가중치 생성)
- organizes [[Knowledge Graph (지식 그래프)]] (3. 개체와 관계를 그래프 구조로 표현)
  - part_of [[Triple (트리플)]] (3a. 주어-서술어-목적어 형식의 기본 단위)
  - part_of [[Entity Resolution (엔티티 해결)]] (3b. 동일 개체의 중복 식별 및 통합)
  - extends [[RPG (Repository Planning Graph)]] (3c. 코드 특화 지식 그래프. 의미론+위상으로 검색 가능한 코드 표현)
- organizes [[Hybrid Search]] (4. BM25 + 시맨틱 검색의 결합으로 최적 결과 도출)
- organizes [[ReAct Paradigm]] (5. Reasoning + Acting 결합. 생각→행동→관찰 루프)
  - extends [[Agent Architecture]] (5a. 에이전트 아키텍처 설계)
- connects_to [[아키텍처 (Architectures)]] (하이브리드 검색 아키텍처 구현)
- connects_to [[컨텍스트 엔지니어링 (Context Engineering)]] (LLM 컨텍스트와 Attention의 관계)
- connects_to [[문자 인코딩 시스템 (Encoding Systems)]] (텍스트 표현의 기초로 검색 구현)

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
    ├─ [3b] Entity Resolution (통합)
    └─ [3c] RPG (코드 특화)
        ├─ 노드: 의미론 + 위상
        └─ 엣지: 기능 + 의존성

[4] Hybrid Search (결합)
    = [1a] + [2] + 의미 임베딩
```

---

## 검색 방식 비교

| 방식 | 기반 | 장점 | 단점 |
|------|------|------|------|
| TF-IDF | 단어 빈도 | 단순, 빠름 | 문맥 무시 |
| BM25 | 확률 모델 | 정확도 향상 | 여전히 키워드 중심 |
| 시맨틱 검색 | 임베딩 | 의미 이해 | 느림, 비용 증가 |
| 하이브리드 | BM25 + 시맨틱 | 최고 품질 | 복잡도 증가 |