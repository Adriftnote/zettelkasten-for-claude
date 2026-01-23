---
title: Temporal Knowledge Graph
type: note
permalink: 01.-concepts/temporal-knowledge-graph
tags:
- memory
- knowledge-graph
- temporal
- rag
---

# Temporal Knowledge Graph

## 📖 개요

시간 차원을 포함한 지식 그래프입니다. 엔티티 간의 관계뿐만 아니라, 그 관계가 **언제 유효한지**(valid_from, valid_until)를 함께 저장합니다. 이를 통해 "특정 시점의 사실"을 정확하게 쿼리할 수 있습니다.

## 🎭 비유

역사책과 같습니다. 단순히 "한국의 수도는 서울이다"가 아니라, "1948년 이후 한국의 수도는 서울이다"처럼 시간 맥락을 포함합니다. 덕분에 "1900년 한국의 수도는?"이라는 질문에도 정확히 답할 수 있습니다.

## ✨ 특징

- **시간 유효성**: 관계의 유효 기간 저장 (valid_from, valid_until)
- **이력 추적**: 과거 상태 조회 가능
- **충돌 방지**: 같은 관계의 시간별 버전 관리
- **높은 정확도**: DMR 기준 ~94.8% (Zep 기준)

## 💡 예시

### 예시 1: 시간 인식 쿼리

```cypher
# 2024년 1월 15일 시점 John의 주소 조회
MATCH (user:Person)-[r:LIVES_AT]->(address:Location)
WHERE user.id = "john"
AND r.valid_from <= date("2024-01-15")
AND (r.valid_until IS NULL OR r.valid_until > date("2024-01-15"))
RETURN address.city

# 결과: "부산" (2022년 이사 후 현재까지 유효)
```

### 예시 2: 관계 이력 조회

```cypher
# John의 거주지 이력 전체 조회
MATCH (user:Person {id: "john"})-[r:LIVES_AT]->(address:Location)
RETURN address.city, r.valid_from, r.valid_until
ORDER BY r.valid_from

# 결과:
# | city   | valid_from | valid_until |
# |--------|------------|-------------|
# | 서울   | 2018-03-01 | 2022-01-01  |
# | 부산   | 2022-01-01 | NULL        |
```

### 예시 3: 데이터 모델

```python
# Temporal KG 스키마
class TemporalRelation:
    source_id: str      # 시작 엔티티
    target_id: str      # 끝 엔티티
    relation_type: str  # 관계 유형 (LIVES_AT, WORKS_FOR 등)
    valid_from: date    # 유효 시작일
    valid_until: date   # 유효 종료일 (NULL = 현재 유효)
    confidence: float   # 신뢰도
    source: str         # 정보 출처

# 저장 예시
relations = [
    TemporalRelation(
        source_id="john",
        target_id="seoul",
        relation_type="LIVES_AT",
        valid_from=date(2018, 3, 1),
        valid_until=date(2022, 1, 1),
        confidence=1.0,
        source="user_input"
    ),
    TemporalRelation(
        source_id="john",
        target_id="busan",
        relation_type="LIVES_AT",
        valid_from=date(2022, 1, 1),
        valid_until=None,  # 현재 유효
        confidence=1.0,
        source="user_input"
    )
]
```

## 🛠️ 구현 방법

### 방법 1: Neo4j + Temporal 속성
```cypher
CREATE (john:Person {id: "john"})
CREATE (busan:Location {city: "부산"})
CREATE (john)-[:LIVES_AT {
    valid_from: date("2022-01-01"),
    valid_until: null
}]->(busan)
```

### 방법 2: Zep Memory System
- 자동 Temporal KG 구축
- 대화에서 엔티티/관계 자동 추출
- 시간 유효성 자동 관리

### 방법 3: Custom Implementation
```python
class TemporalKnowledgeGraph:
    def add_relation(self, source, target, relation, valid_from, valid_until=None):
        # 기존 유효한 관계가 있으면 종료 처리
        self.close_existing_relation(source, target, relation, valid_from)
        # 새 관계 추가
        self.relations.append({...})
    
    def query_at_time(self, entity, relation, query_time):
        return [r for r in self.relations
                if r['source'] == entity
                and r['relation'] == relation
                and r['valid_from'] <= query_time
                and (r['valid_until'] is None or r['valid_until'] > query_time)]
```

## Relations

- solves [[vector-store-limitations]] - 벡터 스토어의 시간 유효성 문제 해결
- relates_to [[hybrid-search-architecture]] - 하이브리드 아키텍처의 구성 요소
- relates_to [[knowledge-refinement-pipeline]] - 지식 정제에 활용