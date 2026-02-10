---
title: vecsearch
type: module
permalink: modules/vecsearch-1
level: high
category: search/semantic/knowledge
semantic: vector semantic search for basic-memory
path: C:\claude-workspace\_system\vector-search\vecsearch.py
tags:
- python
- sqlite-vec
- fastembed
- vector-search
- semantic-search
---

# vecsearch

basic-memory 지식베이스의 벡터 시맨틱 검색 도구

## 📖 개요

basic-memory의 entity 마크다운 파일을 벡터 임베딩하여 의미 기반 유사도 검색을 제공.
FTS5 키워드 매칭이 아닌 시맨틱 검색으로, "컨텍스트 관리"를 검색하면 "Four-Bucket Optimization" 같은 의미적으로 관련된 노트도 찾아줌.

## Observations

- [impl] intfloat/multilingual-e5-large 모델 사용 (1024차원, 한국어 지원) #model
- [impl] 마크다운 파일을 ## 헤더 기준으로 청킹하여 섹션별 임베딩 #chunking
- [impl] sqlite-vec로 벡터 저장 및 KNN 유사도 검색 #storage
- [impl] checksum 비교로 변경된 노트만 재임베딩 (증분 동기화) #sync
- [deps] fastembed, sqlite-vec, sqlite3 #import
- [usage] `python vecsearch.py search "쿼리" --unique` 시맨틱 검색
- [usage] `python vecsearch.py sync` 변경분 동기화
- [usage] `python vecsearch.py index` 전체 재인덱싱
- [usage] `python vecsearch.py stats` 인덱스 통계
- [note] 346 entities → 2,346 chunks 인덱싱 완료 (2026-02-10) #stats
- [note] Claude Code Stop hook으로 세션 종료 시 자동 sync #automation

## 아키텍처

```
memory.db (entity 메타데이터, 읽기 전용)
    ↓ entity.file_path + project base path
마크다운 파일 (from-obsidian/)
    ↓ ## 헤더 기준 청킹 (## Relations 스킵)
    ↓ 각 청크에 [entity_type] title 접두사
fastembed (multilingual-e5-large, 1024차원)
    ↓ 벡터 변환
sqlite-vec (vectors.db)
    ↓ KNN 유사도 검색
검색 결과 반환
```

## DB 스키마

### chunks 테이블 (메타데이터)
```sql
CREATE TABLE chunks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_id INTEGER NOT NULL,
    entity_title TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    project_id INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    section_header TEXT,
    chunk_text TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    checksum TEXT NOT NULL,
    created_at TEXT, updated_at TEXT
);
```

### vec_chunks 테이블 (벡터 인덱스)
```sql
CREATE VIRTUAL TABLE vec_chunks USING vec0(
    embedding float[1024]
);
```

### sync_state 테이블 (동기화 추적)
```sql
CREATE TABLE sync_state (
    entity_id INTEGER PRIMARY KEY,
    checksum TEXT NOT NULL,
    synced_at TEXT
);
```

## 동기화 로직

```
sync 실행 시:
1. memory.db에서 전체 entity (id, checksum) 조회
2. vectors.db의 sync_state에서 (entity_id, checksum) 조회
3. 비교:
   - checksum 같음 → 스킵
   - checksum 다름 → 해당 노트 청크 삭제 → 재청킹 → 재임베딩
   - memory.db에만 있음 → 신규 임베딩
   - vectors.db에만 있음 → 삭제된 노트 → 제거
```

## 파일 구조

```
C:\claude-workspace\_system\vector-search\
├── vecsearch.py      (메인 스크립트, 검색/인덱싱/동기화)
├── vec-watcher.py    (memory.db 감시 → 자동 sync, 선택적)
└── vectors.db        (벡터 인덱스 DB)
```

## CLI 옵션

| 명령                              | 설명              |
| ------------------------------- | --------------- |
| `search "쿼리"`                   | 시맨틱 검색          |
| `search --top N`                | 결과 수 지정 (기본 5)  |
| `search --type concept`         | entity_type 필터  |
| `search --project zettelkasten` | 프로젝트 필터         |
| `search --unique`               | entity 중복 제거    |
| `sync`                          | 변경분만 재임베딩       |
| `index`                         | 전체 재인덱싱 (기존 삭제) |
| `stats`                         | 인덱스 통계          |

## basic-memory search vs vecsearch

| 상황 | 도구 |
|------|------|
| 정확한 키워드/제목 검색 | basic-memory `search_notes` |
| 맥락적/의미적 검색 | **vecsearch** |
| 관계 탐색 (graph) | basic-memory `build_context` |

## Relations
- part_of [[벡터 시맨틱 검색]] (소속 프로젝트)
- extends [[basic-memory]] (basic-memory에 시맨틱 검색 추가)
- uses [[sqlite-vec]] (벡터 저장/검색 엔진)
- uses [[fastembed]] (임베딩 모델 로더)
- contains [[init-vector-db]] (DB 초기화 및 스키마 생성)
- contains [[get-entities-from-memory-db]] (memory.db entity 목록 조회)
- contains [[strip-frontmatter]] (YAML 프론트매터 제거)
- contains [[chunk-markdown]] (마크다운 청킹)
- contains [[get-embedder]] (fastembed 모델 싱글턴 로더)
- contains [[serialize-f32]] (float 벡터 직렬화)
- contains [[embed-texts]] (텍스트 → 벡터 변환)
- contains [[read-entity-file]] (entity 파일 읽기)
- contains [[index-entity]] (entity 인덱싱 파이프라인)
- contains [[delete-entity-chunks]] (entity 청크 삭제)
- contains [[cmd-index]] (전체 재인덱싱 CLI)
- contains [[cmd-sync]] (증분 동기화 CLI)
- contains [[cmd-search]] (시맨틱 검색 CLI)
- contains [[cmd-stats]] (인덱스 통계 CLI)
- contains [[main-vecsearch]] (CLI 엔트리포인트)