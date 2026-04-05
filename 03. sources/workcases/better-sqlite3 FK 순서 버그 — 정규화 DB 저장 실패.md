---
title: better-sqlite3 FK 순서 버그 — 정규화 DB 저장 실패
type: workcase
permalink: sources/workcases/better-sqlite3-fk-order-bug
tags:
- better-sqlite3
- foreign-key
- sqlite
- sns-dashboard
---

# better-sqlite3 FK 순서 버그 — 정규화 DB 저장 실패

## 문제 상황

SNS 대시보드의 `collect-posts.js`가 네이버 블로그 데이터를 수집하여 정규화 DB(`naver_blog.db`)에 저장할 때, `FOREIGN KEY constraint failed` 에러로 `post_rank_daily` 테이블에 데이터가 전혀 들어가지 않았다.

- `dashboard_today` (FK 없음) → 정상 저장
- `post_rank_daily` (FK: `content_id → m_contents`) → 저장 실패
- 에러가 `saveToNormalizedDb` 전체를 중단시켜 다른 플랫폼도 저장 실패

증상 발견이 늦은 이유:
- `run-loop.sh`에서 `node collect-posts.js 2>&1 | tail -5`로 마지막 5줄만 출력 → 에러 로그가 잘림
- SQLite CLI는 FK 기본 OFF라서 수동 INSERT 테스트에서 재현 안 됨

## 근본 원인

**better-sqlite3는 FK 검사가 기본 ON** (`PRAGMA foreign_keys = 1`), SQLite CLI는 기본 OFF.

트랜잭션 내에서 INSERT 순서가 잘못됐다:

```js
// ❌ FK 위반: m_contents에 아직 없는 content_id를 참조
insertRank.run(capturedAt, today, i + 1, r.post_id, r.view_count);
upsertContent.run(r.post_id, r.post_title, r.post_id);
```

`post_rank_daily.content_id`가 `m_contents.content_id`를 FK로 참조하는데, `insertRank`가 `upsertContent`보다 먼저 실행되어 아직 존재하지 않는 FK 대상을 참조.

## 해결책

1. **INSERT 순서 수정** — FK 대상 먼저 삽입:

```js
// ✅ FK 대상(m_contents) 먼저, 참조(post_rank_daily) 나중
upsertContent.run(r.post_id, r.post_title, r.post_id);
insertRank.run(capturedAt, today, i + 1, r.post_id, r.view_count);
```

2. **플랫폼별 개별 try-catch** — 한 플랫폼 에러가 다른 플랫폼 저장을 막지 않도록:

```js
const savePlatform = (name, fn) => {
  try { saved += fn(); }
  catch (e) { console.log(`⚠️ ${name} 정규화 저장 실패: ${e.message}`); }
};
```

## 적용

- `collect-posts.js`: `saveToNormalizedDb` 함수 리팩터링
- 수정 후 즉시 `post_rank_daily`에 오늘 데이터 정상 저장 확인

## 관련 Task
- task-20260317-001: 대시보드 세부 수정 (네이버 블로그 Content Performance 누락)

## Relations
- uses [[SQLite]] (FK 제약 조건 동작 차이)
- implemented_in [[collect-posts.js]] (수집기 정규화 저장)
- part_of [[SNS 게시물별 조회수 추적]] (대시보드 프로젝트)

## Observations
- [fact] better-sqlite3는 `PRAGMA foreign_keys = 1` 기본값, SQLite CLI는 기본 OFF #better-sqlite3 #foreign-key
- [warning] SQLite CLI로 수동 테스트 성공해도 better-sqlite3에서 FK 에러 발생 가능 — 반드시 Node.js 환경에서 검증 #sqlite #testing
- [solution] FK 참조가 있는 테이블에 INSERT 시, FK 대상 테이블에 먼저 upsert 후 참조 테이블에 insert #sqlite #foreign-key
- [pattern] 여러 독립 저장 로직을 하나의 try-catch로 감싸면 첫 에러에서 전체 중단 — 플랫폼별 개별 try-catch 필수 #error-handling
- [warning] `tail -N` 파이프로 로그 출력 시 에러 메시지가 잘릴 수 있음 — 디버깅 시 전체 출력 확인 필요 #debugging