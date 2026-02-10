---
title: knowledge
type: module
permalink: modules/knowledge
level: high
category: tools/knowledge-management/models
semantic: define knowledge graph models
path: basic_memory/models/knowledge.py
tags:
- python
- sqlalchemy
- orm
---

# knowledge

Entity, Observation, Relation ORM 모델을 정의하는 핵심 모듈.

## 개요

basic-memory 지식 그래프의 3대 핵심 모델을 정의한다.
Entity는 마크다운 파일에 대응하는 의미 노드, Observation은 Entity에 대한 원자적 사실,
Relation은 Entity 간 방향성 관계를 나타낸다. 모두 Project에 속하며,
cascade delete로 생명주기가 관리된다.

## Observations

- [impl] Entity: UUID external_id + int PK, file_path/permalink/checksum 추적 #identity
- [impl] Entity: project_id FK로 멀티프로젝트 지원, content_type으로 마크다운 판별 #multi-project
- [impl] Entity: mtime/size 필드로 빠른 변경 감지 (checksum 비교 전 pre-filter) #optimization
- [impl] Observation: entity_id FK + CASCADE, category/content/tags/context 구조 #atomic-fact
- [impl] Observation: permalink 프로퍼티로 합성 경로 생성 (entity/observations/category/content) #synthetic-permalink
- [impl] Relation: from_id/to_id FK, to_name으로 미해석 링크도 저장 #unresolved-link
- [impl] Relation: UniqueConstraint(from_id, to_id, relation_type)으로 중복 방지 #constraint
- [impl] Entity.__getattribute__ 오버라이드로 datetime 타임존 보장 #timezone
- [deps] sqlalchemy, uuid #import
- [note] to_id는 nullable (미해석 관계), to_name은 항상 존재 #caveat

## Relations

- part_of [[basic-memory]] (핵심 모델 모듈)
- contains [[entity-model]] (Entity ORM 클래스)
- contains [[observation-model]] (Observation ORM 클래스)
- contains [[relation-model]] (Relation ORM 클래스)
- depends_on [[SQLAlchemy]] (ORM 프레임워크)