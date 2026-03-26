---
title: config
type: note
permalink: modules/config
level: high
category: code/modules
semantic: module
path: internal/config/config.go
tags:
- module
- go
- yaml
- config
---

## 역할
platform_config.yaml 파싱 + PlatformConfig 구조체 제공

## 경로
`internal/config/config.go`

## 구조체
- `PlatformConfig` — 플랫폼별 메타데이터 (테이블명, 컬럼, 지표, QueryMode)
- `TitleSource` — 제목 소스 설정 (Inline 여부, JOIN 테이블/컬럼)
- `MetricMapping` — 지표 매핑 (DB 컬럼 → 표시 이름)
- `Config` — 전체 설정 (Platforms map)

## 함수
- `Load` — YAML 파일 로드 → Config 구조체
- `ByKey` — 플랫폼 키로 PlatformConfig 조회
- `ByCategory` — 카테고리(organic/ads)별 플랫폼 목록
- `PrimaryMetric` — 플랫폼의 주요 지표 반환

## Relations
- part_of [[MOT 실시간 대시보드]]
- contains [[load]]
- contains [[by-key]]
- contains [[by-category]]
- contains [[primary-metric]]

## Observations
- [impl] goccy/go-yaml 사용 (gopkg.in/yaml.v3 대신) #deps
- [impl] QueryMode 필드로 쿼리 전략 선택: snapshot_diff, snapshot_cumulative, pre_aggregated, ads_campaign #pattern
- [impl] TitleSource.Inline=true이면 스냅샷 테이블에 title 존재 (별도 JOIN 불필요) #pattern