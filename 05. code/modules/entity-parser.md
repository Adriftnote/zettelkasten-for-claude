---
title: entity-parser
type: module
permalink: modules/entity-parser
level: high
category: tools/knowledge-management/markdown
semantic: parse markdown to entity
path: basic_memory/markdown/entity_parser.py
tags:
- python
- markdown-it
- frontmatter
---

# entity-parser

마크다운 파일을 EntityMarkdown 객체로 파싱하는 모듈.

## 개요

python-frontmatter로 YAML 프론트매터를 추출하고, markdown-it에 observation/relation 커스텀 플러그인을 적용하여
본문에서 Observation(`- [category] content #tag`)과 Relation(`- type [[target]] (context)`)을 파싱한다.
EntityParser 클래스는 base_path 기준으로 상대 경로를 해석하며, 파일/문자열 양쪽 입력을 지원한다.

## Observations

- [impl] markdown-it에 observation_plugin + relation_plugin 적용하여 구조 추출 #markdown-it
- [impl] normalize_frontmatter_value로 date/bool/int를 문자열로 정규화 (PyYAML 자동변환 대응) #yaml-safety
- [impl] parse() 함수: markdown-it token.meta에서 observation/relation 추출 #parse
- [impl] EntityParser.parse_file: 파일 읽기 → parse_file_content → parse_markdown_content #pipeline
- [impl] parse_markdown_content: BOM 제거 → frontmatter 파싱 → 기본값 설정 → observation/relation 추출 #parse-flow
- [impl] YAML 파싱 실패 시 graceful fallback (빈 메타데이터로 처리) #error-handling
- [impl] dateparser로 유연한 날짜 파싱 ("yesterday", "2 days ago" 등) #date-parsing
- [deps] frontmatter, markdown-it-py, dateparser, pydantic #import
- [note] strip_bom으로 Windows BOM 문자 제거 (issue #452) #windows

## Relations

- part_of [[basic-memory]] (마크다운 파싱 모듈)
- contains [[entity-parser-class]] (EntityParser 클래스)
- contains [[normalize-frontmatter-value]] (프론트매터 정규화 함수)
- contains [[parse-content]] (본문 파싱 함수)
- depends_on [[markdown-it]] (마크다운 파서)
- uses [[markdown-schemas]] (Pydantic 스키마)