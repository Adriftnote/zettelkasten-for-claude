---
title: MariaDB 뷰의 LAG() 필터 pushdown 실패 — 물리 테이블 직접 조회로 1300배 개선
type: note
permalink: zettelkasten/03.-sources/workcases/maria-db-byuyi-lag-pilteo-pushdown-silpae-mulri-teibeul-jigjeob-johoero-1300bae-gaeseon
tags:
- workcase
- mariadb
- performance
- view
- lag
- n-plus-1
- mot-dashboard
---

# MariaDB 뷰의 LAG() 필터 pushdown 실패 — 물리 테이블 직접 조회로 1300배 개선

> MOT 실시간 대시보드 `index.php` 성능 최적화 (2026-04-22)
> source: `/volume1/web/mot/index.php` (NAS Synology MariaDB 10.11)

## 문제 상황

사용자 불만: **"대시보드에서 조회 날짜 바꾸면 엄청 느려짐"**

측정 결과:
- `index.php?date=2026-04-22` **29초+** (페이지 로드)
- 핵심 쿼리만 따로 재현해도 29초

기대치: 날짜는 단순 WHERE 조건 변경이니 체감 즉시 반응 (< 1초).

## 근본 원인

### 뷰 3중 중첩 구조

```
v_content_daily_perf           ← index.php가 호출
  └─ v_content_latest_daily    (JOIN 뷰)
      └─ v_content_snapshots_raw  (5개 플랫폼 UNION ALL 뷰)
          └─ 실제 스냅샷 테이블들
```

### 결정타 1: LAG() 윈도우 함수로 WHERE pushdown 차단

`v_content_daily_perf` 안에 `LAG(views) OVER (PARTITION BY content_id ORDER BY snap_date)`로 전날값 계산 + `views - LAG() AS views_diff`.

- MariaDB 옵티마이저는 윈도우 함수(LAG, SUM OVER, ROW_NUMBER 등)가 있으면 **WHERE 절을 뷰 안으로 push-down 하지 않음** — 윈도우가 파티션 전체를 봐야 결과가 맞으므로 논리적으로 밀어넣을 수 없음
- `WHERE snap_date = '2026-04-22'`를 걸어도 **전체 기간 풀 스캔 후 바깥에서 필터링**
- 누적된 27만+ row 전체를 매번 재계산 → 29초

### 결정타 2: naver_blog 누적값 N+1 상관 서브쿼리

CEO 요구사항: `naver_blog`는 좋아요/댓글이 누적값으로 표시돼야 함 (단일 스냅샷이 아닌 전 기간 합산).

뷰 내부에서 각 row마다:
```sql
(SELECT SUM(likes) FROM ... WHERE platform='naver_blog' AND content_id = outer.content_id AND snap_date < outer.snap_date)
```

- 20개 row → 서브쿼리 20번 개별 실행
- 상관 서브쿼리라 매번 인덱스 lookup + 집계 재계산

## 시도했지만 안 된 방법

| 시도 | 결과 | 왜 실패 |
|-----|------|--------|
| `v_content_prev_totals` 사전 집계 뷰 추가 | 16.8초 | 뷰도 풀 materialization 발생 |
| 인라인 필터링 서브쿼리 | 7.7초 | `v_content_daily_perf` 자체가 7.8초 |

→ **뷰 자체가 병목**이라는 것이 EXPLAIN + `SELECT * FROM v_... WHERE ... LIMIT 20` 단독 측정으로 판명됨.

## 해결책

**뷰 완전 우회 + 물리 테이블 직접 조회.**

`content_daily_cache` 테이블에 이미 precompute된 컬럼이 있음 — 뷰들이 매번 재계산하던 것이 **사실은 이 테이블에 저장되어 있었음** (이중 작업):
- `prev_views`, `views_diff`, `prev_likes`, `likes_diff`, `prev_comments`, `comments_diff` 전부 존재
- PK: `(snap_date, platform, content_id)` — 인덱스로 바로 찾음

naver_blog 누적값만 별도로 — 미리 필터링된 GROUP BY로 1회만:

```sql
SELECT c.snap_date, c.platform, c.channel_name, c.content_id, c.content_title, c.content_type,
       c.views, c.prev_views, c.views_diff,
       CASE WHEN c.platform = 'naver_blog' THEN COALESCE(pt.prev_likes_sum, 0) ELSE c.prev_likes END AS prev_likes,
       CASE WHEN c.platform = 'naver_blog' THEN COALESCE(pt.prev_likes_sum, 0) + COALESCE(c.likes, 0) ELSE c.likes END AS likes,
       CASE WHEN c.platform = 'naver_blog' THEN COALESCE(c.likes, 0) ELSE c.likes_diff END AS likes_diff,
       CASE WHEN c.platform = 'naver_blog' THEN COALESCE(pt.prev_comments_sum, 0) ELSE c.prev_comments END AS prev_comments,
       CASE WHEN c.platform = 'naver_blog' THEN COALESCE(pt.prev_comments_sum, 0) + COALESCE(c.comments, 0) ELSE c.comments END AS comments,
       CASE WHEN c.platform = 'naver_blog' THEN COALESCE(c.comments, 0) ELSE c.comments_diff END AS comments_diff
FROM content_daily_cache c
LEFT JOIN (
    SELECT platform, content_id,
           COALESCE(SUM(likes), 0) AS prev_likes_sum,
           COALESCE(SUM(comments), 0) AS prev_comments_sum
    FROM content_daily_cache
    WHERE platform = 'naver_blog' AND snap_date < :snap_date_filter
    GROUP BY platform, content_id
) pt ON pt.platform = c.platform AND pt.content_id = c.content_id
WHERE c.snap_date = :snap_date
ORDER BY c.views_diff DESC, c.views DESC
LIMIT 20
```

