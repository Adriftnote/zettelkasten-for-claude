---
title: watch-service
type: module
permalink: modules/watch-service
level: high
category: tools/knowledge-management/sync
semantic: watch filesystem changes
path: basic_memory/sync/watch_service.py
tags:
- python
- watchfiles
- realtime
---

# watch-service

watchfiles 기반 실시간 파일 감시 서비스 모듈. (516줄)

## 개요

WatchService는 watchfiles.awatch로 프로젝트 디렉토리의 파일 변경을 실시간으로 감지하고,
변경 이벤트를 SyncService에 전달하여 즉시 동기화한다.
WatchServiceState Pydantic 모델로 서비스 상태(실행 여부, 에러 수, 최근 이벤트)를 추적하며,
WatchEvent로 개별 동기화 결과를 기록한다.

## Observations

- [impl] watchfiles.awatch로 비동기 파일 감시, gitignore 패턴으로 필터링 #watchfiles
- [impl] WatchEvent: timestamp/path/action/status/checksum/error 기록 #event
- [impl] WatchServiceState: running/start_time/pid/error_count/recent_events (최대 100개) #state
- [impl] SyncServiceFactory 타입 별칭으로 프로젝트별 SyncService 동적 생성 #factory
- [impl] 멀티프로젝트 지원: ProjectRepository로 모든 활성 프로젝트 감시 #multi-project
- [deps] watchfiles, pydantic, rich #import
- [note] watch_status.json에 상태 파일 기록 #status-file

## Relations

- part_of [[basic-memory]] (실시간 감시 모듈)
- calls [[sync-service]] (변경 감지 시 동기화 호출)
- depends_on [[watchfiles]] (파일 감시 라이브러리)