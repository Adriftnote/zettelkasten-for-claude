---
title: Rust - Learning Paths
type: note
permalink: reference/rust/rust-learning-paths
tags:
- rust
- learning
- roadmap
- study-guide
---

# Rust - 학습 경로

The Rust Programming Language 책의 권장 학습 순서입니다.

## Beginner Path (초급)

| 순서 | 주제 | 챕터 | 페이지 | 비고 |
|------|------|------|--------|------|
| 1 | Getting Started | 1 | 10-29 | 설치, Hello World |
| 2 | Basic Concepts | 3 | 58-105 | 변수, 타입, 함수 |
| 3 | **Ownership** | 4 | 105-147 | ⭐ 가장 중요 |
| 4 | Structs & Enums | 5-6 | 147-205 | 데이터 구조화 |
| 5 | Error Handling | 9 | 272-304 | panic!, Result |
| 6 | Testing | 11 | 357-409 | 테스트 작성법 |
| 7 | **minigrep** | 12 | 409-460 | CLI 프로젝트 |

## Intermediate Path (중급)

| 순서 | 주제 | 챕터 | 페이지 |
|------|------|------|--------|
| 1 | Generics & Traits | 10 | 304-357 |
| 2 | Collections | 8 | 242-272 |
| 3 | Modules | 7 | 205-242 |
| 4 | Closures & Iterators | 13 | 460-496 |
| 5 | Cargo Advanced | 14 | 496-528 |
| 6 | **Web Server** | 21 | 839-904 |

## Advanced Path (고급)

| 순서 | 주제 | 챕터 | 페이지 |
|------|------|------|--------|
| 1 | Smart Pointers | 15 | 528-593 |
| 2 | Concurrency | 16 | 593-631 |
| 3 | Async | 17 | 631-696 |
| 4 | OOP Patterns | 18 | 696-734 |
| 5 | Advanced Patterns | 19 | 734-768 |
| 6 | Unsafe & Advanced | 20 | 768-839 |

## 핵심 개념 연결

### Memory Safety Chain
```
Ownership → Borrowing → Lifetimes → Smart Pointers → Arc<Mutex<T>>
```

### Type Abstraction Chain
```
Structs/Enums → Generics → Traits → Trait Objects → Advanced Traits
```

## Quick Reference

| 개념 | 키워드 | 챕터 |
|------|--------|------|
| Ownership | move, clone, drop | 4 |
| Borrowing | &T, &mut T | 4.2 |
| Lifetimes | 'a, 'static | 10.3 |
| Generics | <T>, trait bounds | 10 |
| Error Handling | Result, ?, panic! | 9 |
| Smart Pointers | Box, Rc, RefCell, Arc | 15 |
| Threads | thread, Mutex, channel | 16 |
| Async | async, await, Future | 17 |

## 관계

- [part_of:: The Rust Programming Language - 개요]
- [guides:: Rust - Memory Management]
- [guides:: Rust - Type System]
- [guides:: Rust - Concurrency]
