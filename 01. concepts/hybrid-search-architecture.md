---
title: Hybrid Search Architecture
type: architecture
permalink: knowledge/concepts/hybrid-search-architecture-1
tags:
- search
- hybrid
- claude-mem
- basic-memory
- integration
category: System Architecture
difficulty: 고급
---

# Hybrid Search Architecture

claude-mem(SQLite 기반)과 Basic Memory(의미론적 지식베이스)를 통합한 하이브리드 검색 아키텍처입니다.

## 📖 개요

Hybrid Search Architecture는 **두 가지 검색 시스템의 장점을 모두 활용**합니다. SQLite 기반의 구조적 검색과 Basic Memory의 의미론적 검색을 병행하여 정확도와 재현율을 동시에 높입니다.

## 🎭 비유

도서관의 분류 시스템(Dewey Decimal)과 사서의 추천(의미론적 이해)을 함께 사용하는 것 같습니다. 정확한 분류로 빠르게 찾고, 사서의 지식으로 관련 책들을 놓친 부분까지 발견합니다.

## ✨ 특징

- **이중 검색**: 구조적(SQL) + 의미론적(Semantic) 동시 검색
- **결과 병합**: 두 검색의 결과를 점수 기반으로 통합
- **상호 보완**: 각 시스템의 약점을 다른 시스템이 보완
- **컨텍스트 인식**: 쿼리 유형에 따라 검색 가중치 동적 조정
- **성능 최적화**: 캐싱과 병렬 처리로 응답 시간 단축

## 💡 예시

**검색 과정**:

```
[사용자 쿼리] "MCP 서버 기본 설정"
    ↓
┌─────────────────────┬──────────────────────┐
│ SQLite 검색         │ Basic Memory 검색    │
├─────────────────────┼──────────────────────┤
│ task_id LIKE '%MCP' │ Semantic similarity  │
│ ↓                   │ ↓                    │
│ task-20260115-005   │ "MCP Architecture"   │
│ task-20260116-008   │ "Tool Integration"   │
│ (3개 결과)          │ (5개 결과)           │
└─────────────────────┴──────────────────────┘
    ↓
[결과 통합]
1. task-20260115-005 (SQLite 정확매칭 + Semantic 관련)
2. "MCP Architecture" (Semantic 높은 점수)
3. task-20260116-008 (Semantic 부분 매칭)
    ↓
[최종 결과 반환]
```

## 🛠️ 구현 방식

**1. SQLite 검색 (정확도)**
```sql
SELECT * FROM orchestration_log
WHERE output_summary LIKE '%MCP%'
  AND status='completed'
ORDER BY created_at DESC
```

**2. Basic Memory 검색 (의미론)**
```
query_embedding = embed("MCP 서버 기본 설정")
results = search(index, query_embedding, top_k=5)
```

**3. 결과 통합**
```
score = 0.6 * (sql_rank/total_sql) + 0.4 * (semantic_score)
sorted_results = rank_by_score(combined_results)
```

## Relations

- relates_to [[knowledge-refinement-pipeline]]
- relates_to [[knowledge-agent-architecture]]
- relates_to [[tool-hub-philosophy]]
- relates_to [[progressive-disclosure]]
- relates_to [[jarvis-lite-architecture]]

---

**난이도**: 고급
**카테고리**: System Architecture
**마지막 업데이트**: 2026년 1월
**출처**: Search Architecture Guide