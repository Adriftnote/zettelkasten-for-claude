---
title: MariaDB IN 서브쿼리 → INNER JOIN 167배 성능 개선
type: note
permalink: zettelkasten/03.-sources/workcases/maria-db-in-seobeukweori-inner-join-167bae-seongneung-gaeseon
tags:
- mariadb
- sql
- performance
- optimization
- mot-dashboard
---

# MariaDB IN 서브쿼리 → INNER JOIN 167배 성능 개선

## 문제 상황

MOT 대시보드 기간별 탭에서 오가닉 6개 플랫폼의 일별 시계열 데이터를 조회할 때 **10초 이상** 소요. 데이터 4천건밖에 없는데도 극도로 느림.

원인 쿼리:
```sql
SELECT DATE(captured_at) AS period_date, SUM(view_count) AS val
FROM yt_video_snapshots
WHERE DATE(captured_at) >= '2026-03-17'
  AND captured_at IN (
    SELECT MAX(captured_at) FROM yt_video_snapshots
    WHERE DATE(captured_at) >= '2026-03-17'
    GROUP BY DATE(captured_at)
  )
GROUP BY period_date
```

## 근본 원인

MariaDB가 `WHERE col IN (SELECT ...)` 패턴을 **correlated subquery처럼 실행** — 외부 테이블의 각 행에 대해 서브쿼리를 반복 실행. 4,371행 × 서브쿼리 = 수만 번 실행.

추가 악화 요인: `WHERE DATE(captured_at) >= ...`에서 `DATE()` 함수 호출이 **인덱스를 못 타게** 만듦. `captured_at` 컬럼에 인덱스가 있어도 함수 적용 시 full scan.

## 해결책

`IN (서브쿼리)` → `INNER JOIN`으로 교체 + `DATE(captured_at)` → `captured_at` 직접 비교:

```sql
SELECT DATE(s.captured_at) AS period_date, SUM(s.view_count) AS val
FROM yt_video_snapshots s
INNER JOIN (
  SELECT MAX(captured_at) AS max_at FROM yt_video_snapshots
  WHERE captured_at >= '2026-03-17'
  GROUP BY DATE(captured_at)
) d ON s.captured_at = d.max_at
GROUP BY period_date
```

- 서브쿼리를 **1번만 실행**해서 임시 테이블 생성 → JOIN
- `captured_at >= '2026-03-17'`로 인덱스 활용

결과: **10초 → 0.06초 (167배 개선)**

## 적용

`internal/store/period_query.go` — `snapshot_diff`, `snapshot_cumulative`, `ads_campaign` 3개 QueryMode의 기간별 쿼리 전부 교체.

## 관련 Task
- task-20260323-004: MOT 대시보드 v1 동형 아키텍처 구현

## Relations
- uses [[MariaDB]] (데이터베이스 엔진)
- implemented_in [[generic-query]] (쿼리 빌더 모듈)
- part_of [[MOT 실시간 대시보드]] (프로젝트)

## Observations
- [fact] MariaDB는 IN (SELECT ...) 패턴을 optimizer가 semi-join으로 변환하지 못할 때 correlated subquery로 실행 #mariadb #performance
- [fact] WHERE DATE(col) >= 비교는 컬럼에 함수를 적용하므로 인덱스 무효화 #mariadb #index
- [solution] IN 서브쿼리 → INNER JOIN 파생 테이블로 교체하면 서브쿼리 1회 실행으로 변환 #sql #optimization
- [solution] DATE(captured_at) >= '날짜' 대신 captured_at >= '날짜'로 인덱스 활용 #sql #sargable
- [warning] 데이터가 수천건이라도 IN 서브쿼리 패턴은 O(N*M) 될 수 있음 — 데이터 양만 보고 안심하지 말 것 #performance
- [pattern] "날짜별 마지막 스냅샷 조회" 패턴: GROUP BY DATE() + MAX(timestamp) → JOIN이 정석 #sql #pattern