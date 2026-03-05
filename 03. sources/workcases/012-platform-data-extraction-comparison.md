---
extraction_status: pending
type: workcase
permalink: sources/workcases/platform-data-extraction-comparison
---

# 플랫폼별 데이터 추출 방식 비교

> X, Facebook, Naver 통계 데이터 접근 방식 분석

**작성일:** 2026-01-13

---

## 요약

| 플랫폼          |      엑셀      | Chrome Extension |     API      | 최선의 방법          |
| ------------ | :----------: | :--------------: | :----------: | --------------- |
| **Naver**    | △ (공감/댓글 없음) |    ✅ DOM 텍스트     |     ❌ 없음     | Extension       |
| **Facebook** |     ✅ 충분     |  ✅ 직접 GraphQL 호출  | ✅ GraphQL 무료 | Extension or API |
| **X**        |     ✅ 충분     |  ✅ React fiber   |  ❌ $200/월~   | 엑셀 or Extension |

---

## 1. Naver (네이버 블로그)

### 엑셀 내보내기
- **문제:** 공감/댓글 데이터 없음 (조회수, 이웃증감만)
- **파일 형식:** inlineStr (openpyxl 직접 안 읽힘, XML 파싱 필요)

### Chrome Extension ✅ 추천
- **DOM 구조:** 단순, 텍스트로 접근 가능
- **이미 구현:** `naver-stats-extension/`
- **추출 가능 데이터:** 조회수, 공감, 댓글, 이웃증감

### API
- 공식 API 없음

---

## 2. Facebook (Meta Business Suite)

### 엑셀 내보내기
- **품질:** 양호 (3개 시트: 조회수, 상호작용, 팔로우)
- **일별 데이터:** 포함됨

### Chrome Extension ✅ 가능 (직접 GraphQL 호출)
- **DOM 구조:** React + Relay (데이터 접근 차단)
- **JavaScript 접근:** 전역 변수에 데이터 없음
- **차트:** SVG로 렌더링, 데이터 속성 없음
- **✅ 해결책:** 콘솔에서 직접 GraphQL API 호출!

```javascript
// 시도한 방법들
Object.keys(window).filter(...)  // 데이터 없음
document.querySelectorAll('rect')  // 데이터 속성 없음
__reactFiber  // props에 데이터 없음, 참조만 있음
__RELAY_DEVTOOLS_HOOK__  // 프로덕션에서 비활성화
require('RelayStore')  // undefined 반환
```

### Facebook 아키텍처 심층 분석

#### 데이터를 숨기는 방법

| 방식                           | 설명                                  |
| ---------------------------- | ----------------------------------- |
| **Relay DevTools Hook 비활성화** | 프로덕션에서 `__RELAY_DEVTOOLS_HOOK__` 없음 |
| **모듈 내용 숨김**                 | `require('RelayStore')` → undefined |
| **React fiber에 데이터 안 넣음**    | props에 raw data 대신 참조만 저장           |
| **서버 스트리밍**                  | 데이터를 조각조각 전송 후 클라이언트에서 조립           |

#### Base64 인코딩 스크립트

Facebook 페이지에서 발견된 스크립트:
```html
<script src="data:text/javascript;base64,..." nonce=""></script>
```

디코딩 결과:
```javascript
requireLazy(["ServerJSPayloadListener"], function(m) {
  m.process();
}, null, 0x100)
```

- **241개**의 base64 인코딩된 스크립트
- **238개**의 인라인 JSON 설정 스크립트

#### Facebook 데이터 로딩 흐름

```
[서버]
   │
   ├── base64 인코딩된 스크립트 241개 전송
   ├── inline JSON 설정 238개 전송
   │
   ▼
[requireLazy / require]
   │
   ├── ServerJSPayloadListener.process()
   ├── 데이터 스트리밍
   │
   ▼
[Relay Store] ← 데이터 저장 (클라이언트 접근 차단)
   │
   ▼
[React 컴포넌트] ← props에는 참조/ID만 전달
```

#### X vs Facebook 아키텍처 비교

```
X (Twitter):
├── Recharts 라이브러리 사용
├── React props에 데이터 배열 직접 저장
├── memoizedProps.data = [{Impressions: 945, ...}]
└── ✅ 클라이언트에서 접근 가능

Facebook:
├── Relay + GraphQL 사용
├── 데이터는 Relay Store에 저장 (접근 차단)
├── React props에는 참조/ID만 저장
├── 프로덕션에서 DevTools Hook 제거
└── ❌ 의도적으로 클라이언트 접근 차단
```

