---
title: HTTP Methods
type: concept
permalink: knowledge/concepts/http-methods
tags:
- web-basics
- concepts
- http
- api
- network
category: 웹 개발
difficulty: 초급
---

# HTTP Methods

HTTP 요청에서 **"어떤 동작을 할 것인가"**를 지정하는 동사입니다. 서버에게 "이 데이터를 조회해줘", "새로 만들어줘", "삭제해줘" 같은 명령을 전달합니다.

## 📖 개요

HTTP Method는 **클라이언트가 서버에게 보내는 행동 지시**입니다.

```
HTTP 요청 구조:

Method + Endpoint + Payload
  ↓         ↓          ↓
POST   /api/users   {name: "홍길동"}
"만들어"  "어디에"     "이 데이터로"
```

> [!important] 핵심
> HTTP Method는 **전 세계 공통 표준**(RFC 9110)입니다. 한국이든 미국이든 모두 똑같이 사용합니다.

## 🎭 비유

**도서관 사서에게 주는 명령**과 같습니다:

```
GET    → "책 목록 보여주세요" (조회만)
POST   → "새 책 등록해주세요" (신규 추가)
PUT    → "이 책 정보를 전부 이걸로 바꿔주세요" (전체 교체)
PATCH  → "이 책의 제목만 고쳐주세요" (부분 수정)
DELETE → "이 책 삭제해주세요" (제거)
HEAD   → "책 목록만 보여주세요 (내용은 빼고)" (메타데이터만)
OPTIONS → "어떤 작업이 가능한가요?" (지원 메서드 확인)
```

## ✨ 특징

- **표준화**: IETF RFC 9110로 국제 표준 정의
- **명확성**: 각 메서드마다 명확한 의미와 규칙
- **멱등성**: 일부 메서드는 여러 번 실행해도 결과 동일
- **CRUD 매핑**: 데이터베이스 작업과 1:1 대응

## 📊 주요 5가지 Methods (CRUD)

### 데이터베이스 작업과 매핑

| DB 작업 | HTTP Method | 의미 |
|---------|-------------|------|
| **C**reate | POST | 생성 |
| **R**ead | GET | 조회 |
| **U**pdate | PUT / PATCH | 수정 |
| **D**elete | DELETE | 삭제 |

## 💡 메서드별 상세 설명

### 1. GET (조회)

**"데이터를 보여줘"** - 가져오기만 하고 변경하지 않음

```javascript
// 사용자 목록 조회
fetch('https://api.example.com/users')
  .then(res => res.json())
  .then(users => console.log(users))

// 특정 사용자 조회
fetch('https://api.example.com/users/123')

// 검색 (쿼리 파라미터)
fetch('https://api.example.com/search?q=JavaScript&sort=date')
```

**HTTP 요청 예시:**
```http
GET /users/123 HTTP/1.1
Host: api.example.com
Accept: application/json

(Body 없음)
```

**응답:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 123,
  "name": "홍길동",
  "email": "hong@example.com"
}
```

**특징:**
- ✅ URL에 데이터 포함 (쿼리 스트링)
- ✅ Body 없음
- ✅ 캐싱 가능
- ✅ 브라우저 히스토리에 남음
- ✅ 북마크 가능
- ✅ 멱등성 O (같은 요청 반복해도 결과 동일)
- ✅ 안전성 O (서버 데이터 변경 안 함)

**언제 사용:**
- 웹페이지 로드
- 데이터 조회/검색
- 이미지/파일 다운로드

---

### 2. POST (생성)

**"새로운 데이터를 만들어줘"**

```javascript
// 회원가입
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: '홍길동',
    email: 'hong@example.com',
    password: 'secure123'
  })
})

// 게시글 작성
fetch('https://api.example.com/posts', {
  method: 'POST',
  body: JSON.stringify({
    title: '첫 게시글',
    content: '안녕하세요!'
  })
})
```

**HTTP 요청 예시:**
```http
POST /users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Content-Length: 78

