---
title: sync-service
type: module
permalink: modules/sync-service
level: high
category: tools/knowledge-management/sync
semantic: synchronize files with database
path: basic_memory/sync/sync_service.py
tags:
- python
- sync
- circuit-breaker
---

# sync-service

파일시스템과 데이터베이스 간 동기화를 수행하는 핵심 모듈. (1260줄)

## 개요

SyncService는 프로젝트 디렉토리의 마크다운 파일을 스캔하여 DB와 비교하고,
새 파일/수정된 파일/삭제된 파일/이동된 파일을 감지하여 동기화한다.
Circuit breaker 패턴으로 반복 실패하는 파일을 자동 스킵하며,
SyncReport로 변경 사항을 추적한다.

## Observations

- [impl] SyncReport: new/modified/deleted/moves 집합 + checksums dict #report
- [impl] Circuit breaker: MAX_CONSECUTIVE_FAILURES=3, FileFailureInfo로 실패 추적 #circuit-breaker
- [impl] SkippedFile dataclass로 스킵된 파일 정보 기록 (path, reason, count, first_failed) #skip-tracking
- [impl] checksum + mtime + size 3단계 변경 감지 (빠른 것부터 비교) #change-detection
- [impl] bmignore 패턴으로 무시할 파일 필터링 #ignore-patterns
- [impl] has_frontmatter 체크로 마크다운 파일만 처리 #filter
- [impl] Entity CRUD: EntityParser → EntityService → SearchService 인덱싱 체인 #sync-chain
- [impl] Windows에서 subprocess 대신 os.walk 사용 (SelectorEventLoop 제약) #windows
- [deps] aiofiles, sqlalchemy, loguru #import
- [note] 1260줄 대형 모듈, 동기화 로직의 핵심 #large-module

## Relations

- part_of [[basic-memory]] (동기화 핵심 모듈)
- uses [[entity-parser]] (파일 파싱)
- uses [[entity-service]] (Entity CRUD)
- uses [[search-service]] (검색 인덱스 업데이트)
- uses [[file-service]] (파일 I/O)
- uses [[link-resolver]] (wikilink 해석)
- data_flows_to [[watch-service]] (감시 서비스에서 호출)