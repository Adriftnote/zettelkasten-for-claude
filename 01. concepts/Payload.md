---
title: Payload
type: concept
permalink: knowledge/concepts/payload
tags:
- web-basics
- concepts
- api
- network
category: 웹 개발
difficulty: 초급
---

# Payload

**실제로 전달하려는 핵심 데이터**를 의미합니다. 메타데이터와 포장을 제외한, 진짜 목적인 내용물입니다.

## 📖 개요

Payload는 전체 메시지에서 **헤더/메타데이터를 제외한 실제 데이터 부분**입니다.

```
전체 메시지 = 메타데이터 + Payload

메타데이터: "어디서 왔고, 어디로 가고, 어떤 형식인지"
Payload:   "실제로 뭘 전달하는지"
```

> [!important] 핵심
> Payload는 **"포장을 뜯고 나서 실제로 쓸 수 있는 내용물"**입니다.

## 🎭 비유

**택배 상자 시스템**과 같습니다:

```
📦 택배 상자 전체 (HTTP 메시지)
├─ 📋 송장 (발신지, 수신지)      ← 헤더/메타데이터
├─ 📦 포장재 (뽁뽁이, 테이프)     ← 프로토콜 오버헤드
└─ 📱 실제 상품 (스마트폰)        ← Payload (진짜 목적!)

고객이 원하는 건 스마트폰이지, 송장이나 뽁뽁이가 아닙니다.
```

## ✨ 특징

- **본질적 데이터**: 통신의 실제 목적
- **헤더와 분리**: 메타데이터와 구분됨
- **형식 다양**: JSON, XML, Binary 등
- **크기 중요**: 네트워크 비용의 핵심

## 💡 예시

### 1. HTTP POST 요청

```javascript
// API 호출 예시
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {                         // ← 메타데이터 (헤더)
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({             // ← Payload (실제 데이터!)
    name: '홍길동',
    email: 'hong@example.com',
    age: 25
  })
});
```

**분해하면:**
```
헤더:
- "이 데이터는 JSON이에요"
- "인증 토큰은 이거예요"

Payload:
- 실제로 저장할 사용자 정보 {name, email, age}
```

### 2. HTTP 응답

```http
HTTP/1.1 200 OK
Content-Type: application/json      ← 헤더 (메타데이터)
Content-Length: 58
Cache-Control: max-age=3600

{                                    ← Payload (본문)
  "id": 123,
  "name": "홍길동",
  "created": true
}
```

### 3. 네트워크 패킷 구조

```
TCP/IP 패킷:
┌─────────────────────────┐
│ IP Header               │ ← 출발지/목적지 IP
│ (20 bytes)              │
├─────────────────────────┤
│ TCP Header              │ ← 포트, 순서 번호
│ (20 bytes)              │
├─────────────────────────┤
│ "Hello World"           │ ← Payload (실제 데이터)
│ (11 bytes)              │
└─────────────────────────┘

오버헤드: 40 bytes (헤더)
Payload:  11 bytes (실제 데이터)
효율:     11/51 = 21.6%
```

### 4. JWT (JSON Web Token)

```javascript
// JWT 구조 (점으로 구분된 3부분)
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEyM30.9x7s...
└────────┬────────┘ └────────┬─────────┘ └──┬──┘
       Header            Payload        Signature

// Payload 부분을 디코딩하면:
{
  "userId": 123,
  "name": "홍길동",
  "role": "admin",
  "exp": 1234567890  // 만료 시간
}

// 실제로 활용하는 정보가 Payload에 들어있음!
```

### 5. Chrome Extension 메시지

```javascript
// Content Script → Background Script
chrome.runtime.sendMessage({
  action: 'saveData',        // ← 메타데이터 (어떤 동작인지)
  type: 'article',           // ← 메타데이터 (데이터 타입)
  payload: {                 // ← Payload (실제 데이터!)
    title: '문서 제목',
    content: '본문 내용 전체...',
    url: 'https://example.com/article',
    timestamp: Date.now(),
    tags: ['tech', 'web']
  }
});

// Background Script에서 처리
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // action으로 분기
  if (msg.action === 'saveData') {
    // payload에 실제 저장할 데이터가 들어있음
    saveToDatabase(msg.payload);
  }
});
```

### 6. Express.js에서 Payload 받기

```javascript
// 서버에서 payload 처리
app.post('/users', (req, res) => {
  // req.body가 payload
  const payload = req.body;  // {name: '홍길동', email: ...}

  // 헤더는 req.headers에 있음
  const contentType = req.headers['content-type'];

  // payload만 활용해서 DB 저장
  db.users.create(payload);

  res.json({success: true});
});
```

