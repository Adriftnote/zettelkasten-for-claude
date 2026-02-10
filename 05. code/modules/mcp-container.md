---
title: mcp-container
type: module
permalink: modules/mcp-container
level: high
category: tools/knowledge-management/mcp
semantic: compose MCP dependencies
path: basic_memory/mcp/container.py
tags:
- python
- composition-root
- dependency-injection
---

# mcp-container

MCP 서버의 Composition Root. 설정과 런타임 모드를 중앙 관리.

## 개요

McpContainer는 ConfigManager를 읽어 BasicMemoryConfig와 RuntimeMode(local/cloud/test)를 결정하는
단일 진입점이다. 이 모듈만 ConfigManager를 직접 읽고, 하위 모듈은 명시적으로 주입받는다.
should_sync_files 프로퍼티로 동기화 활성화 여부를 판단하며,
create_sync_coordinator()로 SyncCoordinator를 생성한다.

## Observations

- [impl] McpContainer dataclass: config + mode 보관, create() 클래스메소드로 생성 #composition-root
- [impl] should_sync_files: sync_changes && !test && !cloud 조건 #sync-decision
- [impl] sync_skip_reason: 동기화 비활성화 사유를 문자열로 반환 (로깅용) #logging
- [impl] 모듈 레벨 _container + get_container()/set_container()로 글로벌 접근 #singleton
- [impl] create_sync_coordinator: deferred import로 순환 의존성 회피 #circular-import
- [deps] BasicMemoryConfig, ConfigManager, RuntimeMode #import
- [note] "Only this module reads ConfigManager directly" 원칙 #design-principle

## Relations

- part_of [[basic-memory]] (MCP Composition Root)
- uses [[config]] (설정 읽기)
- data_flows_to [[mcp-server]] (서버 lifespan에서 사용)
- data_flows_to [[sync-coordinator]] (코디네이터 생성)