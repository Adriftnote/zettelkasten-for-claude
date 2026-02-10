---
title: markdown-schemas
type: module
permalink: modules/markdown-schemas
level: high
category: tools/knowledge-management/markdown
semantic: define markdown schemas
path: basic_memory/markdown/schemas.py
tags:
- python
- pydantic
- schema
---

# markdown-schemas

마크다운 파일의 구조를 표현하는 Pydantic 스키마 모듈.

## 개요

Observation, Relation, EntityFrontmatter, EntityMarkdown 4개의 Pydantic 모델을 정의한다.
Observation은 `- [category] content #tag (context)` 형식의 원자적 사실,
Relation은 `- type [[target]] (context)` 형식의 관계를 표현한다.
EntityMarkdown은 프론트매터 + 본문 + observations + relations를 통합하는 최상위 스키마이다.

## Observations

- [impl] Observation: category/content/tags/context + __str__로 마크다운 출력 #pydantic
- [impl] Relation: type/target/context + __str__로 wikilink 포맷 출력 #pydantic
- [impl] EntityFrontmatter: metadata dict 기반, title/type/permalink를 @property로 접근 #metadata-dict
- [impl] EntityMarkdown: frontmatter + content + observations + relations + created/modified #composite
- [deps] pydantic, datetime #import
- [note] EntityFrontmatter는 고정 필드 대신 metadata dict로 유연하게 처리 #flexible-schema

## Relations

- part_of [[basic-memory]] (마크다운 스키마 모듈)
- data_flows_to [[entity-parser]] (파싱 결과 스키마)
- data_flows_to [[markdown-processor]] (직렬화 입력 스키마)