핵심 원칙:
1. **뷰 완전 우회** — 옵티마이저 hint가 아닌 뷰 자체를 거치지 않음
2. **서브쿼리도 사전 필터링** — `WHERE platform='naver_blog' AND snap_date < :target`을 **서브쿼리 내부**에 먼저 걸어 대상 row를 줄인 후 GROUP BY
3. **ORDER BY/LIMIT이 인덱스 활용 가능** — PK `(snap_date, platform, content_id)` 선두 컬럼이 필터에 있음

## 성능 비교

| 환경 | Before | After | 개선 |
|------|--------|-------|------|
| 로컬 SQL only | 29s | 11ms | **2600×** |
| 로컬 풀 페이지 | 29s+ | 254ms | **114×** |
| NAS warm (날짜 변경) | 29s+ | 22~73ms | **400×+** |
| NAS cold | 29s+ | 1.08s | **27×** |

데이터 일치 검증: `naver_blog content_id=224091282657` → `prev_likes=5, likes=5, comments=5` (before/after 동일).

## 적용

- `C:\claude-workspace\working\mot-dashboard\index.php` (라인 59~107 — `$sql_ct` 교체)
- NAS 배포: `cat | ssh admin123@192.168.0.9 "cat > /volume1/web/mot/index.php"`
- 백업: `/volume1/web/mot/index.php.bak-20260422-100410` 보존
- 관련 PHP: `includes/queries/content.php` (드릴다운은 `v_content_snapshots_raw` 사용 — 별개 이슈)

## 학습 교훈

### LAG() + WHERE = pushdown 불가

MariaDB/MySQL/PostgreSQL 공통 — 윈도우 함수가 있는 뷰는 **전체 materialization이 필요**. 필터가 있어도 먼저 밀어넣지 않음. 뷰 자체를 풀 스캔한 뒤 외부 필터링.

**검출 방법:**
```sql
EXPLAIN SELECT * FROM v_with_lag WHERE date = '...';
-- type: ALL, rows: <전체 row 수>, Extra: Using where
```
→ 뷰 안에서 rows가 전부 읽혔다면 pushdown 실패.

### 뷰 중첩은 성능 재앙

뷰가 뷰를 부르는 구조는 **가독성**에는 좋지만 **성능**에는 최악:
- 캐시 불가
- 인덱스 미활용
- 중복 계산
- 옵티마이저가 전체를 풀지 못함

### precompute 된 테이블이 있으면 뷰 우회

`content_daily_cache`처럼 ETL 단계에서 이미 diff/누적을 계산해둔 물리 테이블이 있으면, 뷰로 감싸서 재계산하지 말고 **직접 조회**. 뷰는 "편의"지만 성능 관점에선 "이중 작업"이 될 수 있음.

### N+1 상관 서브쿼리 → pre-filtered GROUP BY LEFT JOIN

상관 서브쿼리는 바깥 row마다 실행됨. 필터링 된 GROUP BY 서브쿼리로 1회 집계 + LEFT JOIN이 수십~수백 배 빠름. 이는 [[MariaDB IN 서브쿼리 → INNER JOIN 167배 성능 개선]]에서도 같은 패턴.

## 관련 Task

- task-20260422-001: MOT 대시보드 index.php 쿼리 최적화 (29s→254ms)

## Relations

- uses [[MariaDB IN 서브쿼리 → INNER JOIN 167배 성능 개선]] (같은 DB, 같은 패턴 — N+1 상관 서브쿼리 제거)
- applied_in [[Projects Index]] (MOT 실시간 대시보드 적용 대상)
- implemented_in [[queries-content]] (인접 드릴다운 쿼리 모듈은 아직 미적용 — 별개 스코프)
- led_to [[contentPerformanceStatusView]] (드릴다운 v_content_snapshots_raw 60~90초 — 별도 이슈로 분리)

## Observations

- [fact] MariaDB 옵티마이저는 윈도우 함수(LAG, SUM OVER 등)가 있는 뷰에 대해 WHERE push-down을 하지 않음 #mariadb #window-function
- [fact] 뷰 3중 중첩(v_content_daily_perf → v_content_latest_daily → v_content_snapshots_raw)은 각 계층마다 풀 materialization이 발생할 수 있음 #view #nested
- [solution] precompute된 물리 테이블(content_daily_cache)이 이미 있으면 뷰를 우회하고 직접 조회 — 2600배 개선 #optimization #direct-query
- [solution] N+1 상관 서브쿼리는 WHERE 사전 필터링된 GROUP BY 서브쿼리 + LEFT JOIN으로 치환 #n-plus-1 #group-by
- [warning] 뷰는 가독성에 좋지만 "성능 추상화"가 될 수 있다는 착각 금물 — ETL에서 precompute된 값이 있는데 뷰가 다시 계산하면 이중 작업 #anti-pattern
- [method] 병목 진단: EXPLAIN SELECT * FROM v_... WHERE ... LIMIT N → type: ALL, rows: 전체면 pushdown 실패 #explain #debug
- [method] 뷰 병목 vs 쿼리 병목 판별: SELECT * FROM view_name LIMIT 20 단독 측정 → 이게 느리면 뷰가 원인 #profiling
- [tech] MariaDB 10.11 (Synology 패키지) + PHP 8.2 PDO + content_daily_cache PK (snap_date, platform, content_id) #stack
- [pattern] 뷰 편의 vs 물리 테이블 직접 조회는 성능 관점에서 tradeoff — precompute 존재 여부로 판단 #decision
- [pattern] 스코프 크리프 방어: 테스트 중 드릴다운 60~90초 느림 발견했으나 사용자 요청 범위(index.php)에만 집중하고 별개 이슈로 플래그 #scope-discipline
