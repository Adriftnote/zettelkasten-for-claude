---
title: cmd-index
type: function
permalink: functions/cmd-index
level: low
category: search/semantic/cli
semantic: full reindex command
path: C:\claude-workspace\_system\vector-search\vecsearch.py
tags:
- python
- cli
---

# cmd-index

전체 재인덱싱 CLI 명령 함수 (기존 데이터 삭제 후 새로 구축)

## 📖 시그니처

```python
def cmd_index(args)
```

## Observations

- [impl] vectors.db 파일 자체를 삭제 후 새로 생성 #destructive
- [impl] memory.db에서 전체 entity 조회 → 각각 index_entity() 호출 #full-scan
- [impl] 50개마다 commit하여 메모리 절약 및 진행률 표시 #batch-commit
- [return] None (콘솔 출력)
- [usage] `python vecsearch.py index` #cli
- [note] 346 entities → 2,346 chunks, 약 5분 소요 (e5-large 기준) #performance

## Relations

- part_of [[vecsearch]] (소속 모듈)
- calls [[get-embedder]] (모델 로드)
- calls [[init-vector-db]] (DB 초기화)
- calls [[get-entities-from-memory-db]] (entity 목록 조회)
- calls [[index-entity]] (entity별 인덱싱)