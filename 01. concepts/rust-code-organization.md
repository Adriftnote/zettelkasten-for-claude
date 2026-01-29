---
title: Rust Code Organization
type: concept
tags:
- rust
- modules
- cargo
- crates
- packages
- code-structure
permalink: knowledge/concepts/rust-code-organization
category: Rust
difficulty: 중급
---

# Rust Code Organization

Rust의 모듈 시스템과 Cargo를 통해 코드를 구조화하고 프로젝트를 관리하는 방식입니다.

## 📖 개요

Rust는 packages, crates, modules, paths를 통한 계층적 코드 조직화 시스템을 제공합니다. 이를 통해 대규모 프로젝트에서도 코드의 가독성, 재사용성, 유지보수성을 확보할 수 있습니다. Cargo는 이러한 시스템을 관리하는 빌드 도구입니다.

## 🎭 비유

도서관의 분류 체계처럼 작동합니다. 책들을 섹션(패키지), 선반(크레이트), 책장(모듈), 도서번호(경로)로 조직하여 필요한 책을 빠르게 찾을 수 있습니다.

## ✨ 특징

- **Packages & Crates**: Cargo.toml로 정의된 프로젝트 단위 관리
- **Modules**: 코드를 논리적 단위로 그룹화
- **Privacy by default**: 비공개가 기본, pub으로 명시적 공개
- **Flexible paths**: 절대/상대 경로 모두 지원
- **Workspaces**: 멀티 패키지 프로젝트 관리

## 💡 예시

### Module System 기본

```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}

        pub fn seat_at_table() {}
    }

    mod serving {
        fn take_order() {}
    }
}
```

### Paths 사용

```rust
// 절대 경로
crate::front_of_house::hosting::add_to_waitlist();

// 상대 경로
self::hosting::add_to_waitlist();
super::another_module::function();
```

### use Keyword

```rust
// 기본 사용
use crate::front_of_house::hosting;
hosting::add_to_waitlist();

// 별칭
use std::io::Result as IoResult;

// Re-exporting (공개)
pub use crate::front_of_house::hosting;

// Nested paths
use std::{cmp::Ordering, io};
use std::io::{self, Write};
```

### Visibility 레벨

```rust
pub fn public_function() {}        // 모두 접근 가능
fn private_function() {}           // 기본값: 비공개
pub(crate) fn crate_internal() {}  // 크레이트 내부만
pub(super) fn parent_only() {}     // 부모 모듈만
pub(in path) fn specific() {}      // 특정 경로만
```

### File Separation

```
src/
├── main.rs
├── lib.rs
├── front_of_house.rs              // mod front_of_house;
└── front_of_house/
    ├── hosting.rs                 // pub mod hosting;
    └── serving.rs                 // mod serving;
```

## 📚 Packages & Crates

| 개념 | 정의 | 역할 |
|------|------|------|
| **Package** | Cargo.toml로 정의된 프로젝트 | 프로젝트 경계 정의 |
| **Crate** | 컴파일 단위 (바이너리/라이브러리) | 컴파일 결과 생성 |
| **Crate root** | `main.rs` 또는 `lib.rs` | 모듈 트리의 시작점 |

### Package 구조

```
my_project/
├── Cargo.toml          # Package 정의
├── Cargo.lock          # 의존성 잠금
├── src/
│   ├── main.rs        # Binary crate root
│   ├── lib.rs         # Library crate root
│   └── bin/           # 추가 바이너리
└── tests/             # 통합 테스트
```

## 🔧 Cargo Features

### Release Profiles

```toml
[profile.dev]
opt-level = 0          # 빠른 컴파일, 느린 실행

[profile.release]
opt-level = 3          # 느린 컴파일, 빠른 실행

[profile.test]
opt-level = 1          # 균형
```

### Documentation

```rust
/// 함수 문서 (Doc comment)
///
/// # Arguments
/// * `x` - 첫 번째 숫자
/// * `y` - 두 번째 숫자
///
/// # Returns
/// 두 수의 합
///
/// # Examples
/// ```
/// let result = my_crate::add(2, 3);
/// assert_eq!(result, 5);
/// ```
pub fn add(x: i32, y: i32) -> i32 {
    x + y
}
```

```bash
# 문서 생성 및 열기
cargo doc --open

# 테스트 포함 실행
cargo test --doc
```

### Publishing to crates.io

1. crates.io 계정 생성
2. `cargo login` 실행
3. Cargo.toml 메타데이터 작성
4. `cargo publish` 실행

```toml
[package]
name = "my_awesome_crate"
version = "0.1.0"
edition = "2021"
description = "A brief description"
license = "MIT"
repository = "https://github.com/user/repo"
```

### Workspaces

다중 패키지 프로젝트를 하나의 작업 공간으로 관리:

```toml
# Cargo.toml (workspace root)
[workspace]
members = [
    "adder",
    "add-one",
]
resolver = "2"
```

**장점:**
- 멀티 패키지 의존성 관리
- 공유 `Cargo.lock` (버전 일관성)
- 단일 `target/` 디렉토리 (빌드 최적화)
- 워크스페이스 내 패키지 참조: `add-one = { path = "../add-one" }`

### cargo install

로컬 머신에 바이너리 설치:

```bash
cargo install ripgrep
```

- 바이너리 crate만 설치 가능
- `~/.cargo/bin/`에 저장
- PATH에 자동 추가

## 🎓 모듈 조직화 패턴

### 1. Flat Structure (소규모 프로젝트)

```rust
// lib.rs
pub mod network;
pub mod database;
pub mod utils;
```

### 2. Hierarchical Structure (대규모 프로젝트)

```rust
// lib.rs
pub mod core {
    pub mod network;
    pub mod parser;
}

pub mod utils {
    pub mod logging;
    pub mod validation;
}
```

### 3. Re-export Pattern (공개 API 정리)

```rust
// lib.rs - 내부 구현
mod internal {
    pub mod implementation;
}

// 공개 API
pub use internal::implementation::PublicType;
```

## ⚠️ 일반적인 실수

### 1. Privacy 혼동

```rust
// ❌ 잘못된 예
mod my_module {
    fn helper() {}  // 비공개
}
my_module::helper();  // 에러!

// ✅ 올바른 예
mod my_module {
    pub fn helper() {}
}
my_module::helper();  // OK
```

### 2. use로 모듈 끌어올리기

```rust
// ❌ 비추천
use std::collections::HashMap;
let map = HashMap::new();

// ✅ 추천 (명확성)
use std::collections;
let map = collections::HashMap::new();

// ✅ 관례 (enum)
use std::io::Result;
```

### 3. Glob imports 남용

```rust
// ❌ 남용
use std::collections::*;

// ✅ 필요한 것만
use std::collections::{HashMap, HashSet};
```

## 🔗 Best Practices

1. **모듈명은 단수형**: `mod user` (not `users`)
2. **공개 API 최소화**: re-export로 깔끔한 인터페이스 제공
3. **깊이 제한**: 3-4 레벨 이상 중첩 피하기
4. **일관된 구조**: 팀 내 합의된 조직화 원칙 유지
5. **문서화**: pub 항목은 모두 문서화 (`cargo doc`)

## Relations

- part_of [[rust-language]] - Rust 핵심 기능
- relates_to [[rust-module-system]] - 모듈 시스템 심화
- depends_on [[cargo-ecosystem]] - Cargo 빌드 도구
- used_with [[rust-visibility]] - Privacy 제어
- prerequisite_for [[rust-projects]] - 실제 프로젝트 구성

---

**난이도**: 중급
**카테고리**: Rust
**마지막 업데이트**: 2026년 1월
