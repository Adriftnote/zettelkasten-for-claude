---
title: Rust Error Handling
type: concept
tags: [rust, error-handling, result, panic, recoverable, unrecoverable]
permalink: knowledge/concepts/rust-error-handling
category: Rust
difficulty: 중급
created: 2026-01-29
---

# Rust Error Handling

**"Rust는 복구 가능한 에러(Result)와 불가능한 에러(panic)를 명확히 구분하여 처리하는 방식"**

Rust의 에러 처리는 컴파일 타임에 에러 상황을 강제로 고려하게 만들어 안정성을 보장합니다. 패턴 매칭과 ? 연산자를 통해 우아한 에러 처리가 가능합니다.

## 📖 개요

Rust는 두 가지 에러 처리 방식을 명확히 구분합니다.

| 유형 | 특징 | 용도 | 함수 |
|------|------|------|------|
| **Unrecoverable** | 프로그램 즉시 종료 | 불가능한 상황 | `panic!()` |
| **Recoverable** | 에러 반환 후 계속 | 복구 가능한 에러 | `Result<T, E>` |

## 🎭 비유

### 자동차 운전

```
[불가능한 에러 - panic!]
엔진이 물리적으로 분해됨 → 운전할 수 없음 → 즉시 중단
(프로그램이 할 수 있는 게 없음)

[복구 가능한 에러 - Result]
휘발유가 떨어짐 → Result::Err 반환
→ 운전자(호출자)가 결정: 주유소 가거나, 다른 교통수단 사용
(상황에 따라 대응 가능)
```

### 식당 주문

```
[Panic - 불가능한 에러]
"저희 식당은 운영 중입니다... 잠깐만요"
→ 주방이 불을 질렀음 → 건물 대피
→ 아무것도 할 수 없음 → panic!

[Result - 복구 가능한 에러]
"죄송하지만 오늘 소고기가 떨어졌습니다"
→ 손님(호출자)이 선택: 돼지고기 주문 또는 다른 식당 가기
→ 프로그램이 계속 실행
```

## 💡 Unrecoverable Errors: panic!

프로그램이 계속될 수 없는 상황에서 사용합니다.

```rust
panic!("crash and burn");
```

### 언제 사용할까?

| 상황 | 예제 |
|------|------|
| **예제, 프로토타입** | 문제 해결 방식 시연 |
| **테스트** | 테스트 데이터에 panic 넣기 |
| **불변 조건 위반** | 배열 범위 초과, null 포인터 역참조 |
| **회복 불가능** | 디스크 풀, 메모리 부족 |

### 디버깅

```bash
# 백트레이스 출력
RUST_BACKTRACE=1 cargo run

# 상세 백트레이스 (최적화 없음)
RUST_BACKTRACE=full cargo run
```

### 백트레이스 읽기

```
thread 'main' panicked at 'crash and burn', src/main.rs:2:5
stack backtrace:
   0: rust_begin_unwind
   1: core::panicking::panic_fmt
   2: my_app::main
             ↑ 여기서 panic이 발생함
```

## 💻 Recoverable Errors: Result<T, E>

복구 가능한 에러를 처리하는 표준 방식입니다.

```rust
enum Result<T, E> {
    Ok(T),      // 성공: 값을 포함
    Err(E),     // 실패: 에러를 포함
}
```

### 기본 사용: match 패턴 매칭

```rust
use std::fs::File;

fn main() {
    let file = File::open("hello.txt");

    match file {
        Ok(file) => {
            println!("File opened successfully!");
        },
        Err(error) => {
            println!("Problem opening the file: {:?}", error);
        }
    }
}
```

### 에러별 처리 (match guard)

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let file = File::open("hello.txt");

    match file {
        Ok(file) => println!("File opened"),
        Err(error) => match error.kind() {
            ErrorKind::NotFound => {
                println!("File not found, creating it...");
                // 파일 생성 로직
            },
            ErrorKind::PermissionDenied => {
                println!("Permission denied");
            },
            other_error => panic!("Other error: {:?}", other_error),
        }
    }
}
```

## 🚀 ? 연산자 (에러 전파)

가장 우아한 에러 처리 방식입니다.

```rust
use std::fs;
use std::io;

