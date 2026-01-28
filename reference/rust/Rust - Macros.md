---
title: Rust - Macros
type: note
permalink: reference/rust/rust-macros
tags:
- rust
- macros
- metaprogramming
- derive
---

# Rust - 매크로 & 메타프로그래밍

컴파일 타임 코드 생성입니다.

## 개요

- [chapter:: 20.5]
- [pages:: 823-838]

## Macros vs Functions (pp. 823-824)

| 특성 | 매크로 | 함수 |
|------|--------|------|
| 실행 시점 | 컴파일 타임 | 런타임 |
| 인자 개수 | 가변 | 고정 |
| 복잡도 | 높음 | 낮음 |
| 디버깅 | 어려움 | 쉬움 |

**매크로의 장점:**
- 컴파일 타임 코드 생성
- 가변 인자 지원
- 트레이트 구현 자동화

## Declarative Macros (macro_rules!)

- [pages:: 824-827]

### 기본 문법

```rust
#[macro_export]
macro_rules! vec {
    ( $( $x:expr ),* ) => {
        {
            let mut temp_vec = Vec::new();
            $(
                temp_vec.push($x);
            )*
            temp_vec
        }
    };
}
```

### 패턴 매칭 기반
- `$x:expr` - 표현식 캡처
- `$( ... ),*` - 반복
- `#[macro_export]` - 외부 공개

## Procedural Macros

- [pages:: 827-838]

### 요구사항
- 별도 crate 필요
- `proc_macro` crate 사용
- `TokenStream` 입출력

### 종류

#### 1. Custom derive (pp. 828-836)

```rust
// 사용
#[derive(HelloMacro)]
struct Pancakes;

// 정의 (별도 crate)
use proc_macro::TokenStream;
use quote::quote;
use syn;

#[proc_macro_derive(HelloMacro)]
pub fn hello_macro_derive(input: TokenStream) -> TokenStream {
    let ast = syn::parse(input).unwrap();
    impl_hello_macro(&ast)
}
```

**필요 crates:**
- `syn` - 파싱
- `quote` - 코드 생성

#### 2. Attribute-like (pp. 836-837)

```rust
#[route(GET, "/")]
fn index() { }
```

```rust
#[proc_macro_attribute]
pub fn route(attr: TokenStream, item: TokenStream) -> TokenStream {
    // ...
}
```

#### 3. Function-like (pp. 837-838)

```rust
let sql = sql!(SELECT * FROM users WHERE id = 1);
```

```rust
#[proc_macro]
pub fn sql(input: TokenStream) -> TokenStream {
    // ...
}
```

## Derivable Traits

- [appendix:: C]
- [pages:: 918-924]

| Trait | 용도 |
|-------|------|
| `Debug` | `{:?}` 포맷팅 |
| `Clone` | `.clone()` 메서드 |
| `Copy` | 비트 복사 |
| `PartialEq` | `==` 비교 |
| `Eq` | 완전 동등성 |
| `PartialOrd` | `<`, `>` 비교 |
| `Ord` | 완전 순서 |
| `Hash` | 해시값 생성 |
| `Default` | 기본값 |

```rust
#[derive(Debug, Clone, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}
```

## 관계

- [part_of:: The Rust Programming Language - 개요]
- [advanced_topic:: true]
