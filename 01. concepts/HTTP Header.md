---
title: HTTP Header (HTTP 헤더)
type: concept
permalink: knowledge/concepts/http-header
tags:
- web-basics
- concepts
- http
category: 웹 기초
difficulty: 초급
---

# HTTP Header (HTTP 헤더)

HTTP 요청과 응답에 포함되는 **메타데이터(부가 정보)**로, 본문(body)과 별도로 전송됩니다.

## 📖 개요

HTTP 헤더는 **"실제 데이터(본문) 외에 추가로 전달하고 싶은 정보"**를 담는 공간입니다. 브라우저와 서버가 서로에게 다양한 지시사항과 정보를 전달할 때 사용합니다.

```http
요청/응답 첫 줄 (시작 라인)
헤더1: 값1          ← HTTP 헤더 영역
헤더2: 값2
헤더3: 값3
(빈 줄)
본문 데이터          ← HTTP 본문 (body)
```

## 🎭 비유

택배 상자의 **송장**과 같습니다. 상자 안의 물건(본문 데이터)은 실제 내용물이고, 송장(헤더)에는 "보낸 사람", "받는 사람", "무게", "주의사항" 같은 부가 정보가 적혀 있습니다.

## ✨ 특징

- **키-값 형식**: `Header-Name: value` 형태
- **대소문자 무시**: `Content-Type`과 `content-type`은 같음
- **여러 개 가능**: 하나의 요청/응답에 수십 개의 헤더 포함 가능
- **양방향**: 요청 헤더(클라이언트→서버), 응답 헤더(서버→클라이언트)

## 💡 예시

### 요청 헤더 (Request Headers)

클라이언트가 서버에게 보내는 정보:

```http
GET /api/users HTTP/1.1
Host: api.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0)
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Cookie: session_id=abc123
```

| 헤더 | 역할 |
|------|------|
| `Host` | 요청할 서버 도메인 |
| `User-Agent` | 브라우저/클라이언트 정보 |
| `Accept` | 받을 수 있는 데이터 형식 |
| `Authorization` | 인증 정보 (토큰, 비밀번호 등) |
| `Cookie` | 쿠키 데이터 |

### 응답 헤더 (Response Headers)

서버가 클라이언트에게 보내는 정보:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 1234
Set-Cookie: session_id=xyz789; HttpOnly
Access-Control-Allow-Origin: https://mysite.com
Cache-Control: max-age=3600
```

| 헤더 | 역할 |
|------|------|
| `Content-Type` | 본문 데이터 형식 (JSON, HTML, 이미지 등) |
| `Content-Length` | 본문 크기 (바이트) |
| `Set-Cookie` | 클라이언트에 쿠키 저장 지시 |
| `Access-Control-Allow-Origin` | [[CORS (Cross-Origin Resource Sharing)\|CORS]] 허용 출처 |
| `Cache-Control` | 캐싱 정책 |

### 실제 예시: fetch 요청

```javascript
fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',  // 헤더 설정
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({ name: 'John' })  // 본문
})
```

브라우저가 실제로 보내는 HTTP 메시지:

```http
POST /data HTTP/1.1
Host: api.example.com
Content-Type: application/json        ← 우리가 설정한 헤더
Authorization: Bearer token123        ← 우리가 설정한 헤더
Content-Length: 17

{"name":"John"}                       ← 본문
```

## 📝 헤더 분류

### 1. 일반 헤더 (General Headers)
요청/응답 모두 사용:
- `Date`: 메시지 생성 시간
- `Connection`: 연결 유지 방식

### 2. 요청 헤더 (Request Headers)
클라이언트 → 서버:
- `Host`, `User-Agent`, `Accept`, `Authorization`, `Cookie`

### 3. 응답 헤더 (Response Headers)
서버 → 클라이언트:
- `Server`, `Set-Cookie`, `Location` (리다이렉트)

### 4. 엔티티 헤더 (Entity Headers)
본문 데이터 정보:
- `Content-Type`, `Content-Length`, `Content-Encoding`

## 🔍 헤더를 보는 방법

### Chrome DevTools
1. F12 → Network 탭
2. 요청 클릭 → Headers 탭
3. **Request Headers** / **Response Headers** 확인

### cURL 명령어
```bash
# 응답 헤더 확인
curl -I https://example.com

# 요청/응답 헤더 모두 확인
curl -v https://example.com
```

## Relations

- used_by [[cors]]
- part_of [[http]]
- used_by [[rest-api]]
- relates_to [[cookie]]

---

**난이도**: 초급
**카테고리**: 웹 기초
**마지막 업데이트**: 2026년 1월
