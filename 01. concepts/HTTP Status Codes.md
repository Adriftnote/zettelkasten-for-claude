---
title: HTTP Status Codes
type: concept
permalink: knowledge/concepts/http-status-codes
tags:
- web-basics
- concepts
- http
- api
category: 웹 개발
difficulty: 초급
---

# HTTP Status Codes

서버가 **요청 처리 결과를 나타내는 3자리 숫자 코드**입니다.

## 📖 개요

HTTP 상태 코드는 서버의 응답 상태를 표준화된 숫자로 나타냅니다.

```
클라이언트: "로그인 요청"
    ↓
서버: "200 OK" (성공!)
      "401 Unauthorized" (로그인 필요)
      "500 Server Error" (서버 오류)
```

첫 번째 자리 숫자로 **5가지 카테고리**를 구분합니다.

> [!important] 국제 표준
> HTTP 상태 코드는 **RFC 문서**에 정의된 국제 표준입니다. 전 세계 모든 웹 서버가 동일한 코드를 사용합니다.

## 🎭 비유

**신호등 시스템**과 같습니다:

```
🟢 2xx (초록불): 통과! (성공)
🟡 3xx (노란불): 다른 곳으로 (리다이렉트)
🔴 4xx (빨간불): 멈춤! 당신 문제 (클라이언트 오류)
🔴 5xx (빨간불): 멈춤! 우리 문제 (서버 오류)
```

## 📊 5가지 카테고리

| 범위 | 의미 | 설명 | 예시 |
|------|------|------|------|
| **1xx** | 정보 응답 | "처리 중이에요..." | 100 Continue |
| **2xx** | 성공 | "✅ 성공했어요!" | 200 OK |
| **3xx** | 리다이렉트 | "→ 다른 곳으로 가세요" | 301 Moved |
| **4xx** | 클라이언트 오류 | "❌ 당신이 잘못했어요" | 404 Not Found |
| **5xx** | 서버 오류 | "💥 제가 잘못했어요" | 500 Server Error |

## ✨ 자주 쓰이는 코드

### 2xx: 성공 ✅

| 코드 | 이름 | 의미 | 사용 상황 |
|------|------|------|----------|
| **200** | OK | 일반적인 성공 | GET, PUT 성공 |
| **201** | Created | 생성 성공 | POST로 새 데이터 생성 |
| **204** | No Content | 성공했지만 반환할 내용 없음 | DELETE 성공 |

```javascript
// 200 OK
GET /api/users/123
→ HTTP/1.1 200 OK
  {"id": 123, "name": "홍길동"}

// 201 Created
POST /api/users
→ HTTP/1.1 201 Created
  {"id": 456, "name": "김철수"}

// 204 No Content
DELETE /api/users/123
→ HTTP/1.1 204 No Content
  (본문 없음)
```

### 3xx: 리다이렉트 ↪️

| 코드 | 이름 | 의미 | 사용 상황 |
|------|------|------|----------|
| **301** | Moved Permanently | 영구 이동 | URL이 완전히 바뀜 |
| **302** | Found | 임시 이동 | 일시적으로 다른 URL |
| **304** | Not Modified | 수정되지 않음 | 캐시 사용 가능 |

```javascript
// 301 Moved Permanently
GET http://example.com/old-page
→ HTTP/1.1 301 Moved Permanently
  Location: http://example.com/new-page
  (브라우저가 자동으로 새 URL로 이동)

// 304 Not Modified (캐시 활용)
GET /api/data
If-Modified-Since: Mon, 01 Jan 2024 00:00:00 GMT
→ HTTP/1.1 304 Not Modified
  (브라우저가 저장된 캐시 사용)
```

### 4xx: 클라이언트 오류 ❌

| 코드 | 이름 | 의미 | 사용 상황 |
|------|------|------|----------|
| **400** | Bad Request | 요청 형식 오류 | 필수 필드 없음, 형식 틀림 |
| **401** | Unauthorized | 인증 필요 | 로그인 필요 |
| **403** | Forbidden | 권한 없음 | 접근 금지 |
| **404** | Not Found | 리소스 없음 | 페이지/데이터 없음 |
| **405** | Method Not Allowed | 메서드 불가 | GET만 되는데 POST 시도 |
| **409** | Conflict | 충돌 | 이미 존재하는 데이터 |
| **429** | Too Many Requests | 요청 과다 | Rate Limit 초과 |