// ? 연산자 사용
fn read_username_from_file() -> Result<String, io::Error> {
    let mut username = String::new();
    let mut file = File::open("hello.txt")?;
    file.read_to_string(&mut username)?;
    Ok(username)
}

// 위 코드와 동등하지만 명시적인 방식
fn read_username_from_file_explicit() -> Result<String, io::Error> {
    let mut username = String::new();
    let mut file = match File::open("hello.txt") {
        Ok(file) => file,
        Err(e) => return Err(e),  // 에러 즉시 반환
    };
    match file.read_to_string(&mut username) {
        Ok(_) => Ok(username),
        Err(e) => Err(e),
    }
}
```

### ? 연산자의 작동 원리

```rust
// ? 연산자가 있으면
value?

// 내부적으로는
match value {
    Ok(val) => val,
    Err(e) => return Err(e),  // 즉시 반환
}
```

### ? 연산자 규칙

```rust
// ✅ 함수 반환 타입이 Result이어야 함
fn ok_function() -> Result<String, io::Error> {
    let x = some_result()?;  // OK
    Ok(x)
}

// ❌ 반환 타입이 ()이면 ? 사용 불가
fn bad_function() {
    let x = some_result()?;  // 컴파일 에러!
}

// ✅ main에서도 사용 가능 (Rust 1.50+)
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let f = File::open("hello.txt")?;
    Ok(())
}
```

### 체이닝

```rust
// 여러 ? 연산자 체이닝
fn read_file_chain() -> Result<String, io::Error> {
    fs::read_to_string("hello.txt")  // 이미 Result 반환
}

// 메서드 체이닝과 함께
fn parse_config() -> Result<Config, ParseError> {
    let content = fs::read_to_string("config.txt")?;
    let config = parse_json(&content)?;
    Ok(config)
}
```

## 📊 에러 타입 변환

? 연산자는 자동으로 에러를 변환할 수 있습니다.

```rust
use std::io;
use std::num::ParseIntError;

// 여러 에러 타입을 하나의 에러 타입으로 통합
fn complicated_function() -> Result<i32, Box<dyn std::error::Error>> {
    let file = File::open("file.txt")?;      // io::Error
    let content = fs::read_to_string("file")?;
    let number: i32 = content.trim().parse()?;  // ParseIntError
    // ? 연산자가 자동으로 Box<dyn std::error::Error>로 변환
    Ok(number)
}

// From trait을 구현하면 자동 변환
impl From<ParseIntError> for MyError {
    fn from(err: ParseIntError) -> MyError {
        MyError::ParseError(err)
    }
}
```

## 🎯 언제 panic! vs Result?

### panic! 사용하기

```rust
// ✅ 예제 코드
let v = vec![1, 2, 3];
println!("{}", v[99]);  // panic! (전개 프로세스는 선택)

// ✅ 테스트
#[test]
fn it_works() {
    panic!("Make this test fail");
}

// ✅ 불가능한 상황
match some_value {
    Some(val) => process(val),
    None => panic!("This should never happen!"),
}
```

### Result 사용하기

```rust
// ✅ 프로덕션 코드
fn open_config(path: &str) -> Result<Config, ConfigError> {
    // 호출자가 에러 처리 방식 결정 가능
    let content = fs::read_to_string(path)?;
    parse_config(&content)
}

// ✅ 호출자가 선택 가능
match open_config("app.json") {
    Ok(config) => run_app(config),
    Err(e) => {
        eprintln!("Config error: {}", e);
        use_default_config()
    }
}
```

## 💡 유용한 Result 메서드

```rust
// unwrap - 값이면 반환, 에러면 panic
let x: Result<i32, &str> = Ok(2);
assert_eq!(x.unwrap(), 2);

// unwrap_or - 값이면 반환, 에러면 기본값
let x: Result<i32, &str> = Err("error");
assert_eq!(x.unwrap_or(0), 0);

// unwrap_or_else - 값이면 반환, 에러면 클로저 실행
let x: Result<i32, &str> = Err("error");
assert_eq!(x.unwrap_or_else(|_| 0), 0);

// map - Ok 값 변환
let x: Result<i32, &str> = Ok(2);
assert_eq!(x.map(|v| v + 1), Ok(3));

