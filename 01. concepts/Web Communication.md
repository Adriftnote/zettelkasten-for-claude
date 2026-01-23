---
title: Web Communication
type: concept
permalink: knowledge/concepts/web-communication
tags:
- web-basics
- concepts
- network
- http
category: 웹 개발
difficulty: 초급
---

# Web Communication

웹에서 **클라이언트(브라우저)와 서버가 데이터를 주고받는 전체 과정**입니다.

## 📖 개요

웹 통신은 **"누가, 어디로, 무엇을, 어떻게 보내는가"**의 조합입니다.

```
브라우저 (Client)
    ↕ HTTP/HTTPS 프로토콜
서버 (Server)
    ↕ Database Query
데이터베이스 (DB)
```

URL을 입력하거나 버튼을 클릭하면, 뒤에서 복잡한 통신 과정이 자동으로 일어납니다.

> [!important] 핵심
> 웹 통신은 **요청(Request) → 처리 → 응답(Response)** 구조입니다.

## 🎭 비유

**우편 시스템**과 같습니다:

```
1. 편지 작성 (HTTP 요청 생성)
2. 주소 확인 (DNS 조회)
3. 우체국으로 배달 (TCP/IP 전송)
4. 수신자가 읽고 답장 작성 (서버 처리)
5. 답장 받음 (HTTP 응답)
```

## 🌐 전체 흐름 (7단계)

### 시나리오: 네이버 로그인

```
┌─────────────┐
│  브라우저   │  "로그인하고 싶어요"
│  (Client)   │
└──────┬──────┘
       │ ① DNS 조회
       │ ② TCP 연결
       │ ③ HTTP 요청 전송
       ↓
┌─────────────┐
│ 네이버 서버  │  요청 처리
│  (Server)   │
└──────┬──────┘
       │ ④ DB 조회
       ↓
┌─────────────┐
│ 데이터베이스 │  데이터 반환
└──────┬──────┘
       │ ⑤ 응답 생성
       ↓
┌─────────────┐
│ 네이버 서버  │  응답 전송
└──────┬──────┘
       │ ⑥ HTTP 응답
       ↓
┌─────────────┐
│  브라우저   │  ⑦ 화면 표시
└─────────────┘
```

## 💡 단계별 상세 설명

### 1단계: 브라우저에서 요청 생성

사용자가 로그인 버튼을 클릭하면:

```javascript
// JavaScript가 HTTP 요청 생성
fetch('https://naver.com/api/login', {  // ← Endpoint
  method: 'POST',
  headers: {                            // ← 메타데이터
    'Content-Type': 'application/json',
    'User-Agent': 'Chrome/120.0'
  },
  body: JSON.stringify({                // ← Payload
    username: 'hong',
    password: '1234'
  })
});
```

**구성 요소:**
- **Endpoint**: `/api/login` (어디로)
- **Method**: `POST` (어떤 동작)
- **Headers**: 메타데이터
- **Payload**: 실제 데이터 `{username, password}`

### 2단계: DNS 조회 (도메인 → IP 주소)

```
브라우저: "naver.com이 어디 있어?"
    ↓
DNS 서버: "223.130.200.107이야"
    ↓
브라우저: "오케이, 그 주소로 보낼게"
```

**왜 필요한가?**
- 사람: `naver.com` (이름으로 기억)
- 컴퓨터: `223.130.200.107` (IP 주소로 통신)

**DNS는 인터넷 주소록**입니다.

### 3단계: TCP 연결 (3-way Handshake)

데이터 전송 전에 **안전한 통로**를 만듭니다:

```
브라우저 → 서버: "연결해도 돼?" (SYN)
서버 → 브라우저: "오케이!" (SYN-ACK)
브라우저 → 서버: "알았어!" (ACK)

→ 연결 완료! 이제 데이터 전송 시작
```

### 4단계: HTTP 요청 전송

```http
POST /api/login HTTP/1.1                    ← 요청 라인
Host: naver.com                             ← 헤더 시작
Content-Type: application/json
Content-Length: 45
User-Agent: Chrome/120.0
Cookie: session_id=abc123
                                            ← 빈 줄 (헤더 끝)
{"username":"hong","password":"1234"}       ← Payload (Body)
```

**실제 네트워크 패킷:**
```
┌──────────────────┐
│ IP Header        │ 출발지: 내 PC IP
│                  │ 목적지: 223.130.200.107
├──────────────────┤
│ TCP Header       │ 포트: 443 (HTTPS)
│                  │ 순서 번호: 12345
├──────────────────┤
│ HTTP 요청        │ POST /api/login ...
│                  │ {"username":"hong"...}
└──────────────────┘
```

