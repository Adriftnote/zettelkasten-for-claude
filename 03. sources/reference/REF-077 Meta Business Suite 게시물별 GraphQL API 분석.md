---
title: REF-077 Meta Business Suite 게시물별 GraphQL API 분석
type: guide
permalink: sources/reference/meta-business-suite-per-post-graphql
tags:
- facebook
- graphql
- meta-business-suite
- per-post-insights
- sns-data
date: 2026-03-05
---

# Meta Business Suite 게시물별 GraphQL API 분석

Meta Business Suite 내부 GraphQL API로 게시물별 조회수·반응·시계열 데이터를 추출하는 방법 분석.

## 📖 핵심 아이디어

기존 `social-analytics-extractor` Chrome Extension은 **채널 레벨** GraphQL 쿼리만 사용 중이었다. 동일한 `doc_id` (`31321294414185827`, `useBizWebInsightsSingleValueQuery`)에 `id` 파라미터를 **게시물 ID**로 바꾸면 게시물별 조회수·시계열 데이터를 가져올 수 있다. 별도의 per-post 전용 doc_id가 필요하지 않다.

## 🛠️ 구성 요소 / 주요 내용

### 엔티티 구조

| 엔티티                  | 타입           | 설명            |
| -------------------- | ------------ | ------------- |
| `812034231994709`    | FB_PAGE      | 페이스북 페이지      |
| `122120877705065988` | FB_PAGE_POST | 페이스북 게시물      |
| `18623606215033891`  | IG_POST      | 연결된 인스타그램 게시물 |
| `17841476782609905`  | IG_ACCOUNT   | 인스타그램 계정      |

한 게시물 → FB_PAGE_POST + IG_POST 두 엔티티. 합산해서 전체 조회수 표시.

### 메트릭 목록 (Relay 스토어에서 확인)

| event | metric | FB값 | IG값 | 설명 |
|-------|--------|------|------|------|
| **VIEW** | COUNT | 19 | 35 | 조회수 (합계 54) |
| IMPRESSION | COUNT | 8 | 18 | 노출수 |
| IMPRESSION | UNIQUE_USERS | 3 | 16 | 도달 |
| REACTION | NET_COUNT | 1 | 3 | 반응 |
| INTERACTION | NET_COUNT | 1 | 4 | 상호작용 |
| COMMENT | NET_COUNT | 0 | 0 | 댓글 |
| SHARE | NET_COUNT | 0 | - | 공유 |
| SAVE | NET_COUNT | 0 | 0 | 저장 |
| REELS_PLAYS | COUNT | error | - | 릴스 재생 |

### 핵심 doc_id

| doc_id              | 쿼리명                                                          | 용도                |
| ------------------- | ------------------------------------------------------------ | ----------------- |
| `31321294414185827` | useBizWebInsightsSingleValueQuery                            | 단일값 + 시계열 (범용)    |
| `25734062989548700` | BizWebInsightsObjectInsightsDeepLinkContainerDEPRECATEDQuery | 컨테이너/라우팅 (메타데이터만) |
| `25139519128986465` | BizWebInsightsResultsViewsCardQuery                          | 일별 조회수 (채널 레벨 전용) |

## 🔧 작동 방식 / 적용 방법

### 단일 조회수 가져오기

```javascript
const params = new URLSearchParams({
  'doc_id': '31321294414185827',
  'variables': JSON.stringify({
    "arg": {
      "breakdowns": [],
      "compare_time_range": null,
      "delta_formats": ["DELTA_RAW_VALUE", "DELTA_PERCENTAGE", "RAW_PREVIOUS_VALUE"],
      "event": "VIEW",
      "id": "122120877705065988",  // ← 게시물 ID
      "time_range": {"type": "LIFETIME"},
      "tofu_metric": "COUNT"
    },
    "callerID": "BIZWEB_OBJECT_INSIGHTS",
    "shouldQueryDefinition": false
  }),
  'fb_dtsg': dtsg,  // 페이지에서 추출
  'lsd': lsd,       // 페이지에서 추출
  'fb_api_req_friendly_name': 'useBizWebInsightsSingleValueQuery',
  '__a': '1'
});

// 응답: {"data":{"tofu_metrics_query":{"value":19}}}
```

### 시계열 데이터 가져오기 (성장 곡선)

```javascript
// 같은 doc_id, breakdowns만 변경
"arg": {
  "breakdowns": ["TIME_SINCE"],     // ← 시계열 전환
  "event": "VIEW",
  "id": "122120877705065988",
  "time_granularity": "OVERALL",
  "time_range": {"type": "LIFETIME"},
  "tofu_metric": "FOA_COUNT"        // ← FOA_COUNT 사용
}

// 응답: 75개 데이터 포인트 (15분 간격, 게시 후 상대시간)
// points: [{value:2}, {value:2}, ..., {value:51}]
```

