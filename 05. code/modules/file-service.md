---
title: file-service
type: module
permalink: modules/file-service
level: high
category: tools/knowledge-management/services
semantic: handle file operations
path: basic_memory/services/file_service.py
tags:
- python
- aiofiles
- async-io
---

# file-service

비동기 파일 I/O와 체크섬 추적을 담당하는 서비스 모듈.

## 개요

FileService는 base_path 기준으로 Entity 파일의 비동기 읽기/쓰기를 처리한다.
asyncio.Semaphore로 동시 파일 작업 수를 제한(기본 10)하여 OOM을 방지하고,
MarkdownProcessor를 통해 프론트매터 관리와 원자적 쓰기를 수행한다.
파일 체크섬, 메타데이터 추출, 콘텐츠 타입 판별 등 유틸리티도 제공한다.

## Observations

- [impl] asyncio.Semaphore(max_concurrent_files=10)로 동시 I/O 제한 #concurrency-control
- [impl] get_entity_path: base_path + entity.file_path → 절대 경로 #path-resolution
- [impl] read_entity_content: 프론트매터/observations/relations 제거 후 순수 콘텐츠 반환 #content-extraction
- [impl] aiofiles로 true async I/O (non-blocking) #async-io
- [impl] MarkdownProcessor 위임으로 읽기/쓰기 분리 #delegation
- [deps] aiofiles, hashlib, mimetypes, pathlib #import

## Relations

- part_of [[basic-memory]] (파일 I/O 서비스)
- uses [[markdown-processor]] (마크다운 읽기/쓰기)
- data_flows_to [[entity-service]] (Entity 파일 처리)
- data_flows_to [[search-service]] (콘텐츠 읽기)