**결론:** Facebook은 단순 "암호화"가 아니라 **아키텍처 자체가 데이터 접근을 어렵게 설계**됨

#### Network 탭에서 GraphQL 응답 발견

DevTools Network 탭에서 `graphql` 필터로 검색하면 실제 데이터를 확인할 수 있음:

**요청 URL:**
```
https://business.facebook.com/api/graphql/
```

**응답 예시 1 - 콘텐츠 유형별 분류:**
```json
{
  "data": {
    "tofu_metrics_query": {
      "__typename": "TofuSingleValueWithBreakdownMetricsQueryResult",
      "bucket_values": [
        {"bucket_names": ["Reel"], "bucket_value": 18},
        {"bucket_names": ["Multi photo"], "bucket_value": 16},
        {"bucket_names": ["Multi media"], "bucket_value": 4},
        {"bucket_names": ["Others"], "bucket_value": 4}
      ]
    }
  }
}
```

**응답 예시 2 - 조회수 KPI + 일별 데이터:**
```json
{
  "data": {
    "tofu_entity": {
      "entity_insights": {
        "views_kpi": {
          "value": 144,
          "delta": {
            "value": -669,
            "percentage": -0.8228,
            "compared_time_range_text": "2025. 12. 29.~2026. 1. 4."
          }
        },
        "views_line": {
          "points": [
            {"start_time": "2026-01-05T00:00:00-08:00", "value": 13},
            {"start_time": "2026-01-06T00:00:00-08:00", "value": 23},
            {"start_time": "2026-01-07T00:00:00-08:00", "value": 14},
            {"start_time": "2026-01-08T00:00:00-08:00", "value": 20},
            {"start_time": "2026-01-09T00:00:00-08:00", "value": 6},
            {"start_time": "2026-01-10T00:00:00-08:00", "value": 4},
            {"start_time": "2026-01-11T00:00:00-08:00", "value": 64}
          ]
        }
      }
    }
  }
}
```

**핵심 쿼리 키:**
| 키 | 용도 |
|-----|------|
| `tofu_entity.entity_insights` | 인사이트 메인 쿼리 |
| `views_kpi.value` | 총 조회수 (144) |
| `views_kpi.delta` | 이전 기간 대비 변화 (-82.3%) |
| `views_line.points[]` | 일별 조회수 차트 데이터 |

**결론:** DOM/React fiber에서는 접근 불가하지만, **Network 탭 GraphQL 응답에서 완전한 데이터 구조 확인 가능**

#### 콘솔에서 직접 GraphQL 호출 ✅ 성공!

Network 탭에서 발견한 요청을 콘솔에서 직접 호출하면 데이터 추출 가능!

**조회수 데이터 호출 코드:**
```javascript
const params = new URLSearchParams({
  'doc_id': '31321294414185827',
  'variables': JSON.stringify({
    "arg": {
      "breakdowns": [],
      "compare_time_range": null,
      "delta_formats": ["DELTA_RAW_VALUE", "DELTA_PERCENTAGE", "RAW_PREVIOUS_VALUE"],
      "event": "VIEW",
      "id": "812034231994709",  // 페이지 ID
      "time_range": {"type": "LAST_7D"},
      "tofu_metric": "COUNT"
    },
    "callerID": "BIZWEB_PROFILE_PLUS_INSIGHTS",
    "shouldQueryDefinition": false
  }),
  'fb_dtsg': '...',  // 페이지에서 추출 필요
  'lsd': '...',      // 페이지에서 추출 필요
  'fb_api_req_friendly_name': 'useBizWebInsightsSingleValueQuery',
  '__a': '1'
});

fetch('https://business.facebook.com/api/graphql/', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: params
})
.then(r => r.json())
.then(data => console.log(data));
```

**응답 결과:**
```json
{
  "data": {
    "tofu_metrics_query": {
      "value": 144,
      "delta": {
        "value": -669,
        "percentage": -0.82287822878229
      }
    }
  }
}
```

**핵심 파라미터:**
| 파라미터 | 설명 | 추출 방법 |
|---------|------|----------|
| `doc_id` | GraphQL 쿼리 ID | Network 탭에서 복사 |
| `fb_dtsg` | CSRF 토큰 | 페이지 HTML에서 추출 |
| `lsd` | 보안 토큰 | 페이지 HTML에서 추출 |
| `variables.arg.id` | 페이지 ID | URL에서 추출 |

**Extension 구현 시:**
1. 페이지 로드 시 `fb_dtsg`, `lsd` 토큰 추출
2. 직접 GraphQL 호출로 데이터 가져오기
3. DOM 파싱 불필요!