### 파라미터 변형

| 변경 | 효과 |
|------|------|
| `id`를 다른 게시물 ID로 | 다른 게시물 데이터 |
| `event`를 "REACTION" 등으로 | 다른 메트릭 |
| `breakdowns: ["TIME_SINCE"]` | 단일값 → 시계열 |
| `time_range: {type: "LAST_7D"}` | 최근 7일 |
| `callerID: "BIZWEB_OBJECT_INSIGHTS"` | 게시물 인사이트 컨텍스트 |

### Relay 스토어 직접 접근 (디버깅용)

```javascript
const env = require('CometRelayEnvironment');
const source = env.getStore().getSource();

// 모든 TofuEntity 조회
const entities = source.getRecordIDs().filter(id => id.startsWith('TofuEntity:'));

// 특정 게시물의 인사이트 메트릭 추출
const insights = source.get('client:TofuEntity:POST_ID:entity_insights');
// → raw_query_result(args:{event, metric}) 키로 개별 메트릭 접근
```

### 데이터 흐름

```
[페이지 로드]
  │
  ├─ 컨테이너 쿼리 (25734062989548700) → 메타데이터만 (엔티티 타입, 페이지 정보)
  │
  ├─ 인사이트 쿼리 (31321294414185827) × N회
  │   ├─ VIEW/COUNT → 조회수
  │   ├─ VIEW/FOA_COUNT + TIME_SINCE → 시계열 차트
  │   ├─ REACTION/NET_COUNT → 반응수
  │   └─ ... (각 메트릭별 별도 호출)
  │
  └─ FB_PAGE_POST + IG_POST 각각 호출 → 합산 표시
```

## 💡 실용적 평가 / 적용

### 장점
- **기존 Extension 패턴과 동일**: `callGraphQL(docId, variables)` 함수 그대로 사용
- **채널/게시물 공용 doc_id**: `31321294414185827` 하나로 id만 바꾸면 됨
- **시계열 데이터 포함**: 15분 간격 성장 곡선 데이터 (75포인트)
- **FB + IG 분리 가능**: 각 엔티티 ID로 플랫폼별 개별 조회

### 시계열 타임스탬프 복원

API 응답(`doc_id: 31321294414185827`)에는 `start_time` 미포함이지만, **Relay 스토어에는 있음**:

```
start_time: "1969-12-31T16:15:00-08:00"  → 에포크 상대시간 (게시 후 +15분)
start_time: "1969-12-31T18:00:00-08:00"  → 게시 후 +2시간
```

**절대 시각 복원 공식**: `created_at(unix) + start_time의 에포크 offset`

| 항목 | 값 | 출처 |
|------|-----|------|
| `created_at` | `1769151626` (2026-01-23 16:00:26 KST) | entity_info |
| `start_time` | 에포크 상대 오프셋 | Relay 스토어 `TofuTimeSeriesWithoutBreakdownDataPoint` |

**간격 패턴** (일정하지 않음):
- 처음 ~6포인트: **15분** 간격
- 이후: **30분** 간격
- 후반부: 점점 넓어짐 (시간→일 단위)

**Extension 구현 시**: `require('CometRelayEnvironment')` → Relay 스토어에서 `start_time` + `value` 직접 추출하면 절대 시각 포함 시계열 완성.

### 한계
- **API 응답에 start_time 미포함**: doc_id `31321294414185827` 응답에는 포맷된 값만 반환. Relay 스토어 직접 접근 또는 별도 doc_id 필요
- **게시물 ID 목록 필요**: 콘텐츠 리스트 페이지에서 게시물 ID 목록을 먼저 가져와야 함
- **IG 엔티티 ID 매핑 필요**: FB 게시물 ID → IG 게시물 ID 매핑 로직 필요 (컨테이너 쿼리 응답에 포함)
- **비공식 API**: Meta 내부 GraphQL이므로 doc_id 변경 리스크 존재

### 확장 구현 시 필요 작업
1. 콘텐츠 리스트 GraphQL 쿼리 발견 (게시물 ID 목록)
2. `facebook.js`에 per-post 함수 추가 (`getPostInsights(contentId)`)
3. FB + IG 엔티티 ID 매핑 로직
4. 시계열 타임스탬프 보강 (별도 doc_id 또는 인덱스 계산)

## 🔗 관련 개념

- [[facebook-extractor]] - (기존 채널 레벨 GraphQL 추출기, 동일 callGraphQL 패턴 공유)
- [[call-graphql-x]] - (X GraphQL 호출 패턴과 대비, X는 Bearer+CSRF / Meta는 fb_dtsg+lsd)
- [[플랫폼별 데이터 추출 방식 비교]] - (이 분석의 기반 워크케이스, 채널→게시물 레벨 확장)

---

**작성일**: 2026-03-05
**분류**: SNS 데이터 수집 / Meta GraphQL API