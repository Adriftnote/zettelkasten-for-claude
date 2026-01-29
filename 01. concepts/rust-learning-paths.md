---
type: concept
title: Rust Learning Paths
permalink: knowledge/concepts/rust-learning-paths
category: Rust
difficulty: 초급
tags:
  - rust
  - learning
  - roadmap
  - study-guide
---

# Rust Learning Paths

**한 줄 정의**: The Rust Programming Language 책의 권장 학습 순서에 따른 체계적인 학습 경로

## 🎭 비유

Rust 학습은 건축 프로젝트와 같습니다. 견고한 기초(Ownership)부터 시작해야 하고, 중급 기술(Traits, Generics)을 습득한 후, 고급 구조(Concurrency, Async)를 다룰 수 있습니다. 순서를 무시하고 진행하면 구조가 무너집니다.

---

## 초급 (Beginner Path)

| 순서 | 주제 | 챕터 | 페이지 | 비고 |
|------|------|------|--------|------|
| 1 | Getting Started | 1 | 10-29 | 설치, Hello World |
| 2 | Basic Concepts | 3 | 58-105 | 변수, 타입, 함수 |
| 3 | **Ownership** | 4 | 105-147 | ⭐ 가장 중요 |
| 4 | Structs & Enums | 5-6 | 147-205 | 데이터 구조화 |
| 5 | Error Handling | 9 | 272-304 | panic!, Result |
| 6 | Testing | 11 | 357-409 | 테스트 작성법 |
| 7 | **minigrep** | 12 | 409-460 | CLI 프로젝트 |

### 핵심 학습 목표
- 기본 문법 및 구조 이해
- Ownership 개념 완전히 습득 (모든 고급 개념의 기초)
- 간단한 프로젝트 완성

---

## 중급 (Intermediate Path)

| 순서 | 주제 | 챕터 | 페이지 |
|------|------|------|--------|
| 1 | Generics & Traits | 10 | 304-357 |
| 2 | Collections | 8 | 242-272 |
| 3 | Modules | 7 | 205-242 |
| 4 | Closures & Iterators | 13 | 460-496 |
| 5 | Cargo Advanced | 14 | 496-528 |
| 6 | **Web Server** | 21 | 839-904 |

### 핵심 학습 목표
- 추상화 기법 습득 (Generics, Traits)
- 함수형 프로그래밍 패턴 이해
- 실제 애플리케이션 구축

---

## 고급 (Advanced Path)

| 순서 | 주제 | 챕터 | 페이지 |
|------|------|------|--------|
| 1 | Smart Pointers | 15 | 528-593 |
| 2 | Concurrency | 16 | 593-631 |
| 3 | Async | 17 | 631-696 |
| 4 | OOP Patterns | 18 | 696-734 |
| 5 | Advanced Patterns | 19 | 734-768 |
| 6 | Unsafe & Advanced | 20 | 768-839 |

### 핵심 학습 목표
- 메모리 안전성 깊이 있게 이해
- 병렬 프로그래밍 패턴
- 성능 최적화 및 저수준 작업

---

## 핵심 개념 연결

### Memory Safety Chain
```
Ownership → Borrowing → Lifetimes → Smart Pointers → Arc<Mutex<T>>
```

### Type Abstraction Chain
```
Structs/Enums → Generics → Traits → Trait Objects → Advanced Traits
```

---

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

---

## Relations

- **part_of**: The Rust Programming Language - 개요
- **guides**: Rust - Memory Management
- **guides**: Rust - Type System
- **guides**: Rust - Concurrency

---

## 메타데이터

| 항목 | 값 |
|------|-----|
| 카테고리 | Rust |
| 난이도 | 초급 |
| 학습 기간 | 3-6개월 (적극적 학습) |
| 업데이트 | 2026-01-29 |
