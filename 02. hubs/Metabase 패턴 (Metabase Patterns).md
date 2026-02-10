---
title: Metabase 패턴
type: hub
tags:
- hub
- metabase
- bi
- dashboard
- pattern
permalink: hubs/metabase-patterns
---

# Metabase 패턴

Metabase BI 도구 사용 시 자주 마주치는 **UI 패턴**과 **설정 방법**들.

---

## Observations

- [fact] Metabase는 SQL 없이 데이터 탐색 가능 - 고급 기능은 SQL과 API 필요 #metabase
- [fact] 드롭다운 필터는 template-tags와 parameters 둘 다 설정 필요 #filter
- [fact] 카드 제목에 변수 사용 시 특정 문법 필요 #variables

## Relations

- organizes [[dropdown-filter-pattern]] (1. 드롭다운 필터 구현)
  - part_of [[template-tags-setup]] (1a. template-tags 설정)
  - part_of [[parameters-configuration]] (1b. parameters 설정)
- organizes [[model-configuration-pattern]] (2. 모델 기반 필터 설정)
  - extends [[model-reusability]] (2a. 모델 재사용 전략)
- organizes [[using-variables-in-card-titles]] (3. 카드 제목에 변수 사용)
  - extends [[dynamic-titles]] (3a. 동적 제목 구현)
- organizes [[text-card-addition-pattern]] (4. 텍스트 카드 추가)
- organizes [[server-selection-pattern]] (5. 서버 선택 패턴)
- connects_to [[웹 기초 (Web Fundamentals)]] (Metabase는 웹 앱, HTTP 기반)
- connects_to [[아키텍처 (Architectures)]] (BI 대시보드 아키텍처)
- connects_to [[일반 CS 개념 (General CS)]] (API와 Endpoint 개념)