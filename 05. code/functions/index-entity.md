---
title: index-entity
type: function
permalink: functions/index-entity
level: low
category: search/semantic/indexing
semantic: index entity to vector db
path: C:\claude-workspace\_system\vector-search\vecsearch.py
tags:
- python
- sqlite-vec
---

# index-entity

entity 하나를 파일 읽기 → 청킹 → 임베딩 → DB 저장까지 처리하는 파이프라인 함수

## 📖 시그니처

```python
def index_entity(vdb: sqlite3.Connection, embedder, entity: dict) -> int
```

## Observations

- [impl] read_entity_file → chunk_markdown → embed_texts → INSERT 순서로 파이프라인 실행 #pipeline
- [impl] chunks 테이블에 메타데이터, vec_chunks에 벡터 각각 INSERT #dual-insert
- [impl] sync_state에 entity_id + checksum 저장 (변경 추적용) #sync
- [impl] chunk_id = cursor.lastrowid로 chunks↔vec_chunks rowid 매핑 #key-mapping
- [return] 생성된 청크 수 (int), 파일 없으면 0
- [deps] sqlite3 #import

## 데이터 흐름

```
entity dict (id, title, type, file_path, checksum, project_id)
    ↓ read_entity_file()
마크다운 텍스트
    ↓ chunk_markdown()
청크 리스트 [{section_header, chunk_text, chunk_index}]
    ↓ embed_texts()
벡터 리스트 [bytes]
    ↓ INSERT INTO chunks + vec_chunks
vectors.db
```

## Relations

- part_of [[vecsearch]] (소속 모듈)
- calls [[read-entity-file]] (파일 읽기)
- calls [[chunk-markdown]] (청킹)
- calls [[embed-texts]] (임베딩)