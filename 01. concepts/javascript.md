---
title: JavaScript
type: concept
tags:
- programming
- javascript
- web
- interpreter
- dynamic-typing
permalink: knowledge/concepts/javascript-1
category: Programming Languages
difficulty: 기초
created: 2026-01-27
---

# JavaScript

## 📖 개요

**JavaScript**는 1995년 Netscape에서 만든 프로그래밍 언어로, **웹 브라우저에서 실행되는 유일한 프로그래밍 언어**입니다. 동적 타입, 인터프리터 방식의 언어로, 웹 개발의 필수 언어입니다.

## 🎭 비유

**자유로운 카페**와 같습니다.
- 메뉴판 없음 (타입 정의 없음)
- "아무거나 주세요" → OK
- 커피 시켰는데 피자 나올 수도 있음 (런타임에 에러 발견)

## ⚠️ Java와의 관계

> **"Java와 JavaScript는 '햄'과 '햄스터'만큼 다르다"**

| | Java ☕ | JavaScript 🟨 |
|--|--------|---------------|
| 만든 곳 | Sun Microsystems | Netscape |
| 용도 | 서버, 안드로이드 | 웹 브라우저 |
| 타입 | 정적 (엄격) | 동적 (자유) |
| 실행 | JVM | 브라우저/Node.js |

**이름이 비슷한 이유**: 1995년 Java가 인기 있어서 마케팅 목적으로 이름을 빌려옴

## ✨ 특징

- **동적 타입**: 변수 타입을 선언하지 않음
- **인터프리터**: 한 줄씩 실행
- **브라우저 독점**: 웹 프론트엔드의 유일한 언어
- **유연함**: 거의 모든 것이 허용됨
- **빠른 개발**: 작성 즉시 실행 가능

## 💡 예시

### 동적 타입의 자유로움 (그리고 위험)

```javascript
let x = 42;          // 숫자
x = "hello";         // 문자열로 변경 OK
x = [1, 2, 3];       // 배열로 변경 OK
x = { name: "Kim" }; // 객체로 변경 OK
x = null;            // null로 변경 OK

// 실행해봐야 문제 발견
function add(a, b) {
    return a + b;
}

add(5, 3);      // 8 ✅
add("5", 3);    // "53" ← 문자열 연결됨 🤔
```

### 실행 환경

```
[브라우저]
HTML 페이지 ← <script> 태그로 JS 삽입
     ↓
JavaScript 엔진 (V8, SpiderMonkey 등)
     ↓
실행

[서버]
Node.js ← JavaScript 런타임
     ↓
JavaScript 엔진 (V8)
     ↓
실행
```

## 🛠️ 사용 사례

```
웹 프론트엔드
├── DOM 조작 (버튼 클릭, 애니메이션)
├── React, Vue, Angular (프레임워크)
└── 사용자 인터랙션

웹 백엔드 (Node.js)
├── Express, NestJS (서버 프레임워크)
├── API 서버
└── 실시간 통신 (Socket.io)

기타
├── 모바일 앱 (React Native)
├── 데스크톱 앱 (Electron)
└── 게임 (Phaser)
```

## Relations

- hub [[programming-languages]]
- extended_by [[typescript]] (TypeScript는 JS의 슈퍼셋)
- different_from [[java]] (이름만 비슷, 완전 다른 언어)
- is_a [[interpreter]] (인터프리터 언어)
- runs_on [[runtime]] (브라우저, Node.js)