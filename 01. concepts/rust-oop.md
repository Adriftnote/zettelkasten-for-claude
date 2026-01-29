---
title: Rust 객체지향 프로그래밍
type: concept
permalink: knowledge/concepts/rust-oop
category: Rust
difficulty: 중급
tags:
  - rust
  - oop
  - trait-objects
  - polymorphism
  - design-patterns
---

# Rust 객체지향 프로그래밍

**한 줄 정의**: Rust는 전통적인 상속 대신 Traits, Trait Objects, Type System을 통해 다형성과 캡슐화를 구현하는 독특한 OOP 철학을 제공합니다.

## 🎭 비유

Rust의 OOP는 전통적인 상속 기반 설계(클래스 계층도)와 달리, **LEGO 블록 조립** 같습니다. 각 블록(Trait)은 독립적이며, 필요한 기능을 자유롭게 조합하여 복잡한 구조를 만듭니다. 상속 대신 **구성(Composition)**으로 유연성을 얻고, 타입 시스템으로 컴파일 타임 안정성을 보장합니다.

## 개요

- **출처**: The Rust Programming Language, Chapter 18
- **페이지**: 696-734
- **핵심 개념**: Encapsulation, Polymorphism, State Patterns

## OOP 특성과 Rust 구현

| OOP 특성 | 전통적 구현 | Rust 구현 |
|----------|-----------|---------|
| **Objects** | 클래스 인스턴스 | Structs/Enums + impl |
| **Encapsulation** | private 필드/메서드 | `pub` keyword |
| **Inheritance** | 클래스 상속 | ✗ (Traits로 대체) |
| **Polymorphism** | 가상 메서드 | Generics + Trait Bounds / Trait Objects |

## Encapsulation (캡슐화)

Rust는 `pub` 키워드로 공개/비공개를 제어합니다.

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
        // private method - 외부에서 접근 불가
    }
}
```

**특징**: 데이터 무결성 보장, 내부 구현 변경 가능

---

## Trait Objects (특성 객체)

### 문법

```rust
Box<dyn Trait>    // 힙 할당
&dyn Trait        // 참조
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
            component.draw();  // 동적 디스패치
        }
    }
}

// 다양한 타입 저장 가능
let screen = Screen {
    components: vec![
        Box::new(Button { label: "OK".to_string() }),
        Box::new(TextField { value: "".to_string() }),
    ],
};
```

### Generics vs Trait Objects

| 측면 | Generics | Trait Objects |
|------|----------|---------------|
| **디스패치** | Static (컴파일 타임) | Dynamic (런타임) |
| **이질적 타입** | ✗ 불가능 | ✓ 가능 |
| **성능** | 빠름 (최적화) | vtable 오버헤드 |
| **코드 크기** | 커짐 (모노모르피즘) | 작음 |
| **사용 시기** | 타입이 정해진 경우 | 다양한 타입 혼합 |

**선택 기준**:
- 타입을 미리 알 수 있으면 → **Generics**
- 런타임에 타입 결정 필요 → **Trait Objects**

### Object Safety (객체 안정성)

Trait Object로 사용 가능하려면:

✓ **Object-Safe**:
- 메서드가 `Self`를 반환하지 않음
- 제네릭 타입 파라미터 없음

```rust
trait Draw {
    fn draw(&self);           // OK
    fn get_size(&self) -> u32; // OK
}
```

✗ **NOT Object-Safe**:
```rust
trait Clone {
    fn clone(&self) -> Self;  // ✗ Self 반환
}

trait Iterator {
    type Item;  // ✗ 연관 타입
}
```

---

## State Pattern (상태 패턴)

### 1. 전통적 OOP 방식 (Trait Objects)

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

impl State for Draft {
    fn request_review(self: Box<Self>) -> Box<dyn State> {
        Box::new(PendingReview {})
    }
    // ...
}
```

**장점**: OOP 패턴과 유사, 상태 추가 용이
**단점**: 런타임 오버헤드, 잘못된 상태 전이 방지 어려움

### 2. Enum으로 상태 표현

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

impl Post {
    pub fn request_review(&mut self) {
        match self.state {
            PostState::Draft => self.state = PostState::PendingReview,
            _ => {} // 불가능한 전이 무시
        }
    }
}
```

**장점**: 간단함, 컴파일 타임 검사 가능
**단점**: 상태별 행동 분산

### 3. 타입으로 상태 인코딩 (Rust 권장)

```rust
struct DraftPost { content: String }
struct PendingReviewPost { content: String }
struct PublishedPost { content: String }

impl DraftPost {
    fn request_review(self) -> PendingReviewPost {
        PendingReviewPost {
            content: self.content
        }
    }
}

impl PendingReviewPost {
    fn approve(self) -> PublishedPost {
        PublishedPost {
            content: self.content
        }
    }
}

// 사용
let post = DraftPost { content: "Hello".to_string() };
let post = post.request_review();
let post = post.approve();
// post.request_review();  // ✗ 컴파일 에러! PublishedPost엔 이 메서드 없음
```

**장점**:
- ✓ 컴파일 타임에 잘못된 상태 전이 방지
- ✓ 각 상태마다 유효한 메서드만 제공
- ✓ 타입 안정성 극대화

**단점**: 코드 보일러플레이트 증가

---

## Rust의 OOP 철학

> **Prefer Composition over Inheritance**

Rust는 다음 원칙을 따릅니다:

1. **상속 대신 Trait Composition**
   ```rust
   // 대신 이렇게:
   trait Drawable { fn draw(&self); }
   trait Resizable { fn resize(&mut self, size: u32); }

   struct Button;
   impl Drawable for Button { /* ... */ }
   impl Resizable for Button { /* ... */ }
   ```

2. **다형성은 Trait Bounds 또는 Trait Objects**
   ```rust
   fn render<T: Drawable>(obj: &T) { /* ... */ }  // 정적
   fn render(obj: &dyn Drawable) { /* ... */ }    // 동적
   ```

3. **상태 기계는 타입 시스템으로 인코딩**
   ```rust
   // 런타임 체크 대신 타입 체크
   struct ValidatedData<T>;
   ```

---

## 실전 예시

### GUI 컴포넌트 시스템

```rust
trait Widget {
    fn draw(&self);
    fn handle_event(&mut self, event: &Event);
}

struct Window {
    children: Vec<Box<dyn Widget>>,
}

impl Window {
    fn render(&self) {
        for child in &self.children {
            child.draw();
        }
    }
}

struct Button { label: String }
struct TextBox { text: String }

impl Widget for Button {
    fn draw(&self) { println!("Button: {}", self.label); }
    fn handle_event(&mut self, _: &Event) { /* ... */ }
}

impl Widget for TextBox {
    fn draw(&self) { println!("TextBox: {}", self.text); }
    fn handle_event(&mut self, _: &Event) { /* ... */ }
}
```

---

## 관계

### Relations

- **part_of**: [[Rust Programming Language Overview|The Rust Programming Language]]
- **requires**: [[rust-type-system|Rust - Type System]]
- **related**: [[trait-system|Rust - Trait System]]
- **uses**: [[polymorphism|Polymorphism Concepts]]
- **alternative_to**: [[class-based-oop|Class-Based OOP]]

---

**난이도**: 중급
**카테고리**: Rust
**마지막 업데이트**: 2026-01-29
**학습 시간**: 3-4시간