### API ✅ 추천
- **Meta Graph API:** 무료
- **기존 인스타그램 자동화와 동일 방식 가능**
- **n8n HTTP Request로 GraphQL 호출**
- **내부 GraphQL 쿼리 구조:** `tofu_entity`, `tofu_metrics_query` 등 (참고용)

---

## 3. X (Twitter)

### 엑셀 내보내기
- **품질:** 좋음 (깔끔한 구조)
- **일별 데이터:** 포함됨
- **컬럼:** 노출수, 참여수, 새로운 팔로우 등

### Chrome Extension ✅ 가능
- **DOM 구조:** React + Recharts
- **데이터 접근:** React fiber에서 직접 추출 가능!

```javascript
// 데이터 추출 방법
var chartWrapper = document.querySelector('.recharts-wrapper');
var fiberKey = Object.keys(chartWrapper).find(k => k.startsWith('__reactFiber'));
var fiber = chartWrapper[fiberKey];

function findData(node, depth) {
  if (depth > 10 || !node) return null;
  if (node.memoizedProps?.data) return node.memoizedProps.data;
  return findData(node.return, depth + 1);
}

var data = findData(fiber, 0);
// 결과: [{Impressions: 945, Engagements: 87, timestamp: 1767830400000}, ...]
```

**추출 가능 데이터:**
```json
{
  "Impressions": 945,    // 노출수
  "Engagements": 87,     // 참여수
  "timestamp": 1767830400000  // 날짜 (밀리초)
}
```

### API ❌ 비쌈
- **Free tier:** 쓰기 전용, 읽기 불가
- **Basic:** $100/월
- **Pro:** $5,000/월
- **Analytics 대시보드 만들기:** 약관 위반 가능성

---

## 기술적 발견

### hover 데이터 vs fiber 데이터

| 방식                 | 장점         | 단점             |
| ------------------ | ---------- | -------------- |
| **hover 시뮬레이션**    | 직관적        | 불안정, 느림        |
| **React fiber 접근** | 한번에 전체 데이터 | React 구조 이해 필요 |

### React fiber 데이터 접근 패턴

```javascript
// 1. recharts-wrapper 찾기
var wrapper = document.querySelector('.recharts-wrapper');

// 2. React fiber 키 찾기
var fiberKey = Object.keys(wrapper).find(k => k.startsWith('__reactFiber'));

// 3. fiber tree 탐색하며 data 찾기
function findData(node, depth) {
  if (depth > 10 || !node) return null;
  if (node.memoizedProps?.data) return node.memoizedProps.data;
  return findData(node.return, depth + 1);
}
```

### Recharts 라이브러리
- X Analytics에서 사용
- SVG 기반 차트
- React props로 데이터 전달
- `memoizedProps.data`에 배열로 저장

---

## 최종 결론

### 플랫폼별 추천 방식

| 플랫폼          | 방법                       | 파이프라인                 |
| ------------ | ------------------------ | --------------------- |
| **Naver**    | Chrome Extension         | Extension → JSON → DB |
| **Facebook** | API (GraphQL)            | n8n → JSON → DB       |
| **X**        | 엑셀 (우선) / Extension (대안) | 엑셀 → 스크립트 → DB        |

### X Extension 개발 가능성
- **React fiber 접근 방식으로 일별 데이터 추출 가능**
- hover 없이 전체 데이터 한번에 가져올 수 있음
- 단, 엑셀 내보내기가 이미 충분하므로 우선순위 낮음

---

## 관련 파일

- `C:/유정우/Projects/data-analytics/convert/` - 엑셀 변환 스크립트
- `C:/유정우/Projects/data-analytics/convert/naver-stats-extension/` - 네이버 Extension
- `C:/유정우/Projects/data-analytics/convert/DATA_STRUCTURE.md` - 엑셀 구조 문서
- `C:/유정우/Projects/data-analytics/convert/DB_SCHEMA.md` - DB 스키마

---

**참고 링크:**
- [X API Pricing](https://twitterapi.io/blog/twitter-api-pricing-2025)
- [Meta Graph API](https://developers.facebook.com/docs/graph-api/)
- [Facebook.com Redesign Architecture](https://engineering.fb.com/2020/05/08/web/facebook-redesign/)
- [Relay Store Deep Dive](https://yashmahalwal.medium.com/a-deep-dive-into-the-relay-store-9388affd2c2b)
- [Accessing Relay Store](https://gist.github.com/0xdevalias/0e723b6c46fec7947a3119de9dd5045d)