### 7. WebSocket 메시지

```javascript
// WebSocket으로 실시간 채팅
const message = {
  messageId: '123',          // ← 메타데이터
  timestamp: Date.now(),     // ← 메타데이터
  payload: {                 // ← Payload
    from: 'user1',
    to: 'user2',
    text: '안녕하세요!',
    attachments: []
  }
};

ws.send(JSON.stringify(message));
```

## 🔍 맥락별 의미

| 맥락 | Payload | 예시 |
|------|---------|------|
| **API/웹** | 요청/응답의 body 데이터 | JSON 객체 |
| **네트워크** | 헤더 제외한 실제 전송 데이터 | TCP payload |
| **보안** | 악성코드의 실제 공격 코드 | 랜섬웨어 암호화 로직 |
| **우주/항공** | 로켓이 운반하는 화물 | 인공위성 |
| **메시징** | 메시지의 실제 내용 | 채팅 텍스트 |

## 💡 어원

**Pay (지불하다) + Load (짐)**

원래 우주/항공 용어:

```
🚀 로켓 발사 비용: 1억 달러
├─ 연료: 90톤        ← 운반 수단 (비용 듦)
├─ 기체: 9톤         ← 운반 수단 (비용 듦)
└─ 위성: 1톤         ← Payload (진짜 목적!)

"돈 들여서(Pay) 싣고 가는 짐(Load)"
→ 진짜 전달하려는 가치 있는 화물
```

컴퓨터 통신에서도 **"진짜 전달하려는 데이터"**를 Payload라고 부르게 됨.

## 🎯 Payload vs 다른 개념

### Payload vs Body

```javascript
// HTTP에서는 거의 동의어로 사용
fetch('/api', {
  body: JSON.stringify(data)     // body = payload
});

// 하지만 엄밀히는:
// Body: HTTP 용어 (요청/응답의 본문)
// Payload: 일반 네트워크 용어 (실제 데이터)
```

### Payload vs Metadata

```javascript
const message = {
  // Metadata (데이터에 대한 정보)
  timestamp: Date.now(),
  version: '1.0',
  type: 'user-data',

  // Payload (실제 데이터)
  payload: {
    name: '홍길동',
    email: 'hong@example.com'
  }
};
```

## 🔧 실전 팁

### 1. Payload 크기 최적화

```javascript
// ❌ 비효율적 (불필요한 데이터 포함)
{
  userId: 123,
  userName: '홍길동',
  userEmail: 'hong@example.com',
  userProfile: {...},       // 안 쓰는 데이터
  userSettings: {...},      // 안 쓰는 데이터
  userHistory: [...]        // 안 쓰는 데이터
}

// ✅ 효율적 (필요한 것만)
{
  userId: 123,
  userName: '홍길동'
}
```

### 2. Payload 압축

```javascript
// gzip 압축으로 payload 크기 줄이기
fetch('/api/data', {
  headers: {
    'Content-Encoding': 'gzip'
  },
  body: compressedPayload
});
```

### 3. Payload 검증

```javascript
// 서버에서 payload 검증
app.post('/users', (req, res) => {
  const payload = req.body;

  // 필수 필드 확인
  if (!payload.name || !payload.email) {
    return res.status(400).json({
      error: 'Invalid payload: missing required fields'
    });
  }

  // 처리...
});
```

## 📋 Payload 관련 국제 표준

Payload **개념 자체**에는 표준이 없지만, **구체적인 형식과 프로토콜**마다 표준이 존재합니다.

### 1. HTTP Payload 표준

**RFC 7230~7235** (HTTP/1.1 프로토콜)

```http
POST /users HTTP/1.1
Host: api.example.com
Content-Type: application/json    ← RFC 7231 (Semantics)
Content-Length: 45                 ← RFC 7230 (Message Syntax)

{"name":"홍길동","email":"..."}    ← Payload (Body)
```

**주요 표준:**
- **RFC 7230**: HTTP 메시지 구문 (Message Syntax and Routing)
- **RFC 7231**: HTTP 의미론 (Semantics and Content)
- **RFC 7232**: 조건부 요청 (Conditional Requests)
- **RFC 7233**: 범위 요청 (Range Requests)
- **RFC 7234**: 캐싱 (Caching)
- **RFC 7235**: 인증 (Authentication)

### 2. JSON Payload 표준

**RFC 8259** (JavaScript Object Notation)

```json
{
  "name": "홍길동",
  "age": 25,
  "email": "hong@example.com"
}
```

**규칙:**
- UTF-8 인코딩 필수
- 키는 반드시 문자열 (쌍따옴표)
- 값: string, number, boolean, null, object, array
- 주석 불가 (JSON에는 주석 없음)

