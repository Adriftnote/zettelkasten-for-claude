---
title: Java
type: concept
tags:
- programming
- java
- jvm
- compiled
- static-typing
permalink: knowledge/concepts/java
category: Programming Languages
difficulty: 중급
created: 2026-01-27
---

# Java

## 📖 개요

**Java**는 1995년 Sun Microsystems(현 Oracle)에서 만든 프로그래밍 언어로, **"Write Once, Run Anywhere"** 철학을 가진 언어입니다. 정적 타입, 객체지향, JVM(Java Virtual Machine)에서 실행됩니다.

## 🎭 비유

**체계적인 레스토랑**과 같습니다.
- 메뉴판 있음 (타입 정의 필수)
- 주문 형식이 정해져 있음 (문법 엄격)
- 잘못된 주문은 접수 거부 (컴파일 에러)

## ⚠️ JavaScript와의 관계

> **완전히 다른 언어입니다!**

| | Java ☕ | JavaScript 🟨 |
|--|--------|---------------|
| 타입 | 정적 (미리 선언) | 동적 (자유) |
| 실행 | JVM (바이트코드) | 인터프리터 |
| 문법 | 엄격함 | 유연함 |
| 용도 | 서버, 안드로이드 | 웹 브라우저 |

**이름이 비슷한 이유**: JavaScript가 Java의 인기에 편승하려고 이름을 빌림 (마케팅)

## ✨ 특징

- **정적 타입**: 모든 변수의 타입을 미리 선언
- **컴파일 + 인터프리터**: 바이트코드로 컴파일 → JVM에서 실행
- **플랫폼 독립**: JVM만 있으면 어디서든 실행
- **객체지향**: 클래스 기반 설계
- **엄격한 문법**: 실수를 미리 방지

## 💡 예시

### 정적 타입의 엄격함

```java
// Java ☕ - 타입 선언 필수
public class Main {
    public static void main(String[] args) {
        int age = 25;           // int 타입 선언
        String name = "홍길동";  // String 타입 선언

        age = "스물다섯";  // ❌ 컴파일 에러! int에 String 불가
    }
}
```

```java
// 함수도 타입 명시
public int add(int a, int b) {
    return a + b;
}

add(5, 3);      // 8 ✅
add("5", 3);    // ❌ 컴파일 에러!
```

### 실행 흐름

```
Java 소스 코드 (.java)
        ↓
[javac 컴파일러]
        ↓
바이트코드 (.class)  ← 중간 코드, 플랫폼 독립
        ↓
[JVM - Java Virtual Machine]
        ↓
[JIT 컴파일] → 기계어
        ↓
CPU 실행
```

### TypeScript와 비교

```
Java:       .java → [javac] → .class (바이트코드) → [JVM] → 실행
TypeScript: .ts   → [tsc]   → .js (JavaScript)   → [Node.js] → 실행

공통점: 둘 다 2단계 변환 (소스 → 중간 코드 → 실행)
차이점: Java는 타입이 런타임에도 존재, TS는 컴파일 후 타입 사라짐
```

## 🛠️ 사용 사례

```
안드로이드 앱
└── Android SDK (Kotlin과 함께 공식 언어)

기업 백엔드
├── Spring Framework
├── 은행, 대기업 시스템
└── 안정성과 성능 중시

빅데이터
├── Hadoop
├── Spark
└── Kafka

게임
└── Minecraft (Java로 작성됨)
```

## Relations

- hub [[프로그래밍 언어 비교 (Programming Languages)]]
- different_from [[javascript]] (이름만 비슷, 완전 다른 언어)
- compared_with [[typescript]] (타입 시스템 유사점)
- is_a [[compiler]] (바이트코드로 컴파일)
- runs_on [[virtual-machine]] (JVM)
