---
title: Rust Testing
type: concept
permalink: knowledge/concepts/rust-testing
category: Rust
difficulty: 중급
tags:
  - rust
  - testing
  - tdd
  - unit-test
  - integration-test
---

# Rust Testing

Rust의 내장 테스트 프레임워크를 통해 단위 테스트, 통합 테스트, TDD 개발을 효율적으로 수행하는 방법입니다.

**한 줄 정의**: Rust는 `#[test]` 속성과 assertion 매크로를 제공하여 테스트를 언어 수준에서 지원하고, 단위 테스트와 통합 테스트를 구조적으로 분리하여 관리합니다.

## 🎭 비유

Rust의 테스팅은 마치 건설 현장의 품질 관리와 같습니다. 각 부품(단위 테스트)이 제대로 작동하는지 검사하고, 조립된 전체 건물(통합 테스트)이 규격대로 지어졌는지 확인합니다. Rust의 컴파일러가 건물 설계도를 검증한다면, 테스트는 실제 사용 시나리오에서의 안정성을 보증합니다.

## Writing Tests

### Test Functions

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

**주요 특징:**
- `#[test]` 속성으로 테스트 함수 표시
- `#[cfg(test)]`로 테스트 모듈은 테스트 실행 시에만 컴파일
- 컴파일 시간과 바이너리 크기 최적화

### Assertions

| 매크로 | 용도 | 예시 |
|--------|------|------|
| `assert!` | 조건이 참인지 확인 | `assert!(2 + 2 == 4)` |
| `assert_eq!` | 두 값이 같은지 확인 | `assert_eq!(2 + 2, 4)` |
| `assert_ne!` | 두 값이 다른지 확인 | `assert_ne!(2 + 2, 5)` |

### Custom Messages

```rust
assert!(
    result.contains("Carol"),
    "Greeting didn't contain name, value was `{}`",
    result
);
```

테스트 실패 시 더 명확한 오류 메시지를 제공합니다.

### #[should_panic]

```rust
#[test]
#[should_panic(expected = "less than or equal to 100")]
fn greater_than_100() {
    Guess::new(200);
}
```

특정 조건에서 panic이 발생하는지 확인합니다.

### Result in Tests

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
- 더 명시적인 오류 처리 가능

## Test Execution

### 기본 명령어

```bash
cargo test                    # 모든 테스트 실행
cargo test test_name          # 특정 테스트 실행
cargo test --test-threads=1   # 순차 실행 (병렬 비활성화)
cargo test --show-output      # println! 출력 표시
cargo test --ignored          # ignored만 실행
cargo test --include-ignored  # ignored 포함 전부 실행
```

### 테스트 필터링

```bash
cargo test add      # "add" 포함된 테스트만 실행
cargo test tests::  # 특정 모듈의 테스트만 실행
```

### #[ignore] 속성

```rust
#[test]
#[ignore]
fn expensive_test() {
    // 시간이 오래 걸리는 테스트
}
```

기본적으로 실행되지 않지만, `--ignored` 옵션으로 명시적으로 실행할 수 있습니다.

## Test Organization

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
- Private 함수도 테스트 가능
- 컴파일 후 제거됨

### Integration Tests

```
tests/
├── common/
│   └── mod.rs       # 공유 헬퍼 함수
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
- `tests/` 디렉토리에 위치
- 각 파일이 독립적인 crate로 컴파일됨
- Public API만 테스트 가능
- 최종 사용자 관점의 테스트

## TDD: Red-Green-Refactor Cycle

### 사이클 단계

1. **Red**: 실패하는 테스트 작성
2. **Green**: 테스트를 통과시키는 최소한의 코드 작성
3. **Refactor**: 코드 개선 및 최적화

### 실제 예시

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

이 패턴으로 안정적이고 명확한 요구사항 기반의 코드를 작성할 수 있습니다.

## Relations

**Part of**: The Rust Programming Language
**Related to**: Rust - Error Handling, Rust - Projects
**Demonstrates**: Rust - TDD, Red-Green-Refactor Pattern

---

**Category**: Rust | **Difficulty**: 중급 | **Last updated**: 2026-01-29
