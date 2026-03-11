---
title: REF-099 Facebook Ads Manager 내부 API 구조 분석 — am_tabular 엔드포인트
type: guide
permalink: sources/reference/facebook-ads-manager-am-tabular-api
tags:
- facebook
- ads-manager
- marketing-api
- am-tabular
- graphql
- sns-data
- playwright
date: 2026-03-11
---

# Facebook Ads Manager 내부 API 구조 분석 — am_tabular 엔드포인트

Facebook Ads Manager가 광고 성과 테이블 데이터를 로드할 때 사용하는 내부 API(`am_tabular`)의 구조를 리버스 엔지니어링하여 분석.

## 📖 핵심 아이디어

Ads Manager의 광고 성과 테이블(노출, 도달, 클릭, 비용 등)은 **GraphQL이 아니라 Marketing API 기반의 `am_tabular` 엔드포인트**를 사용한다. GraphQL(`/api/graphql/`)은 광고 메타데이터(설정, 상태, URL)와 보조 데이터(랜딩페이지뷰, 세일즈세그먼트)를 담당하고, 실제 인사이트 수치는 `adsmanager-graph.facebook.com`의 `am_tabular` REST 엔드포인트가 반환한다.

## 🛠️ 구성 요소 / 주요 내용

### 엔드포인트 구분

| 엔드포인트 | 호스트 | 용도 | 비고 |
|-----------|--------|------|------|
| `/api/graphql/` | `adsmanager.facebook.com` | 광고 메타데이터, 설정, 보조 데이터 | doc_id 기반, POST |
| `/v22.0/act_{id}/am_tabular` | `adsmanager-graph.facebook.com` | **인사이트 수치** (노출, 도달, 비용 등) | REST GET, access_token |
| `/v22.0/act_{id}/light_campaigns` | `adsmanager-graph.facebook.com` | 캠페인 목록 | 구조 데이터 |
| `/v22.0/act_{id}/lightads` | `adsmanager-graph.facebook.com` | 광고 목록 | 구조 데이터 |

### 페이지 로드 시 네트워크 요청 분포 (실측)

| 경로 | 호출 수 | 역할 |
|------|---------|------|
| `/api/graphql/` | 256 | 메타데이터, 상태, 토큰 |
| `/v22.0/act_{id}/am_tabular` | 22 | **인사이트 수치** |
| `/ajax/bootloader-endpoint/` | 14 | JS 번들 로딩 |
| `/v22.0/act_{id}/light_campaigns` | 5 | 캠페인 목록 |
| `/v22.0/act_{id}/light_adsets` | 5 | 광고세트 목록 |
| `/v22.0/act_{id}/lightads` | 5 | 광고 목록 |

### GraphQL doc_id 매핑 (캡처 17개 중 주요)

| doc_id | 호출 수 | 용도 |
|--------|---------|------|
| `8902413049861666` | 14 | config/killswitch (기능 플래그) |
| `26191181877178810` | 3 | 광고 메타데이터 배치 조회 (ids 배열) |
| `24647352514934222` | 4 | 광고별 attribution/sales segment |
| `9926574544119764` | 4 | 랜딩페이지 뷰 데이터 |
| `23913431554915374` | 1 | 편집 다이얼로그 컨텍스트 |

### am_tabular 응답 구조

```json
{
  "data": [{
    "headers": {
      "dimensions": ["ad_name", "ad_id", "objective", "date_start", "date_stop"],
      "atomic_columns": [
        {"name": "reach", "type": "numeric string"},
        {"name": "frequency", "type": "numeric string"},
        {"name": "spend", "type": "numeric string"},
        {"name": "impressions", "type": "numeric string"},
        {"name": "cpm", "type": "numeric string"},
        {"name": "cpc", "type": "numeric string"},
        {"name": "clicks", "type": "numeric string"},
        {"name": "ctr", "type": "numeric string"}
      ],
      "result_columns": [
        {"name": "results", "type": "results", "attribution_window": "default"},
        {"name": "cost_per_result", "type": "results", "attribution_window": "default"}
      ]
    },
    "rows": [
      {
        "dimension_values": ["광고명", "광고ID", "OUTCOME_TRAFFIC", "2026-03-04", "2026-03-10"],
        "atomic_values": ["18451", "1.039", "60059", "19178", "3131.2", "500.5", "120", "0.626"],
        "result_values": [{"indicator": "actions:landing_page_view"}, {"indicator": "..."}]
      }
    ]
  }],
  "paging": {}
}
```

