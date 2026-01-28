---
title: Rust - Type System
type: note
permalink: reference/rust/rust-type-system
tags:
- rust
- types
- generics
- traits
- structs
- enums
---

# Rust - 타입 시스템 & 추상화

Rust의 강력한 타입 시스템과 추상화 메커니즘입니다.

## Basic Types

- [chapter:: 3.2]
- [pages:: 66-79]

### Scalar Types (pp. 66-70)
- integers: `i8`~`i128`, `u8`~`u128`
- floats: `f32`, `f64`
- `bool`
- `char` (Unicode)

### Compound Types (pp. 70-79)
- tuples: `(T1, T2, ...)`
- arrays: `[T; N]`

## Structs

- [chapter:: 5]
- [pages:: 147-177]

### Defining & Instantiating (pp. 148-158)
- Field init shorthand
- Struct update syntax: `..other`
- Tuple structs
- Unit-like structs

### Methods (pp. 168-177)
```rust
impl Block
&self, &mut self, self
Self::new()  // Associated functions
```

## Enums

- [chapter:: 6]
- [pages:: 177-205]

### Defining Enums (pp. 178-186)
- Variants with data
- `Option<T>`: `Some(T) | None`

### Pattern Matching (pp. 189-199)
- `match` expression
- Exhaustiveness checking
- Catch-all: `_` pattern

### Concise Control (pp. 199-203)
- `if let`
- `let...else`

## Generics

- [chapter:: 10.1]
- [pages:: 305-322]

```rust
fn foo<T>(x: T)        // Functions
struct Point<T>        // Structs
enum Option<T>         // Enums
```

### Performance
- Monomorphization - 컴파일 타임 특화 (zero-cost)

## Traits

- [chapter:: 10.2]
- [pages:: 322-336]

### Basic Traits (pp. 322-326)
```rust
trait Summary {
    fn summarize(&self) -> String;
}
```

### Trait Bounds (pp. 326-330)
```rust
T: Display + Clone
```

### Advanced Traits (Chapter 20.2, pp. 789-807)

| 개념 | 페이지 | 예시 |
|------|--------|------|
| Associated Types | 789-791 | `type Item;` |
| Default Generic Parameters | 791-795 | `Add<Rhs=Self>` |
| Fully Qualified Syntax | 795-801 | `<Type as Trait>::function()` |
| Supertraits | 801-805 | `trait OutlinePrint: Display` |
| Newtype Pattern | 805-807 | Orphan rule 우회 |

## Advanced Types

- [chapter:: 20.3]
- [pages:: 807-816]

| 타입 | 문법 | 용도 |
|------|------|------|
| Type Aliases | `type Kilometers = i32;` | 타입 별칭 |
| Never Type | `!` | 절대 반환하지 않는 함수 |
| DST | `str`, `?Sized` | 동적 크기 타입 |

## 타입 추상화 단계

```
Structs/Enums → Generics → Traits → Trait Objects → Advanced Traits
```

## 관계

- [part_of:: The Rust Programming Language - 개요]
- [related_to:: Rust - Memory Management]
- [prerequisite_for:: Rust - OOP]
