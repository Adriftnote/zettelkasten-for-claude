---
title: get-entities-from-memory-db
type: function
permalink: functions/get-entities-from-memory-db
level: low
category: search/semantic/db
semantic: get entities from memory database
path: C:\claude-workspace\_system\vector-search\vecsearch.py
tags:
- python
- sqlite
---

# get-entities-from-memory-db

basic-memory의 memory.db에서 entity 목록을 조회하는 함수

## 📖 시그니처

```python
def get_entities_from_memory_db() -> List[dict]
```

## Observations

- [impl] content_type = 'text/markdown'인 entity만 조회 #filter
- [impl] id, title, entity_type, file_path, checksum, project_id 컬럼 반환 #columns
- [impl] Row factory로 dict 리스트 반환 #pattern
- [return] entity 딕셔너리 리스트 (List[dict])
- [deps] sqlite3 #import
- [note] memory.db는 읽기 전용, basic-memory가 관리 #readonly

## SQL 쿼리

```sql
SELECT id, title, entity_type, file_path, checksum, project_id
FROM entity
WHERE content_type = 'text/markdown'
ORDER BY id
```

## Relations

- part_of [[vecsearch]] (소속 모듈)
- data_flows_to [[cmd-sync]] (entity 목록 → 동기화 비교)
- data_flows_to [[cmd-index]] (entity 목록 → 전체 인덱싱)