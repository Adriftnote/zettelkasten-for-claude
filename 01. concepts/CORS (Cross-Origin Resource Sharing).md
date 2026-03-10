---
title: CORS (Cross-Origin Resource Sharing)
type: concept
permalink: knowledge/concepts/cors
tags:
- web-basics
- concepts
- web-security
category: 웹 보안
difficulty: 중급
---

# CORS (Cross-Origin Resource Sharing)

다른 출처(Origin)의 리소스를 안전하게 요청할 수 있게 해주는 [[HTTP Header|HTTP 헤더]] 기반 메커니즘입니다.

## 📖 개요

브라우저는 보안상 [[Same-Origin Policy (동일 출처 정책)|Same-Origin Policy]]를 적용해 **다른 출처로의 요청을 기본적으로 차단**합니다. CORS는 서버가 "이 출처에서 오는 요청은 허용한다"고 명시적으로 선언하는 방법입니다.

```
내 사이트 (mysite.com)
    ↓ fetch 요청
다른 사이트 (api.example.com)
    ↓
🚫 브라우저가 차단! → CORS 헤더 있으면 ✅ 허용
```

## 🎭 비유

외국에 입국할 때 **비자**와 같습니다. 서버(국가)가 "이 출처(국적)의 요청은 허용한다"는 허가증을 발급해야 브라우저(입국심사)가 통과시켜 줍니다.

## ✨ 특징

- **서버 측 설정**: 서버가 허용 여부를 결정
- **브라우저 측 적용**: 브라우저가 헤더를 확인하고 차단/허용
- **Preflight 요청**: 복잡한 요청 전 OPTIONS로 먼저 확인
- **자격 증명**: 쿠키/인증 정보 포함 여부 별도 설정

## 💡 예시

**CORS 에러 발생**:
```javascript
// mysite.com에서 실행
fetch('https://api.example.com/data')
  .then(res => res.json())
// ❌ CORS 에러: No 'Access-Control-Allow-Origin' header
```

**서버에서 CORS 허용**:
```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://mysite.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type
```

**주요 CORS 헤더**:

| 헤더 | 역할 |
|------|------|
| `Access-Control-Allow-Origin` | 허용할 출처 (`*` = 모두) |
| `Access-Control-Allow-Methods` | 허용할 HTTP 메서드 |
| `Access-Control-Allow-Headers` | 허용할 요청 헤더 |
| `Access-Control-Allow-Credentials` | 쿠키 포함 허용 여부 |

**우회 방법**:

| 방법 | 설명 |
|------|------|
| 서버 설정 | 서버에서 CORS 헤더 추가 (정석) |
| 프록시 서버 | 같은 출처의 서버를 경유 |
| [[Background Script (Service Worker)|Background Script]] | Chrome Extension 권한 활용 |

## Relations

- implements [[http-header]]
- extends [[same-origin-policy]]
- relates_to [[content-script]]
- relates_to [[Background Script (Service Worker)]]
- relates_to [[iframe (Inline Frame)]]

---

**난이도**: 중급
**카테고리**: 웹 보안
**마지막 업데이트**: 2026년 1월