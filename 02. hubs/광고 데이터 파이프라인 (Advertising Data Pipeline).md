---
title: 광고 데이터 파이프라인 (Advertising Data Pipeline)
type: hub
permalink: hubs/advertising-data-pipeline
tags:
- hub
- advertising-data
- api
- scraping
- etl
- marketing-platform
---

# 광고 데이터 파이프라인 (Advertising Data Pipeline)

광고 플랫폼(Google Ads / Meta / Instagram 등)에서 캠페인·메트릭·자산 데이터를 끌어와 내부 DB(MariaDB/SQLite)에 적재하고 대시보드로 시각화하기까지의 전체 흐름을 조직화하는 허브. 각 플랫폼의 **공식 API**, **내부(비공식) API**, **UI 스크래핑** 세 가지 접근법과 그 trade-off를 정리한다.

## Observations

- [pattern] 한 광고 플랫폼은 보통 **세 가지 데이터 통로**가 공존한다 — (1) 공식 API (developer token + OAuth), (2) UI 백엔드 내부 API (gRPC-Web, GraphQL, am_tabular 등), (3) Playwright UI 스크래핑 #pattern
- [tradeoff] 공식 API는 안정적이지만 dev token 발급·OAuth 동의 절차 필요. 내부 API는 즉시 가능하지만 endpoint 변경 위험. UI 스크래핑은 가장 자유롭지만 신뢰도 낮음 #tradeoff
- [fact] Google Ads는 `cost_micros` (1 KRW = 1,000,000 micros) 단위. Meta는 spend USD/KRW 그대로. **단위 정규화가 멀티 플랫폼 통합의 첫 관문** #fact
- [fact] 메트릭 시간성은 **일별 vs 평생 누적** 두 종류. Meta BS는 항상 LIFETIME 누적, Google Ads는 `segments.date`로 일별 분해, Meta Ads API도 `time_range` 파라미터로 일별 가능 #fact
- [pattern] 광고 메트릭 계층은 보통 **계정 → 캠페인 → 광고그룹 → 광고 → (키워드/자산/잠재고객)** 5단계. 분석 깊이에 따라 어디까지 끌어올지 결정 #pattern
- [pattern] 운영 cron의 좋은 분리: **마스터 메타(주간) + 메트릭 시계열(일별 또는 시간별)**. 마스터를 매번 끌면 ops 한도 낭비, 시계열을 주간으로 끌면 latency 발생 #pattern
- [insight] 같은 광고 계정의 데이터라도 **OAuth 동의한 Google 계정에 따라 접근 가능 여부가 갈린다** — refresh_token이 본질, dev token은 앱 식별일 뿐 #insight
- [pitfall] UI 스크래핑으로 잡은 customer_id가 잘못된 계정을 가리킬 수 있음. 공식 API의 `list_accessible_customers`로 검증 후 사용 권장 #pitfall

## Relations

- organizes [[REF-139 gaarf — Google Ads API Report Fetcher (GAQL → SQL DB 자동 적재)]] (Google Ads 공식 API 통합 — GAQL → SQLAlchemy로 MariaDB 직접 적재)
- organizes [[REF-112 Google Ads 내부 gRPC-Web API 구조 분석]] (Google Ads 내부 API — UI 백엔드 gRPC-Web 분석. gaarf 대안)
- organizes [[REF-099 Facebook Ads Manager 내부 API 구조 분석 — am_tabular 엔드포인트]] (Facebook 내부 API — am_tabular 단일 엔드포인트로 전체 메트릭)
- organizes [[REF-100 Meta Ads API 지표 산출 관계 — 52개 메트릭 계층 구조]] (Meta 공식 Marketing API — 52개 메트릭의 산출 관계 계층)
- organizes [[REF-101 Meta BS content_ads 광고별 VIEW vs Ads API 산출 관계]] (Meta Business Suite VIEW vs Ads API의 산출 차이 — 항상 LIFETIME 누적 함정)
- organizes [[REF-114 Instagram Graph API — 공식 Insights 엔드포인트 및 FB-IG 분리 수집 전략]] (Instagram 공식 API — Graph API Insights, FB·IG 분리 수집 전략)
- connects_to [[메모리 시스템 (Memory Systems)]] (대비점: 광고 데이터 파이프라인은 외부 ingest, 메모리 시스템은 내부 저장. 둘 다 일별/평생 누적 시간성 분리가 핵심)
- connects_to [[MCP Tool 패턴 (MCP Tool Patterns)]] (연결: 광고 데이터를 LLM 도구로 노출할 때 ops 한도·캐싱 패턴이 MCP 도구 설계와 동일한 trade-off)