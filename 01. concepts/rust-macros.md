---
title: Rust - Macros (러스트 매크로)
type: concept
tags:
  - rust
  - macros
  - metaprogramming
  - derive
  - code-generation
permalink: knowledge/concepts/rust-macros
category: Rust
difficulty: 고급
---

# Rust - Macros (러스트 매크로)

**컴파일 타임에 코드를 자동으로 생성하는 메타프로그래밍 도구**입니다.

## 📖 개요

매크로(Macro)는 함수처럼 보이지만 컴파일 시점에 다른 코드를 생성하는 Rust의 강력한 기능입니다. 코드의 중복을 제거하고, 트레이트를 자동으로 구현하며, 도메인 특화 언어(DSL)를 만들 수 있습니다.

참고: The Rust Programming Language - Chapter 20.5 (pp. 823-838), Appendix C (pp. 918-924)

## 🎭 비유

| 상황 | 함수 | 매크로 |
|------|------|--------|
| **공장** | 제품을 만드는 기계 | 공장을 만드는 공장 |
| **청사진** | 완성된 건물 설계도 | 설계도를 자동으로 만드는 도구 |
| **생산** | 런타임에 실행 | 컴파일 타임에 생성 |

## ✨ Macros vs Functions

| 특성 | 매크로 | 함수 |
|------|--------|------|
| **실행 시점** | 컴파일 타임 | 런타임 |
| **인자 개수** | 가변 | 고정 |
| **복잡도** | 높음 | 낮음 |
| **디버깅** | 어려움 | 쉬움 |
| **호출 방식** | `macro!()` | `func()` |

**매크로의 장점:**
- 컴파일 타임 코드 생성으로 런타임 오버헤드 없음
- 가변 인자 지원 (`println!`, `vec!`)
- 트레이트 구현 자동화 (`#[derive]`)
- 도메인 특화 언어(DSL) 구현 가능

## 💡 Declarative Macros (`macro_rules!`)

### 기본 개념

선언적 매크로는 패턴 매칭을 기반으로 동작합니다. 입력 토큰을 패턴과 비교하여 매칭되는 분기의 코드를 생성합니다.

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

### 핵심 요소

| 요소 | 설명 | 예시 |
|------|------|------|
| **`( ... ) => { ... }`** | 규칙 | 패턴 → 생성 코드 |
| **`$x:expr`** | 표현식 캡처 | 모든 Rust 표현식 |
| **`$( ... ),*`** | 반복 패턴 | 0개 이상 반복 |
| **`#[macro_export]`** | 외부 공개 | 다른 crate에서 사용 가능 |

### 캡처 유형

```rust
$x:expr      // 표현식
$x:ty        // 타입
$x:pat       // 패턴
$x:item      // 아이템 (fn, struct 등)
$x:stmt      // 문(statement)
$x:block     // 코드 블록
$x:path      // 경로 (module::item)
$x:tt        // 토큰 트리
```

### 반복 문법

```rust
$( ... ),*    // 0개 이상, `,` 구분
$( ... ),+    // 1개 이상, `,` 구분
$( ... );*    // 0개 이상, `;` 구분
$( ... );+    // 1개 이상, `;` 구분
```

## 🔧 Procedural Macros

### 개념

절차적 매크로는 Rust 코드를 `TokenStream`으로 받아 처리하고 새로운 `TokenStream`을 반환합니다. 더 강력하지만 별도의 crate가 필요합니다.

### 요구사항

```toml
# Cargo.toml
[lib]
proc-macro = true

[dependencies]
proc-macro2 = "1.0"
quote = "1.0"
syn = { version = "2.0", features = ["full"] }
```

- `syn`: Rust 구문 파싱
- `quote`: 코드 생성
- `proc_macro2`: TokenStream 처리

### 1. Custom Derive Macros

**가장 일반적인 절차적 매크로** - 구조체/열거형에 자동으로 트레이트를 구현합니다.

