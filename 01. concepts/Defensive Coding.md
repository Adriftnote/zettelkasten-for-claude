---
title: Defensive Coding
type: concept
tags: [programming, best-practice, error-handling, reliability]
permalink: knowledge/concepts/defensive-coding
category: 프로그래밍 원칙
difficulty: 초급
created: 2026-01-22
---

# Defensive Coding

**"예상치 못한 입력이나 상황에도 프로그램이 안전하게 동작하도록 코드를 작성하는 기법"**

"최악의 상황을 가정하고 코딩하라"는 원칙. 외부 입력, API 응답, 사용자 행동 등 제어할 수 없는 요소에 대비합니다.

## 📖 개요

핵심 아이디어: **"신뢰하지 말고 검증하라 (Trust No One)"**

```javascript
// ❌ 낙관적 코드
const name = user.profile.name;

// ✅ 방어적 코드
const name = user?.profile?.name ?? 'Unknown';
```

## 🎭 비유

### 운전할 때

```
[낙관적 운전]
"저 차가 깜빡이를 켰으니 우회전 하겠지" → 💥

[방어적 운전]
"깜빡이를 켰어도 직진할 수 있어" → 확인 후 진행 → ✅ 안전
```

## 💡 핵심 패턴

### 1. Null/Undefined 가드

```javascript
// ❌ 위험
function getLength(arr) {
  return arr.length;  // arr이 null이면 에러
}

// ✅ 방어적
function getLength(arr) {
  if (!arr) return 0;
  return arr.length;
}

// ✅ 또는 Optional Chaining
function getLength(arr) {
  return arr?.length ?? 0;
}
```

### 2. 빈 배열 가드 (Empty Array Guard)

```javascript
// ❌ 위험 - API가 빈 배열 반환 시 에러
const firstItem = response.data[0].name;

// ✅ 방어적
const firstItem = response.data?.[0]?.name ?? 'default';

// ✅ 또는 명시적 체크
if (response.data && response.data.length > 0) {
  const firstItem = response.data[0].name;
} else {
  handleEmptyResponse();
}
```

### 3. 타입 검증

```javascript
// ❌ API 응답을 그대로 신뢰
function processUser(user) {
  return user.name.toUpperCase();
}

// ✅ 타입 검증 후 처리
function processUser(user) {
  if (typeof user?.name !== 'string') {
    throw new Error('Invalid user data');
  }
  return user.name.toUpperCase();
}
```

### 4. 범위 검증

```javascript
// ❌ 입력값 그대로 사용
function getElement(index) {
  return array[index];
}

// ✅ 범위 검증
function getElement(index) {
  if (index < 0 || index >= array.length) {
    return null;
  }
  return array[index];
}
```

## 💻 실제 사례

### n8n 빈 배열 처리

```javascript
// ❌ n8n에서 흔한 실수
// API가 빈 배열 반환 시 다음 노드에서 에러
$input.all()[0].json.data  // undefined 에러!

// ✅ 방어적 처리
const items = $input.all();
if (items.length === 0) {
  return [{ json: { error: 'No data' } }];
}
return items;
```

### API 응답 처리

```javascript
// ❌ API 응답 구조 가정
async function fetchUser(id) {
  const response = await api.get(`/users/${id}`);
  return response.data.user.profile.name;
}

// ✅ 방어적 처리
async function fetchUser(id) {
  try {
    const response = await api.get(`/users/${id}`);

    if (!response?.data?.user) {
      throw new Error('Invalid response structure');
    }

    return response.data.user.profile?.name ?? 'Unknown';
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}
```

## 📊 방어 레벨

| 레벨 | 검증 대상 | 예시 |
|------|----------|------|
| **L1** | Null/Undefined | `value ?? default` |
| **L2** | 타입 | `typeof x === 'string'` |
| **L3** | 범위/형식 | `x >= 0 && x < max` |
| **L4** | 비즈니스 규칙 | `age >= 18` |

## ⚠️ 흔한 취약점

| 취약점 | 방어 방법 |
|--------|----------|
| `obj.prop` | `obj?.prop` |
| `arr[0]` | `arr?.[0]` 또는 length 체크 |
| `JSON.parse(str)` | try-catch로 감싸기 |
| `Number(input)` | `isNaN()` 체크 |
| API 응답 | 구조 검증 |

## ✅ 체크리스트

| 체크 | 내용 |
|------|------|
| 1 | 외부 입력은 항상 검증 |
| 2 | API 응답 구조 가정하지 않기 |
| 3 | 배열 접근 전 length 체크 |
| 4 | Optional Chaining 활용 (`?.`) |
| 5 | Nullish Coalescing으로 기본값 (`??`) |
| 6 | try-catch로 예외 처리 |

## 🔧 유용한 유틸리티

```javascript
// 안전한 JSON 파싱
function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

// 안전한 배열 첫 번째 요소
function safeFirst(arr, fallback = null) {
  return arr?.[0] ?? fallback;
}

// 안전한 객체 속성 접근
function safeGet(obj, path, fallback = null) {
  return path.split('.').reduce(
    (acc, key) => acc?.[key],
    obj
  ) ?? fallback;
}

// 사용 예
safeGet(user, 'profile.address.city', 'Unknown');
```

## 💡 언제 방어적이어야 하나?

| 상황 | 방어 수준 |
|------|----------|
| 외부 API 응답 | 🔴 최대 |
| 사용자 입력 | 🔴 최대 |
| 설정 파일 | 🟡 중간 |
| 내부 함수 호출 | 🟢 기본 |
| 타입 시스템 보장 | 🟢 최소 |

## Relations

- prevents [[Race Condition]] - 예상치 못한 상태 대비
- uses [[TDZ (Temporal Dead Zone)]] - 변수 선언 순서 주의
- related_to [[graceful-degradation]] - 실패 시에도 동작 유지
- prevents [[Double Serialization (이중 직렬화)]] - 타입 검증으로 방지