### 5단계: 서버에서 처리

```javascript
// 네이버 서버 코드 (Express.js 예시)
app.post('/api/login', async (req, res) => {

  // ① Payload 추출
  const { username, password } = req.body;

  // ② 데이터베이스 조회
  const user = await db.query(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );

  // ③ 비밀번호 확인
  const isValid = await bcrypt.compare(password, user.passwordHash);

  // ④ 응답 생성
  if (isValid) {
    res.json({                          // ← 응답 Payload
      success: true,
      token: 'jwt_token_here',
      userId: user.id
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
});
```

### 6단계: HTTP 응답 전송

```http
HTTP/1.1 200 OK                             ← 상태 라인
Content-Type: application/json              ← 응답 헤더
Set-Cookie: session_id=xyz789
Content-Length: 78
Cache-Control: no-store
                                            ← 빈 줄
{"success":true,"token":"jwt_...","userId":123}  ← 응답 Payload
```

**HTTP 상태 코드:**
- `200 OK`: 성공
- `401 Unauthorized`: 인증 실패
- `404 Not Found`: 페이지 없음
- `500 Internal Server Error`: 서버 오류

### 7단계: 브라우저에서 처리

```javascript
// 응답 받은 후 처리
fetch('/api/login', {...})
  .then(response => response.json())  // Payload 파싱
  .then(data => {
    if (data.success) {
      // ① 토큰 저장
      localStorage.setItem('token', data.token);

      // ② 페이지 이동
      window.location.href = '/dashboard';
    } else {
      // ③ 에러 메시지 표시
      alert('로그인 실패: ' + data.error);
    }
  });
```

## 📊 핵심 개념 연결

지금까지 배운 개념들이 모두 연결됩니다:

| 개념 | 역할 | 예시 |
|------|------|------|
| [[Endpoint\|Endpoint]] | 어디로 보낼지 | `POST /api/login` |
| [[Payload\|Payload]] | 무엇을 보낼지 | `{username, password}` |
| [[Encoding\|Encoding]] | 어떻게 변환할지 | UTF-8로 문자 인코딩 |
| **HTTP Method** | 어떤 동작인지 | POST (데이터 생성) |
| **Headers** | 메타데이터 | Content-Type, Cookie |
| **Status Code** | 결과 상태 | 200 (성공), 404 (없음) |

## 🔧 네트워크 계층 구조

웹 통신은 **7계층**으로 나뉩니다 (OSI 모델):

```
7. Application   │ HTTP/HTTPS
   Layer         │ 사람이 이해하는 형태
                 │ GET /api/users
─────────────────┼─────────────────────
4. Transport     │ TCP/UDP
   Layer         │ 포트 번호, 순서 보장
                 │ Port 443 (HTTPS)
─────────────────┼─────────────────────
3. Network       │ IP
   Layer         │ 출발지/목적지 주소
                 │ 192.168.0.1 → 223.130.200.107
─────────────────┼─────────────────────
2. Data Link     │ Ethernet/Wi-Fi
   Layer         │ MAC 주소
─────────────────┼─────────────────────
1. Physical      │ 전기/광신호
   Layer         │ 01010101...
```

**마치 러시아 인형처럼 겹겹이 포장됩니다!**

```
HTTP 요청
  → TCP로 감싸기 (포트 정보 추가)
    → IP로 감싸기 (주소 정보 추가)
      → Ethernet으로 감싸기 (물리적 전송)
        → 전기 신호로 변환
```

## 💻 실전 예시

### 클라이언트 코드 (브라우저)

```html
<!DOCTYPE html>
<html>
<body>
  <form id="loginForm">
    <input name="username" placeholder="아이디" />
    <input name="password" type="password" placeholder="비밀번호" />
    <button type="submit">로그인</button>
  </form>

  <script>
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // ① Payload 준비
    const payload = {
      username: e.target.username.value,
      password: e.target.password.value
    };

    try {
      // ② HTTP 요청 (Endpoint로 Payload 전송)
      const response = await fetch('https://api.example.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)  // UTF-8 Encoding
      });

      // ③ 응답 Payload 받기
      const data = await response.json();

      // ④ 결과 처리
      if (data.success) {
        localStorage.setItem('token', data.token);
        location.href = '/dashboard';
      } else {
        alert('로그인 실패: ' + data.error);
      }
    } catch (error) {
      console.error('네트워크 오류:', error);
    }
  });
  </script>
</body>
</html>
```

### 서버 코드 (Node.js + Express)

