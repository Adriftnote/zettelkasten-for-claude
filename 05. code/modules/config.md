---
title: config
type: module
permalink: modules/config
level: high
category: tools/knowledge-management/core
semantic: manage configuration
path: basic_memory/config.py
tags:
- python
- pydantic
- configuration
---

# config

basic-memory 설정 관리 모듈. BasicMemoryConfig, ConfigManager, ProjectConfig를 제공.

## 개요

Pydantic Settings 기반 설정 클래스(BasicMemoryConfig)로 DB 백엔드(SQLite/Postgres), 동기화 옵션, 포맷터 등을 관리한다.
ConfigManager는 `~/.basic-memory/config.json` 파일을 읽어 프로젝트별 경로 매핑을 처리하며,
ProjectConfig dataclass는 개별 프로젝트의 이름-경로 쌍을 표현한다.

## Observations

- [impl] BasicMemoryConfig는 pydantic-settings BaseSettings 상속, env prefix "BASIC_MEMORY_" #pydantic
- [impl] DatabaseBackend enum으로 SQLite/Postgres 전환 지원 #dual-backend
- [impl] ConfigManager는 config.json을 CRUD하며 프로젝트 목록 관리 #config-file
- [impl] ProjectConfig dataclass로 프로젝트 이름-경로 쌍 표현 #dataclass
- [deps] pydantic-settings, pathlib, platformdirs #import
- [note] Windows에서 `~/.basic-memory/` → `C:\Users\{user}\.basic-memory\` #platform

## 주요 설정 항목

| 설정 | 기본값 | 용도 |
|------|--------|------|
| `database_backend` | `sqlite` | DB 백엔드 선택 |
| `database_path` | `~/.basic-memory/memory.db` | SQLite DB 경로 |
| `database_url` | None | Postgres 연결 URL |
| `sync_changes` | True | 파일 변경 자동 감시 |
| `cloud_mode_enabled` | False | 클라우드 모드 |

## Relations

- part_of [[basic-memory]] (루트 설정 모듈)
- contains [[basic-memory-config]] (설정 클래스)
- contains [[config-manager]] (설정 파일 관리)
- depends_on [[pydantic-settings]] (설정 프레임워크)