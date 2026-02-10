---
title: context-service
type: module
permalink: modules/context-service
level: high
category: tools/knowledge-management/services
semantic: build context from graph
path: basic_memory/services/context_service.py
tags:
- python
- knowledge-graph
- context
---

# context-service

memory:// URI에서 지식 그래프 컨텍스트를 빌딩하는 서비스 모듈.

## 개요

ContextService는 memory:// URI를 받아 지식 그래프를 탐색하고 풍부한 컨텍스트를 구성한다.
직접 permalink 조회, 와일드카드 패턴 매칭, 관련 Entity 탐색 3가지 모드를 지원하며,
ContextResult(results + metadata)로 계층적 결과를 반환한다.
결과의 각 항목은 primary_result + observations + related_results 구조이다.

## Observations

- [impl] 3가지 컨텍스트 빌딩 모드: direct permalink, pattern match, special(related) #context-modes
- [impl] ContextResultRow: type/id/title/permalink/depth/root_id + relation/observation 필드 #result-row
- [impl] ContextResultItem: primary + observations[] + related_results[] 계층 구조 #hierarchical
- [impl] ContextMetadata: uri/types/depth/timeframe/counts 통계 #metadata
- [impl] depth 파라미터로 그래프 탐색 깊이 제어 (기본 1) #depth
- [deps] sqlalchemy, loguru, dateparser #import

## Relations

- part_of [[basic-memory]] (컨텍스트 빌딩 서비스)
- uses [[search-service]] (검색 기반 Entity 조회)
- uses [[knowledge]] (Entity/Relation 모델)