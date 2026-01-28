---
title: Rust - Testing
type: note
permalink: reference/rust/rust-testing
tags:
- rust
- testing
- tdd
- unit-test
- integration-test
---

# Rust - 테스팅

Rust의 내장 테스트 프레임워크입니다.

## 개요

- [chapter:: 11]
- [pages:: 357-409]

## Writing Tests (pp. 358-387)

### Test Functions (pp. 358-365)

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
```

### Assertions

| 매크로 | 용도 | 페이지 |
|--------|------|--------|
| `assert!` | 조건 참인지 | 365-370 |
| `assert_eq!` | 같은지 | 370-374 |
| `assert_ne!` | 다른지 | 370-374 |

### Custom Messages (pp. 374-378)

```rust
assert!(
    result.contains("Carol"),
    "Greeting didn't contain name, value was `{}`",
    result
);
```

### #[should_panic] (pp. 378-385)

```rust
#[test]
#[should_panic(expected = "less than or equal to 100")]
fn greater_than_100() {
    Guess::new(200);
}
```

### Result in Tests (pp. 385-387)

```rust
#[test]
fn it_works() -> Result<(), String> {
    if 2 + 2 == 4 {
        Ok(())
    } else {
        Err(String::from("two plus two does not equal four"))
    }
}
```
- `?` 연산자 사용 가능

## Test Execution (pp. 387-399)

### 기본 명령어

```bash
cargo test                    # 모든 테스트
cargo test test_name          # 특정 테스트
cargo test --test-threads=1   # 순차 실행
cargo test --show-output      # println! 출력
cargo test --ignored          # ignored만 실행
cargo test --include-ignored  # 전부 실행
```

### 테스트 필터링

```bash
cargo test add      # "add" 포함된 테스트
cargo test tests::  # 특정 모듈
```

### #[ignore]

```rust
#[test]
#[ignore]
fn expensive_test() {
    // 시간이 오래 걸리는 테스트
}
```

## Test Organization (pp. 399-409)

### Unit Tests

```rust
// src/lib.rs
pub fn add(a: i32, b: i32) -> i32 { a + b }

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add(2, 3), 5);
    }
}
```

**특징:**
- `src/` 내부에 위치
- `#[cfg(test)]`로 표시
- private 함수도 테스트 가능

### Integration Tests

```
tests/
├── common/
│   └── mod.rs       # 공유 헬퍼
├── integration_test.rs
└── another_test.rs
```

```rust
// tests/integration_test.rs
use my_crate;

mod common;

#[test]
fn test_public_api() {
    common::setup();
    assert_eq!(my_crate::add(2, 3), 5);
}
```

**특징:**
- `tests/` 디렉토리
- 각 파일이 별도 crate
- Public API만 테스트

## TDD 예시: minigrep

- [chapter:: 12.4]
- [pages:: 438-447]

### Red-Green-Refactor 사이클

1. **Red**: 실패하는 테스트 작성
2. **Green**: 테스트 통과하는 최소 코드
3. **Refactor**: 코드 개선

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn one_result() {
        let query = "duct";
        let contents = "\
Rust:
safe, fast, productive.
Pick three.";

        assert_eq!(vec!["safe, fast, productive."], search(query, contents));
    }
}
```

## 관계

- [part_of:: The Rust Programming Language - 개요]
- [related_to:: Rust - Error Handling]
- [demonstrated_in:: Rust - Projects]