{
  "name": "홍길동",
  "email": "hong@example.com",
  "password": "secure123"
}
```

**응답:**
```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /users/124

{
  "id": 124,
  "name": "홍길동",
  "email": "hong@example.com",
  "createdAt": "2026-01-20T10:30:00Z"
}
```

**특징:**
- ✅ Body에 데이터 포함
- ❌ 멱등성 X (같은 요청 반복하면 새 데이터 계속 생성)
- ❌ 캐싱 안 됨
- ❌ 안전성 X (서버 데이터 변경)

**언제 사용:**
- 회원가입
- 게시글/댓글 작성
- 파일 업로드
- 로그인 (세션 생성)

---

### 3. PUT (전체 수정)

**"데이터를 통째로 교체해줘"**

```javascript
// 사용자 정보 전체 수정
fetch('https://api.example.com/users/123', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: '홍길동',
    email: 'newemail@example.com',
    age: 30,
    address: '서울시 강남구',
    phone: '010-1234-5678'
    // 모든 필드를 다시 보냄
  })
})
```

**HTTP 요청 예시:**
```http
PUT /users/123 HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
  "name": "홍길동",
  "email": "newemail@example.com",
  "age": 30,
  "address": "서울시 강남구",
  "phone": "010-1234-5678"
}
```

**특징:**
- ✅ 리소스 **전체**를 새 데이터로 교체
- ✅ 멱등성 O (같은 요청 반복해도 결과 동일)
- ⚠️ 누락된 필드는 삭제되거나 기본값으로 초기화될 수 있음

**언제 사용:**
- 프로필 전체 수정
- 설정 전체 재설정
- 문서 전체 덮어쓰기

---

### 4. PATCH (부분 수정)

**"일부만 고쳐줘"**

```javascript
// 이메일만 수정
fetch('https://api.example.com/users/123', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'newemail@example.com'
    // 수정할 필드만 보냄
  })
})

// 좋아요 +1
fetch('https://api.example.com/posts/456', {
  method: 'PATCH',
  body: JSON.stringify({
    likes: 101
  })
})
```

**HTTP 요청 예시:**
```http
PATCH /users/123 HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
  "email": "newemail@example.com"
}
```

**응답:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 123,
  "name": "홍길동",
  "email": "newemail@example.com",  // 변경됨
  "age": 30,                         // 유지
  "address": "서울시 강남구"         // 유지
}
```

**특징:**
- ✅ 리소스의 **일부**만 수정
- ✅ PUT보다 효율적 (네트워크 비용 절감)
- △ 멱등성 △ (구현에 따라 다름)

**PUT vs PATCH:**
```javascript
// PUT: 전체 교체
PUT /users/123
{
  name: "홍길동",
  email: "new@example.com",
  age: 30,
  address: "서울시"
}
// → 모든 필드 다시 보내야 함

// PATCH: 부분 수정
PATCH /users/123
{
  email: "new@example.com"
}
// → 바꿀 필드만 보냄 (효율적!)
```

**언제 사용:**
- 특정 필드만 수정
- 좋아요/조회수 증가
- 상태 변경 (완료/미완료)

---

### 5. DELETE (삭제)

**"데이터를 지워줘"**

```javascript
// 사용자 삭제
fetch('https://api.example.com/users/123', {
  method: 'DELETE'
})

// 댓글 삭제
fetch('https://api.example.com/comments/789', {
  method: 'DELETE'
})

// 삭제 확인
fetch('https://api.example.com/posts/456', {
  method: 'DELETE'
})
  .then(response => {
    if (response.status === 204) {
      console.log('삭제 완료')
    }
  })
```

**HTTP 요청 예시:**
```http
DELETE /users/123 HTTP/1.1
Host: api.example.com
Authorization: Bearer token123

(보통 Body 없음)
```

**응답:**
```http
HTTP/1.1 204 No Content

(Body 없음 - 성공적으로 삭제됨)
```

