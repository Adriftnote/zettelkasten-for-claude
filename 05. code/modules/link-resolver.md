---
title: link-resolver
type: module
permalink: modules/link-resolver
level: high
category: tools/knowledge-management/services
semantic: resolve wikilinks
path: basic_memory/services/link_resolver.py
tags:
- python
- wikilink
- resolution
---

# link-resolver

마크다운 wikilink를 permalink로 해석하는 서비스 모듈.

## 개요

LinkResolver는 `[[link text]]` 형식의 wikilink를 5단계 우선순위로 해석한다:
(1) 정확한 permalink 매칭, (2) 정확한 title 매칭, (3) 정확한 file_path 매칭,
(4) .md 확장자 추가 매칭, (5) search 기반 fuzzy 매칭.
source_path가 있으면 상대 경로 해석과 가까운 노트 우선을 지원한다.

## Observations

- [impl] 5단계 해석: permalink → title → file_path → file_path.md → search fallback #resolution-chain
- [impl] source_path 기반 상대 경로 해석 (folder/note.md에서 [[nested/deep]] → folder/nested/deep.md) #relative-path
- [impl] context-aware: source_path 가까운 노트를 우선 반환 #proximity
- [impl] _normalize_link_text: alias 분리 (link|alias 형식) #alias
- [impl] strict 모드: fuzzy 검색 비활성화 (정확한 매칭만) #strict
- [deps] loguru, EntityRepository, SearchService #import

## Relations

- part_of [[basic-memory]] (wikilink 해석 서비스)
- uses [[search-service]] (fuzzy 검색 fallback)
- uses [[knowledge]] (Entity 조회)
- data_flows_to [[entity-service]] (링크 해석 결과 전달)
- data_flows_to [[sync-service]] (동기화 시 링크 해석)