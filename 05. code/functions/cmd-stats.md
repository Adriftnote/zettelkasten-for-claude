---
title: cmd-stats
type: function
permalink: functions/cmd-stats
level: low
category: search/semantic/cli
semantic: show index statistics
path: C:\claude-workspace\_system\vector-search\vecsearch.py
tags:
- python
- cli
---

# cmd-stats

벡터 인덱스 통계를 출력하는 CLI 명령 함수

## 📖 시그니처

```python
def cmd_stats(args)
```

## Observations

- [impl] chunks 테이블에서 총 청크 수, 총 entity 수 집계 #aggregation
- [impl] entity_type별, project_id별 분포 출력 #breakdown
- [impl] 모델명과 차원 정보 표시 (MODEL_NAME, EMBEDDING_DIM) #meta
- [return] None (콘솔 출력)
- [usage] `python vecsearch.py stats` #cli
- [note] 모델 로드 불필요 (DB 쿼리만 실행) #lightweight

## Relations

- part_of [[vecsearch]] (소속 모듈)
- calls [[init-vector-db]] (DB 연결)