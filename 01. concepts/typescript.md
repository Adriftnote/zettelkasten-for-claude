---
title: TypeScript
type: concept
tags:
- programming
- typescript
- javascript
- transpilation
- type-system
- web
permalink: knowledge/concepts/typescript
category: Programming Languages
difficulty: 중급
created: 2026-01-27
---

# TypeScript

## 📖 개요

**TypeScript**는 Microsoft가 개발한 프로그래밍 언어로, **JavaScript에 정적 타입 시스템을 추가**한 언어입니다. JavaScript의 "슈퍼셋(superset)"이라고 불리며, 모든 JavaScript 코드는 유효한 TypeScript 코드입니다.

## 🎭 비유

**JavaScript가 자유로운 메모장**이라면, **TypeScript는 양식이 있는 문서**입니다.
- 메모장: 아무거나 써도 됨 (실행해봐야 문제 발견)
- 양식 문서: 정해진 칸에 맞게 작성 (작성 중에 잘못된 것 발견)

## ✨ 특징

- **정적 타입**: 변수, 함수의 타입을 미리 정의
- **컴파일 시점 검사**: 실행 전에 오류 발견
- **JavaScript로 변환**: 브라우저/Node.js에서 실행하려면 JS로 트랜스파일
- **점진적 도입**: 기존 JS 프로젝트에 조금씩 추가 가능
- **탈출구(any)**: 급할 때 타입 검사 우회 가능

## 💡 예시

### JavaScript vs TypeScript

```javascript
// JavaScript 🟨 - 타입 없음
function add(a, b) {
    return a + b;
}

add(5, 3);        // 8 ✅
add("5", 3);      // "53" ← 의도한 건가?
add(null, undefined); // NaN 💥
```

```typescript
// TypeScript 🔷 - 타입 있음
function add(a: number, b: number): number {
    return a + b;
}

add(5, 3);        // 8 ✅
add("5", 3);      // ❌ 컴파일 에러! string 안 됨
add(null, undefined); // ❌ 컴파일 에러!
```

### 실행 흐름

```
TypeScript 코드 (.ts)
       ↓
[TypeScript 컴파일러 (tsc)]
       ↓
JavaScript 코드 (.js)  ← 타입 정보 사라짐!
       ↓
[Node.js / 브라우저]
       ↓
실행 결과
```

### 타입이 사라지는 예시

```typescript
// 컴파일 전 (TypeScript)
function greet(name: string): string {
    return `Hello, ${name}`;
}
```

```javascript
// 컴파일 후 (JavaScript) - 타입 정보 없음!
function greet(name) {
    return `Hello, ${name}`;
}
```

## 🆚 비교

### TypeScript vs Java

| 특성 | TypeScript | Java |
|------|------------|------|
| 실행 방식 | JS로 트랜스파일 → 인터프리터 | 바이트코드 → JVM |
| 타입 존재 | 컴파일 시점에만 | 런타임에도 존재 |
| 용도 | 웹 개발 | 서버, 안드로이드 |
| 엄격함 | ⭐⭐⭐ | ⭐⭐⭐⭐ |

### 왜 TypeScript를 쓰나?

1. **웹에서 JS가 유일한 선택지** - 브라우저는 JS만 실행
2. **기존 JS 생태계 활용** - npm 200만+ 패키지
3. **점진적 도입 가능** - 한 파일씩 전환
4. **적당한 균형** - 안전성 + 유연성

## 🛠️ 사용 사례

- **웹 프론트엔드**: React, Angular, Vue (TypeScript 지원)
- **웹 백엔드**: Node.js + Express/NestJS
- **데스크톱 앱**: Electron (VS Code가 TypeScript로 작성됨)
- **모바일 앱**: React Native

## Relations

- hub [[programming-languages]]
- is_superset_of [[javascript]]
- uses [[transpilation]]
- compared_with [[java]]
- relates_to [[compiler]] (tsc는 컴파일러)
- runs_on [[runtime]] (Node.js, 브라우저)