// and_then - Result 반환하는 함수 연결
let x: Result<i32, &str> = Ok(2);
let y: Result<i32, &str> = x.and_then(|v| Ok(v + 1));

// is_ok / is_err - 상태 확인
let x: Result<i32, &str> = Ok(2);
assert!(x.is_ok());
assert!(!x.is_err());
```

## 🔄 에러 처리 발전 단계

```
초급: match 모든 경우 처리
  ↓
중급: Result 타입 정의 및 사용
  ↓
상급: ? 연산자로 간결하게
  ↓
고급: 커스텀 에러 타입 + From trait
  ↓
전문가: thiserror, anyhow 크레이트 활용
```

## 📝 커스텀 에러 타입

```rust
use std::fmt;
use std::io;

#[derive(Debug)]
enum MyError {
    Io(io::Error),
    Parse(std::num::ParseIntError),
    Custom(String),
}

impl fmt::Display for MyError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            MyError::Io(e) => write!(f, "IO error: {}", e),
            MyError::Parse(e) => write!(f, "Parse error: {}", e),
            MyError::Custom(msg) => write!(f, "{}", msg),
        }
    }
}

impl std::error::Error for MyError {}

// From trait으로 자동 변환
impl From<io::Error> for MyError {
    fn from(err: io::Error) -> MyError {
        MyError::Io(err)
    }
}

impl From<std::num::ParseIntError> for MyError {
    fn from(err: std::num::ParseIntError) -> MyError {
        MyError::Parse(err)
    }
}

// 이제 ? 연산자가 자동으로 변환
fn my_function() -> Result<i32, MyError> {
    let content = std::fs::read_to_string("file.txt")?;  // MyError::Io로 변환
    let number: i32 = content.trim().parse()?;          // MyError::Parse로 변환
    Ok(number)
}
```

## 🛠️ 실전 패턴

### 파일 읽기 및 파싱

```rust
use std::fs;

#[derive(Debug)]
struct Config {
    name: String,
    value: i32,
}

fn load_config(path: &str) -> Result<Config, Box<dyn std::error::Error>> {
    let content = fs::read_to_string(path)?;
    let lines: Vec<&str> = content.lines().collect();

    let name = lines.get(0)
        .ok_or("Missing name")?
        .to_string();

    let value: i32 = lines.get(1)
        .ok_or("Missing value")?
        .trim()
        .parse()?;

    Ok(Config { name, value })
}
```

### 재시도 로직

```rust
fn retry_operation<F>(mut f: F, max_attempts: u32) -> Result<String, String>
where
    F: FnMut() -> Result<String, String>
{
    for attempt in 1..=max_attempts {
        match f() {
            Ok(result) => return Ok(result),
            Err(e) if attempt < max_attempts => {
                eprintln!("Attempt {} failed: {}", attempt, e);
                continue;
            }
            Err(e) => return Err(e),
        }
    }
    Err("All attempts failed".to_string())
}

// 사용
retry_operation(|| network_call(), 3)?;
```

## ⚠️ 일반적인 실수

```rust
// ❌ panic만 사용 (프로덕션 위험)
fn read_file(path: &str) -> String {
    std::fs::read_to_string(path).expect("Failed!")
}

// ✅ Result 반환
fn read_file(path: &str) -> Result<String, io::Error> {
    std::fs::read_to_string(path)
}

// ❌ 에러 무시
let file = File::open("file.txt").ok();  // 에러 정보 소실

// ✅ 에러 처리
match File::open("file.txt") {
    Ok(file) => process(file),
    Err(e) => eprintln!("Error: {}", e),
}
```

## 📚 학습 자료

- The Rust Programming Language, Chapter 9: Error Handling
- Rust by Example: Error Handling
- 실습: Result 패턴으로 여러 에러 처리하기

## Relations

- part_of [[Rust Language Hub]] - Rust의 핵심 개념
- related_to [[Rust Testing]] - 테스트에서의 panic 활용
- related_to [[Option]] - Result와 유사한 타입
- used_in [[Rust Projects]] - 실제 Rust 프로젝트에서 필수 패턴
- precedes [[Advanced Error Handling with thiserror]] - 고급 에러 처리
