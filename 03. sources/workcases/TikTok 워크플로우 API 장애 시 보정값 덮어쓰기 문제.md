---
title: TikTok 워크플로우 API 장애 시 보정값 덮어쓰기 문제
type: note
permalink: 03.-sources/workcases/tik-tok-weokeupeulrou-api-jangae-si-bojeonggabs-deopeosseugi-munje
tags:
- tiktok
- n8n
- 워크플로우
- 트러블슈팅
- is_alive
- API장애
---

# TikTok 워크플로우 API 장애 시 보정값 덮어쓰기 문제

## 문제 상황

TikTok 1/31 API 500 에러로 조회수/반응수가 음수값 발생.
선형보간으로 수동 보정했으나(`daily_channel_summary`에 views=446, interactions=8),
n8n 스케줄(매일 19:00/19:05) 실행될 때마다 비정상 값으로 **되돌아가는 현상** 반복.

```
수동 보정 (446) → n8n 실행 → 다시 41687로 덮어씌워짐 → 또 수동 보정 → 반복...
```

## 시도했지만 안 된 방법

- `daily_channel_summary` 테이블만 수동 UPDATE → 다음 스케줄에 다시 덮어씌워짐
- `corrected` 플래그 컬럼 추가 검토 → 3개 테이블 + 여러 노드 수정 필요해서 복잡

## 근본 원인

TikTok 수집은 **2개 API를 순차 호출**하는 구조:

```
[API 1] 비디오 목록 조회 (video/list)
   → 성공: 비디오 ID + 메타데이터
   → 실패: 비디오 없음 → is_alive 체크 가능 ✅

[API 2] 통계 Batch 조회 (video/query)
   → 성공: view_count, like_count 등
   → 실패: statsMap 비어있음 → 값=0인데 is_alive=1 ❌
```

`is_alive`는 **"비디오가 존재하는가"** 용도로 설계됨.
→ 비디오 목록 API가 성공하면 `is_alive=1` 하드코딩
→ 통계 API가 500 에러나도 비디오는 "존재"하므로 `is_alive=1`
→ `view_count=0`이 정상 데이터로 취급

```
5. 데이터 병합 노드 (수정 전):
  is_alive: 1,  ← 하드코딩! API 장애 구분 불가
```

덮어쓰기 체인 (3단계):

```
① Tiktok_workflow (19:00)
   tiktok_raw (is_alive=1, stats=0)
   → video_views_daily: 0 - 전날누적 = -40795 (음수!)
   → video_engagement_daily: 0 - 전날누적 = -615 (음수!)

② My workflow 3 (19:05)
   video_views_daily 읽기 → daily_metrics_atomic (INSERT OR REPLACE)
   집계 → daily_channel_summary (INSERT OR REPLACE)
   → 보정값 덮어씌워짐!
```

추가 발견: engagement Daily 계산 노드(`2-B. Daily 계산4`)만 `prevAlive` 탐색 로직이 누락됨.
다른 지표(views, likes, comments, shares)는 `is_alive=0`인 날을 건너뛰고 이전 alive 레코드를 찾는 로직이 있었으나, engagement만 바로 이전 레코드(`records[i-1]`)만 체크하는 구조.

## 해결책

### 1. `5. 데이터 병합` 노드 - is_alive 동적 판단

```javascript
// 수정 전
is_alive: 1,

// 수정 후
const hasStats = !!statsMap[videoId];
is_alive: hasStats ? 1 : 0,
```

statsMap에 해당 비디오가 없으면(통계 API 실패) `is_alive=0`으로 마킹.

### 2. `2-B. Daily 계산4` 노드 - prevAlive 로직 통일

```javascript
// 수정 전: 바로 이전만 체크
const prev = records[i - 1];
if (current.is_alive && prev.is_alive) { daily = current.total - prev.total; }
else { continue; }

// 수정 후: alive인 레코드를 뒤로 탐색 (다른 지표와 동일)
if (!current.is_alive) continue;
let prevAlive = null;
for (let j = i - 1; j >= 0; j--) {
  if (records[j].is_alive) { prevAlive = records[j]; break; }
}
daily = prevAlive ? current.total - prevAlive.total : current.total;
```

### 3. 기존 비정상 데이터 수동 수정

```sql
UPDATE tiktok_raw SET is_alive = 0 WHERE collection_date LIKE '2026-01-31%';
```

## 적용

- **Tiktok_workflow** (n8n ID: BTcgGx0kn9SrzVna): 2개 노드 수정 후 재임포트
- **tiktok_analytics.db**: 1/31 tiktok_raw is_alive=0 변경
- 수정 후 결과:
  - 2/01 views: 41,687 → 892 (정상)
  - 2/01 interactions: 632 → 17 (정상)
  - 1/31 수동보정값(446, 8) 유지됨

## 관련 Task

- task-20260202-004: TikTok API 장애 데이터 보정 (최초 선형보간)
- task-20260204-009: TikTok 2/1 데이터 재보정 (n8n 덮어쓰기 복구)
- task-20260209-001: TikTok 워크플로우 API 장애 시 데이터 보호 로직 수정

## Observations

- [fact] TikTok 수집은 비디오목록API와 통계API 2단계로 분리되어 있다 #tiktok #n8n
- [fact] is_alive 플래그는 원래 비디오 삭제/비공개 용도로 설계됨 #tiktok #is_alive
- [fact] INSERT OR REPLACE는 PK 충돌 시 무조건 덮어쓴다 #sqlite
- [warning] continueOnFail=true 설정 시 API 에러가 0값으로 조용히 전파될 수 있다 #n8n #API
- [warning] 수동 보정한 DB 값은 자동 파이프라인이 덮어쓸 수 있다 - 파이프라인 로직도 함께 수정 필요 #n8n #데이터보정
- [pattern] 여러 API를 순차 호출하는 구조에서 한쪽만 실패하는 케이스는 방어가 누락되기 쉽다 #API #에러처리
- [pattern] 같은 패턴의 코드 노드가 여러 개일 때 일부만 다른 로직인 경우 버그 원인이 된다 (engagement만 prevAlive 누락) #n8n #코드일관성
- [solution] is_alive의 의미를 "비디오 존재 여부"에서 "유효한 데이터 수신 여부"로 확장하여 해결 #tiktok #is_alive
- [tech] SQLite UPSERT 구문으로 조건부 덮어쓰기 가능: ON CONFLICT DO UPDATE WHERE 조건 #sqlite
