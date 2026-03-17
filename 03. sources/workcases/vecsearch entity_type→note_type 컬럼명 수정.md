---
title: vecsearch entity_type→note_type 컬럼명 수정
type: note
permalink: zettelkasten/03.-sources/workcases/vecsearch-entity-type-note-type-keolreommyeong-sujeong
tags:
- vecsearch
- basic-memory
- schema-migration
- sql
- troubleshooting
---

# vecsearch entity_type→note_type 컬럼명 수정

## 문제 상황

basic-memory v0.20 업그레이드 후 `vecsearch sync` 실행 시 SQL 에러 예상. DB 스키마에서 `entity` 테이블의 `entity_type` 컬럼이 `note_type`으로 변경됨. vecsearch.py 91행이 옛 컬럼명 참조.

단, `vecsearch search`는 자체 vector DB(chunks 테이블)에서 읽으므로 기존 인덱스가 있으면 **검색은 정상 동작**. sync만 실패하는 구조.

## 근본 원인

basic-memory v0.19.0+ breaking change:
- `entity_type` → `note_type` 컬럼명 변경
- vecsearch.py는 memory.db를 직접 SQL 조회하므로 스키마 변경에 즉시 영향

## 해결책

vecsearch.py 91행 SQL에 AS alias 적용:

```python
# Before
SELECT id, title, entity_type, file_path, checksum, project_id
FROM entity

# After
SELECT id, title, note_type AS entity_type, file_path, checksum, project_id
FROM entity
```

AS alias 덕분에 나머지 코드(10곳+)에서 `entity["entity_type"]`으로 참조하는 부분은 변경 불필요.

## 적용

- `_system/vector-search/vecsearch.py` 91행 수정 완료
- sync 테스트 통과: `+27 new, ~3 updated`

## 관련 Task

- basic-memory v0.20 MCP 수정과 동시 진행 (별도 task 미등록)

## Relations

- applied_in [[vecsearch]] (수정 대상 모듈)
- learned_from [[vecsearch 벡터 시맨틱 검색 구현]] (초기 구현 workcase)
- learned_from [[basic-memory v0.20 MCP 연결 실패 — onnxruntime AMD GPU hang]] (동일 v0.20 업그레이드에서 발생한 연쇄 이슈)

## Observations

- [fact] basic-memory v0.19+에서 entity_type→note_type 컬럼명 변경 (breaking change) #basic-memory #schema
- [fact] vecsearch search는 자체 vector DB 조회라 memory.db 스키마 변경 영향 없음. sync만 영향 #vecsearch #architecture
- [solution] SQL에 AS alias 사용하면 1줄 수정으로 하위 코드 전체 호환 유지 #sql #minimal-fix
- [pattern] 외부 DB를 직접 SQL 조회하는 도구는 스키마 변경에 취약 — 업그레이드 시 항상 확인 필요 #integration #coupling