## 🔧 작동 방식 / 적용 방법

### 인증 토큰 추출

```javascript
// access_token: 페이지 HTML 또는 Performance API에서 추출
// EAAB... 형식, Marketing API용 내부 토큰
const html = document.documentElement.innerHTML;
const tokenMatch = html.match(/(EAABsbCS1iHg[A-Za-z0-9%]+)/);
const accessToken = decodeURIComponent(tokenMatch[1]);

// 주의: 이 토큰은 graph.facebook.com (공개 Marketing API)에서는 사용 불가
// adsmanager-graph.facebook.com (내부 API) 전용
```

### am_tabular API 호출

```javascript
const params = new URLSearchParams({
  access_token: accessToken,
  action_attribution_windows: '["default"]',
  column_fields: JSON.stringify([
    "ad_name", "ad_id", "results", "reach", "frequency",
    "cost_per_result", "spend", "impressions", "cpm", "cpc",
    "clicks", "ctr", "objective"
  ]),
  filtering: JSON.stringify([
    { field: "campaign.impressions", operator: "GREATER_THAN", value: 0 }
  ]),
  include_headers: 'true',
  level: 'ad',           // ad | adset | campaign | account
  limit: '5000',
  locale: 'ko_KR',
  method: 'get',
  suppress_http_code: '1',
  time_range: JSON.stringify({ since: "2026-03-04", until: "2026-03-10" }),
  use_unified_attribution_setting: 'true'
});

const url = `https://adsmanager-graph.facebook.com/v22.0/act_${accountId}/am_tabular?${params}`;
const resp = await fetch(url, { method: 'GET', credentials: 'include' });
const json = await resp.json();
// json.data[0].rows → 광고별 인사이트 배열
```

### 응답 파싱

```javascript
const rows = json.data[0].rows;
const parsed = rows.map(r => ({
  ad_name: r.dimension_values[0],
  ad_id: r.dimension_values[1],
  objective: r.dimension_values[2],
  date_start: r.dimension_values[3],
  date_stop: r.dimension_values[4],
  reach: parseInt(r.atomic_values[0]) || 0,
  frequency: parseFloat(r.atomic_values[1]) || 0,
  spend: parseFloat(r.atomic_values[2]) || 0,
  impressions: parseInt(r.atomic_values[3]) || 0,
  cpm: parseFloat(r.atomic_values[4]) || 0,
  cpc: parseFloat(r.atomic_values[5]) || 0,
  clicks: parseInt(r.atomic_values[6]) || 0,
  ctr: parseFloat(r.atomic_values[7]) || 0
}));
```

### 사용 가능한 column_fields

Ads Manager UI에서 확인된 26개 컬럼:

| 카테고리 | 필드 |
|----------|------|
| 성과 | `results`, `reach`, `frequency`, `impressions` |
| 비용 | `spend`, `cost_per_result`, `cpm`, `cpc` |
| 클릭 | `clicks`, `ctr`, `link_clicks`, `link_ctr` |
| 품질 | `quality_ranking`, `engagement_rate_ranking`, `conversion_rate_ranking` |
| 식별 | `ad_name`, `ad_id`, `objective`, `attribution_setting` |

### level별 집계

| level | 단위 | 설명 |
|-------|------|------|
| `ad` | 개별 광고 | 광고 소재별 성과 |
| `adset` | 광고 세트 | 타겟/예산 그룹별 |
| `campaign` | 캠페인 | 목표별 합산 |
| `account` | 계정 전체 | 전체 합산 (footer) |

### Playwright 자동화 패턴

```javascript
async function collectAds(page, accountId, dateRange) {
  // 1. Ads Manager 페이지 로드 (세션 쿠키 인증)
  await page.goto(`https://adsmanager.facebook.com/adsmanager/manage/ads?act=${accountId}`);
  await page.waitForTimeout(5000);

  // 2. page.evaluate()로 API 직접 호출
  const data = await page.evaluate(async (params) => {
    const html = document.documentElement.innerHTML;
    const tokenMatch = html.match(/(EAABsbCS1iHg[A-Za-z0-9%]+)/);
    const accessToken = decodeURIComponent(tokenMatch[1]);
    
    const searchParams = new URLSearchParams({
      access_token: accessToken,
      column_fields: JSON.stringify(["ad_name","ad_id","spend","impressions","reach","clicks","ctr","cpm","cpc","results","cost_per_result"]),
      filtering: JSON.stringify([{ field: "campaign.impressions", operator: "GREATER_THAN", value: 0 }]),
      include_headers: 'true',
      level: 'ad',
      limit: '5000',
      method: 'get',
      time_range: JSON.stringify(params.dateRange),
      use_unified_attribution_setting: 'true',
      action_attribution_windows: '["default"]',
      suppress_http_code: '1'
    });
    
    const url = `https://adsmanager-graph.facebook.com/v22.0/act_${params.accountId}/am_tabular?${searchParams}`;
    const resp = await fetch(url, { credentials: 'include' });
    return resp.json();
  }, { accountId, dateRange });

  // 3. 파싱 및 반환
  return data.data[0].rows.map(r => ({ /* ... */ }));
}
```

## 💡 실용적 평가 / 적용

### 장점
- **REST API**: GraphQL doc_id 의존 없음 — `am_tabular`는 URL 파라미터 기반으로 안정적
- **풍부한 인사이트**: 26+ 컬럼의 광고 성과 데이터 일괄 조회
- **level 집계**: ad/adset/campaign/account 레벨 자유롭게 선택
- **Playwright 통합 용이**: `page.evaluate()` + `fetch()` 패턴으로 기존 collect-posts.js와 동일 구조

### 한계
- **내부 API**: `adsmanager-graph.facebook.com`은 비공식 — 엔드포인트 변경 가능성
- **access_token 추출 필요**: 페이지 HTML에서 EAAB 패턴으로 추출 (Regex 의존)
- **공개 Marketing API와 다름**: `graph.facebook.com/v22.0/act_{id}/insights`는 별도 토큰 필요 (App 등록 + 권한)
- **column_fields 전체 목록 미확인**: UI에 보이는 26개 외에 더 있을 수 있음

### Business Suite API vs Ads Manager API

| 항목 | Business Suite (REF-077) | Ads Manager (이 노트) |
|------|-------------------------|---------------------|
| 호스트 | `business.facebook.com` | `adsmanager-graph.facebook.com` |
| 프로토콜 | GraphQL (doc_id) | REST (am_tabular) |
| 대상 | 게시물 유기적 인사이트 | **광고 유료 인사이트** |
| 메트릭 | 조회수, 반응, 댓글 | 노출, 도달, 비용, 클릭, CPC, CPM |
| 인증 | fb_dtsg + cookie | access_token (EAAB) + cookie |
| 안정성 | doc_id 변경 위험 | URL 파라미터 기반, 상대적 안정 |

### 검증 결과 (2026-03-11 실측)

| 항목 | 값 |
|------|-----|
| 기간 | 2026-03-04 ~ 2026-03-10 (7일) |
| 수집 광고 수 | 36개 |
| 총 지출 | ₩503,579 |
| 총 노출 | 132,486 |
| 총 도달 | 121,152 |
| 총 클릭 | 1,544 |

## 🔗 관련 개념

- [[REF-077 Meta Business Suite 게시물별 GraphQL API 분석]] - (동일 Meta 플랫폼이나 다른 API 체계: Business Suite=게시물 유기적 인사이트 / Ads Manager=광고 유료 인사이트)
- [[facebook-extractor]] - (기존 채널 레벨 GraphQL 추출기, Ads Manager는 별도 엔드포인트 사용)
- [[REF-079 SNS 게시물별 실시간 조회수 추적 — 플랫폼별 API 비교 및 자동화 전략]] - (전체 플랫폼 수집 전략에서 Facebook 광고 데이터가 누락된 부분을 보완)

---

**작성일**: 2026-03-11
**분류**: SNS 데이터 수집 / Facebook Ads Manager API