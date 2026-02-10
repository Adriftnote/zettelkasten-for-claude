---
title: mcp-server
type: module
permalink: modules/mcp-server-1
level: high
category: tools/knowledge-management/mcp
semantic: run FastMCP server
path: basic_memory/mcp/server.py
tags:
- python
- fastmcp
- mcp
---

# mcp-server

FastMCP 기반 MCP 서버와 lifespan 관리 모듈.

## 개요

FastMCP 인스턴스를 생성하고, lifespan 컨텍스트 매니저로 서버 생명주기를 관리한다.
시작 시 McpContainer 생성 → initialize_app(마이그레이션, 프로젝트 조정) → SyncCoordinator 시작,
종료 시 SyncCoordinator 정지 → DB 연결 해제 순서로 정리한다.
테스트 환경에서는 외부 제공 엔진을 보존하는 로직이 포함되어 있다.

## Observations

- [impl] FastMCP(name="Basic Memory", lifespan=lifespan) 단일 인스턴스 #fastmcp
- [impl] lifespan: McpContainer.create() → set_container() → initialize_app() → sync start #startup
- [impl] 테스트 환경: engine_was_none 체크로 외부 엔진 보존 #test-safety
- [impl] 종료 순서: sync stop → db shutdown (외부 엔진이면 skip) #shutdown
- [deps] fastmcp, loguru #import

## 3-레이어 아키텍처

```
Tools (17개) → Clients (6개) → Services (7개)
```

- **Tools**: MCP 프로토콜에 노출되는 함수 (write_note, read_note, search 등)
- **Clients**: Tool → Service 연결 레이어 (Knowledge, Search, Memory, Directory, Resource, Project)
- **Services**: 비즈니스 로직 (EntityService, SearchService, ContextService 등)

## Relations

- part_of [[basic-memory]] (MCP 서버 모듈)
- uses [[mcp-container]] (Composition Root)
- uses [[sync-coordinator]] (동기화 라이프사이클)
- depends_on [[FastMCP]] (MCP 프레임워크)