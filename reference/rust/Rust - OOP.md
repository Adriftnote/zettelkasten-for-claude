---
title: Rust - OOP
type: note
permalink: reference/rust/rust-oop
tags:
- rust
- oop
- trait-objects
- polymorphism
---

# Rust - 객체지향 프로그래밍

Rust의 OOP 특성과 디자인 패턴입니다.

## 개요

- [chapter:: 18]
- [pages:: 696-734]

## OOP Characteristics (pp. 697-703)

| OOP 특성 | Rust 구현 |
|----------|----------|
| Objects | Structs/Enums + impl |
| Encapsulation | `pub` keyword |
| Inheritance | X (Traits로 대체) |
| Polymorphism | Generics + Trait Bounds, Trait Objects |

### Encapsulation 예시

```rust
pub struct AveragedCollection {
    list: Vec<i32>,        // private
    average: f64,          // private
}

impl AveragedCollection {
    pub fn add(&mut self, value: i32) {
        self.list.push(value);
        self.update_average();
    }

    pub fn average(&self) -> f64 {
        self.average
    }

    fn update_average(&mut self) {
        // private method
    }
}
```

## Trait Objects (pp. 703-713)

### 문법

```rust
Box<dyn Trait>
&dyn Trait
```

### 사용 예시

```rust
pub trait Draw {
    fn draw(&self);
}

pub struct Screen {
    pub components: Vec<Box<dyn Draw>>,
}

impl Screen {
    pub fn run(&self) {
        for component in self.components.iter() {
            component.draw();
        }
    }
}
```

### Generics vs Trait Objects

| 방식 | 디스패치 | 이질적 타입 | 성능 |
|------|----------|-------------|------|
| Generics | Static (컴파일 타임) | X | 빠름 |
| Trait Objects | Dynamic (런타임) | O | vtable 오버헤드 |

### Object Safety

Trait Object로 사용 가능하려면:
- 메서드가 `Self`를 반환하지 않음
- 제네릭 타입 파라미터 없음

```rust
// Object-safe
trait Draw {
    fn draw(&self);
}

// NOT object-safe
trait Clone {
    fn clone(&self) -> Self;  // Self 반환
}
```

## State Pattern (pp. 713-732)

### 전통적 OOP 방식

```rust
pub struct Post {
    state: Option<Box<dyn State>>,
    content: String,
}

trait State {
    fn request_review(self: Box<Self>) -> Box<dyn State>;
    fn approve(self: Box<Self>) -> Box<dyn State>;
    fn content<'a>(&self, post: &'a Post) -> &'a str { "" }
}

struct Draft {}
struct PendingReview {}
struct Published {}
```

### Rust 대안 1: Enum으로 상태 표현

```rust
enum PostState {
    Draft,
    PendingReview,
    Published,
}

struct Post {
    state: PostState,
    content: String,
}
```

### Rust 대안 2: 타입으로 상태 인코딩

```rust
struct DraftPost { content: String }
struct PendingReviewPost { content: String }
struct Post { content: String }

impl DraftPost {
    fn request_review(self) -> PendingReviewPost {
        PendingReviewPost { content: self.content }
    }
}

impl PendingReviewPost {
    fn approve(self) -> Post {
        Post { content: self.content }
    }
}
```

**장점:** 컴파일 타임에 잘못된 상태 전이 방지

## Rust의 OOP 철학

> "Prefer composition over inheritance"

- 상속 대신 **Trait composition**
- 다형성은 **Trait bounds** 또는 **Trait objects**
- 상태 기계는 **타입 시스템**으로 인코딩 가능

## 관계

- [part_of:: The Rust Programming Language - 개요]
- [requires:: Rust - Type System]
- [uses:: Trait Objects]
