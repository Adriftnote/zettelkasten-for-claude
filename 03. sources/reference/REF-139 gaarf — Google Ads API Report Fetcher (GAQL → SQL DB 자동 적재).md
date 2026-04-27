---
title: REF-139 gaarf — Google Ads API Report Fetcher (GAQL → SQL DB 자동 적재)
type: guide
permalink: sources/reference/google-ads-api-gaarf-integration
tags:
- google-ads-api
- gaarf
- gaql
- oauth
- sqlalchemy
- mariadb
- advertising-data
- demand-gen
- search-ads
date: 2026-04-27
---

# gaarf — Google Ads API Report Fetcher

GAQL 쿼리(.sql 파일)를 작성하면 인증·실행·다양한 출력 포맷으로 저장까지 자동 처리하는 Google 공식 OSS. **로컬 SQLite/NAS MariaDB 직접 적재 검증 완료** (2026-04-27, 1011726623 광고계정에서 실데이터 fetch 성공).

레포: [google/ads-api-report-fetcher](https://github.com/google/ads-api-report-fetcher) · 1.18.3 · TypeScript+Python 듀얼

## 📖 핵심 아이디어

- "쿼리 작성"과 "실행+저장"을 분리한다. .sql 파일에 GAQL만 적으면 gaarf가 OAuth/HTTP/스키마 추론/DB 적재까지 떠안는다.
- Python 버전은 SQLAlchemy 기반 `sqldb` writer 제공 → **MariaDB/MySQL/PostgreSQL/SQLite 모두 connection string 한 줄 차이**로 출력 가능.
- 인증 없이 검증할 수 있는 `gaarf-simulator` 동봉 — Faker로 GAQL 스키마에 맞는 가짜 데이터 1000행 생성 → 실DB 파이프라인 사전 검증.
- Playwright UI 스크래핑 대비: 안정성 ↑ (공식 API), 정밀도 ↑ (cost_micros·conversions·quality_score 등 raw), 데이터 범위 ↑ (campaign/adgroup/ad/keyword/asset/conversion_action 자유 SELECT).

## 🛠️ 구성 요소

### 인증 3요소 (`google-ads.yaml`)

| 항목 | 의미 | 발급 위치 |
|------|------|----------|
| `developer_token` | API 호출 권한 (앱 식별) | https://ads.google.com/aw/apicenter — **MCC(관리자) 계정 필요** |
| `client_id` / `client_secret` | OAuth 2.0 클라이언트 (앱 ID) | https://console.cloud.google.com/apis/credentials — Desktop app 권장 |
| `refresh_token` | 데이터 권한 (어떤 계정 접근) | OAuth Playground / oauth2l / `InstalledAppFlow.run_local_server()` |
| `login_customer_id` *(선택)* | MCC 통해 자식 계정 접근 시 MCC ID | 단일 계정 직접 접근이면 **라인 자체 제거** (빈 문자열은 validation 실패) |

### Access level (Operation/day)

- **Explorer** (자동 즉시 부여): production 2,880 ops/day
- **Test/Basic**: 15,000 ops/day
- **Standard**: 무제한

소규모 운영(캠페인 20~50개, 일별 cron 24회)은 **Explorer로 충분**. Basic 심사 안 기다려도 시작 가능.

### 출력 writer

| writer | Python | Node | 비고 |
|--------|--------|------|------|
| `bq`, `csv`, `json`, `console` | ✅ | ✅ | 공통 |
| **`sqldb`** (SQLAlchemy) | ✅ | ❌ | **MariaDB/MySQL/PostgreSQL/SQLite** |
| `sheet`, `excel`, `kafka`, `pubsub`, `elasticsearch`, `opensearch`, `null` | ✅ | 일부 | 부가 |

`sqldb` 설치: `pip install "google-ads-api-report-fetcher[sqlalchemy]" pymysql` (MariaDB/MySQL이면 pymysql 추가)

### gaarf-simulator (인증 없이 검증)

- 별도 extra: `pip install "google-ads-api-report-fetcher[simulator]"` — Faker 의존
- GAQL의 SELECT 컬럼만 보고 자동으로 가짜 데이터 1000행 생성 (campaign_id BIGINT, segment_date 등 타입 추론)
- ⚠️ CLI `gaarf-simulator --output=sqldb` 라우팅 버그 존재 (`dest='save'` 충돌로 yaml `output` 무시되고 console로 fallback). **Python 직접 호출이 안전** — `simulation.simulate_data() + SqlAlchemyWriter.write()` 11줄로 끝.

## 🔧 작동 방식

### 인증 셋업 절차 (work.with~ 계정 패턴 검증)

```
1. GCP 프로젝트 + Google Ads API 활성화
2. OAuth 동의 화면 — Data access에서 scope `https://www.googleapis.com/auth/adwords` 추가
3. Audience에 Test users로 권한 받을 광고계정 owner 이메일 추가
4. OAuth Client (Desktop app) 만들기 → client_secret_*.json 다운로드
5. 별도 본인 Gmail로 MCC 생성 (광고비 0, 운영 불필요) → API Center에서 dev token 신청 → Explorer 자동 부여
6. InstalledAppFlow.run_local_server() 실행 → 브라우저에서 광고계정 owner 계정으로 동의 → refresh_token 자동 캡처
7. yaml에 5종 채워서 GoogleAdsApiClient(path_to_config="google-ads.yaml") 생성
```

**주의**: refresh_token 발급은 OAuth 동의한 Google 계정 기준. 회사 광고계정 owner 계정으로 동의받아야 그 데이터 접근 가능. 다른 계정으로 동의받으면 `list_accessible_customers`에서 회사 계정 안 보임.

### 최소 호출 패턴 (Python)

```python
from gaarf.api_clients import GoogleAdsApiClient
from gaarf.report_fetcher import AdsReportFetcher
from garf.io.writers.sqldb_writer import SqlAlchemyWriter

client = GoogleAdsApiClient(path_to_config="google-ads.yaml")
fetcher = AdsReportFetcher(api_client=client)
report = fetcher.fetch(open("query.sql").read(), ["1011726623"])

# SQLite
SqlAlchemyWriter("sqlite:///out.db").write(report, "campaign_metrics")
# MariaDB
SqlAlchemyWriter("mysql+pymysql://root:pwd@192.168.0.9/mot_dashboard?ssl_disabled=true").write(report, "campaign_metrics")
```

`pandas.to_sql()` 내부 사용 → **테이블 자동 생성, BIGINT/TEXT/DOUBLE 타입 자동 추론**, `if_exists='replace'` 기본 (다른 옵션: `append`, `fail`).

### GAQL 메타데이터 카탈로그 (campaign 도메인 검증된 필드)

검증 광고계정: 1011726623 ((주)우리정보통신_olleh8282_디멘드젠), 23 캠페인 / 42 광고그룹 / 키워드 EXACT.

| 리소스 (FROM) | 핵심 필드 | 화면 활용 |
|--------------|----------|---------|
| `customer` | id, descriptive_name, currency_code, time_zone, optimization_score, auto_tagging_enabled, tracking_url_template | 헤더 메타 |
| `campaign` | id, name, status, serving_status, advertising_channel_type (SEARCH/PERFORMANCE_MAX/DEMAND_GEN), advertising_channel_sub_type, bidding_strategy_type, experiment_type, payment_mode, optimization_score | 캠페인 카드/배지 |
| `campaign_budget` | amount_micros (일별), total_amount_micros (평생), delivery_method (STANDARD/ACCELERATED), period (DAILY) | 예산 vs 실 spend 비교 |
| `ad_group` | id, name, status, type (SEARCH_STANDARD 등), cpc_bid_micros, target_cpa_micros, target_roas, campaign(FK) | 드릴다운 |
| `ad_group_ad` | ad.id, ad.type (RESPONSIVE_SEARCH_AD), status, policy_summary.approval_status, ad.final_urls | 광고 소재 목록 |
| `campaign_criterion` | type (LANGUAGE/LOCATION/DEVICE), negative, geo_target_constant, language, device.type | 타겟팅 카드 |
| `conversion_action` | id, name, type (WEBPAGE/GOOGLE_ANALYTICS_4_*), category (PHONE_CALL_LEAD/PURCHASE/PAGE_VIEW), primary_for_goal, lookback_window_days | 전환 액션 분해 |
| `asset` / `campaign_asset` | type (CALLOUT/IMAGE/LOGO/STRUCTURED_SNIPPET/YOUTUBE_VIDEO), text/image/youtube 세부, field_type, status | 자산 매핑 |
| `keyword_view` | keyword.text, match_type (EXACT/PHRASE/BROAD), quality_info.quality_score, status, negative | 키워드 성과 |
| `geo_target_constant` | id, name, country_code, target_type — `2410=South Korea` 룩업 | 타겟팅 라벨 |

**메트릭+세그먼트** (재사용 패턴): `metrics.impressions`, `metrics.clicks`, `metrics.cost_micros`, `metrics.conversions`, `metrics.conversions_value`, `metrics.ctr`, `metrics.average_cpc`, `metrics.average_cpm`, `metrics.cost_per_conversion`. 세그먼트: `segments.date`, `segments.device`, `segments.day_of_week`, `segments.hour`, `segments.ad_network_type`.

**GAQL 함정**:
- `campaign.start_date`/`end_date` — v24에서 GaarfFieldException. 캠페인 시작일은 첫 metric 데이터 일자로 추론하면 됨
- 한 쿼리는 **하나의 FROM 리소스만**. JOIN 없음 — 자식 리소스 필드(`campaign_budget.*`)는 그냥 SELECT에 같이 적으면 자동 join

### `cost_micros` 단위

KRW 기준 1원 = 1,000,000 micros. 즉 `cost_micros / 1_000_000`이 KRW.

## 💡 실용적 평가

### 우리 케이스 적용 (MOT 대시보드 Phase A)

- **즉시 채택 가능** — gaarf API 호출 + NAS MariaDB 적재 1초 미만, E2E 검증 끝남
- 기존 Playwright `collect-google-ads.js` 대체 후보. 단 dev token 신청·OAuth 동의 작업이 사용자 액션 필요 (자동화 불가)
- pandas auto-schema → 별도 DDL 안 짜도 첫 실행 시 테이블 생성. 단 운영 시 컬럼 추가/타입 안정성 위해 명시적 DDL + `if_exists='append'`로 가는 게 안전
- Phase A 본 작업 흐름: GAQL 쿼리 7~12개 (`includes/queries/ads/*.sql`) 작성 → cron `gaarf` 실행 → mot_dashboard MariaDB 테이블 → 기존 `contentPerformance*.php` 패턴 그대로 이식

### 한계·주의점

- **MCC 필수** — dev token 발급은 Manager 계정에서만. 일반 광고계정은 신청 메뉴 자체가 안 보임
- **OAuth 동의 계정 == 데이터 접근 권한** — 회사 광고계정 owner로 동의받아야 그 데이터 접근. 다른 계정으로 받으면 `list_accessible_customers` 결과가 다름
- **Test users 등록 필수** — 동의 화면이 Testing 상태면 등록되지 않은 이메일 차단 (access_denied 403)
- **gaarf-simulator CLI 버그** — `--output=sqldb` 옵션이 argparse `dest='save'` 매핑 충돌로 console fallback. Python 직접 호출 권장
- Windows 콘솔 cp949 환경에서 em-dash(`—`) print → UnicodeEncodeError. 스크립트 출력에서 ASCII 문자 사용 또는 `python -X utf8` 플래그
- `login_customer_id`는 빈 문자열이면 validation 실패 → MCC 통한 자식 접근이 아니면 yaml에서 라인 자체 제거

### Playwright vs gaarf 비교

| 항목 | Playwright (`collect-google-ads.js`) | gaarf |
|------|-------------------------------------|-------|
| 안정성 | UI 변경/세션 만료에 취약 | 공식 API |
| 데이터 정밀도 | UI 라운딩, `cost_micros 17282200154` 같은 단위 이상값 | spec 정확 (`segments.date`, `cost_micros` raw) |
| 데이터 범위 | 보이는 화면 한정 | GAQL로 자유 (campaign/ad_group/ad/keyword/asset/conversion 모두) |
| 셋업 | 세션 유지 cron | dev token 신청 (며칠) + OAuth 동의 |
| 운영 비용 | 브라우저 메모리 | API 호출만 (operation 한도 내 무료) |
| 실패 모드 | 조용히 0건/이상값 | gRPC 에러 명시적 |

### 부수 발견

기존 Playwright 수집기의 `google_ads.db.m_accounts.customer_id = 6515484705`는 **잘못된 값**. ssen.info.official 권한 안에 없음. **진짜 광고계정은 1011726623** ((주)우리정보통신_olleh8282_디멘드젠). Playwright가 다른 GA 계정을 customer_id로 잘못 저장한 듯. gaarf 도입 시 이 ID 정정 필요.

## 🔗 관련 개념

- [[REF-112 Google Ads 내부 gRPC-Web API 구조 분석]] - (Playwright UI 스크래핑 대안 — gaarf는 이 노트의 비공식 gRPC를 공식 API로 대체하는 정도)
- [[REF-099 Facebook Ads Manager 내부 API 구조 분석 — am_tabular 엔드포인트]] - (대비점: Meta는 동일한 공식 API/스크래핑 분리, Facebook은 Marketing API + am_tabular 분리. Google은 gaarf 한 가지로 통일됨)
- [[REF-100 Meta Ads API 지표 산출 관계 — 52개 메트릭 계층 구조]] - (공통점: Meta·Google 광고 메트릭 모두 평생 누적 vs 일별 분리, cost/value/conversion 계층 구조 유사)
- [[REF-101 Meta BS content_ads 광고별 VIEW vs Ads API 산출 관계]] - (공통점: 광고별 일별 분해 패턴. Meta는 BS Lifetime + Ads API daily, Google은 segments.date 한 번에)
- [[REF-113 MariaDB 로컬 환경 활용 가이드 — CLI·MCP·설정 패턴]] - (출력 destination — gaarf SqlAlchemyWriter가 그대로 적재)
- [[REF-079 SNS 게시물별 실시간 조회수 추적 — 플랫폼별 API 비교 및 자동화 전략]] - (전체 플랫폼 자동화 전략의 한 조각 — Google Ads 부분이 gaarf로 깔끔)
- [[REF-094 gogcli — Google Workspace CLI (Gmail, GCal, GDrive 등)]] - (대비점: Workspace는 Discovery 기반 단일 CLI, Ads는 별도 dev token 절차. 같은 Google이라도 라인이 다름)

---

**작성일**: 2026-04-27
**분류**: 광고 데이터 파이프라인 (Google Ads API)
**검증**: 1011726623 광고계정에서 LAST_7_DAYS 캠페인 메트릭 10행 fetch 성공, NAS MariaDB E2E 1000행 적재 1초 미만