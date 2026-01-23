---
title: Metabase 패턴
type: hub
tags:
- hub
- metabase
- bi
- dashboard
- pattern
permalink: hubs/metabase-patterns-1
---

# Metabase 패턴

Metabase BI 도구 사용 시 자주 마주치는 **UI 패턴**과 **설정 방법**들.

---

## Observations

### 핵심 인사이트

> "Metabase는 **SQL 없이** 데이터를 탐색할 수 있게 해준다. 하지만 고급 기능은 SQL과 API를 알아야 한다."

- [insight] 드롭다운 필터는 **template-tags**와 **parameters** 둘 다 설정 필요 (흔한 실수)
- [insight] 카드 제목에 변수 사용 시 특정 문법 필요 (`[[변수]]` 형식)
- [tip] 모델(Model)을 활용하면 복잡한 필터를 깔끔하게 재사용 가능

### 학습 경로

[path] 기초 (카드 생성) → 필터링 → 모델 활용 → 변수 동적화 → 고급 SQL

### 인덱싱 (루만식)

- [index:1] [[dropdown-filter-pattern]] - 드롭다운 필터 구현 (시작점)
- [index:1a] [[template-tags-setup]] - template-tags 설정
- [index:1b] [[parameters-configuration]] - parameters 설정
- [index:2] [[model-configuration-pattern]] - 모델 기반 필터 설정
- [index:2a] [[model-reusability]] - 모델 재사용 전략
- [index:3] [[using-variables-in-card-titles]] - 카드 제목에 변수 사용
- [index:3a] [[dynamic-titles]] - 동적 제목 구현
- [index:4] [[text-card-addition-pattern]] - 텍스트 카드 추가
- [index:5] [[server-selection-pattern]] - 서버 선택 패턴

---

## Relations

### 관리하는 노트들

- organizes [[dropdown-filter-pattern]]
- organizes [[model-configuration-pattern]]
- organizes [[using-variables-in-card-titles]]
- organizes [[text-card-addition-pattern]]
- organizes [[server-selection-pattern]]
- organizes [[template-tags-setup]]
- organizes [[parameters-configuration]]
- organizes [[model-reusability]]
- organizes [[dynamic-titles]]

### 다른 허브와의 연결

- connects_to [[web-fundamentals]] (Metabase는 웹 앱, HTTP 기반)
- connects_to [[architectures]] (BI 대시보드 아키텍처)
- connects_to [[general-cs]] (API와 Endpoint 개념)