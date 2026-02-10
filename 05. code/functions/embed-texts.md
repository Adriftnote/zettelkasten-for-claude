---
title: embed-texts
type: function
permalink: functions/embed-texts
level: low
category: search/semantic/embedding
semantic: embed texts to vectors
path: C:\claude-workspace\_system\vector-search\vecsearch.py
tags:
- python
- fastembed
---

# embed-texts

텍스트 리스트를 벡터 배열로 변환하는 함수

## 📖 시그니처

```python
def embed_texts(embedder, texts: List[str]) -> List[bytes]
```

## Observations

- [impl] fastembed의 embed() 메서드로 배치 임베딩 #batch
- [impl] 결과를 serialize_f32()로 bytes 직렬화 #pipeline
- [return] 직렬화된 벡터 리스트 (List[bytes], 각 1024차원 float32)
- [deps] fastembed #import

## Relations

- part_of [[vecsearch]] (소속 모듈)
- calls [[serialize-f32]] (벡터 직렬화)
- data_flows_to [[index-entity]] (벡터 배열 → DB 저장)