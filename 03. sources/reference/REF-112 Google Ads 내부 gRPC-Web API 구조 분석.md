---
title: REF-112 Google Ads 내부 gRPC-Web API 구조 분석
type: note
permalink: zettelkasten/03.-sources/reference/ref-112-google-ads-naebu-g-rpc-web-api-gujo-bunseog
date: '2026-03-13'
source: REF-112
tags:
- google-ads
- grpc-web
- protobuf
- api-analysis
- real-time-data
- playwright
- data-collection
- sns-api
---

# Google Ads 내부 gRPC-Web API 구조 분석

Google Ads 내부 gRPC-Web API 34개를 Playwright로 전수 조사하고, 실시간 데이터 가용성을 검증한 분석 결과.

## 📖 핵심 아이디어

Google Ads 내부 API는 gRPC-Web + protobuf 직렬화 구조로, 필드명이 숫자인 특이한 형식을 사용한다. 8개 탭에서 34개 API가 호출되며, CampaignService/List는 28개 메트릭을 **실시간**으로 반환한다 (17~43초 간격 노출수 증가 확인). 공식 REST API(v23)는 D+1 전일 확정만 제공하므로, 실시간 모니터링은 내부 API만 가능하다.

## 🛠️ 구성 요소 / 주요 내용

| 항목 | 설명 |
|------|------|
| 프로토콜 | gRPC-Web + protobuf (필드명 숫자, stats.* 메트릭명 별도 제공) |
| API 도메인 | `aw_essentials` (핵심), `aw_dva` (잠재고객), `aw_insights` (인사이트), `aw_changehistory` (변경기록), `aw` (공통) |
| 총 API 수 | 34개 (수집 대상 14개 + 공통/운영 제외 20개) |
| 조사 탭 | 8개 — 개요, 캠페인, 광고그룹, 광고, 키워드, 잠재고객, 인사이트, 변경기록 |
| 핵심 API | CampaignService/List (28 메트릭 ★실시간), OverviewService/Get (42~191 카드) |
| 실시간 검증 | impressions 17~43초 간격 증가 확인 (2026-03-13 Playwright 캡처) |
| 검증 소스 | Google Ads REST API v23 (GAQL D+1 확정값) |

## 🔧 작동 방식 / 적용 방법

```
수집 파이프라인:

[Playwright 브라우저] → page.on('response') 인터셉트
  ├── ads.google.com/aw_essentials/_/rpc/CampaignService/List   → 5~10분 (실시간)
  ├── ads.google.com/aw_essentials/_/rpc/OverviewService/Get     → 1일 1회
  ├── ads.google.com/aw_essentials/_/rpc/AdGroupAdService/List   → 1일 1회
  └── ... (14개 엔티티)

[검증] → Google Ads REST API v23
  └── GAQL: SELECT metrics.* FROM campaign WHERE segments.date DURING YESTERDAY

protobuf 응답 구조 (CampaignService/List):
  "1" → 데이터 행 배열
    └── "200.1" → 메트릭 값 (인덱스: [0]=avg_cpm [1]=impressions [5]=cost [9]=clicks)
  "2.2" → 컬럼 정의 (stats.impressions, stats.clicks 등)
```

### 의미 관계 (10개)

| 관계 | 소스 → 타겟 | 설명 |
|------|-------------|------|
| `aggregates` | OverviewService → CampaignService | 캠페인 메트릭 → 대시보드 카드 집계 |
| `extends` (2) | GetFollowUp → Overview, CtCustomer → Customer | 기본 → 상세 확장 |
| `summarizes` | BatchService → CampaignService | 래핑 API로 경량 캠페인 목록 |
| `evaluates` | InsightService → CampaignService | 캠페인 성과 진단/점수화 |
| `configures` | SuggestionService → CampaignService | 최적화 추천 → 설정 영향 |
| `validates` | GAQL D+1 → CampaignService 실시간 | 전일 확정값으로 정합성 검증 |
| `real-time-of` | CampaignService → GAQL | 동일 메트릭의 시간 해상도 차이 |
| `breaks-down-by` | PersonaService → AudienceService | 오디언스 페르소나 분해 |
| `cross-domain-of` | 내부 gRPC-Web ↔ 공식 REST | 동일 메트릭, 다른 시스템 |

### 수집 주기

| 주기 | API | 근거 |
|------|-----|------|
| 5~10분 | CampaignService/List (28 메트릭) | 실시간 확인됨. 광고비 이상 감지 |
| 1일 1회 | OverviewService, AdGroupAdService, GAQL YESTERDAY | 일간 집계/검증 |
| 1주 1회 | InsightService, SuggestionService, Audience, ChangeHistory, CtCustomer | 변동 드묾 |
| 제외 | 공통 8개 + 운영 6개 | 인프라성 API |

## 💡 실용적 평가 / 적용

**장점**
- 유일한 실시간 광고 성과 모니터링 수단 (공식 API는 D+1만)
- 28개 메트릭 동시 수집 (impressions/clicks/cost/conversions 포함)
- 개요 대시보드 전체 카드 구조 캡처 가능

**한계**
- protobuf 숫자 키 구조 → 파싱 복잡, 스키마 변경 시 깨짐 위험
- 비공개 API — 버전 관리 없고, 사전 공지 없이 변경 가능
- 전환(conversions)은 어트리뷰션 윈도우(최대 90일)로 소급 조정됨 → 실시간 값 5~20% 오차
- URL dateRange 파라미터 무효 — 서버 세션 기반 날짜 관리

**vs 다른 플랫폼**
- Meta Ads: REST JSON + access_token → 상대적으로 파싱 쉬움
- TikTok: REST JSON → 가장 표준적
- Google Ads: gRPC-Web protobuf → 가장 파싱 어려움, 그러나 실시간 성능 최고

## 🔗 관련 개념

- [[REF-079 6개 플랫폼 SNS API 비교 분석 및 자동화 전략]] - (Google Ads를 포함한 크로스플랫폼 API 비교 전략의 일부)
- [[REF-099 Facebook Ads Manager 내부 API 구조 분석]] - (동일 패턴의 Meta Ads am_tabular 분석 — 내부 API 리버스엔지니어링 비교)
- [[SNS 게시물별 조회수 추적]] - (Google Ads 수집기가 속하는 상위 프로젝트)
- [[SNS 기초 데이터 수집 자동화]] - (Playwright 수집 파이프라인 아키텍처)

---

**작성일**: 2026-03-13
**분류**: API 분석 / 데이터 수집 / Google Ads
**소스**: google_ads_all_tabs.json + google_ads_today.json (Playwright 캡처) + Google Ads API v23 공식문서