```javascript
// 400 Bad Request
POST /api/users
{"name": "홍길동"}  // email 필수인데 없음
→ HTTP/1.1 400 Bad Request
  {"error": "email is required"}

// 401 Unauthorized
GET /api/profile
(Authorization 헤더 없음)
→ HTTP/1.1 401 Unauthorized
  {"error": "Authentication required"}

// 403 Forbidden
DELETE /api/users/1
(관리자 권한 필요)
→ HTTP/1.1 403 Forbidden
  {"error": "Admin access required"}

// 404 Not Found
GET /api/users/999
(존재하지 않는 ID)
→ HTTP/1.1 404 Not Found
  {"error": "User not found"}

// 429 Too Many Requests
(1분에 100번 요청 제한인데 초과)
→ HTTP/1.1 429 Too Many Requests
  Retry-After: 60
  {"error": "Rate limit exceeded"}
```

### 5xx: 서버 오류 💥

| 코드 | 이름 | 의미 | 사용 상황 |
|------|------|------|----------|
| **500** | Internal Server Error | 서버 내부 오류 | 코드 버그, 예외 발생 |
| **502** | Bad Gateway | 게이트웨이 오류 | 프록시/로드밸런서 오류 |
| **503** | Service Unavailable | 서비스 불가 | 서버 과부하/점검 중 |
| **504** | Gateway Timeout | 게이트웨이 타임아웃 | 상위 서버 응답 지연 |

```javascript
// 500 Internal Server Error
GET /api/users
(서버에서 예외 발생)
→ HTTP/1.1 500 Internal Server Error
  {"error": "Internal server error"}

// 503 Service Unavailable
GET /api/data
(서버 점검 중)
→ HTTP/1.1 503 Service Unavailable
  Retry-After: 3600
  {"error": "Service maintenance"}
```

## 🎨 재미있는 코드들

### 418 I'm a teapot 🫖

```
418 I'm a teapot  → "저는 찻주전자예요"
```

**1998년 만우절 농담**으로 만들어진 코드인데, 실제 표준(RFC 2324)에 들어갔습니다!

```javascript
// Google에서도 실제로 사용
GET https://www.google.com/teapot

HTTP/1.1 418 I'm a teapot
```

**의미**: 커피포트에게 차를 끓이라고 요청하면 거부한다는 농담.

### 420 Enhance Your Calm

```
420 Enhance Your Calm  → "진정하세요"
```

Twitter(현 X)가 비공식적으로 사용했던 코드입니다. 너무 많이 요청하면 "좀 천천히 하세요"라는 의미로 사용했습니다.

### 451 Unavailable For Legal Reasons

```
451 Unavailable For Legal Reasons  → "법적 이유로 접근 불가"
```

정부 검열이나 저작권 때문에 막힌 경우입니다.
**451**은 레이 브래드버리의 소설 **"화씨 451도"**(책을 불태우는 디스토피아)에서 따온 숫자입니다.

```javascript
GET /censored-content
→ HTTP/1.1 451 Unavailable For Legal Reasons
  {"error": "Blocked by government order"}
```

## 💡 실전 예시

### 1. 로그인 흐름

```javascript
// ① 로그인 시도
POST /api/login
{
  "email": "hong@example.com",
  "password": "1234"
}

// ② 성공
HTTP/1.1 200 OK
{
  "success": true,
  "token": "jwt_token_here",
  "userId": 123
}

// ③ 비밀번호 틀림
HTTP/1.1 401 Unauthorized
{
  "success": false,
  "error": "Invalid password"
}

// ④ 계정 정지됨
HTTP/1.1 403 Forbidden
{
  "success": false,
  "error": "Account suspended"
}

// ⑤ 필수 필드 없음
POST /api/login
{"email": "hong@example.com"}  // password 없음

HTTP/1.1 400 Bad Request
{
  "success": false,
  "error": "password is required"
}
```

### 2. CRUD 작업별 코드

```javascript
// Create (생성)
POST /api/posts
{"title": "새 글", "content": "..."}
→ 201 Created

// Read (조회)
GET /api/posts/123
→ 200 OK

// Update (수정)
PUT /api/posts/123
{"title": "수정된 글"}
→ 200 OK

// Delete (삭제)
DELETE /api/posts/123
→ 204 No Content
```

### 3. 파일 업로드

