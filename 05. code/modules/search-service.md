---
title: search-service
type: module
permalink: modules/search-service
level: high
category: tools/knowledge-management/services
semantic: search knowledge base
path: basic_memory/services/search_service.py
tags:
- python
- fts5
- search
---

# search-service

FTS5/tsvector 기반 전문 검색 서비스 모듈.

## 개요

SearchService는 3가지 검색 모드를 지원한다: 정확한 permalink 매칭,
와일드카드 패턴 매칭(specs/*), 그리고 title/content 전문 검색.
Entity 변경 시 content_stems(6000자 제한)을 생성하여 검색 인덱스에 반영하며,
reindex_all로 전체 재색인도 지원한다.

## Observations

- [impl] 3가지 검색 모드: exact permalink, pattern match (*), full-text search #search-modes
- [impl] MAX_CONTENT_STEMS_SIZE=6000 (Postgres 8KB index row limit 대응) #postgres-limit
- [impl] _mtime_to_datetime: Entity.mtime → datetime 변환 (updated_at fallback) #timestamp
- [impl] SearchRepository 추상화로 SQLite/Postgres 백엔드 투명 전환 #abstraction
- [impl] index_entity: Entity → SearchIndexRow 변환 + observations/relations 개별 인덱싱 #indexing
- [impl] reindex_all: DROP TABLE → init → 전체 Entity 재색인 #reindex
- [deps] dateparser, sqlalchemy, loguru #import

## Relations

- part_of [[basic-memory]] (검색 서비스)
- uses [[search-ddl]] (검색 인덱스 DDL)
- uses [[file-service]] (Entity 콘텐츠 읽기)
- data_flows_to [[entity-service]] (인덱스 업데이트 수신)
- data_flows_to [[context-service]] (검색 결과 제공)