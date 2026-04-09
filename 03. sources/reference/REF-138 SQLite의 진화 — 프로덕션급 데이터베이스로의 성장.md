---
title: REF-138 SQLite의 진화 — 프로덕션급 데이터베이스로의 성장
type: doc_summary
permalink: zettelkasten/03.-sources/reference/ref-138-sqliteyi-jinhwa-peurodeogsyeongeub-deiteobeiseuroyi-seongjang
tags:
- sqlite
- database
- production
- fts5
- wal
- json
---

# SQLite의 진화 — 프로덕션급 데이터베이스로의 성장

"개발 단계용 경량 DB"로만 인식되던 SQLite가 프로덕션 환경에서 활용 가능한 수준으로 진화한 현황 정리.

## 📖 핵심 아이디어

SQLite가 "하나의 파일, 제로 설정, 제로 의존성"이라는 핵심 가치를 유지하면서 JSON 처리, 전문 검색, 분석 쿼리, 타입 안전성 등의 기능 간극을 빠르게 좁혀가고 있다. PostgreSQL 완전 대체보다는 "PostgreSQL이 정말 필요한가?"라는 재평가가 진행 중.

## 🛠️ 구성 요소 / 주요 내용

| 기능 | 설명 | 실용성 |
|------|------|--------|
| JSON 네이티브 | `json_extract()`, `->>`/`->` 연산자, `json_valid()` CHECK | API 응답/이벤트 로그 저장+쿼리 |
| FTS5 | Porter 스테밍, NEAR 검색, 랭킹 — Elasticsearch 없이 전문 검색 | 소규모 검색 충분, 대규모는 한계 |
| 분석 쿼리 | 윈도우 함수, CTE — 누적합, 이동평균, 순위 | 분석 대시보드 가능 |
| STRICT 모드 | 타입 불일치 시 즉시 에러 — 유연한 타입의 버그 위험 제거 | 프로덕션 필수 |
| Generated Columns | 파생 데이터 자동 동기화 + 인덱싱 가능 | 정규화 대신 선언적 |
| WAL 모드 | 읽기/쓰기 동시성 개선 — `PRAGMA journal_mode = WAL` 한 줄 | 멀티프로세스 접근 시 필수 |

## 🔧 작동 방식 / 적용 방법

### JSON 쿼리 예시

```sql
SELECT
  json_extract(payload, '$.user.id') AS user_id,
  payload->>'$.action' AS action
FROM events
WHERE payload->>'$.action' = 'login';
```

### FTS5 전문 검색

```sql
CREATE VIRTUAL TABLE docs USING fts5(title, body, tokenize = "porter");
SELECT rowid, title FROM docs WHERE docs MATCH 'local NEAR/5 storage';
```

### WAL + 동시 접근

```sql
PRAGMA journal_mode = WAL;
-- 이후 여러 프로세스에서 동시 읽기 가능, 쓰기는 순차
```

## 💡 실용적 평가 / 적용

**우리 환경과의 연결**
- orchestration.db, basic-memory DB 모두 SQLite — 이 기능들을 이미 부분적으로 활용 중
- FTS5: ryu-memory의 BM25 검색이 정확히 이것
- WAL: MCP서버+웹모니터 동시 접근 시 필수 (episodic-memory에서 경험)
- JSON: orchestration_log의 intent 필드를 json_extract로 구조화 쿼리 가능성

**남은 과제**
- 동시 쓰기 병목: WAL이 개선하나 근본 해결은 아님 (Turso MVCC 등 대안)
- 관측성: 프로덕션 내부 상태 파악 어려움
- 백업/변경 추적: 백업 API + diff 방식

## 🔗 관련 개념

- [[REF-113 MariaDB 로컬 환경 활용 가이드 — CLI·MCP·설정 패턴]] - (SQLite vs MariaDB — 대시보드는 MariaDB로 전환했지만 시스템 DB는 여전히 SQLite)

---

**작성일**: 2026-04-09
**원문**: https://wikidocs.net/blog/@jaehong/10625/
**저자**: 박재홍
**분류**: 데이터베이스 / SQLite