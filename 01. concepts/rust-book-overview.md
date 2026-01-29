---
title: The Rust Programming Language - 개요
type: concept
tags:
  - rust
  - programming
  - book
  - reference
  - language-fundamentals
permalink: knowledge/concepts/rust-book-overview
category: Rust
difficulty: 초급
---

# The Rust Programming Language - 개요

Rust 공식 입문서 "The Rust Programming Language"의 구조화된 개념 맵입니다.

## 📖 개요

"The Rust Programming Language"는 936페이지의 공식 입문서로, 21개 장과 7개의 부록으로 구성되어 있습니다. Rust의 핵심 개념부터 고급 주제까지 체계적으로 설명하는 완벽한 학습 가이드입니다.

## 🎭 비유

Rust 학습은 **건축 프로젝트**와 같습니다:
- **기초(기초 문법, 타입, 제어흐름)**: 건물의 기초와 뼈대
- **메모리 관리(소유권, 차용, 라이프타임)**: 구조의 안전성과 안정성을 보장하는 설계 원칙
- **고급 기능(매크로, 비동기, 동시성)**: 건물을 더 기능적이고 효율적으로 만드는 마무리 작업

## 책 정보

| 속성 | 값 |
|------|-----|
| **페이지 수** | 936 |
| **장(Chapters)** | 21 |
| **부록(Appendices)** | 7 |
| **문서** | The Rust Programming Language.pdf |

## 주요 개념 카테고리

이 책은 13개의 핵심 개념 영역으로 구성됩니다:

1. **[[Rust - Memory Management]]** - Ownership, Borrowing, Lifetimes, Smart Pointers
2. **[[Rust - Type System]]** - Types, Structs, Enums, Generics, Traits
3. **[[Rust - Error Handling]]** - panic!, Result, ? operator
4. **[[Rust - Concurrency]]** - Threads, Channels, Mutex, Async
5. **[[Rust - Functional Programming]]** - Closures, Iterators
6. **[[Rust - Collections]]** - Vec, String, HashMap
7. **[[Rust - Control Flow]]** - match, if let, Pattern Matching
8. **[[Rust - Code Organization]]** - Modules, Cargo, Workspaces
9. **[[Rust - Testing]]** - Unit Tests, Integration Tests, TDD
10. **[[Rust - Macros]]** - Declarative, Procedural Macros
11. **[[Rust - Unsafe]]** - Raw Pointers, FFI
12. **[[Rust - OOP]]** - Trait Objects, State Pattern
13. **[[Rust - Projects]]** - Guessing Game, minigrep, Web Server

## 학습 경로

- [[Rust - Learning Paths|학습 경로 가이드]] - 초급/중급/고급 순서

## 핵심 주제

### 메모리 안전성 (Memory Safety)
Rust의 가장 독특한 특징으로, **컴파일 타임**에 메모리 안전성을 보장합니다:
- Ownership System: 메모리 소유권의 명확한 규칙
- Borrowing: 소유권 이전 없이 데이터에 접근
- Lifetimes: 참조의 유효 범위를 추적

### 타입 시스템 (Type System)
강력하고 표현력 있는 타입 시스템:
- Structs와 Enums: 데이터 구조 정의
- Generics: 재사용 가능한 코드 작성
- Traits: 인터페이스와 다형성

### 동시성 (Concurrency)
스레드 안전성을 언어 차원에서 보장:
- Threads: 병렬 처리
- Channels: 스레드 간 통신
- Async/Await: 비동기 프로그래밍

## Relations

- covers [[Ownership System]]
- covers [[Borrowing & References]]
- covers [[Lifetimes]]
- covers [[Smart Pointers]]
- covers [[Concurrency]]
- covers [[Async Programming]]
- related_to [[Systems Programming]]
- related_to [[Memory Safety]]

---

**난이도**: 초급
**카테고리**: Rust
**마지막 업데이트**: 2026년 1월
