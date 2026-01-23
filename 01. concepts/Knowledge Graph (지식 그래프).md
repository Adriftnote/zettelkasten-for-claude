---
title: Knowledge Graph (지식 그래프)
type: concept
permalink: knowledge/concepts/knowledge-graph
tags:
- ai-basics
- concepts
- data-structures
category: 데이터 구조
difficulty: 중급
---

# Knowledge Graph (지식 그래프)

정보를 **노드(엔티티)**와 **엣지(관계)**로 구조화하여 표현하는 그래프 데이터베이스입니다.

## 📖 개요

지식 그래프는 현실 세계의 지식을 컴퓨터가 이해할 수 있는 형태로 구조화합니다. 개별 사실들을 [[Triple (트리플)|트리플]] 형태로 저장하여, 엔티티 간의 관계를 명확하게 표현합니다.

```
엔티티 (Entity/Node): 사람, 장소, 사물, 개념
관계 (Relation/Edge): 엔티티 간의 연결
```

## 🎭 비유

**지하철 노선도**와 같습니다:
- **역** = 노드 (엔티티)
- **노선** = 엣지 (관계)
- **전체 노선도** = 지식 그래프

역들이 노선으로 연결되듯, 지식도 관계로 연결됩니다.

## ✨ 특징

- **구조화**: 텍스트가 아닌 그래프로 정보 표현
- **관계 중심**: 엔티티 간 연결이 핵심
- **질의 가능**: 그래프 탐색으로 답변 도출
- **확장성**: 새로운 노드/관계 추가 용이

## 💡 예시

### 기본 구조

```
(Steve Jobs) --[founded]--> (Apple)
(Apple) --[founded_year]--> (1976)
(Steve Jobs) --[CEO_of]--> (Apple)
(Apple) --[headquartered_in]--> (Cupertino)
```

### 시각화

```
    Steve Jobs
      /  |  \
founded CEO_of co-founded_with
    /    |       \
  Apple  Apple   Steve Wozniak
    |
founded_year
    |
   1976
```

### 질의 예시

**질문**: "Apple의 창립자는 누구인가?"

**그래프 탐색**:
```
(?) --[founded]--> (Apple)
→ Steve Jobs
```

## 🔍 실제 활용 사례

### Google Knowledge Graph
```
검색: "스티브 잡스"
→ 오른쪽 정보 패널:
  - 출생: 1955년
  - 창립한 회사: Apple, Pixar
  - 배우자: Laurene Powell Jobs
```

### ChatGPT/RAG 시스템
```
질문: "Apple은 언제 설립되었나?"
→ 지식 그래프 검색 → "1976년"
```

### Wikipedia
```
각 문서가 노드
링크가 엣지
→ 전체가 거대한 지식 그래프
```

## 📊 전통 데이터베이스 vs 지식 그래프

| | 관계형 DB | 지식 그래프 |
|---|---|---|
| **구조** | 테이블 (행/열) | 그래프 (노드/엣지) |
| **관계** | 외래키 | 직접 연결 |
| **질의** | SQL (JOIN) | 그래프 탐색 |
| **유연성** | 스키마 고정 | 유연한 확장 |
| **예시** | MySQL, PostgreSQL | Neo4j, KGGen |

## 🔧 지식 그래프 구축 방법

### 1. 수동 구축
```
전문가가 직접 작성
→ 고품질, 비용 높음
예: Cyc, WordNet
```

### 2. 자동 추출 (전통)
```
규칙 기반 추출
→ 중복 많음, 희소함
예: OpenIE
```

### 3. AI 기반 (현대)
```
LLM + 임베딩
→ 자동화 + 고품질
예: KGGen, GraphRAG
```

## ⚡ 문제점과 해결

### 문제: 희소성 (Sparsity)
```
"Steve Jobs", "S. Jobs", "잡스"
→ 별개 노드로 생성
→ 연결 끊김
```

### 해결: [[Entity Resolution (엔티티 해결)]]
```
벡터 임베딩 + AI
→ 같은 대상 통합
→ 밀도 높은 그래프
```

## Relations

- part_of [[Triple (트리플)]]
- used_by [[Entity Resolution (엔티티 해결)]]

## 📚 더 알아보기

- [[KGGen - Knowledge Graph Generation Framework|KGGen 프레임워크]] - AI 기반 자동 생성

---

**난이도**: 중급
**카테고리**: 데이터 구조
**마지막 업데이트**: 2026년 1월