```javascript
// ① 정상 업로드
POST /api/upload
(파일 데이터)
→ HTTP/1.1 201 Created
  Location: /files/12345
  {"id": 12345, "url": "https://cdn.example.com/file.jpg"}

// ② 파일 너무 큼
POST /api/upload
(50MB 파일, 제한: 10MB)
→ HTTP/1.1 413 Payload Too Large
  {"error": "File size exceeds 10MB limit"}

// ③ 지원 안 하는 형식
POST /api/upload
(example.exe 파일)
→ HTTP/1.1 415 Unsupported Media Type
  {"error": "Only JPEG and PNG allowed"}
```

### 4. API Rate Limit

```javascript
// ① 정상 요청
GET /api/data
→ HTTP/1.1 200 OK
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 99

// ② 100번째 요청
GET /api/data
→ HTTP/1.1 200 OK
  X-RateLimit-Remaining: 0

// ③ 101번째 요청 (초과)
GET /api/data
→ HTTP/1.1 429 Too Many Requests
  Retry-After: 3600
  {"error": "Rate limit exceeded. Try again in 1 hour"}
```

## 💻 서버 코드 예시

### Express.js에서 적절한 코드 반환

```javascript
const express = require('express');
const app = express();

app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;

    // 400 Bad Request (필수 필드 없음)
    if (!name || !email) {
      return res.status(400).json({
        error: 'name and email are required'
      });
    }

    // 409 Conflict (이미 존재)
    const exists = await db.findUserByEmail(email);
    if (exists) {
      return res.status(409).json({
        error: 'User with this email already exists'
      });
    }

    // 201 Created (성공)
    const user = await db.createUser({ name, email });
    return res.status(201).json(user);

  } catch (error) {
    // 500 Internal Server Error
    console.error('Error creating user:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
});

app.get('/api/users/:id', async (req, res) => {
  const user = await db.findUser(req.params.id);

  // 404 Not Found
  if (!user) {
    return res.status(404).json({
      error: 'User not found'
    });
  }

  // 200 OK
  return res.status(200).json(user);
});

app.delete('/api/users/:id', async (req, res) => {
  // 401 Unauthorized (인증 필요)
  if (!req.headers.authorization) {
    return res.status(401).json({
      error: 'Authentication required'
    });
  }

  // 403 Forbidden (권한 없음)
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Admin access required'
    });
  }

  await db.deleteUser(req.params.id);

  // 204 No Content (삭제 성공, 반환 데이터 없음)
  return res.status(204).send();
});
```

## 🖥️ 클라이언트 코드 예시

### 상태 코드별 처리

```javascript
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // 상태 코드별 분기 처리
    switch (response.status) {
      case 200:
        // 성공
        const data = await response.json();
        return data;

      case 401:
        // 인증 필요 → 로그인 페이지로
        alert('로그인이 필요합니다');
        window.location.href = '/login';
        break;

      case 403:
        // 권한 없음
        alert('이 데이터에 접근할 권한이 없습니다');
        break;

      case 404:
        // 데이터 없음
        alert('사용자를 찾을 수 없습니다');
        break;

      case 429:
        // Rate Limit 초과
        const retryAfter = response.headers.get('Retry-After');
        alert(`요청이 너무 많습니다. ${retryAfter}초 후 다시 시도하세요`);
        break;

      case 500:
      case 502:
      case 503:
        // 서버 오류
        alert('서버 오류가 발생했습니다. 잠시 후 다시 시도하세요');
        break;

      default:
        alert(`알 수 없는 오류: ${response.status}`);
    }

  } catch (error) {
    // 네트워크 오류 (응답 자체가 없음)
    console.error('Network error:', error);
    alert('네트워크 연결을 확인하세요');
  }
}

// response.ok 활용 (200~299 체크)
async function simpleFetch(url) {
  const response = await fetch(url);

  if (!response.ok) {
    // 200번대가 아니면 에러
    throw new Error(`HTTP error: ${response.status}`);
  }

  return response.json();
}
```

## 🔍 브라우저에서 확인

### Chrome DevTools (F12 → Network 탭)

```
Name          Status      Type      Size      Time
─────────────────────────────────────────────────────
login         200 OK      fetch     125 B     45ms    🟢
users         404         fetch     42 B      12ms    🔴
profile       401         fetch     67 B      23ms    🔴
image.jpg     304         img       (cached)  8ms     ⚪
data          500         fetch     156 B     89ms    🔴
```

**색상 의미:**
- 🟢 초록색 (200~299): 성공
- 🔴 빨간색 (400~599): 오류
- ⚪ 회색 (300~399): 리다이렉트/캐시