```rust
// 사용
#[derive(HelloMacro)]
struct Pancakes;

// 정의 (별도 crate hello_macro_derive)
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput};

#[proc_macro_derive(HelloMacro)]
pub fn hello_macro_derive(input: TokenStream) -> TokenStream {
    let input = parse_macro_input!(input as DeriveInput);
    let name = &input.ident;

    let expanded = quote! {
        impl HelloMacro for #name {
            fn hello_macro() {
                println!("Hello, Macro! My name is {}", stringify!(#name));
            }
        }
    };

    TokenStream::from(expanded)
}
```

**주요 특징:**
- 가장 사용하기 쉬운 절차적 매크로
- Cargo.toml에서 `proc-macro = true` 필수
- `#[derive(...)]` 속성으로 사용

### 2. Attribute-like Macros

함수나 구조체에 커스텀 속성을 추가하여 동작을 제어합니다.

```rust
// 사용
#[route(GET, "/")]
fn index() {
    // ...
}

// 정의
#[proc_macro_attribute]
pub fn route(attr: TokenStream, item: TokenStream) -> TokenStream {
    // attr: GET, "/"
    // item: fn index() { ... }
    // 처리하여 새로운 코드 반환
}
```

**활용 사례:**
- 웹 프레임워크의 라우팅 (`#[get("/")]`)
- 테스트 속성 (`#[test]`)
- 직렬화 설정 (`#[serde(rename = "...")]`)

### 3. Function-like Macros

매크로를 함수처럼 호출하되 임의의 문법을 지원합니다.

```rust
// 사용
let sql = sql!(SELECT * FROM users WHERE id = 1);

// 정의
#[proc_macro]
pub fn sql(input: TokenStream) -> TokenStream {
    // SQL 쿼리를 파싱하여 안전한 Rust 코드로 변환
}
```

**활용 사례:**
- SQL 쿼리 빌더
- 정규식 컴파일타임 검증
- 설정 파싱 (`launchpad!` 매크로)

## 📋 Derivable Traits

Rust 표준 라이브러리의 여러 트레이트는 `#[derive]`로 자동 구현됩니다.

| Trait | 용도 | 예시 |
|-------|------|------|
| `Debug` | 디버그 포맷팅 | `println!("{:?}", value)` |
| `Clone` | 깊은 복사 | `value.clone()` |
| `Copy` | 얕은 복사 (값 타입) | 할당 시 자동 복사 |
| `PartialEq` | 부분 동등성 비교 | `a == b` |
| `Eq` | 완전 동등성 (반사성) | `#[derive(Eq, PartialEq)]` |
| `PartialOrd` | 부분 순서 비교 | `a < b` |
| `Ord` | 완전 순서 (모든 값 비교 가능) | `#[derive(Ord, PartialOrd)]` |
| `Hash` | 해시값 생성 | HashMap 키로 사용 |
| `Default` | 기본값 초기화 | `Point::default()` |

### 사용 예시

```rust
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
struct Point {
    x: i32,
    y: i32,
}

impl Default for Point {
    fn default() -> Self {
        Point { x: 0, y: 0 }
    }
}

// 또는
#[derive(Default)]
struct Point {
    x: i32,
    y: i32,
}
```

### 주의사항

- `Copy`: `Clone`과 함께 사용되어야 함
- `Eq`: `PartialEq`를 먼저 구현해야 함
- `Ord`: `PartialOrd`, `Eq`, `PartialEq` 모두 필요

## ⚡ 매크로 디버깅

```bash
# 전개된 매크로 코드 확인
cargo install cargo-expand
cargo expand

# 특정 매크로만 보기
cargo expand --lib path::to::module
```

## Relations

- part_of [[The Rust Programming Language]]
- related_to [[Procedural Macros]]
- related_to [[Declarative Macros]]
- used_for [[Code Generation]]
- related_to [[Metaprogramming]]
- enables [[Domain Specific Languages (DSL)]]

---

**난이도**: 고급
**카테고리**: Rust
**마지막 업데이트**: 2026년 1월
