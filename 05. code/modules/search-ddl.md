---
title: search-ddl
type: module
permalink: modules/search-ddl
level: high
category: tools/knowledge-management/models
semantic: define search index DDL
path: basic_memory/models/search.py
tags:
- python
- sqlite
- postgres
- fts5
---

# search-ddl

SQLite FTS5와 Postgres tsvector 검색 인덱스의 DDL 정의 모듈.

## 개요

검색 인덱스 테이블은 ORM이 아닌 raw DDL로 정의된다. SQLite는 FTS5 가상 테이블을,
Postgres는 composite PK + GENERATED tsvector 컬럼 + GIN 인덱스를 사용한다.
두 백엔드 모두 SearchIndexRow dataclass를 통해 동일한 인터페이스로 접근한다.

## Observations

- [impl] SQLite FTS5: unicode61 tokenizer + tokenchars='/' + prefix='1,2,3,4' #fts5
- [impl] Postgres: tsvector GENERATED ALWAYS AS (to_tsvector('english', ...)) STORED #tsvector
- [impl] Postgres GIN 인덱스: fts, metadata(jsonb_path_ops), permalink(partial unique) #gin-index
- [impl] Composite PK: (id, type, project_id) #schema
- [impl] Postgres DDL은 별도 문으로 분리 (asyncpg 다중 문 미지원) #asyncpg-limitation
- [deps] sqlalchemy.DDL #import
- [note] ORM 모델 불가 - FTS5 가상 테이블은 SQLAlchemy ORM으로 표현 불가 #caveat

## Relations

- part_of [[basic-memory]] (검색 인덱스 DDL 모듈)
- depends_on [[SQLAlchemy]] (DDL 정의)