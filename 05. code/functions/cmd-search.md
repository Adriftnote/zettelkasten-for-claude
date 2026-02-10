---
title: cmd-search
type: function
permalink: functions/cmd-search
level: low
category: search/semantic/cli
semantic: semantic search command
path: C:\claude-workspace\_system\vector-search\vecsearch.py
tags:
- python
- cli
- sqlite-vec
---

# cmd-search

시맨틱 검색을 실행하는 CLI 명령 함수

## 📖 시그니처

```python
def cmd_search(args)
```

## Observations

- [impl] 쿼리 텍스트를 embed_texts()로 벡터화 후 KNN 검색 #pipeline
- [impl] over-fetch (k*3) 후 post-filter로 정확도 보완 #knn-workaround
- [impl] --type으로 entity_type 필터링 (concept, module 등) #filter
- [impl] --project로 프로젝트 필터링 (zettelkasten, RPG) #filter
- [impl] --unique로 entity당 1개 청크만 반환 (중복 제거) #dedup
- [impl] 결과 출력: 순위, entity 타입, 제목, distance, 프로젝트, 미리보기 #display
- [return] None (콘솔 출력)
- [usage] `python vecsearch.py search "컨텍스트 관리" --unique --top 10` #cli

## SQL 쿼리

```sql
SELECT vc.rowid, vc.distance,
       c.entity_title, c.entity_type, c.section_header,
       c.chunk_text, c.file_path, c.project_id
FROM vec_chunks vc
JOIN chunks c ON c.id = vc.rowid
WHERE vc.embedding MATCH ?
  AND k = ?
ORDER BY vc.distance
```

## Relations

- part_of [[vecsearch]] (소속 모듈)
- calls [[get-embedder]] (모델 로드)
- calls [[embed-texts]] (쿼리 임베딩)