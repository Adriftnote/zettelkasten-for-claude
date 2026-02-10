---
title: strip-frontmatter
type: function
permalink: functions/strip-frontmatter
level: low
category: search/semantic/chunking
semantic: strip yaml frontmatter
path: C:\claude-workspace\_system\vector-search\vecsearch.py
tags:
- python
- markdown
---

# strip-frontmatter

마크다운 파일의 YAML 프론트매터(--- ... ---)를 제거하는 함수

## 📖 시그니처

```python
def strip_frontmatter(text: str) -> str
```

## Observations

- [impl] `---`로 시작하면 두 번째 `---`까지 제거 #parsing
- [impl] 프론트매터가 없으면 원문 그대로 반환 #fallback
- [return] 프론트매터가 제거된 본문 텍스트 (str)

## Relations

- part_of [[vecsearch]] (소속 모듈)
- data_flows_to [[chunk-markdown]] (정제된 본문 → 청킹)