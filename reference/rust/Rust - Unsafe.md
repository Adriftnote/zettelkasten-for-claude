---
title: Rust - Unsafe
type: note
permalink: reference/rust/rust-unsafe
tags:
- rust
- unsafe
- ffi
- raw-pointers
---

# Rust - Unsafe & 저수준

컴파일러 안전 검사를 우회하는 저수준 프로그래밍입니다.

## 개요

- [chapter:: 20.1]
- [pages:: 769-789]

## Unsafe Superpowers

`unsafe` 블록 내에서만 가능한 작업들:

### 1. Raw Pointer Dereferencing (pp. 771-773)

```rust
let mut num = 5;

// raw pointer 생성 (safe)
let r1 = &num as *const i32;
let r2 = &mut num as *mut i32;

// 역참조 (unsafe)
unsafe {
    println!("r1: {}", *r1);
    println!("r2: {}", *r2);
}
```

| 타입 | 의미 |
|------|------|
| `*const T` | 불변 raw pointer |
| `*mut T` | 가변 raw pointer |

### 2. Unsafe Functions (pp. 773-781)

```rust
unsafe fn dangerous() {
    // unsafe 코드
}

unsafe {
    dangerous();
}
```

#### Safe Abstraction 구축

```rust
fn split_at_mut(values: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32]) {
    let len = values.len();
    let ptr = values.as_mut_ptr();

    assert!(mid <= len);

    unsafe {
        (
            slice::from_raw_parts_mut(ptr, mid),
            slice::from_raw_parts_mut(ptr.add(mid), len - mid),
        )
    }
}
```

### 3. FFI (Foreign Function Interface)

```rust
extern "C" {
    fn abs(input: i32) -> i32;
}

fn main() {
    unsafe {
        println!("abs(-3) = {}", abs(-3));
    }
}
```

#### Rust 함수를 C에 노출

```rust
#[no_mangle]
pub extern "C" fn call_from_c() {
    println!("Called from C!");
}
```

### 4. Mutable Static Variables (pp. 781-784)

```rust
static mut COUNTER: u32 = 0;

fn add_to_count(inc: u32) {
    unsafe {
        COUNTER += inc;
    }
}
```

> **위험**: Data race 가능성

### 5. Unsafe Traits (pp. 784-785)

```rust
unsafe trait Foo {
    // methods
}

unsafe impl Foo for i32 {
    // implementation
}
```

**예시:** `Send`, `Sync` 트레이트

### 6. Union Fields (pp. 784-785)

```rust
union MyUnion {
    f1: u32,
    f2: f32,
}

let u = MyUnion { f1: 1 };
unsafe {
    println!("{}", u.f1);
}
```

- C 코드 인터페이스용

## Miri (pp. 785-787)

Undefined Behavior 탐지 도구

```bash
rustup +nightly component add miri
cargo +nightly miri test
```

**탐지 가능:**
- Use after free
- Out of bounds access
- Invalid pointer dereference
- Data races

## 언제 Unsafe를 사용하나?

| 사용 O | 사용 X |
|--------|--------|
| FFI 바인딩 | 성능 최적화 (먼저 safe 시도) |
| 하드웨어 접근 | 편의성 |
| Safe abstraction 내부 | 컴파일러 우회 |

## 관계

- [part_of:: The Rust Programming Language - 개요]
- [requires:: Rust - Memory Management]
- [advanced_topic:: true]
