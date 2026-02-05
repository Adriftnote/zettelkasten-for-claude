---
title: 웹 기초
type: hub
tags:
- hub
- web
- html
- css
- javascript
- http
- zettelkasten
- basic-memory
permalink: hubs/web-fundamentals
---

# 웹 기초 (Web Fundamentals)

**문서(HTML)**와 **스타일(CSS)**과 **동작(JS)**의 조합이 **HTTP 프로토콜**을 통해 브라우저와 서버 사이를 오간다. 웹의 본질은 하이퍼링크로 연결된 문서다.

## Observations

- [fact] 웹의 본질은 하이퍼링크로 연결된 문서 - 나머지는 모두 그 위에 쌓인 레이어 #web
- [fact] HTML은 구조, CSS는 표현, JS는 동작 - 관심사 분리의 전형 #separation-of-concerns
- [fact] SOP는 웹 보안의 근간, CORS는 그 예외를 허용하는 메커니즘 #security
- [fact] Chrome Extension은 웹 페이지 위에서 동작하는 별도의 실행 컨텍스트 #extension

## Relations

- organizes [[HTML (HyperText Markup Language)]] (1. 웹 문서의 구조 정의)
  - extends [[DOM (Document Object Model)]] (1a. HTML의 프로그래밍 인터페이스)
  - extends [[iframe (Inline Frame)]] (1b. 문서 안의 문서)
- organizes [[CSS (Cascading Style Sheets)]] (2. 시각적 표현과 스타일링)
- organizes [[JavaScript (JS)]] (3. 동적 동작과 상호작용)
- organizes [[HTTP Header]] (4. 웹 통신의 요청/응답 메타데이터)
  - extends [[HTTP Methods]] (4a. GET, POST, PUT, DELETE 등 통신 방법)
  - extends [[HTTP Status Codes]] (4b. 200, 404, 500 등 상태 응답)
  - extends [[Web Communication]] (4c. 브라우저-서버 간 통신의 전체 그림)
- organizes [[Same-Origin Policy (동일 출처 정책)]] (5. 웹 보안의 기본 정책)
  - extends [[CORS (Cross-Origin Resource Sharing)]] (5a. 교차 출처 리소스 공유 메커니즘)
- organizes [[Chrome Extension]] (6. 브라우저 기능 확장)
  - extends [[Content Script]] (6a. 웹 페이지에 주입되는 스크립트)
  - extends [[Background Script (Service Worker)]] (6b. 백그라운드 실행 환경)
- connects_to [[programming-basics]] (JS는 프로그래밍 언어)
- connects_to [[encoding-systems]] (웹은 UTF-8이 표준)