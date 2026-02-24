---
title: remap-entity-chunks
type: function
permalink: functions/remap-entity-chunks
level: low
category: search/semantic/sync
semantic: remap chunk metadata when entity_id changes without re-embedding
path: C:\claude-workspace\_system\vector-search\vecsearch.py
tags:
- python
- sqlite-vec
- optimization
---

# remap-entity-chunks

entity_id가 변경되었지만 내용(checksum)이 같을 때, 재임베딩 없이 메타데이터만 갱신하는 함수

## 📖 시그니처

```python
def remap_entity_chunks(vdb: sqlite3.Connection, old_eid: int, entity: dict)
```

## Observations

- [impl] basic-memory 볼트 경로 변경 시 entity_id가 바뀌지만 checksum은 동일한 케이스 대응 #sync
- [impl] chunks 테이블의 entity_id, entity_title, file_path, project_id 업데이트 #metadata
- [impl] 기존 sync_state 삭제 후 새 entity_id로 재등록 #state
- [perf] 재임베딩 스킵으로 전체 reindex 대비 수초 내 처리 #optimization
- [deps] sqlite3 #import

## Relations

- part_of [[vecsearch]] (소속 모듈)
- called_by [[cmd-sync]] (line 348)