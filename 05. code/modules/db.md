---
title: db
type: module
permalink: modules/db
level: high
category: tools/knowledge-management/core
semantic: manage database engine
path: basic_memory/db.py
tags:
- python
- sqlalchemy
- sqlite
- postgres
---

# db

데이터베이스 엔진 생성, 세션 관리, Alembic 마이그레이션을 담당하는 모듈.

## 개요

SQLite(aiosqlite)와 Postgres(asyncpg) 이중 백엔드를 지원한다.
SQLite에서는 WAL 모드, busy_timeout, NullPool(Windows) 등 최적화를 적용하고,
Postgres에서는 NullPool + statement_cache 비활성화로 connection pooler 호환성을 확보한다.
Alembic으로 스키마 마이그레이션을 관리하며, 서버 시작 시 자동 실행된다.

## Observations

- [impl] DatabaseType enum: MEMORY, FILESYSTEM, POSTGRES 3종 #enum
- [impl] Windows에서 SelectorEventLoop 정책 적용 (aiosqlite 호환) #windows
- [impl] SQLite: WAL mode + busy_timeout 10s + cache_size 64MB #sqlite-optimization
- [impl] Windows SQLite: NullPool + timeout 30s + autocommit #windows-fix
- [impl] Postgres: NullPool + statement_cache_size=0 + command_timeout=30 #postgres
- [impl] scoped_session으로 asyncio.current_task 단위 세션 격리 #session
- [impl] Alembic 마이그레이션 자동 실행 + 검색 인덱스 초기화 #migration
- [deps] sqlalchemy, alembic, aiosqlite, asyncpg #import
- [note] 인메모리 DB는 NullPool 사용 불가 (연결 간 상태 유실) #caveat

## Relations

- part_of [[basic-memory]] (데이터베이스 관리 모듈)
- contains [[database-type]] (DB 타입 enum)
- depends_on [[SQLAlchemy]] (비동기 ORM 엔진)
- depends_on [[alembic]] (스키마 마이그레이션)