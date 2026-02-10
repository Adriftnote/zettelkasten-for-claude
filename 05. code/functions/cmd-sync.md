---
title: cmd-sync
type: function
permalink: functions/cmd-sync
level: low
category: search/semantic/cli
semantic: incremental sync command
path: C:\claude-workspace\_system\vector-search\vecsearch.py
tags:
- python
- cli
---

# cmd-sync

변경된 entity만 재임베딩하는 증분 동기화 CLI 명령 함수

## 📖 시그니처

```python
def cmd_sync(args)
```

## Observations

- [impl] memory.db entity의 checksum과 sync_state의 checksum 비교 #diff
- [impl] 새 entity: 바로 index_entity() 호출 #add
- [impl] 변경된 entity: delete_entity_chunks() → index_entity() (삭제 후 재임베딩) #update
- [impl] 삭제된 entity: vectors.db에만 있고 memory.db에 없으면 제거 #delete
- [return] None (콘솔 출력: +N new, ~N updated, -N deleted)
- [usage] `python vecsearch.py sync` #cli
- [note] Claude Code Stop hook으로 세션 종료 시 자동 실행 #automation

## 동기화 로직

```
memory.db entities (id→checksum)  vs  sync_state (entity_id→checksum)
├─ memory에만 있음 → 신규 임베딩
├─ checksum 다름 → 삭제 후 재임베딩
├─ checksum 같음 → 스킵
└─ sync_state에만 있음 → 삭제된 노트 → 제거
```

## Relations

- part_of [[vecsearch]] (소속 모듈)
- calls [[get-embedder]] (모델 로드)
- calls [[get-entities-from-memory-db]] (entity 목록 조회)
- calls [[index-entity]] (entity별 인덱싱)
- calls [[delete-entity-chunks]] (변경/삭제 entity 정리)