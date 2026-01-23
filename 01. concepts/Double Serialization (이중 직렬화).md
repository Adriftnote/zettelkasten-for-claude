---
title: Double Serialization (이중 직렬화)
type: concept
tags: [json, serialization, api, debugging, common-mistake]
permalink: knowledge/concepts/double-serialization
category: 데이터 처리
difficulty: 초급
created: 2026-01-22
---

# Double Serialization (이중 직렬화)

**"이미 JSON 문자열인 데이터를 다시 JSON.stringify()하여 발생하는 오류"**

API 호출이나 데이터 전송 시 흔히 발생하는 실수. JSON 문자열을 또 직렬화하면 이스케이프 문자가 추가되어 파싱 실패나 400 에러가 발생합니다.

## 📖 개요

핵심 문제: **"문자열을 객체처럼 다시 직렬화"**

```javascript
// 정상
const obj = { name: "홍길동" };
JSON.stringify(obj);  // '{"name":"홍길동"}'

// ❌ 이중 직렬화
const str = '{"name":"홍길동"}';  // 이미 JSON 문자열
JSON.stringify(str);  // '"{\"name\":\"홍길동\"}"'
//                       ↑ 따옴표와 이스케이프 추가됨!
```

## 🎭 비유

### 택배 포장

```
[정상]
물건 → 상자에 포장 → 배송

[이중 직렬화]
물건 → 상자에 포장 → 또 상자에 포장 → 배송
→ 받는 사람이 상자를 열어도 또 상자가 나옴!
```

## 💡 발생 패턴

### 패턴 1: REST API 습관을 MCP에 적용

```javascript
// REST API (문자열 전달)
fetch('/api', {
  body: JSON.stringify({ data: '{"nested": true}' })  // 문자열 OK
});

// MCP 도구 (자동 stringify)
// ❌ 잘못된 호출
mcp.callTool('create_card', {
  settings: '{"color": "red"}'  // 문자열 전달 → 내부에서 또 stringify
});

// ✅ 올바른 호출
mcp.callTool('create_card', {
  settings: { color: "red" }  // 객체 전달
});
```

### 패턴 2: 변수에 이미 JSON 문자열 저장

```javascript
// ❌ 이미 JSON 문자열인데 또 stringify
const config = localStorage.getItem('config');  // '{"theme":"dark"}'
const body = JSON.stringify({ config });
// 결과: '{"config":"{\"theme\":\"dark\"}"}'

// ✅ parse 후 사용
const config = JSON.parse(localStorage.getItem('config'));
const body = JSON.stringify({ config });
// 결과: '{"config":{"theme":"dark"}}'
```

## 💻 진단 방법

### 이스케이프 문자 확인

```javascript
// ❌ 이중 직렬화 징후
'"{\"name\":\"test\"}"'
//  ↑ 바깥 따옴표 + 내부 이스케이프

// ✅ 정상
'{"name":"test"}'
```

### 콘솔 출력 비교

```javascript
const data = { name: "test" };

// 정상
console.log(JSON.stringify(data));
// {"name":"test"}

// 이중 직렬화
console.log(JSON.stringify(JSON.stringify(data)));
// "{\"name\":\"test\"}"
// ↑ 따옴표로 감싸지고 내부 따옴표가 이스케이프됨
```

## ⚠️ 실제 에러 사례

### MCP 400 Bad Request

```
Metabase API error: Request failed with status code 400
```

**원인**: MCP 도구가 object 타입 파라미터를 자동으로 `JSON.stringify()` 처리

```javascript
// ❌ 문자열 전달 시
visualization_settings: '{"column_settings": {...}}'
// 내부: JSON.stringify('{"column_settings": {...}}')
// 결과: '"{\"column_settings\": {...}}"' → 파싱 실패 → 400

// ✅ 객체 전달 시
visualization_settings: { column_settings: {...} }
// 내부: JSON.stringify({ column_settings: {...} })
// 결과: '{"column_settings": {...}}' → 정상
```

## ✅ 예방 체크리스트

| 체크 | 내용 |
|------|------|
| 1 | 파라미터 타입 확인 (`object` vs `string`) |
| 2 | 이스케이프 문자(`\"`) 보이면 이중 직렬화 의심 |
| 3 | API/도구 문서에서 자동 stringify 여부 확인 |
| 4 | 변수가 이미 JSON 문자열인지 객체인지 확인 |

## 📊 해결 방법

| 상황 | 해결책 |
|------|--------|
| 이미 JSON 문자열 | `JSON.parse()` 후 사용 |
| 자동 stringify API | 객체로 전달 |
| 불확실할 때 | `typeof` 체크 후 조건 처리 |

```javascript
// 불확실할 때 안전한 처리
function safeStringify(data) {
  if (typeof data === 'string') {
    try {
      JSON.parse(data);  // 유효한 JSON이면
      return data;        // 그대로 반환
    } catch {
      return JSON.stringify(data);  // 일반 문자열이면 stringify
    }
  }
  return JSON.stringify(data);  // 객체면 stringify
}
```

## Relations

- causes [[HTTP Status Codes]] - 400 Bad Request의 흔한 원인
- related_to [[api]] - API 호출 시 자주 발생
- prevents [[Defensive Coding]] - 타입 체크로 예방 가능