**MIME 타입:** `application/json`

### 3. JWT Payload 표준

**RFC 7519** (JSON Web Token)

```javascript
// JWT 구조
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEyM30.signature
└─────Header─────┘ └────Payload────┘ └─Signature─┘

// Payload 표준 클레임 (Claims)
{
  // 표준 클레임 (RFC 7519 정의)
  "iss": "issuer",          // 발행자
  "sub": "subject",         // 주제 (사용자 ID)
  "aud": "audience",        // 대상
  "exp": 1234567890,        // 만료 시간 (Unix timestamp)
  "nbf": 1234567890,        // 유효 시작 시간
  "iat": 1234567890,        // 발행 시간
  "jti": "unique-id",       // JWT ID

  // 커스텀 클레임 (자유롭게 추가)
  "userId": 123,
  "role": "admin"
}
```

**주요 특징:**
- Base64URL 인코딩
- 암호화되지 않음 (서명만 있음)
- 표준 클레임 이름 정의됨

### 4. XML Payload 표준

**W3C XML 1.0 Specification** (Fifth Edition, 2008)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<user>
  <name>홍길동</name>
  <email>hong@example.com</email>
  <age>25</age>
</user>
```

**관련 표준:**
- **XML Schema (XSD)**: XML 구조 검증
- **SOAP**: XML 기반 웹 서비스 프로토콜
- **RSS/Atom**: XML 기반 피드 형식

**MIME 타입:** `application/xml`, `text/xml`

### 5. TCP Payload 표준

**RFC 793** (Transmission Control Protocol)

```
TCP 패킷 구조:
┌──────────────────────────┐
│ IP Header (20 bytes)     │ ← RFC 791 (IP)
├──────────────────────────┤
│ TCP Header (20+ bytes)   │ ← RFC 793 (TCP)
│  - Source Port           │
│  - Dest Port             │
│  - Sequence Number       │
│  - Acknowledgment        │
│  - Flags (SYN, ACK...)   │
├──────────────────────────┤
│ TCP Payload              │ ← 실제 데이터 (HTTP, SSH 등)
│  (가변 길이)              │
└──────────────────────────┘
```

**특징:**
- 최대 세그먼트 크기 (MSS): 보통 1460 bytes
- Payload 길이 제한 없음 (분할 전송)
- 순서 보장, 재전송

### 6. WebSocket Payload 표준

**RFC 6455** (The WebSocket Protocol)

```javascript
// WebSocket 프레임 구조
┌─────────────────────────┐
│ Frame Header            │
│  - FIN (마지막 프레임?)  │
│  - Opcode (데이터 타입)  │
│  - Mask (마스킹 여부)    │
│  - Payload Length       │
├─────────────────────────┤
│ Payload Data            │ ← 실제 메시지 (텍스트/바이너리)
└─────────────────────────┘

// 사용 예시
ws.send(JSON.stringify({
  type: 'chat',
  message: '안녕하세요'
}));
```

**Payload 타입:**
- `0x1`: 텍스트 (UTF-8)
- `0x2`: 바이너리
- `0x8`: 연결 종료
- `0x9`: Ping
- `0xA`: Pong

### 7. Protocol Buffers (Protobuf)

**Google 개발** (오픈소스, 사실상 표준)

```protobuf
// .proto 파일 정의
syntax = "proto3";

message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
  int32 age = 4;
}
```

**특징:**
- **바이너리 형식** (JSON보다 작고 빠름)
- **스키마 기반** (타입 안정성)
- **언어 중립적** (코드 자동 생성)
- gRPC의 기본 payload 형식

**비교:**
```javascript
// JSON: 45 bytes
{"id":123,"name":"홍길동","age":25}

// Protobuf: ~15 bytes (바이너리)
// 3배 이상 작음!
```

### 8. MessagePack

**공식 스펙** (msgpack.org)

```javascript
// JSON과 호환되는 바이너리 형식
const msgpack = require('msgpack');

const data = {name: '홍길동', age: 25};
const packed = msgpack.pack(data);  // 바이너리 변환

// JSON보다 작고 빠름
```

**특징:**
- JSON과 1:1 호환
- 바이너리 형식 (JSON보다 작음)
- 스키마 불필요
- 빠른 직렬화/역직렬화

### 9. CBOR (Concise Binary Object Representation)

**RFC 8949**

```javascript
// JSON과 유사하지만 바이너리
const cbor = require('cbor');

const data = {
  name: '홍길동',
  age: 25,
  joined: new Date()
};