또는:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "User deleted successfully"
}
```

**특징:**
- ✅ 보통 Body 없음
- ✅ 멱등성 O (같은 요청 반복해도 결과 동일)
- ⚠️ 두 번째 요청은 404 반환할 수도 있음 (이미 삭제됨)

**언제 사용:**
- 계정 탈퇴
- 게시글/댓글 삭제
- 장바구니 항목 제거

---

## 🔍 기타 Methods (덜 사용됨)

### 6. HEAD

GET과 동일하지만 **Body 없이 헤더만** 받음

```javascript
// 파일 크기만 확인 (다운로드 전)
fetch('https://example.com/large-file.zip', {
  method: 'HEAD'
})
  .then(response => {
    const fileSize = response.headers.get('Content-Length')
    console.log('파일 크기:', fileSize, 'bytes')
  })
```

**HTTP 요청:**
```http
HEAD /large-file.zip HTTP/1.1
Host: example.com
```

**응답:**
```http
HTTP/1.1 200 OK
Content-Type: application/zip
Content-Length: 104857600
Last-Modified: Mon, 20 Jan 2026 10:00:00 GMT

(Body 없음)
```

**언제 사용:**
- 리소스 존재 확인
- 파일 크기/수정일 확인
- 링크 유효성 검사

---

### 7. OPTIONS

서버가 지원하는 메서드 확인 (CORS 사전 요청)

```javascript
fetch('https://api.example.com/users', {
  method: 'OPTIONS'
})
  .then(response => {
    const allowed = response.headers.get('Allow')
    console.log('지원 메서드:', allowed)
  })
```

**HTTP 요청:**
```http
OPTIONS /users HTTP/1.1
Host: api.example.com
```

**응답:**
```http
HTTP/1.1 204 No Content
Allow: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Origin: *
```

**언제 사용:**
- CORS preflight 요청 (자동)
- API 기능 탐색

---

### 8. CONNECT

프록시를 통한 터널 연결 (HTTPS 프록시)

```
CONNECT server.example.com:443 HTTP/1.1
Host: server.example.com:443
```

**언제 사용:**
- HTTPS 프록시 터널
- 일반 개발자는 직접 사용 안 함

---

### 9. TRACE

요청 경로 추적 (디버깅용, 보안상 대부분 비활성화)

```http
TRACE /path HTTP/1.1
Host: example.com
```

**보안 이슈로 거의 사용 안 함**

---

## 📊 메서드 비교표

| Method | Body | 캐싱 | 멱등성 | 안전성 | 상태코드 | 용도 |
|--------|------|------|--------|--------|----------|------|
| **GET** | ✗ | ✓ | ✓ | ✓ | 200 | 조회 |
| **POST** | ✓ | ✗ | ✗ | ✗ | 201 | 생성 |
| **PUT** | ✓ | ✗ | ✓ | ✗ | 200/204 | 전체 수정 |
| **PATCH** | ✓ | ✗ | △ | ✗ | 200 | 부분 수정 |
| **DELETE** | △ | ✗ | ✓ | ✗ | 204 | 삭제 |
| **HEAD** | ✗ | ✓ | ✓ | ✓ | 200 | 메타데이터 |
| **OPTIONS** | ✗ | ✗ | ✓ | ✓ | 204 | 지원 확인 |

**용어 설명:**
- **멱등성** (Idempotent): 같은 요청을 여러 번 해도 결과가 동일
- **안전성** (Safe): 서버 데이터를 변경하지 않음
- **캐싱** (Cacheable): 브라우저/프록시가 결과를 캐시할 수 있음

---

## 💻 실전 예시

### 블로그 시스템 API

```javascript
// ========== 게시글 관리 ==========

// 1. 게시글 목록 조회
GET /posts
응답: [
  {id: 1, title: "첫 글", views: 100},
  {id: 2, title: "둘째 글", views: 50}
]

// 2. 특정 게시글 조회
GET /posts/1
응답: {
  id: 1,
  title: "첫 게시글",
  content: "안녕하세요...",
  author: "홍길동",
  createdAt: "2026-01-20"
}

