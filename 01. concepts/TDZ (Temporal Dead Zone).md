---
title: TDZ (Temporal Dead Zone)
type: concept
tags: [javascript, hoisting, variable, es6, scope]
permalink: knowledge/concepts/tdz-temporal-dead-zone
category: JavaScript
difficulty: 중급
created: 2026-01-22
---

# TDZ (Temporal Dead Zone)

**"let/const 변수가 선언되기 전까지 접근할 수 없는 구간"**

JavaScript ES6에서 도입된 개념. `let`과 `const`로 선언한 변수는 선언문에 도달하기 전까지 접근하면 ReferenceError가 발생합니다.

## 📖 개요

핵심 아이디어: **"호이스팅은 되지만, 초기화 전에는 접근 불가"**

```javascript
// TDZ 시작 ─────────────────┐
console.log(x);  // ❌ ReferenceError!
                 //     (TDZ 구간)
let x = 10;      // ← 여기서 TDZ 끝
// ─────────────────────────┘
console.log(x);  // ✅ 10
```

## 🎭 비유

### 도서관 예약석

```
[var = 아무 자리]
→ 들어가자마자 아무 자리나 앉을 수 있음 (undefined)

[let/const = 예약석]
→ 예약 확인 전까지 앉을 수 없음 (TDZ)
→ 예약 확인(선언) 후에야 앉을 수 있음
```

## 💡 var vs let/const 비교

| 특성 | var | let/const |
|------|-----|-----------|
| **호이스팅** | ✅ (undefined로 초기화) | ✅ (초기화 안 됨) |
| **TDZ** | ❌ 없음 | ✅ 있음 |
| **선언 전 접근** | undefined 반환 | ReferenceError |
| **스코프** | 함수 스코프 | 블록 스코프 |

```javascript
// var: 호이스팅 + undefined 초기화
console.log(a);  // undefined (에러 아님!)
var a = 1;

// let: 호이스팅 + TDZ
console.log(b);  // ❌ ReferenceError
let b = 2;
```

## 💻 예시

### 기본 예시

```javascript
// 함수 전체가 TDZ
function example() {
  // ─── TDZ 시작 ───
  console.log(x);  // ❌ ReferenceError

  if (true) {
    // 여전히 TDZ
  }
  // ─── TDZ 끝 ───
  let x = 10;
  console.log(x);  // ✅ 10
}
```

### typeof도 예외 아님

```javascript
// var는 typeof 안전
console.log(typeof undeclaredVar);  // "undefined"

// let/const의 TDZ에서는 typeof도 에러
console.log(typeof x);  // ❌ ReferenceError
let x = 1;
```

### 함수 파라미터에서의 TDZ

```javascript
// 파라미터도 TDZ 적용
function foo(a = b, b = 2) {
  // a의 기본값에서 b를 참조할 때 b는 아직 TDZ
}
foo();  // ❌ ReferenceError

// 순서 바꾸면 OK
function bar(b = 2, a = b) {
  console.log(a, b);  // 2, 2
}
bar();  // ✅
```

## ⚠️ 흔한 실수

### 클로저에서의 TDZ

```javascript
// ❌ 에러 발생
let callbacks = [];
for (let i = 0; i < 3; i++) {
  callbacks.push(() => console.log(j));  // j는 아직 TDZ
}
let j = 10;
callbacks[0]();  // 실행 시점에는 OK

// 위 코드가 동작하는 이유:
// 클로저 "생성" 시점이 아닌 "실행" 시점에 j를 참조
// 실행 시점에는 j가 선언되어 있음
```

## ✨ TDZ가 존재하는 이유

| 이유 | 설명 |
|------|------|
| **버그 방지** | 선언 전 접근은 대부분 실수 |
| **명확한 코드** | 변수 사용 전 선언 강제 |
| **const 일관성** | const는 반드시 초기화 필요, TDZ로 일관성 유지 |

## 📊 TDZ 발생 키워드

| 키워드 | TDZ |
|--------|-----|
| `var` | ❌ |
| `let` | ✅ |
| `const` | ✅ |
| `class` | ✅ |
| `function` (선언문) | ❌ (전체 호이스팅) |
| `function` (표현식) | let/const와 동일 |

## Relations

- related_to [[JavaScript (JS)]] (ES6에서 도입된 스코프 개념)
- prevents [[Defensive Coding]] (선언 전 접근 실수 방지)
- compare_with [[Hoisting]] (호이스팅은 되지만 초기화 안 됨)
