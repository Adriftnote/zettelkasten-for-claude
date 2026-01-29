---
title: Rust - 메모리 관리 & 안전성
type: concept
permalink: knowledge/concepts/rust-memory-management
category: Rust
difficulty: 고급
tags:
  - rust
  - memory
  - ownership
  - borrowing
  - lifetimes
  - smart-pointers
updated: 2026-01-29
---

# Rust - 메모리 관리 & 안전성

## 정의
GC 없이 컴파일 타임 메모리 안전성을 보장하는 Rust만의 독특한 시스템으로, Ownership, Borrowing, Lifetimes의 3가지 기둥으로 이루어짐.

## 🎭 비유
Rust의 메모리 관리는 도서관 시스템과 같습니다:
- **Ownership**: 한 사람이 책의 소유자. 스코프를 떠나면 책을 반납함
- **Borrowing**: 다른 사람이 책을 빌려가는 것. 반드시 돌려줘야 함
- **References**: 빌려간 책의 위치를 가리키는 책갈피. 읽기만 가능(`&T`) 또는 수정 가능(`&mut T`)
- **Lifetimes**: 책갈피가 유효한 시간. 반납된 책의 책갈피는 무효

---

## Ownership System ⭐

**정의**: 각 값은 하나의 소유자만 가질 수 있고, 소유자가 스코프를 벗어나면 자동으로 메모리 해제되는 시스템.

### Core Concepts

**Stack vs Heap**
- LIFO 스택: 크기 고정, 빠른 접근
- 포인터 기반 힙: 크기 가변, 상대적으로 느린 접근

**Ownership Rules**
> 각 값은 하나의 소유자만 가질 수 있고, 소유자가 스코프를 벗어나면 drop됨

**Move Semantics**
```rust
let s1 = String::from("hello");
let s2 = s1;  // 소유권 이동, s1 무효화
// println!("{}", s1);  // 컴파일 에러
```
- 대입 시 소유권 이동
- 이전 변수 무효화 (double-free 방지)

**Clone vs Copy**
```rust
// Clone: 명시적 deep copy
let s2 = s1.clone();

// Copy: 스택 데이터 자동 복사 (i32, bool 등)
let x = 5;
let y = x;  // x는 여전히 유효
```

**Functions와 Ownership**
```rust
fn takes_ownership(s: String) {
    println!("{}", s);
}  // s가 드롭됨

let s = String::from("hello");
takes_ownership(s);
// println!("{}", s);  // 에러: s의 소유권이 이동됨

fn gives_ownership() -> String {
    String::from("hello")  // 소유권 반환
}
```

---

## References & Borrowing

**정의**: 소유권을 이전하지 않고 임시로 값을 사용할 수 있게 해주는 메커니즘.

### Immutable References
```rust
let s = String::from("hello");
let r1 = &s;  // 여러 개 동시 존재 가능
let r2 = &s;
let r3 = &s;
println!("{}, {}, {}", r1, r2, r3);
```

### Mutable References
```rust
let mut s = String::from("hello");
let r = &mut s;  // 한 번에 하나만 가능
r.push_str(" world");
println!("{}", r);
```
- 한 번에 하나의 `&mut T`만 존재 가능
- 불변 참조와 동시 사용 불가
- Mutable borrow 중에는 original도 사용 불가

**Rules Summary**:
> 같은 시간에 다음 중 하나만 가능:
> - 여러 개의 immutable reference (`&T`)
> - 정확히 하나의 mutable reference (`&mut T`)

### Dangling References
```rust
// 컴파일러가 자동 방지
fn dangle() -> &String {  // 컴파일 에러!
    let s = String::from("hello");
    &s  // s는 여기서 드롭되는데 참조 반환?
}
```

### Slice Type
```rust
let s = String::from("hello world");
let hello = &s[0..5];  // "hello"
let world = &s[6..11]; // "world"

let arr = [1, 2, 3, 4, 5];
let slice = &arr[1..3];  // &[2, 3]
```

---

## Lifetimes

**정의**: 참조가 유효한 범위를 명시적으로 선언하는 제네릭 파라미터. 컴파일러가 dangling reference를 방지하기 위해 사용.

### Borrow Checker
- 컴파일 타임에 모든 참조 유효성 검증
- 빌린 값이 빌려준 값보다 오래 살 수 없음

### Lifetime Annotation Syntax
```rust
'a, 'b  // 라이프타임 파라미터 (이름일 뿐 시간을 의미하지 않음)
```

### In Function Signatures
```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

// 호출:
let string1 = String::from("long string");
let string2 = "xyz";
let result = longest(string1.as_str(), string2);
```

### Lifetime Elision Rules
Rust는 3가지 규칙으로 자동 추론:
1. 각 입력 참조는 자신의 라이프타임
2. 하나의 입력 라이프타임만 있으면 모든 출력이 그 라이프타임
3. 메서드인 경우 `&self`의 라이프타임이 모든 출력에 할당

