---
title: Vector Store Limitations
type: note
permalink: 01.-concepts/vector-store-limitations
tags:
- memory
- vector-db
- rag
- limitations
---

# Vector Store Limitations

## 📖 개요

벡터 데이터베이스(Vector Store)를 RAG 시스템의 메모리로 사용할 때 발생하는 구조적 한계입니다. 의미적 유사도 검색에는 강하지만, **관계 정보 손실**과 **시간 유효성 부재**가 핵심 문제입니다.

## 🎭 비유

도서관의 책 분류 시스템과 같습니다. "AI 관련 책"은 쉽게 찾을 수 있지만, "이 책을 읽은 사람들이 다음에 뭘 읽었는지"는 알 수 없습니다. 책들 간의 **관계**는 분류 시스템에 저장되지 않기 때문입니다.

## ✨ 특징

- **의미적 유사도 검색**: 강점 (임베딩 기반)
- **관계 정보 손실**: 엔티티 간 연결 정보 저장 불가
- **시간 유효성 없음**: 현재 vs 과거 데이터 구분 불가
- **정확도 한계**: DMR 기준 ~60-70% (Temporal KG 대비 낮음)

## 💡 예시

### 예시 1: 관계 정보 손실

```
# 저장 가능
"Customer X가 Product Y를 구매했다" → 벡터로 저장 ✓

# 질의 불가
"Product Y를 구매한 고객들이 또 뭘 샀나?" → 관계 탐색 불가 ✗
```

Vector Store는 개별 문서를 벡터로 변환하여 저장하지만, 문서 간의 **그래프 구조**(관계)는 손실됩니다.

### 예시 2: 시간 유효성 문제

```python
# Vector Store 쿼리
query = "John의 주소는?"

# 반환 결과 (시간 구분 없음)
results = [
    "John은 서울에 살았다",      # 2020년
    "John은 부산으로 이사했다",   # 2022년
    "John의 현재 주소는 부산이다" # 2024년
]
# 어떤 게 현재 유효한 정보인지 구분 불가
```

### 예시 3: Temporal KG와 비교

```python
# Temporal Knowledge Graph 쿼리
MATCH (user)-[r:LIVES_AT]->(address)
WHERE user.id = "john"
AND r.valid_from <= date("2024-01-15")
AND (r.valid_until IS NULL OR r.valid_until > date("2024-01-15"))
RETURN address
# → 정확히 해당 시점의 유효한 주소 반환
```

## 🛠️ 한계 극복 방법

### 방법 1: Hybrid Architecture
```
Query → Vector Search (의미적 매칭)
         ↓
      Knowledge Graph (관계 탐색)
         ↓
      Combined Result
```

### 방법 2: Metadata 활용
```python
# 벡터 저장 시 메타데이터 추가
vector_store.add({
    "text": "John은 부산에 산다",
    "embedding": [...],
    "metadata": {
        "valid_from": "2022-01-01",
        "valid_until": None,
        "entity_id": "john_001",
        "relation_type": "LIVES_AT"
    }
})
```

### 방법 3: Temporal KG 도입
- Zep, MemGPT 등 Temporal KG 기반 메모리 시스템 사용
- DMR 정확도: ~94.8% (Vector RAG 대비 +30%)

## Relations

- contrasts_with [[temporal-knowledge-graph]] - 시간 유효성 지원하는 대안
- relates_to [[hybrid-search-architecture]] - 하이브리드 접근법
- relates_to [[knowledge-refinement-pipeline]] - 지식 정제 파이프라인