---
title: REF-101 Meta BS content_ads 광고별 VIEW vs Ads API 산출 관계
type: guide
permalink: sources/reference/meta-bs-content-ads-view-vs-ads-api
tags:
- meta
- business-suite
- ads-api
- view
- impressions
- graphql
date: 2026-03-11
---

# REF-101 Meta BS content_ads 광고별 VIEW vs Ads API 산출 관계

BS content_ads 테이블의 광고별 VIEW/VIEWER가 Ads API impressions/reach와 어떤 관계인지 실증 분석.

## 📖 핵심 아이디어

Meta Business Suite의 content_ads 테이블(광고 인사이트)에서 보여주는 **per-ad VIEW ≈ Ads API impressions**이고, **per-ad VIEWER ≈ Ads API reach**다. 단, content_ads의 VIEW 값은 time_range에 관계없이 항상 **광고 LIFETIME 누적값**이며, 일별/기간별 증분 VIEW를 BS에서 구하는 방법은 없다. 채널 수준 paid VIEW는 계정 단위 중복제거 메트릭으로 per-ad VIEW 합산과 일치하지 않는다.

## 🛠️ 구성 요소 / 주요 내용

### 메트릭 매핑 (광고별)

| BS content_ads 메트릭 | Ads API 메트릭 | 최근 광고 ratio | 검증 방법 |
|----------------------|---------------|----------------|-----------|
| VIEW (조회수) | impressions | ~1.07 (평균) | NAS 기간 일치 광고 21개 비교 |
| VIEWER (조회 계정) | reach | ~1.03 (평균) | 동일 |

### 대표 검증 사례 (ratio ≈ 1.0)

| 광고명 | BS VIEW | Ads IMP | ratio | BS VIEWER | Ads REACH | ratio |
|--------|---------|---------|-------|-----------|-----------|-------|
| 브랜드_03_쎈혜택받으셨나요 | 915 | 915 | 1.00 | 945 | 913 | 1.04 |
| 퍼포먼스_03_아이폰뽑기 | 677 | 661 | 1.02 | 638 | 638 | 1.00 |
| 퍼포먼스_04_삐약이 | 315 | 313 | 1.01 | 300 | 307 | 0.98 |
| 퍼포먼스_02_처음이라더설레는 | 1,208 | 1,172 | 1.03 | 1,076 | 1,102 | 0.98 |

### 채널 수준 vs 광고별 수준 차이

```
3/9 하루 기준:
  BS 채널 paid VIEW:            10,685  (계정 수준 중복제거)
  Ads API impressions 합산:     35,755  (광고별, 중복 포함)
  ratio (IMP합/paid VIEW):       3.35x  (1명이 평균 3.35개 광고 봄)
```

## 🔧 작동 방식 / 적용 방법

### content_ads 쿼리 방법

```
doc_id: 34106016262374963
friendlyName: useBizWebUnifiedTableInitialLoad_data_refetchable
callerID: BIZWEB_INSIGHTS_CONTENT_TABLE_ADS
ids: ['120238442146380023']  ← ad_account internal node ID
```

### VIEW 값 추출 경로

```
response (multi-line JSON, first line)
  → data.tofu_unified_table.content.edges[].node
    → row_id (= ad_id)
    → fields.views.renderer.result.value (= VIEW)
    → fields.viewers.renderer.result.value (= VIEWER)
    → fields.spend.renderer.amount_spent_info.currency_info.formatted_amount
    → header.entity.entity_info.title (= 광고명)
```

### time_range 동작 방식

| time_range | 표시되는 광고 | VIEW 값 |
|------------|-------------|---------|
| LIFETIME | 전체 67개 | LIFETIME 누적 |
| LAST_90D | LIFETIME과 동일 | LIFETIME과 동일 값 |
| LAST_28D | 27개 (28일 내 활성) | LIFETIME과 동일 값 |
| LAST_7D | 17개 (7일 내 활성) | LIFETIME과 동일 값 |
| YESTERDAY | 1개만 반환 (신뢰 불가) | LIFETIME과 동일 값 |

검증: 26개 광고 전부 LIFETIME = 28D = 7D 동일 (다름=0)

### 일별 per-ad VIEW 구하기 (불가)

| 방법 | 결과 |
|------|------|
| content_ads since/until | noncoercible_variable_value 에러 |
| TimeSeries (ad ID) | "요청한 지표가 지원되지 않습니다" |
| SingleValue (ad ID) | undefined 반환 |
| **Ads API impressions** | **유일한 대안** (≈ BS VIEW) |

### 계정 ID 주의사항

```
BS 페이지에 연결된 광고 계정: 844700334643800 (legacy)
실제 광고가 집행되는 계정: 1206160518147944 (legacy)
→ 올바른 쿼리 ID: 120238442146380023 (internal node ID)
```

BS content_ads 페이지가 잘못된 계정을 기본 표시하면 테이블이 비어 보임. `BizWebInsightsAdAccountSelectorQueryRendererQuery` (doc_id: 31643149485298558)로 연결 계정 확인 가능.

## 💡 실용적 평가

### 실무 적용

| 용도 | 데이터 소스 | 메트릭 |
|------|------------|--------|
| 광고별 일별 조회수 | Ads API | impressions (≈ BS VIEW) |
| 광고별 일별 도달 | Ads API | reach (≈ BS VIEWER) |
| 채널 전체 paid VIEW | BS TimeSeries (PAGE ID) | VIEW with PAID_ORGANIC breakdown |
| 광고별 누적 조회수 | BS content_ads | VIEW (LIFETIME 고정) |

### 한계

- sum(per-ad impressions) ≠ 채널 paid VIEW: 중복제거 때문 (ratio ~3.35x)
- 채널 paid VIEW가 어떤 Ads API 메트릭에 대응하는지 특정 불가 (NAS 3/9 전체 메트릭 중 10,685 매칭 없음)
- content_ads 응답은 Relay streaming 형식 (multi-line JSON, 첫 줄만 파싱)
- YESTERDAY 필터는 1개 광고만 반환하여 신뢰 불가

### NAS 데이터 범위

ad_metrics_atomic은 3/9~3/11 데이터만 존재. LIFETIME 비교 시 오래된 광고는 ratio가 높게 나옴 (최대 4.76x). ratio ≈ 1.0인 광고만 유효한 비교 대상.

## 🔗 관련 개념

- [[REF-100 Meta Ads API 지표 산출 관계 — 52개 메트릭 계층 구조]] - (채널 수준 지표 계층. 이 노트는 per-ad 수준에서 BS VIEW = impressions 실증 확인)
- [[REF-077 Meta Business Suite 게시물별 GraphQL API 분석]] - (BS GraphQL 쿼리 구조. content_ads도 같은 tofu_unified_table 패턴 사용)
- [[REF-099 Facebook Ads Manager 내부 API 구조 분석 — am_tabular 엔드포인트]] - (Ads Manager API. content_ads와 다른 인터페이스로 같은 광고 데이터 접근)

---

**작성일**: 2026-03-11
**분류**: Meta / Business Suite / 광고 지표 분석