**상세 정보 확인:**
```
Headers 탭:
  Status Code: 400 Bad Request

Response 탭:
  {"error": "email is required"}

Preview 탭:
  (JSON 포맷팅된 응답)
```

## 📚 표준 문서

HTTP 상태 코드는 **RFC (Request for Comments)** 문서에 정의되어 있습니다:

- **RFC 7231**: HTTP/1.1 Semantics and Content
- **RFC 2616**: HTTP/1.1 (구버전)
- **RFC 2324**: HTCPCP/1.0 (418 I'm a teapot)

**주소**: https://www.rfc-editor.org/rfc/rfc7231#section-6

```
전 세계 모든 웹 서버가 이 표준을 따릅니다:
- Apache
- Nginx
- IIS (Microsoft)
- Node.js (Express, Fastify 등)
- Python (Django, Flask)
- Java (Spring, Tomcat)
- Go, Ruby, PHP...
```

## 🎯 상태 코드 선택 가이드

### 성공 케이스

```
GET 요청 성공           → 200 OK
POST로 생성 성공        → 201 Created
PUT으로 수정 성공       → 200 OK
DELETE로 삭제 성공      → 204 No Content
PATCH로 부분 수정 성공  → 200 OK
```

### 클라이언트 오류 케이스

```
필수 필드 없음          → 400 Bad Request
형식 오류 (이메일 등)   → 400 Bad Request
인증 필요              → 401 Unauthorized
권한 없음              → 403 Forbidden
리소스 없음            → 404 Not Found
이미 존재함            → 409 Conflict
요청 너무 많음         → 429 Too Many Requests
```

### 서버 오류 케이스

```
코드 버그/예외         → 500 Internal Server Error
DB 연결 실패           → 500 Internal Server Error
타임아웃              → 504 Gateway Timeout
서버 점검 중           → 503 Service Unavailable
```

## 💡 실전 팁

### 1. 일관성 유지

```javascript
// ✅ 좋은 예: 일관된 에러 형식
{
  "error": "User not found",
  "code": "USER_NOT_FOUND",
  "status": 404
}

// ❌ 나쁜 예: 중구난방
"Error: not found"  // 단순 문자열
```

### 2. 의미 있는 메시지

```javascript
// ✅ 좋은 예
HTTP/1.1 400 Bad Request
{
  "error": "Invalid email format",
  "field": "email",
  "value": "invalid-email"
}

// ❌ 나쁜 예
HTTP/1.1 400 Bad Request
{
  "error": "Bad request"  // 너무 모호함
}
```

### 3. Rate Limit 정보 제공

```javascript
// 헤더로 제한 정보 제공
HTTP/1.1 200 OK
X-RateLimit-Limit: 100        // 시간당 최대 요청 수
X-RateLimit-Remaining: 95     // 남은 요청 수
X-RateLimit-Reset: 1640000000 // 리셋 시간 (Unix timestamp)

// 초과 시
HTTP/1.1 429 Too Many Requests
Retry-After: 3600             // 재시도까지 초 단위
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
```

## 📊 전체 코드 요약

### 꼭 알아야 할 코드 ⭐

```
200 OK               ← 가장 흔한 성공
201 Created          ← POST 성공
204 No Content       ← DELETE 성공
400 Bad Request      ← 요청 오류
401 Unauthorized     ← 인증 필요
403 Forbidden        ← 권한 없음
404 Not Found        ← 가장 유명한 에러
500 Server Error     ← 서버 오류
```

### 알면 유용한 코드 📚

```
301 Moved Permanently
302 Found
304 Not Modified
409 Conflict
429 Too Many Requests
502 Bad Gateway
503 Service Unavailable
```

### 재미로 알아두기 😄

```
418 I'm a teapot
420 Enhance Your Calm
451 Unavailable For Legal Reasons
```

## Relations

- used_by [[Web Communication]]
- part_of [[Endpoint]]
- part_of [[Payload]]
- part_of [[API (Application Programming Interface)]]

## 📖 참고 자료

- MDN Web Docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
- HTTP Status Codes 전체 목록: https://httpstatuses.com/
- HTTP Cats (재미): https://http.cat/
- HTTP Dogs (재미): https://httpstatusdogs.com/

---

**난이도**: 초급
**카테고리**: 웹 개발
**마지막 업데이트**: 2026년 1월
