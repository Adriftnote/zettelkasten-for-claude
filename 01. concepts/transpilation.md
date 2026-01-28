---
title: Transpilation (트랜스파일)
type: concept
tags:
- programming
- transpilation
- compilation
- typescript
- babel
permalink: knowledge/concepts/transpilation
category: Programming Basics
difficulty: 중급
created: 2026-01-27
---

# Transpilation (트랜스파일)

## 📖 개요

**Transpilation**은 한 프로그래밍 언어의 소스 코드를 **비슷한 추상화 수준의 다른 언어**로 변환하는 과정입니다. "Source-to-source compilation"이라고도 불립니다.

**컴파일과의 차이**:
- **컴파일**: 고급 언어 → 저급 언어 (기계어/바이트코드)
- **트랜스파일**: 고급 언어 → 고급 언어

## 🎭 비유

**컴파일** = 한국어 소설 → 영어 번역본 (다른 형태로 변환)
**트랜스파일** = 옛날 한국어 → 현대 한국어 (같은 언어의 다른 버전)

## ✨ 특징

- **같은 추상화 수준**: 입력과 출력이 모두 고급 언어
- **호환성 확보**: 새로운 문법 → 구버전에서도 실행 가능
- **타입 추가**: 타입 있는 언어 → 타입 없는 언어로 변환

## 💡 예시

### TypeScript → JavaScript

```typescript
// TypeScript (입력)
function greet(name: string): string {
    return `Hello, ${name}`;
}
```

```javascript
// JavaScript (출력) - 타입 정보 제거됨
function greet(name) {
    return `Hello, ${name}`;
}
```

### Babel: 최신 JS → 구버전 JS

```javascript
// ES6+ (입력) - 최신 문법
const add = (a, b) => a + b;
const arr = [...oldArr, newItem];
```

```javascript
// ES5 (출력) - 구버전 브라우저 호환
var add = function(a, b) { return a + b; };
var arr = oldArr.concat([newItem]);
```

### 실행 흐름

```
[컴파일]
C 코드 → [gcc] → 기계어
  고급        저급 (추상화 수준 ↓)

[트랜스파일]
TypeScript → [tsc] → JavaScript
  고급           고급 (추상화 수준 =)
```

## 🆚 컴파일 vs 트랜스파일

| 구분 | 컴파일 | 트랜스파일 |
|------|--------|-----------|
| 변환 방향 | 고급 → 저급 | 고급 → 고급 |
| 출력 | 기계어, 바이트코드 | 다른 프로그래밍 언어 |
| 예시 | C → 기계어, Java → 바이트코드 | TS → JS, Sass → CSS |
| 목적 | 실행 가능하게 | 호환성, 기능 추가 |

## 🛠️ 대표적인 트랜스파일러

| 도구 | 입력 | 출력 | 목적 |
|------|------|------|------|
| **tsc** | TypeScript | JavaScript | 타입 시스템 추가 |
| **Babel** | ES6+ JS | ES5 JS | 구버전 브라우저 호환 |
| **Sass** | SCSS | CSS | CSS 확장 문법 |
| **CoffeeScript** | CoffeeScript | JavaScript | 간결한 문법 |

## Relations

- hub [[programming-basics]]
- used_by [[typescript]] (TS는 트랜스파일 언어)
- contrasts_with [[compiler]] (컴파일은 저급 언어로 변환)
- relates_to [[javascript]] (트랜스파일의 주요 타깃)