const encoded = cbor.encode(data);  // 바이너리 변환
```

**특징:**
- **IETF 표준** (RFC 8949)
- JSON보다 풍부한 타입 (날짜, 바이너리 등)
- IoT, 임베디드 시스템에서 인기
- MessagePack보다 더 많은 타입 지원

### 10. gRPC Payload

**Google 개발** (HTTP/2 + Protocol Buffers)

```protobuf
// .proto 파일
service UserService {
  rpc GetUser (GetUserRequest) returns (User);
  rpc CreateUser (CreateUserRequest) returns (User);
}

message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
}
```

**특징:**
- **HTTP/2 기반** (멀티플렉싱, 스트리밍)
- **Protobuf payload** (바이너리)
- **언어 중립적** (다양한 언어 지원)
- REST API보다 빠르고 효율적

### 11. FormData (Multipart)

**RFC 7578** (Multipart Form Data)

```http
POST /upload HTTP/1.1
Content-Type: multipart/form-data; boundary=----Boundary1234

------Boundary1234
Content-Disposition: form-data; name="name"

홍길동
------Boundary1234
Content-Disposition: form-data; name="file"; filename="photo.jpg"
Content-Type: image/jpeg

[바이너리 이미지 데이터...]
------Boundary1234--
```

**사용 사례:**
- 파일 업로드
- 텍스트 + 바이너리 혼합 전송
- HTML `<form>` 전송

## 📊 Payload 형식 비교

| 형식 | 표준 | 타입 | 크기 | 속도 | 사람 가독성 | 사용 사례 |
|------|------|------|------|------|------------|----------|
| **JSON** | RFC 8259 | 텍스트 | 중간 | 보통 | ⭐⭐⭐ 높음 | 웹 API (가장 흔함) |
| **XML** | W3C | 텍스트 | 큼 | 느림 | ⭐⭐ 중간 | 레거시, SOAP |
| **Protobuf** | Google | 바이너리 | 작음 | 빠름 | ❌ 없음 | gRPC, 마이크로서비스 |
| **MessagePack** | msgpack.org | 바이너리 | 작음 | 빠름 | ❌ 없음 | 게임, 실시간 통신 |
| **CBOR** | RFC 8949 | 바이너리 | 작음 | 빠름 | ❌ 없음 | IoT, 임베디드 |
| **JWT** | RFC 7519 | 텍스트 | 중간 | 보통 | ⭐⭐ 중간 | 인증 토큰 |
| **FormData** | RFC 7578 | 혼합 | 큼 | 보통 | ❌ 없음 | 파일 업로드 |

## 🎯 형식 선택 가이드

```javascript
// 1. 웹 API (브라우저 ↔ 서버)
✅ JSON (RFC 8259)
- 가장 보편적, 디버깅 쉬움
- 모든 언어 지원

// 2. 마이크로서비스 간 통신
✅ gRPC + Protobuf
- 빠르고 효율적
- 타입 안정성

// 3. 실시간 게임, 채팅
✅ MessagePack 또는 CBOR
- 빠른 직렬화
- 작은 크기

// 4. 파일 업로드
✅ FormData (RFC 7578)
- 텍스트 + 바이너리 혼합
- 브라우저 네이티브 지원

// 5. 인증 토큰
✅ JWT (RFC 7519)
- Stateless 인증
- URL에 포함 가능

// 6. IoT, 임베디드
✅ CBOR (RFC 8949)
- 작은 메모리 사용
- 낮은 전력 소비
```

## Relations

- used_by [[Endpoint]]
- part_of [[API (Application Programming Interface)]]
- used_by [[HTTP Methods]]
- used_by [[Web Communication]]

## 📚 참고 자료

### RFC 문서
- **HTTP**: [RFC 7230-7235](https://tools.ietf.org/html/rfc7230)
- **JSON**: [RFC 8259](https://tools.ietf.org/html/rfc8259)
- **JWT**: [RFC 7519](https://tools.ietf.org/html/rfc7519)
- **TCP**: [RFC 793](https://tools.ietf.org/html/rfc793)
- **WebSocket**: [RFC 6455](https://tools.ietf.org/html/rfc6455)
- **CBOR**: [RFC 8949](https://tools.ietf.org/html/rfc8949)
- **FormData**: [RFC 7578](https://tools.ietf.org/html/rfc7578)

### 기타 표준
- **XML**: [W3C XML Specification](https://www.w3.org/TR/xml/)
- **Protocol Buffers**: [Google Developers](https://developers.google.com/protocol-buffers)
- **MessagePack**: [msgpack.org](https://msgpack.org)
- **gRPC**: [grpc.io](https://grpc.io)

---

**난이도**: 초급
**카테고리**: 웹 개발
**마지막 업데이트**: 2026년 1월
