---
title: chunk-markdown
type: function
permalink: functions/chunk-markdown
level: low
category: search/semantic/chunking
semantic: chunk markdown by headers
path: C:\claude-workspace\_system\vector-search\vecsearch.py
tags:
- python
- markdown
- chunking
---

# chunk-markdown

마크다운 텍스트를 ## 헤더 기준으로 청크 분할하는 함수

## 📖 시그니처

```python
def chunk_markdown(text: str, entity_title: str, entity_type: str) -> List[dict]
```

## Observations

- [impl] `## ` 헤더 기준으로 re.split 분할 #regex
- [impl] 각 청크 앞에 `[entity_type] entity_title` 접두사 추가 (임베딩 품질 향상) #prefix
- [impl] `## Relations` 섹션은 스킵 (wikilink만 있어서 임베딩 가치 없음) #filter
- [impl] 최소 30자 미만 청크는 필터링 (MIN_CHUNK_CHARS) #filter
- [impl] 청크가 하나도 없으면 전체 본문을 하나의 청크로 반환 #fallback
- [return] 청크 딕셔너리 리스트 (section_header, chunk_text, chunk_index)
- [deps] re #import

## 청크 구조

```python
{
    "section_header": "## 섹션명" | None,  # intro는 None
    "chunk_text": "[concept] 제목\n\n## 섹션명\n\n본문...",
    "chunk_index": 0,  # 순서 번호
}
```

## Relations

- part_of [[vecsearch]] (소속 모듈)
- calls [[strip-frontmatter]] (프론트매터 제거 후 청킹)
- data_flows_to [[index-entity]] (청크 리스트 → 임베딩)