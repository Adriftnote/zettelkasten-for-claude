---
title: sync-coordinator
type: module
permalink: modules/sync-coordinator
level: high
category: tools/knowledge-management/sync
semantic: coordinate sync lifecycle
path: basic_memory/sync/coordinator.py
tags:
- python
- lifecycle
- asyncio
---

# sync-coordinator

동기화/감시 서비스의 라이프사이클을 중앙 관리하는 모듈.

## 개요

SyncCoordinator는 SyncService와 WatchService의 시작/중지/상태 추적을 통합 관리한다.
API, MCP, CLI 등 다양한 진입점에서 동일한 라이프사이클을 보장하며,
SyncStatus enum으로 NOT_STARTED→STARTING→RUNNING→STOPPING→STOPPED 전이를 추적한다.
asyncio.Task 기반으로 백그라운드 실행하며, 클린 셧다운을 보장한다.

## Observations

- [impl] SyncStatus enum: NOT_STARTED, STARTING, RUNNING, STOPPING, STOPPED, ERROR #state-machine
- [impl] dataclass 기반 설계, config + should_sync + skip_reason 파라미터 #dataclass
- [impl] start()는 non-blocking (asyncio.Task 생성), stop()에서 클린 취소 #async-lifecycle
- [impl] should_sync=False이면 skip_reason 로깅 후 즉시 반환 #conditional-sync
- [deps] asyncio, loguru #import

## Relations

- part_of [[basic-memory]] (동기화 라이프사이클 관리)
- calls [[sync-service]] (동기화 실행)
- calls [[watch-service]] (감시 실행)
- data_flows_to [[mcp-server]] (서버 lifespan에서 생성/시작/종료)