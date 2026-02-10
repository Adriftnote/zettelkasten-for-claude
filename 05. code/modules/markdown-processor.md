---
title: markdown-processor
type: module
permalink: modules/markdown-processor
level: high
category: tools/knowledge-management/markdown
semantic: serialize entity to markdown
path: basic_memory/markdown/markdown_processor.py
tags:
- python
- markdown
- serialization
---

# markdown-processor

EntityMarkdown 스키마를 마크다운 파일로 직렬화하는 모듈.

## 개요

read→modify→write 패턴의 I/O 레이어를 담당한다.
EntityParser로 파일을 읽고, 수정 후 write_file로 원자적으로 기록한다.
프론트매터(title, type, permalink)를 OrderedDict로 관리하여 필드 순서를 보장하고,
Observation과 Relation을 표준 포맷으로 직렬화한다.

## Observations

- [impl] write_file: DirtyFileError로 optimistic concurrency 지원 (checksum 비교) #concurrency
- [impl] write_file: 원자적 쓰기 (write_file_atomic) + 선택적 포맷터 적용 #atomic-write
- [impl] to_markdown_string: 파일 I/O 없이 직렬화만 수행 (클라우드 환경 대응) #cloud-support
- [impl] format_observations: `- [category] content (context)` 형식 #format
- [impl] format_relations: `- type [[target]] (context)` 형식 #format
- [impl] OrderedDict로 프론트매터 필드 순서 보장 (title → type → permalink → rest) #ordering
- [deps] frontmatter, pathlib #import
- [note] import 전용 (used only for import) 주석이 있으나 실제로는 sync에서도 사용 #caveat

## Relations

- part_of [[basic-memory]] (마크다운 직렬화 모듈)
- uses [[entity-parser]] (파일 읽기 위임)
- uses [[markdown-schemas]] (EntityMarkdown 스키마)