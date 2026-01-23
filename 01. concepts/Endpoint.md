---
title: Endpoint
type: concept
permalink: knowledge/concepts/endpoint
tags:
- web-basics
- concepts
- api
- network
category: 웹 개발
difficulty: 초급
---

# Endpoint

**통신의 끝점(End Point)** - 데이터가 시작하거나 도착하는 최종 지점을 의미합니다.

## 📖 개요

Endpoint는 맥락에 따라 세 가지 의미로 사용됩니다:

1. **API Endpoint** (가장 흔함): 특정 기능을 제공하는 URL 주소
2. **Network Endpoint**: 통신의 양 끝에 있는 장치/프로그램
3. **Security Endpoint**: 최종 사용자 디바이스 (PC, 스마트폰 등)

웹 개발에서는 주로 **API Endpoint**를 의미합니다.

> [!important] API Endpoint
> API의 각 기능별 URL 주소입니다. 하나의 API 서버는 여러 개의 endpoint를 가질 수 있습니다.

## 🎭 비유

**우체국 창구 시스템**과 같습니다:

```
우체국 (API 서버)
├─ 1번 창구 (endpoint): 택배 보내기
├─ 2번 창구 (endpoint): 우편 접수
└─ 3번 창구 (endpoint): 조회

각 창구가 다른 기능을 제공하듯,
각 endpoint가 다른 기능을 제공합니다.
```

## ✨ 특징

### API Endpoint의 특징

- **URL 형태**: `https://도메인/경로`
- **HTTP 메서드**: GET, POST, PUT, DELETE 등
- **기능 단위**: 하나의 endpoint = 하나의 기능
- **RESTful 설계**: 리소스 중심의 URL 구조

### 구조

```
https://api.github.com/users/octocat
└─────────┬─────────┘ └────┬─────┘
       Base URL          Endpoint
                         (경로)
```

## 💡 예시

### 1. GitHub API Endpoints

```javascript
// 사용자 정보 조회
GET https://api.github.com/users/octocat

// 저장소 목록
GET https://api.github.com/users/octocat/repos

// 이슈 생성
POST https://api.github.com/repos/owner/repo/issues
```

### 2. 실제 사용 코드

```javascript
// API endpoint 호출
const endpoint = 'https://api.github.com/users/octocat';

fetch(endpoint)
  .then(response => response.json())
  .then(data => console.log(data));
```

### 3. Express.js에서 Endpoint 만들기

```javascript
// 서버에서 endpoint 정의
app.get('/users/:id', (req, res) => {
  // GET /users/123 ← 이게 endpoint
  res.json({ id: req.params.id });
});

app.post('/posts', (req, res) => {
  // POST /posts ← 다른 endpoint
  res.json({ message: 'Created' });
});
```

### 4. REST API Endpoint 패턴

| HTTP Method | Endpoint | 기능 |
|-------------|----------|------|
| GET | `/users` | 사용자 목록 조회 |
| GET | `/users/123` | 특정 사용자 조회 |
| POST | `/users` | 사용자 생성 |
| PUT | `/users/123` | 사용자 수정 |
| DELETE | `/users/123` | 사용자 삭제 |

### 5. Chrome Extension 맥락

```javascript
// Content Script에서 Background Script로 메시지 전송
chrome.runtime.sendMessage({action: 'fetchData'});

// Background Script에서 API endpoint 호출
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'fetchData') {
    fetch('https://api.example.com/data') // ← endpoint
      .then(res => res.json())
      .then(data => sendResponse(data));
  }
});
```

## 🔍 다른 맥락에서의 의미

### Network Endpoint

```
클라이언트 (Endpoint 1)
    ↕ TCP/IP 통신
서버 (Endpoint 2)

통신하는 두 지점 모두를 endpoint라고 부름
```

### Security Endpoint

```
회사 보안 시스템:
- Firewall (네트워크 경계 보안)
- Endpoint Security (개별 PC/스마트폰 보안)
  └─ 안티바이러스, 접근 제어 등
```

## 💡 실전 팁

### Endpoint 설계 원칙 (RESTful)

```
✅ 좋은 예:
GET  /users          (명사, 복수형)
GET  /users/123      (ID로 특정)
POST /users          (생성)

❌ 나쁜 예:
GET  /getUser        (동사 포함)
GET  /user/get/123   (불필요한 중복)
POST /createUser     (동사 포함)
```

### Base URL vs Endpoint

```
Base URL:    https://api.example.com
Endpoint:    /v1/users
             /v1/posts
             /v2/users (버전 관리)

Full URL:    https://api.example.com/v1/users
```

## Relations

- part_of [[API (Application Programming Interface)]]
- uses [[HTTP Methods]]
- used_by [[Web Communication]]
- used_by [[Payload]]

---

**난이도**: 초급
**카테고리**: 웹 개발
**마지막 업데이트**: 2026년 1월
