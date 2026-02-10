---
title: entity-service
type: module
permalink: modules/entity-service
level: high
category: tools/knowledge-management/services
semantic: manage entity CRUD
path: basic_memory/services/entity_service.py
tags:
- python
- service
- crud
---

# entity-service

Entity CRUD 및 관계 해석을 담당하는 핵심 서비스 모듈.

## 개요

EntityService는 BaseService를 상속하여 Entity의 생성/읽기/수정/삭제를 처리한다.
EntityParser로 마크다운을 파싱하고, ObservationRepository/RelationRepository로 하위 데이터를 관리하며,
LinkResolver로 wikilink를 permalink로 해석한다. 파일 경로 충돌 감지, 디렉토리 이동/삭제 등 고급 기능도 포함한다.

## Observations

- [impl] BaseService[EntityModel] 상속, EntityRepository + ObservationRepo + RelationRepo 주입 #di
- [impl] detect_file_path_conflicts: 대소문자/유니코드/하이픈-공백 차이 감지 #conflict-detection
- [impl] LinkResolver로 Relation.to_name → Entity.to_id 해석 #link-resolution
- [impl] SearchService 옵셔널 주입 (검색 인덱스 업데이트) #optional-search
- [impl] DirectoryMoveResult/DirectoryDeleteResult로 디렉토리 작업 결과 반환 #directory-ops
- [deps] frontmatter, sqlalchemy, loguru #import
- [note] 가장 의존성이 많은 서비스 (6개 repository/service 주입) #central-service

## Relations

- part_of [[basic-memory]] (Entity 관리 서비스)
- uses [[entity-parser]] (마크다운 파싱)
- uses [[file-service]] (파일 I/O)
- uses [[link-resolver]] (wikilink 해석)
- uses [[search-service]] (검색 인덱스 업데이트)
- uses [[knowledge]] (Entity/Observation/Relation 모델)