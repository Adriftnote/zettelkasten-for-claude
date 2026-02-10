---
title: project-model
type: module
permalink: modules/project-model
level: high
category: tools/knowledge-management/models
semantic: define project model
path: basic_memory/models/project.py
tags:
- python
- sqlalchemy
- orm
---

# project-model

Project ORM 모델과 permalink 자동 생성 이벤트를 정의하는 모듈.

## 개요

Project는 지식 Entity들의 그룹 단위로, 이름-경로-permalink 매핑과 동기화 상태 추적을 담당한다.
SQLAlchemy before_insert/before_update 이벤트로 name→permalink 자동 변환을 보장하며,
last_scan_timestamp/last_file_count로 동기화 최적화 워터마크를 관리한다.

## Observations

- [impl] UUID external_id로 안정적 API 참조, name unique 제약 #identity
- [impl] is_active/is_default 플래그로 프로젝트 상태 관리 #status
- [impl] last_scan_timestamp + last_file_count로 스캔 최적화 워터마크 #sync-optimization
- [impl] before_insert/before_update 이벤트로 permalink 자동 생성 (generate_permalink) #event-listener
- [impl] entities relationship으로 cascade="all, delete-orphan" #cascade
- [deps] sqlalchemy, uuid, datetime #import

## Relations

- part_of [[basic-memory]] (프로젝트 모델 모듈)
- depends_on [[SQLAlchemy]] (ORM 프레임워크)