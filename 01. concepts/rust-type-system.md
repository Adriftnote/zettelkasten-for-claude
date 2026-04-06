---
title: Rust Type System (러스트 타입 시스템)
type: concept
tags:
- rust
- types
- generics
- traits
- structs
- enums
category: Rust
difficulty: 중급
created: 2026-01-29
permalink: knowledge/concepts/rust-type-system
---

# Rust Type System (러스트 타입 시스템)

Rust의 강력한 타입 시스템과 추상화 메커니즘으로, 안전성과 성능을 동시에 제공합니다.

## 📖 개요

Rust의 타입 시스템은 **컴파일 타임에 타입 안전성을 보장**하면서도 **제로 코스트 추상화**를 지원합니다. 기본 타입(Scalar, Compound)부터 고급 추상화(Generics, Traits, Advanced Types)까지 단계적으로 구성되어 있습니다.

## 🎭 비유

Rust의 타입 시스템은 **건축 설계**와 같습니다. 설계 단계에서 모든 것을 정확하게 명시하므로, 시공 단계(실행)에서는 100% 안전하고 효율적입니다. Generic은 "한 번의 설계로 여러 크기의 건물 짓기"이고, Traits는 "공통 인터페이스 표준"입니다.

## ✨ 핵심 개념

### 1. Basic Types (기본 타입)

#### Scalar Types (스칼라 타입)
```rust
// 정수형: i8~i128 (부호 있음), u8~u128 (부호 없음)
let x: i32 = 42;
let y: u64 = 100;

// 부동소수점: f32, f64
let pi: f64 = 3.14;

// 불리언과 문자
let is_true: bool = true;
let ch: char = 'a';  // Unicode 지원
```

#### Compound Types (복합 타입)
```rust
// 튜플: 고정 길이, 각 요소가 다른 타입 가능
let tup: (i32, f64, u8) = (500, 6.4, 1);
let (x, y, z) = tup;  // 디스트럭처링

// 배열: 고정 길이, 모든 요소가 같은 타입
let arr: [i32; 5] = [1, 2, 3, 4, 5];
let first = arr[0];
```

### 2. Structs (구조체)

구조체는 관련된 데이터를 묶어 의미 있는 단위를 만듭니다.

```rust
// 구조체 정의
struct Point {
    x: i32,
    y: i32,
}

// 인스턴스 생성
let p = Point { x: 5, y: 10 };

// 필드 초기화 축약 (이름이 같을 때)
let x = 5;
let y = 10;
let p = Point { x, y };  // Point { x: 5, y: 10 }

// 구조체 업데이트 문법
let p2 = Point { x: 20, ..p };  // y: 10 상속

// 튜플 구조체
struct Color(u8, u8, u8);
let red = Color(255, 0, 0);

// 유닛 구조체 (데이터 없음)
struct Marker;
```

#### Methods (메서드)

```rust
impl Point {
    // &self: 불변 참조 (읽기)
    fn distance_from_origin(&self) -> f64 {
        ((self.x.pow(2) + self.y.pow(2)) as f64).sqrt()
    }

    // &mut self: 가변 참조 (수정)
    fn translate(&mut self, dx: i32, dy: i32) {
        self.x += dx;
        self.y += dy;
    }

    // self: 소유권 이전 (self 소비)
    fn into_tuple(self) -> (i32, i32) {
        (self.x, self.y)
    }

    // Associated functions (Self::)
    fn new(x: i32, y: i32) -> Point {
        Point { x, y }
    }
}

// 사용
let mut p = Point::new(3, 4);
let dist = p.distance_from_origin();
p.translate(1, 2);
```

### 3. Enums (열거형)

열거형은 정해진 값 중 하나를 나타냅니다.

```rust
// 기본 열거형
enum Direction {
    Up,
    Down,
    Left,
    Right,
}

// 데이터를 포함하는 열거형
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

// Option<T>: 값이 있거나 없거나
enum Option<T> {
    Some(T),
    None,
}

// Result<T, E>: 성공 또는 실패
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

#### Pattern Matching (패턴 매칭)

```rust
// match: 완벽한 (exhaustive) 처리
match message {
    Message::Quit => println!("Quit"),
    Message::Move { x, y } => println!("Move to ({}, {})", x, y),
    Message::Write(text) => println!("Text: {}", text),
    Message::ChangeColor(r, g, b) => println!("RGB({}, {}, {})", r, g, b),
}

// if let: 특정 패턴만 처리
if let Some(value) = opt {
    println!("Value: {}", value);
}

// let...else (Rust 1.67+)
let Ok(value) = parse_result else {
    println!("Parse failed");
    return;
};
```

### 4. Generics (제네릭)

하나의 코드로 여러 타입을 지원합니다.

```rust
// 제네릭 함수
fn largest<T: PartialOrd + Copy>(list: &[T]) -> T {
    let mut largest = list[0];
    for &item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}

// 제네릭 구조체
struct Point<T> {
    x: T,
    y: T,
}

// 제네릭 메서드
impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
}

// 제네릭 열거형
enum Option<T> {
    Some(T),
    None,
}
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

**Monomorphization (단형화)**
- Rust는 컴파일 타임에 사용된 모든 제네릭 타입에 대해 **특화된 코드를 생성**합니다.
- `foo<i32>()`, `foo<String>()` 등 각각 다른 버전의 바이너리 코드 생성
- **장점**: 제로 코스트 추상화 (런타임 오버헤드 없음)
- **단점**: 바이너리 코드 크기 증가 가능

### 5. Traits (트레이트)

공통 동작을 정의하는 인터페이스입니다.

#### Basic Traits (기본 트레이트)

