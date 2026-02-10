---
title: read-entity-file
type: function
permalink: functions/read-entity-file
level: low
category: search/semantic/io
semantic: read entity markdown file
path: C:\claude-workspace\_system\vector-search\vecsearch.py
tags:
- python
- file-io
---

# read-entity-file

project_id에 따라 기본 경로를 결정하고 entity 마크다운 파일을 읽는 함수

## 📖 시그니처

```python
def read_entity_file(file_path: str, project_id: int) -> Optional[str]
```

## Observations

- [impl] PROJECT_PATHS 딕셔너리로 project_id → 기본 경로 매핑 #mapping
- [impl] project_id 3 → zettelkasten (from-obsidian/), 4 → RPG (reference/code/) #paths
- [impl] UnicodeDecodeError 시 errors="replace"로 대체 읽기 #encoding
- [impl] 파일 없거나 project_id 미등록이면 None 반환 #error-handling
- [return] 마크다운 파일 내용 (str) 또는 None

## Relations

- part_of [[vecsearch]] (소속 모듈)
- data_flows_to [[index-entity]] (파일 내용 → 청킹)