```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// ① Payload 파싱 미들웨어
app.use(express.json());

// ② CORS 설정 (다른 도메인 허용)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ③ Endpoint 정의
app.post('/login', async (req, res) => {
  try {
    // ④ Payload 추출
    const { username, password } = req.body;

    // ⑤ 입력 검증
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password required'
      });
    }

    // ⑥ 데이터베이스 조회
    const user = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    // ⑦ 비밀번호 확인
    const isValid = await bcrypt.compare(password, user.passwordHash);

    // ⑧ 응답 Payload 생성
    if (isValid) {
      const token = jwt.sign(
        { userId: user.id },
        'secret_key',
        { expiresIn: '1h' }
      );

      res.json({
        success: true,
        token: token,
        userId: user.id,
        username: user.username
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid password'
      });
    }

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// ⑨ 서버 시작
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## 🔄 HTTP vs WebSocket

### HTTP (일반 웹 통신)

```
요청-응답 방식 (단방향):

클라이언트: "데이터 주세요" → 서버: "여기 있어요"
클라이언트: "업데이트 있어?" → 서버: "없어요"
클라이언트: "업데이트 있어?" → 서버: "없어요"
클라이언트: "업데이트 있어?" → 서버: "있어요!"

- 매번 새로 연결
- 클라이언트가 먼저 요청해야 함
- 일반 웹사이트에 적합
```

### WebSocket (실시간 통신)

```
양방향 연결 (실시간):

클라이언트 ←──────────────→ 서버
         (연결 계속 유지)

서버: "새 메시지!" → 클라이언트 (즉시 푸시)
클라이언트: "메시지 전송" → 서버
서버: "읽음 처리" → 클라이언트

- 연결 한 번 맺으면 계속 유지
- 서버가 먼저 데이터 보낼 수 있음
- 채팅, 게임, 주식 시세 등에 적합
```

**WebSocket 예시:**
```javascript
// 클라이언트
const ws = new WebSocket('wss://chat.example.com');

// 연결 성공
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'join',
    username: 'hong'
  }));
};

// 메시지 수신 (서버가 푸시)
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('새 메시지:', data.message);
};
```

## 🎯 통신 방식 비교

| 특징 | HTTP | WebSocket |
|------|------|-----------|
| **연결** | 요청마다 새로 연결 | 한 번 연결 후 유지 |
| **방향** | 클라이언트 → 서버만 | 양방향 |
| **푸시** | 불가능 (폴링 필요) | 가능 |
| **오버헤드** | 매번 헤더 전송 | 최초 1회만 |
| **용도** | 일반 웹사이트 | 실시간 앱 |
| **예시** | 블로그, 쇼핑몰 | 채팅, 게임, 주식 |

## 🔒 HTTPS (보안 통신)

HTTP에 **암호화**를 추가한 것:

```
HTTP:  Client ───── Server
       (평문 전송, 누구나 볼 수 있음)

HTTPS: Client ──🔒─── Server
       (암호화, 중간에 가로채도 못 봄)
```

**SSL/TLS 암호화:**
1. 서버가 인증서 제공
2. 클라이언트가 인증서 검증
3. 암호화 키 교환
4. 이후 모든 통신 암호화

**주소창에 자물쇠 표시** 🔒 = HTTPS 연결

## 💡 실전 팁

### 1. 네트워크 탭 활용 (Chrome DevTools)

```
F12 → Network 탭

- 모든 HTTP 요청/응답 확인
- Headers: 헤더 정보
- Payload: 요청 본문
- Preview: 응답 데이터
- Timing: 각 단계별 소요 시간
```

### 2. API 테스트 도구

```bash
# curl로 HTTP 요청 보내기
curl -X POST https://api.example.com/login \
  -H "Content-Type: application/json" \
  -d '{"username":"hong","password":"1234"}'

# Postman: GUI 기반 API 테스트 도구
# Thunder Client: VSCode 확장
```

### 3. 에러 처리

```javascript
// 네트워크 오류 대비
fetch('/api/data')
  .then(response => {
    if (!response.ok) {
      throw new Error('HTTP error: ' + response.status);
    }
    return response.json();
  })
  .catch(error => {
    console.error('통신 실패:', error);
    // 사용자에게 친절한 메시지 표시
  });
```

## Relations

- uses [[Endpoint]]
- uses [[Payload]]
- uses [[HTTP Methods]]
- uses [[HTTP Status Codes]]
- used_by [[Chrome Extension]]

---

**난이도**: 초급
**카테고리**: 웹 개발
**마지막 업데이트**: 2026년 1월
