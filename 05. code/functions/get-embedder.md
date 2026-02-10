---
title: get-embedder
type: function
permalink: functions/get-embedder
level: low
category: search/semantic/embedding
semantic: get embedding model
path: C:\claude-workspace\_system\vector-search\vecsearch.py
tags:
- python
- fastembed
---

# get-embedder

fastembed TextEmbedding 모델을 싱글턴으로 로드하는 함수

## 📖 시그니처

```python
def get_embedder()
```

## Observations

- [impl] 글로벌 _embedder 변수로 싱글턴 패턴 구현 #singleton
- [impl] 첫 호출 시 intfloat/multilingual-e5-large 모델 로드 (2.24GB) #lazy-loading
- [impl] 이후 호출은 캐시된 인스턴스 반환 #cache
- [return] fastembed.TextEmbedding 인스턴스
- [deps] fastembed #import
- [note] 모델 로드에 수 초 소요, 첫 검색/인덱싱 시 체감 #performance

## Relations

- part_of [[vecsearch]] (소속 모듈)
- data_flows_to [[embed-texts]] (embedder 인스턴스 → 임베딩 실행)