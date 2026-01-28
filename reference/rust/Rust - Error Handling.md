---
title: Rust - Error Handling
type: note
permalink: reference/rust/rust-error-handling
tags:
- rust
- error-handling
- result
- panic
---

# Rust - 에러 처리

Rust는 복구 가능/불가능 에러를 명확히 구분합니다.

## 개요

- [chapter:: 9]
- [pages:: 272-304]

## Unrecoverable Errors: panic!

- [pages:: 273-279]

```rust
panic!("crash and burn");
```

### 디버깅
```bash
RUST_BACKTRACE=1 cargo run
```

## Recoverable Errors: Result<T, E>

- [pages:: 279-296]

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

### Matching on Errors (pp. 281-285)
```rust
match result {
    Ok(value) => value,
    Err(error) => handle_error(error),
}
```

### ? Operator (pp. 285-293)

```rust
fn read_file() -> Result<String, io::Error> {
    let content = fs::read_to_string("file.txt")?;
    Ok(content)
}
```

**특징:**
- 에러 자동 전파
- `From` trait으로 타입 변환
- `Option<T>`에도 사용 가능

## Guidelines (pp. 296-303)

### When to panic!
- 예제, 프로토타입
- 테스트
- 불변 조건 위반

### When to use Result
- 프로덕션 코드
- 복구 가능한 에러
- 호출자에게 선택권 제공

## 에러 처리 발전 단계

```
panic! → Result<T, E> → ? operator → #[should_panic]
```

## 관계

- [part_of:: The Rust Programming Language - 개요]
- [related_to:: Rust - Testing]
- [used_in:: Rust - Projects]
