---
title: 일반 CS 개념
type: hub
tags:
- hub
- cs
- computer-science
- networking
permalink: hubs/general-cs-1
---

# 일반 CS 개념 (General Computer Science)

다른 카테고리에 속하지 않는 **기본 컴퓨터 과학 개념**들.

---

## Observations

### 핵심 인사이트

> "CS의 기초는 **추상화**다. 복잡한 것을 단순한 인터페이스로 감추는 것."

- [insight] **API 통신 = 주소 + 데이터**: Endpoint(WHERE) + Payload(WHAT)
- [insight] 추상화 계층: 각 계층은 하위 복잡성을 숨기고 간단한 인터페이스만 노출
- [tip] API 디버깅 시 항상 Endpoint와 Payload를 분리해서 검토

### 학습 경로

[path] 기초 개념 (추상화) → API 구조 (Endpoint) → 데이터 전달 (Payload) → 실전 활용

### 인덱싱 (루만식)

- [index:1] [[Endpoint]] - API 접근점, 요청을 어디로 보낼지 (시작점)
- [index:1a] [[URL-structure]] - URL 구조와 경로
- [index:1b] [[HTTP-methods]] - GET, POST, PUT, DELETE 메서드
- [index:1c] [[API-versioning]] - API 버전 관리 (v1, v2)
- [index:2] [[Payload]] - 요청/응답의 본문 데이터
- [index:2a] [[request-payload]] - 요청 본문 구조
- [index:2b] [[response-payload]] - 응답 본문 구조
- [index:2c] [[content-type]] - JSON, XML 등 데이터 형식
- [index:3] [[Abstraction]] - 추상화 개념
- [index:3a] [[layered-architecture]] - 계층적 아키텍처
- [index:3b] [[interface-design]] - 인터페이스 설계 원칙

---

## Relations

### 관리하는 노트들

- organizes [[Endpoint]]
- organizes [[Payload]]
- organizes [[URL-structure]]
- organizes [[HTTP-methods]]
- organizes [[API-versioning]]
- organizes [[request-payload]]
- organizes [[response-payload]]
- organizes [[content-type]]
- organizes [[Abstraction]]
- organizes [[layered-architecture]]
- organizes [[interface-design]]

### 다른 허브와의 연결

- connects_to [[web-fundamentals]] (HTTP, REST API 통신 기반)
- connects_to [[programming-basics]] (API 개념과 구현)
- connects_to [[metabase-patterns]] (Metabase API 활용)