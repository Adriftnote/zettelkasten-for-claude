---
title: Rust - Code Organization
type: note
permalink: reference/rust/rust-code-organization
tags:
- rust
- modules
- cargo
- crates
- packages
---

# Rust - 코드 조직화

모듈 시스템과 Cargo를 통한 프로젝트 관리입니다.

## Module System

- [chapter:: 7]
- [pages:: 205-242]

### Packages & Crates (pp. 207-209)

| 개념 | 정의 |
|------|------|
| Package | Cargo.toml로 정의된 프로젝트 |
| Crate | 컴파일 단위 (바이너리/라이브러리) |
| Crate root | `main.rs` 또는 `lib.rs` |

### Modules (pp. 209-215)

```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}
```

**특징:**
- `mod` 키워드로 정의
- 중첩 가능
- Privacy by default

### Paths (pp. 215-227)

```rust
// Absolute (절대 경로)
crate::front_of_house::hosting::add_to_waitlist();

// Relative (상대 경로)
self::hosting::add_to_waitlist();
super::sibling_module::function();
```

### Visibility
```rust
pub fn public_function() {}     // 공개
fn private_function() {}        // 비공개 (기본)
pub(crate) fn crate_only() {}   // 크레이트 내부만
```

### use Keyword (pp. 227-238)

```rust
use crate::front_of_house::hosting;
hosting::add_to_waitlist();

// 별칭
use std::io::Result as IoResult;

// Re-exporting
pub use crate::front_of_house::hosting;

// Nested paths
use std::{cmp::Ordering, io};

// Glob (주의해서 사용)
use std::collections::*;
```

### File Separation (pp. 238-242)

```
src/
├── main.rs
├── lib.rs
├── front_of_house.rs          // mod front_of_house
└── front_of_house/
    └── hosting.rs             // mod hosting
```

## Cargo Features

- [chapter:: 14]
- [pages:: 496-528]

### Release Profiles (pp. 497-499)

```toml
[profile.dev]
opt-level = 0

[profile.release]
opt-level = 3
```

### Documentation (pp. 499-504)

```rust
/// 함수 문서화
/// 
/// # Examples
/// ```
/// let result = my_crate::add(2, 3);
/// ```
pub fn add(a: i32, b: i32) -> i32 { a + b }
```

```bash
cargo doc --open
```

### Publishing to crates.io (pp. 510-516)

1. crates.io 계정 생성
2. `cargo login`
3. Cargo.toml 메타데이터 작성
4. `cargo publish`

```toml
[package]
name = "my_crate"
version = "0.1.0"
edition = "2021"
description = "A brief description"
license = "MIT"
```

### Workspaces (pp. 516-525)

```toml
# Cargo.toml (workspace root)
[workspace]
members = [
    "package1",
    "package2",
]
```

**장점:**
- 멀티 패키지 관리
- 공유 `Cargo.lock`
- 단일 `target/` 디렉토리

### cargo install (pp. 525-528)

```bash
cargo install ripgrep
```
- 바이너리 crate 로컬 설치
- `~/.cargo/bin/`에 저장

## 관계

- [part_of:: The Rust Programming Language - 개요]
- [prerequisite_for:: Rust - Projects]