// 3. 새 게시글 작성
POST /posts
요청: {
  title: "새 게시글",
  content: "내용입니다"
}
응답: {
  id: 3,
  title: "새 게시글",
  createdAt: "2026-01-20"
}

// 4. 게시글 전체 수정
PUT /posts/1
요청: {
  title: "수정된 제목",
  content: "수정된 내용",
  tags: ["web", "javascript"]
}

// 5. 조회수만 증가
PATCH /posts/1
요청: {
  views: 101
}

// 6. 게시글 삭제
DELETE /posts/1
응답: 204 No Content


// ========== 댓글 관리 ==========

// 댓글 목록 조회
GET /posts/1/comments

// 댓글 작성
POST /posts/1/comments
요청: {
  content: "좋은 글이네요!",
  author: "김철수"
}

// 댓글 삭제
DELETE /comments/123
```

---

### 쇼핑몰 장바구니 API

```javascript
// 장바구니 조회
GET /cart
응답: {
  items: [
    {productId: 10, name: "노트북", quantity: 1, price: 1000000}
  ],
  total: 1000000
}

// 상품 추가
POST /cart/items
요청: {
  productId: 20,
  quantity: 2
}

// 수량 변경
PATCH /cart/items/20
요청: {
  quantity: 3
}

// 상품 제거
DELETE /cart/items/20

// 장바구니 비우기
DELETE /cart
```

---

### 사용자 인증 API

```javascript
// 회원가입
POST /auth/register
요청: {
  username: "hong",
  email: "hong@example.com",
  password: "secure123"
}
응답: {
  userId: 124,
  token: "jwt_token_here"
}

// 로그인
POST /auth/login
요청: {
  email: "hong@example.com",
  password: "secure123"
}
응답: {
  token: "jwt_token_here",
  expiresIn: 3600
}

// 로그아웃
POST /auth/logout
요청: {
  token: "jwt_token_here"
}

// 프로필 조회
GET /users/me
헤더: Authorization: Bearer jwt_token_here
응답: {
  id: 124,
  username: "hong",
  email: "hong@example.com"
}

// 프로필 수정 (부분)
PATCH /users/me
요청: {
  bio: "안녕하세요!"
}

// 계정 탈퇴
DELETE /users/me
```

---

## 🌐 글로벌 표준 (RFC)

HTTP Methods는 **IETF**(Internet Engineering Task Force)가 정의한 국제 표준입니다.

### RFC 문서

- **RFC 9110** (2022): HTTP Semantics (현재 표준)
  - GET, POST, PUT, DELETE, HEAD, OPTIONS, CONNECT, TRACE 정의
- **RFC 5789** (2010): PATCH Method
- **RFC 7231** (2014): HTTP/1.1 Semantics (구 표준, RFC 9110으로 대체)

### 표준 진화 과정

```
HTTP/1.0 (1996)
├─ GET
├─ HEAD
└─ POST

HTTP/1.1 (1997)
├─ PUT
├─ DELETE
├─ CONNECT
├─ OPTIONS
└─ TRACE

RFC 5789 (2010)
└─ PATCH (추가)

RFC 9110 (2022)
└─ 현재 표준 (모든 메서드 재정의)
```

### 전 세계 공통 사용

```
한국: POST /users
미국: POST /users
유럽: POST /users
일본: POST /users

→ 모두 똑같이 "사용자 생성"을 의미
```

**주요 API들의 사용 예시:**
- **GitHub API**: GET /users, POST /repos, DELETE /repos/:id
- **Kakao API**: GET /v2/user/me, POST /v1/user/logout
- **Stripe API**: POST /v1/customers, DELETE /v1/customers/:id
- **Twitter API**: GET /tweets, POST /tweets, DELETE /tweets/:id

→ 모두 표준 HTTP Methods 사용!

---

## 🔧 실전 팁

### 1. 올바른 상태 코드 반환

```javascript
// 서버에서 적절한 상태 코드 사용
app.post('/users', (req, res) => {
  const user = createUser(req.body)
  res.status(201).json(user)  // 201 Created
})

