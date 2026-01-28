---
title: Rust - Functional Programming
type: note
permalink: reference/rust/rust-functional-programming
tags:
- rust
- functional
- closures
- iterators
---

# Rust - 함수형 프로그래밍

Closures와 Iterators를 활용한 함수형 프로그래밍 패러다임입니다.

## 개요

- [chapter:: 13]
- [pages:: 460-496]

## Closures

- [pages:: 461-478]

### 기본 문법
```rust
|param| { body }
|x| x + 1           // 단일 표현식
|x, y| x + y        // 다중 파라미터
```

### Capturing Environment (pp. 461-464)
- 주변 변수 캡처 가능
- 함수와의 핵심 차이점

### Capture Modes (pp. 468-471)

| 모드 | 문법 | 설명 |
|------|------|------|
| Immutable borrow | `&T` | 기본 |
| Mutable borrow | `&mut T` | 변경 필요시 |
| Move | `move \|\| ...` | 소유권 이동 |

### Fn Traits (pp. 471-478)

| Trait | 설명 | 호출 횟수 |
|-------|------|----------|
| `FnOnce` | 소유권 이동 | 1번 |
| `FnMut` | 가변 borrow | 여러 번 |
| `Fn` | 불변 borrow | 여러 번 |

## Iterators

- [pages:: 478-487]

### Iterator Trait (pp. 478-481)

```rust
pub trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
}
```

### 이터레이터 생성 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| `.iter()` | `&T` | 불변 참조 |
| `.iter_mut()` | `&mut T` | 가변 참조 |
| `.into_iter()` | `T` | 소유권 이동 |

### Consuming Adapters (pp. 481-484)

```rust
.sum()      // 합계
.collect()  // 컬렉션으로 변환
.count()    // 개수
```

- 이터레이터를 소비 (consume)

### Iterator Adapters (pp. 484-487)

```rust
.map(|x| x * 2)      // 변환
.filter(|x| x > 0)   // 필터링
.take(5)             // N개만
.skip(3)             // N개 건너뛰기
```

**특징:**
- Lazy evaluation (게으른 평가)
- 체이닝 가능
- 클로저와 함께 사용

## Performance (pp. 494-495)

> Zero-cost abstractions

- 이터레이터는 for 루프만큼 빠름
- 컴파일 타임 최적화

## 실전 적용: minigrep 리팩토링

- [pages:: 487-494]

```rust
// Before
let args: Vec<String> = env::args().collect();

// After
Config::build(env::args())

// search 함수
contents
    .lines()
    .filter(|line| line.contains(query))
    .collect()
```

## Functional to Concurrent

```
Closures → move Closures → thread::spawn → async move
```

## 관계

- [part_of:: The Rust Programming Language - 개요]
- [used_in:: Rust - Concurrency]
- [demonstrated_in:: Rust - Projects]
