---
title: init-vector-db
type: function
permalink: functions/init-vector-db
level: low
category: search/semantic/db
semantic: initialize vector database
path: C:\claude-workspace\_system\vector-search\vecsearch.py
tags:
- python
- sqlite-vec
---

# init-vector-db

sqlite-vec 벡터 DB를 초기화하고 스키마를 생성하는 함수

## 📖 시그니처

```python
def init_vector_db(db_path: Path) -> sqlite3.Connection
```

## Observations

- [impl] sqlite_vec 확장 로드 후 3개 테이블 생성 (chunks, vec_chunks, sync_state) #schema
- [impl] vec_chunks는 vec0 가상 테이블로 1024차원 float 벡터 저장 #sqlite-vec
- [impl] 이미 테이블이 있으면 CREATE IF NOT EXISTS로 안전하게 스킵 #idempotent
- [return] sqlite3.Connection (벡터 DB 연결 객체)
- [deps] sqlite3, sqlite_vec #import

## Relations

- part_of [[vecsearch]] (소속 모듈)
- calls [[sqlite_vec.load]] (sqlite-vec 확장 로드)