```rust
trait Summary {
    fn summarize(&self) -> String;

    // 기본 구현 제공 가능
    fn summarize_author(&self) -> String {
        format!("Unknown author")
    }
}

struct NewsArticle {
    headline: String,
    location: String,
    author: String,
    content: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self.location)
    }
}

// 트레이트 객체 (동적 디스패치)
let article = NewsArticle { /* ... */ };
let item: &dyn Summary = &article;
println!("{}", item.summarize());
```

#### Trait Bounds (트레이트 제약)

```rust
// 함수에서 트레이트 제약
fn print_summary<T: Summary>(item: &T) {
    println!("{}", item.summarize());
}

// 복수 제약
fn notify<T: Summary + Display>(item: &T) {
    println!("{}", item.summarize());
}

// where 절 (복잡한 제약일 때)
fn some_function<T, U>(t: &T, u: &U) -> i32
where
    T: Display + Clone,
    U: Clone + Debug,
{
    42
}

// 반환 값에 트레이트 지정 (구체적 타입 숨기기)
fn returns_summary() -> impl Summary {
    NewsArticle { /* ... */ }
}
```

### 6. Advanced Traits (고급 트레이트 개념)

```rust
// Associated Types (연관 타입)
trait Iterator {
    type Item;  // 제네릭 타입 매개변수 대신 사용
    fn next(&mut self) -> Option<Self::Item>;
}

impl Iterator for Counter {
    type Item = u32;
    fn next(&mut self) -> Option<Self::Item> {
        // ...
    }
}

// Default Generic Parameters (기본 제네릭 매개변수)
trait Add<Rhs = Self> {  // Rhs는 기본값이 Self
    type Output;
    fn add(self, rhs: Rhs) -> Self::Output;
}

// Fully Qualified Syntax (완전 한정 문법)
trait Pilot {
    fn fly(&self);
}
trait Wizard {
    fn fly(&self);
}

struct Human;
impl Pilot for Human {
    fn fly(&self) { println!("Flying as a pilot"); }
}
impl Wizard for Human {
    fn fly(&self) { println!("Flying as a wizard"); }
}

let person = Human;
<Human as Pilot>::fly(&person);   // Pilot 트레이트의 fly 호출
<Human as Wizard>::fly(&person);  // Wizard 트레이트의 fly 호출

// Supertraits (슈퍼트레이트)
trait OutlinePrint: Display {
    fn outline_print(&self) {
        let output = self.to_string();
        let len = output.len();
        println!("{}", "*".repeat(len + 4));
        println!("*{}*", " ".repeat(len + 2));
        println!("* {} *", output);
        println!("*{}*", " ".repeat(len + 2));
        println!("{}", "*".repeat(len + 4));
    }
}

// Newtype Pattern (고아 규칙 우회)
struct Wrapper(Vec<String>);
impl Display for Wrapper {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "[{}]", self.0.join(", "))
    }
}
```

### 7. Advanced Types (고급 타입)

```rust
// Type Aliases (타입 별칭)
type Kilometers = i32;
let distance: Kilometers = 5;

type Thunk = Box<dyn Fn() + Send + 'static>;
let f: Thunk = Box::new(|| println!("hi"));

// Never Type (!)
fn die() -> ! {
    panic!("Never returns");
}

fn continue_processing() -> ! {
    loop {
        // 절대 반환하지 않음
    }
}

// match도 ! 를 반환할 수 있음
let x: i32 = match some_option {
    Some(val) => val,
    None => continue,  // ! 타입
};

// Dynamically Sized Types (DST)
// str과 [T]는 컴파일 타임에 크기를 알 수 없음
let s: &str = "hello";     // 슬라이스
let arr: &[i32] = &[1, 2]; // 동적 배열

trait MyTrait: ?Sized {  // ?Sized: 동적 크기 타입 허용
    fn do_something(&self);
}
```

## 📊 타입 추상화 계층

```
Scalars/Compounds
       ↓
   Structs/Enums
       ↓
    Generics
       ↓
     Traits
       ↓
  Trait Objects
       ↓
  Advanced Traits
```

| 레벨 | 기법 | 특징 | 용도 |
|------|------|------|------|
| 기본 | Scalar, Compound | 컴파일 타임 타입 확정 | 단순 데이터 |
| 구조 | Struct, Enum | 데이터 그룹화 | 도메인 모델링 |
| 매개변수 | Generics | 컴파일 타임 특화 | 재사용 가능한 컨테이너 |
| 행동 | Traits | 구조 보존 추상화 | 인터페이스 정의 |
| 동적 | Trait Objects | 런타임 디스패치 | 유연한 다형성 |
| 고급 | Associated Types 등 | 타입 관계 명시 | 복잡한 제네릭 API |

## 💡 주요 특징

- **타입 안전성**: 컴파일 타임에 모든 타입 오류 감지
- **제로 코스트 추상화**: Generic은 단형화로 오버헤드 없음
- **소유권과 타입**: 메모리 안전성 보장
- **트레이트 기반 설계**: OOP와 함수형의 장점 결합
- **명시적 추상화**: 암묵적 강제 변환 없음

## 🔄 Relations

- part_of [[Rust Language (러스트 언어)]] (언어의 핵심 특징)
- relates_to [[rust-memory-management]] (메모리 안전성과 함께 동작)
- prerequisite_for [[rust-oop]] (객체 지향 패턴의 기초)
- prerequisite_for [[Rust - Generics and Traits]] (고급 제네릭 학습 필수)
- relates_to [[rust-functional-programming]] (함수형 프로그래밍 개념 활용)

---

**난이도**: 중급
**카테고리**: Rust
**마지막 업데이트**: 2026년 1월
**출처**: The Rust Book (Chapters 3-10, 20)
