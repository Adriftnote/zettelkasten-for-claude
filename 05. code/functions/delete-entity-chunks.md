---
title: delete-entity-chunks
type: function
permalink: functions/delete-entity-chunks
level: low
category: search/semantic/indexing
semantic: delete entity chunks
path: C:\claude-workspace\_system\vector-search\vecsearch.py
tags:
- python
- sqlite-vec
---

# delete-entity-chunks

특정 entity의 모든 청크와 벡터를 삭제하는 함수

## 📖 시그니처

```python
def delete_entity_chunks(vdb: sqlite3.Connection, entity_id: int)
```

## Observations

- [impl] chunks 테이블에서 entity_id로 chunk id 목록 조회 #query
- [impl] vec_chunks에서 rowid 기준으로 벡터 삭제 후, chunks에서 메타데이터 삭제 #dual-delete
- [impl] 순서: vec_chunks 삭제 → chunks 삭제 (FK 의존성 고려) #order
- [return] None (반환값 없음)
- [deps] sqlite3 #import
- [note] cmd_sync에서 변경된 entity 재임베딩 전 기존 데이터 정리에 사용 #usage

## Relations

- part_of [[vecsearch]] (소속 모듈)
- data_flows_to [[cmd-sync]] (삭제 후 재임베딩)