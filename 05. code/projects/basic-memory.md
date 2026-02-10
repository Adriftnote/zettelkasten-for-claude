---
title: basic-memory
type: project
permalink: projects/basic-memory-1
level: high
category: tools/knowledge-management
path: C:\claude-workspace\reference\basic-memory\src\basic_memory
tags:
- python
- mcp
- knowledge-graph
- zettelkasten
---

# basic-memory

Local-first knowledge management combining Zettelkasten with knowledge graphs, exposed as MCP server.

## 개요

basic-memory는 마크다운 파일을 지식 그래프로 변환하여 LLM이 MCP 프로토콜을 통해 접근할 수 있게 하는 시스템이다.
파일시스템의 마크다운 노트를 SQLite/Postgres DB로 동기화하고, Entity-Observation-Relation 모델로 구조화하며,
FTS5/tsvector 기반 전문 검색과 memory:// URI를 통한 컨텍스트 빌딩을 제공한다. v0.18.0.

## 아키텍처

```
FastMCP Server (lifespan)
  ├── McpContainer (Composition Root)
  │     ├── Config (BasicMemoryConfig + ConfigManager)
  │     └── RuntimeMode (local/cloud/test)
  ├── Tools Layer (17 MCP tools)
  │     └── Clients Layer (6 typed clients)
  │           └── Services Layer
  │                 ├── EntityService (CRUD + link resolution)
  │                 ├── SearchService (FTS5/tsvector 검색)
  │                 ├── ContextService (memory:// URI → 그래프 탐색)
  │                 ├── FileService (async I/O + checksum)
  │                 ├── ProjectService (멀티프로젝트)
  │                 ├── DirectoryService (폴더 탐색)
  │                 └── LinkResolver (wikilink 해석)
  ├── Sync Layer
  │     ├── SyncCoordinator (라이프사이클)
  │     ├── SyncService (파일↔DB 동기화 + circuit breaker)
  │     └── WatchService (watchfiles 감시)
  ├── Markdown Layer
  │     ├── EntityParser (frontmatter + markdown-it)
  │     ├── MarkdownProcessor (읽기/쓰기)
  │     └── Schemas (Pydantic 모델)
  ├── Models Layer (SQLAlchemy ORM)
  │     ├── Entity / Observation / Relation
  │     └── Project
  └── DB Layer
        ├── SQLite (aiosqlite + WAL + FTS5)
        └── Postgres (asyncpg + tsvector)
```

## 코드 구성

**루트 모듈**
- config: 설정 관리 (BasicMemoryConfig, ConfigManager, ProjectConfig)
- db: 데이터베이스 엔진 생성, 마이그레이션, 세션 관리

**모델 (models/)**
- knowledge: Entity, Observation, Relation ORM 모델
- project: Project ORM 모델 + permalink 자동 생성
- search: FTS5/Postgres 검색 인덱스 DDL
- base: SQLAlchemy Base 클래스

**마크다운 (markdown/)**
- entity-parser: 마크다운 파일 → EntityMarkdown 파싱
- markdown-processor: EntityMarkdown → 마크다운 파일 직렬화
- schemas: EntityMarkdown, Observation, Relation Pydantic 스키마

**동기화 (sync/)**
- sync-service: 파일시스템 ↔ DB 동기화 (circuit breaker 패턴)
- watch-service: watchfiles 기반 실시간 감시
- coordinator: 동기화/감시 라이프사이클 관리

**MCP 서버 (mcp/)**
- server: FastMCP 서버 + lifespan 관리
- container: McpContainer Composition Root
- tools: 17개 MCP 도구 (write_note, read_note, search 등)
- clients: 6개 typed client (Knowledge, Search, Memory, Directory, Resource, Project)

**서비스 (services/)**
- entity-service: Entity CRUD + 관계 해석
- search-service: 전문 검색 (FTS5/tsvector)
- context-service: memory:// URI 컨텍스트 빌딩
- file-service: 비동기 파일 I/O + 체크섬
- link-resolver: wikilink → permalink 해석
- project-service: 멀티프로젝트 관리
- directory-service: 폴더 구조 탐색

## Relations

- contains [[config]] (설정 관리 모듈)
- contains [[db]] (데이터베이스 모듈)
- contains [[knowledge]] (Entity/Observation/Relation ORM)
- contains [[project-model]] (Project ORM)
- contains [[search-ddl]] (검색 인덱스 DDL)
- contains [[entity-parser]] (마크다운 파싱)
- contains [[markdown-processor]] (마크다운 직렬화)
- contains [[markdown-schemas]] (Pydantic 스키마)
- contains [[sync-service]] (파일↔DB 동기화)
- contains [[watch-service]] (실시간 감시)
- contains [[sync-coordinator]] (동기화 라이프사이클)
- contains [[mcp-server]] (FastMCP 서버)
- contains [[mcp-container]] (Composition Root)
- contains [[entity-service]] (Entity CRUD 서비스)
- contains [[search-service]] (검색 서비스)
- contains [[context-service]] (컨텍스트 빌딩 서비스)
- contains [[file-service]] (파일 I/O 서비스)
- contains [[link-resolver]] (wikilink 해석 서비스)
- depends_on [[FastMCP]] (MCP 프레임워크)
- depends_on [[SQLAlchemy]] (ORM/DB 엔진)
- depends_on [[markdown-it]] (마크다운 파서)
- depends_on [[watchfiles]] (파일 감시)
- extends [[벡터 시맨틱 검색]] (벡터 검색 확장)
- based_on [[Basic Memory 허브 (Basic Memory Hub)]] (제텔카스텐 지식 관리 허브)