```rust
// 라이프타임 명시 필요 없음:
fn first_word(s: &str) -> &str {
    &s[..s.find(' ').unwrap_or(s.len())]
}
// 컴파일러가 자동으로 이해함
```

### Static Lifetime
```rust
let s: &'static str = "hello";  // 프로그램 전체 수명
```

### Structs와 Lifetimes
```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}

impl<'a> ImportantExcerpt<'a> {
    fn announce_and_return_part(&self, announcement: &str) -> &str {
        println!("Attention please: {}", announcement);
        self.part
    }
}
```

---

## Smart Pointers

**정의**: 포인터처럼 작동하지만 추가 메타데이터와 기능을 제공하는 데이터 구조.

### 주요 타입

| 타입 | 용도 | 특징 |
|------|------|------|
| `Box<T>` | 힙 할당, 재귀 타입 | 소유권 이동, 단일 소유자 |
| `Rc<T>` | Reference counting | 공유 소유권 (단일 스레드) |
| `RefCell<T>` | Interior mutability | 런타임 borrow checking |
| `Arc<T>` | Atomic Rc | 스레드 안전 `Rc<T>` |
| `Weak<T>` | 순환 참조 방지 | `Rc<T>` 순환 구조 방지 |

### Box<T>
```rust
// 힙에 할당
let b = Box::new(5);
println!("b = {}", b);

// 재귀 타입 정의 가능
enum List {
    Cons(i32, Box<List>),
    Nil,
}
let list = Cons(1, Box::new(Cons(2, Box::new(Nil))));
```

### Rc<T> - Reference Counting
```rust
use std::rc::Rc;

let a = Rc::new(5);
let b = Rc::clone(&a);  // 카운트 증가
let c = Rc::clone(&a);

println!("{}", Rc::strong_count(&a));  // 3
```
- 단일 스레드 환경에서 여러 소유자 가능
- `clone()`은 deep copy가 아니라 카운트만 증가

### RefCell<T> - Interior Mutability
```rust
use std::cell::RefCell;

let x = RefCell::new(5);
*x.borrow_mut() = 6;  // 런타임 체크로 mut 가능
println!("{}", x.borrow());
```
- 컴파일 타임 대신 런타임에 borrow rules 검증
- `borrow()` 패닉 가능 (여러 mut borrow 시도)

### Arc<T> - Thread-safe Rc
```rust
use std::sync::Arc;
use std::thread;

let counter = Arc::new(5);
let counter1 = Arc::clone(&counter);

thread::spawn(move || {
    println!("{}", counter1);
});
```

### Weak<T> - 순환 참조 방지
```rust
use std::rc::{Rc, Weak};

struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
}
```

### Related Traits

**Deref Trait**
```rust
impl Deref for MyBox<T> {
    type Target = T;
    fn deref(&self) -> &T {
        &self.0
    }
}

let x = MyBox::new(5);
println!("{}", *x);  // deref() 자동 호출
```

**Drop Trait**
```rust
impl Drop for CustomSmartPointer {
    fn drop(&mut self) {
        println!("Dropping CustomSmartPointer");
    }
}
```

---

## 개념 연결

```
Ownership
   ↓ (여러 소유자 필요)
Borrowing
   ↓ (참조 유효성 검증)
Lifetimes
   ↓ (소유권 공유 필요)
Smart Pointers (Rc<T>, Box<T>)
   ↓ (멀티스레드 환경)
Arc<Mutex<T>>
```

---

## Relations

### Part Of
- The Rust Programming Language - 개요

### Prerequisite For
- [[rust-concurrency|Rust - Concurrency]]
- [[rust-error-handling|Rust - Error Handling]]
- [[rust-traits|Rust - Traits & Polymorphism]]

### Related Concepts
- [[rust-generics|Rust - Generics]]
- [[rust-modules|Rust - Modules & Packages]]

---

## 학습 경로

1. **기초** (1-2시간)
   - Ownership Rules 이해
   - Stack vs Heap 개념
   - Move vs Clone

2. **중급** (2-3시간)
   - References & Borrowing
   - Slice Type
   - Borrow Checker 규칙

3. **고급** (3-4시간)
   - Lifetimes 기초
   - Smart Pointers 소개
   - Interior Mutability

4. **심화** (4-5시간)
   - Lifetimes 심화
   - 모든 Smart Pointer 타입
   - Weak<T>와 순환 참조

---

## 메모

- Rust의 모든 메모리 안전성은 **컴파일 타임에 검증됨** (실행 오버헤드 없음)
- Borrow rules는 처음에 엄격하게 느껴지지만, 대부분의 코드는 **lifetime elision으로 자동 처리됨**
- Smart pointers는 언어 차원의 추상화로 제공되므로 매우 효율적임

---

**카테고리**: Rust
**난이도**: 고급
**마지막 업데이트**: 2026-01-29
**출처**: The Rust Programming Language (Book)
