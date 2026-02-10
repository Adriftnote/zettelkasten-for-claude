---
title: serialize-f32
type: function
permalink: functions/serialize-f32
level: low
category: search/semantic/embedding
semantic: serialize float vector
path: C:\claude-workspace\_system\vector-search\vecsearch.py
tags:
- python
- binary
---

# serialize-f32

float 리스트를 sqlite-vec이 요구하는 bytes 형식으로 직렬화하는 함수

## 📖 시그니처

```python
def serialize_f32(vector: list) -> bytes
```

## Observations

- [impl] struct.pack으로 float32 배열을 바이너리로 변환 #serialization
- [impl] 포맷 문자열 `{len}f`로 가변 길이 지원 #struct
- [return] bytes (sqlite-vec INSERT용 바이너리 벡터)
- [deps] struct #import

## Relations

- part_of [[vecsearch]] (소속 모듈)
- data_flows_to [[embed-texts]] (직렬화 → 벡터 저장)