app.get('/users/:id', (req, res) => {
  const user = findUser(req.params.id)
  if (!user) {
    return res.status(404).json({error: 'User not found'})
  }
  res.status(200).json(user)  // 200 OK
})

app.delete('/users/:id', (req, res) => {
  deleteUser(req.params.id)
  res.status(204).send()  // 204 No Content
})
```

---

### 2. RESTful API 설계

```javascript
// ✅ 좋은 예시 (RESTful)
GET    /users           // 사용자 목록
GET    /users/123       // 특정 사용자
POST   /users           // 사용자 생성
PUT    /users/123       // 사용자 전체 수정
PATCH  /users/123       // 사용자 부분 수정
DELETE /users/123       // 사용자 삭제

// ❌ 나쁜 예시 (Non-RESTful)
GET /getUsers
GET /getUserById?id=123
POST /createUser
POST /updateUser
POST /deleteUser
```

---

### 3. 멱등성 활용

```javascript
// PUT/DELETE는 멱등성 보장
// → 네트워크 오류 시 재시도 안전

// PUT: 여러 번 실행해도 결과 동일
PUT /users/123 {name: "홍길동"}
→ 1회: 홍길동으로 변경
→ 2회: 홍길동으로 변경 (동일)
→ 3회: 홍길동으로 변경 (동일)

// POST: 멱등성 없음
// → 재시도 시 중복 생성 위험
POST /users {name: "홍길동"}
→ 1회: 사용자 생성 (id: 1)
→ 2회: 사용자 생성 (id: 2) ← 중복!
→ 3회: 사용자 생성 (id: 3) ← 중복!
```

---

### 4. 에러 처리

```javascript
fetch('/api/users', {
  method: 'POST',
  body: JSON.stringify(userData)
})
  .then(response => {
    // 상태 코드 확인
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('잘못된 요청입니다')
      }
      if (response.status === 401) {
        throw new Error('로그인이 필요합니다')
      }
      if (response.status === 404) {
        throw new Error('리소스를 찾을 수 없습니다')
      }
      if (response.status >= 500) {
        throw new Error('서버 오류입니다')
      }
    }
    return response.json()
  })
  .catch(error => {
    console.error('요청 실패:', error)
  })
```

---

### 5. Chrome DevTools로 확인

```
F12 → Network 탭

각 요청 클릭하면:
- General: GET /api/users, Status 200
- Request Headers: Content-Type, Authorization 등
- Request Payload: POST/PUT/PATCH의 Body 데이터
- Response: 서버 응답 데이터
```

---

## 🎯 Method 선택 가이드

### "어떤 Method를 써야 하나요?"

```
┌─ 데이터를 가져올 때
│   → GET
│
├─ 새로 만들 때
│   → POST
│
├─ 수정할 때
│   ├─ 전체를 바꿀 때 → PUT
│   └─ 일부만 바꿀 때 → PATCH
│
└─ 삭제할 때
    → DELETE
```

### 실무 예시

| 작업 | Method | Endpoint |
|------|--------|----------|
| 로그인 | POST | /auth/login |
| 회원가입 | POST | /auth/register |
| 로그아웃 | POST | /auth/logout |
| 프로필 조회 | GET | /users/me |
| 프로필 전체 수정 | PUT | /users/me |
| 아바타만 변경 | PATCH | /users/me |
| 계정 탈퇴 | DELETE | /users/me |
| 검색 | GET | /search?q=keyword |
| 파일 업로드 | POST | /uploads |
| 파일 다운로드 | GET | /files/123 |
| 좋아요 추가 | POST | /posts/123/like |
| 좋아요 취소 | DELETE | /posts/123/like |

---

## Relations

- uses [[Endpoint]]
- uses [[Payload]]
- part_of [[Web Communication]]
- part_of [[api]]

---

**난이도**: 초급
**카테고리**: 웹 개발
**마지막 업데이트**: 2026년 1월
