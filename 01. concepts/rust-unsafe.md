---
title: Rust Unsafe (Unsafe와 저수준 프로그래밍)
type: concept
tags: [rust, memory-safety, unsafe, ffi, raw-pointers, advanced]
permalink: /concepts/rust-unsafe
category: Rust
difficulty: 고급
date: 2026-01-29
---

# Rust Unsafe

Rust의 메모리 안전성 보장을 의도적으로 우회하여 저수준 프로그래밍 작업을 수행할 수 있게 하는 메커니즘입니다.

## 비유

Unsafe는 자동차 운전 중에 안전장치(에어백, ABS)를 비활성화하는 것과 같습니다. 일반적으로는 위험하지만, 특정 상황(예: 오프로드 주행, 레이싱)에서는 필요할 수 있습니다. 개발자가 직접 책임을 지고 안전을 보장해야 합니다.

## 📖 개요

Rust는 메모리 안전성을 보장하기 위해 엄격한 컴파일 타임 검사를 수행합니다. 그러나 일부 작업은 이러한 검사를 우회해야 합니다:

- FFI(Foreign Function Interface): C/C++ 라이브러리 호출
- 하드웨어 메모리 접근: 디바이스 레지스터, MMIO
- 성능 최적화: 컴파일러가 증명할 수 없는 안전한 코드
- Low-level 시스템 프로그래밍

Unsafe 코드는 개발자가 메모리 안전성을 **수동으로 보장**해야 하며, 컴파일러는 검사를 생략합니다.

## ✨ Unsafe Superpowers (6가지)

### 1. Raw Pointer Dereferencing

Raw pointer는 메모리 주소를 저수준으로 다루는 도구입니다.

```rust
let mut num = 5;

// raw pointer 생성 (safe)
let r1 = &num as *const i32;  // 불변 raw pointer
let r2 = &mut num as *mut i32; // 가변 raw pointer

// 역참조 (unsafe)
unsafe {
    println!("r1: {}", *r1);  // 5
    println!("r2: {}", *r2);  // 5
}
```

| 타입 | 특징 |
|------|------|
| `*const T` | 불변 raw pointer, 생성은 safe |
| `*mut T` | 가변 raw pointer, 생성은 safe |
| 역참조 | Unsafe 블록 필요 |

### 2. Unsafe Functions

함수 자체를 unsafe로 선언하면 호출자가 사전조건을 확인해야 합니다.

```rust
unsafe fn dangerous() {
    // unsafe 코드
}

fn main() {
    unsafe {
        dangerous();
    }
}
```

**Safe Abstraction 구축 예시:**

```rust
fn split_at_mut(values: &mut [i32], mid: usize)
    -> (&mut [i32], &mut [i32])
{
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

이 함수는 unsafe를 내부에만 사용하고 safe 인터페이스를 제공합니다.

### 3. FFI (Foreign Function Interface)

C/C++ 라이브러리의 함수를 호출할 때 사용합니다.

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

**Rust 함수를 C에 노출:**

```rust
#[no_mangle]
pub extern "C" fn call_from_c() {
    println!("Called from C!");
}
```

### 4. Mutable Static Variables

전역 가변 상태는 data race를 야기할 수 있으므로 unsafe입니다.

```rust
static mut COUNTER: u32 = 0;

fn add_to_count(inc: u32) {
    unsafe {
        COUNTER += inc;  // data race 가능성!
    }
}
```

대안: `std::sync::atomic` 사용 (thread-safe)

```rust
use std::sync::atomic::{AtomicU32, Ordering};

static COUNTER: AtomicU32 = AtomicU32::new(0);

fn add_to_count(inc: u32) {
    COUNTER.fetch_add(inc, Ordering::SeqCst);  // safe & atomic
}
```

### 5. Unsafe Traits

트레이트 구현이 특정 안전 조건을 가정할 때 사용합니다.

```rust
unsafe trait Foo {
    fn method(&self);
}

unsafe impl Foo for i32 {
    fn method(&self) {
        println!("Implementing unsafe trait");
    }
}
```

표준 라이브러리 예시: `Send`, `Sync` 트레이트

### 6. Union Types

C와의 호환성을 위해 여러 필드가 같은 메모리를 공유합니다.

```rust
union MyUnion {
    f1: u32,
    f2: f32,
}

fn main() {
    let u = MyUnion { f1: 1 };
    unsafe {
        println!("{}", u.f1);  // 1
        println!("{}", u.f2);  // 잘못된 해석 가능!
    }
}
```

## 💡 Undefined Behavior 탐지: Miri

Miri는 unsafe 코드의 미정의 동작을 탐지하는 도구입니다.

```bash
rustup +nightly component add miri
cargo +nightly miri test
```

**탐지 가능한 문제:**
- Use after free
- Out of bounds access
- Invalid pointer dereference
- Data races
- Misaligned access

## 🆚 Unsafe 사용 판단

| 사용해야 함 O | 사용 금지 X |
|-------------|----------|
| FFI 바인딩 | 성능 최적화 (먼저 safe 시도) |
| 하드웨어 레지스터 접근 | 편의성 |
| Safe abstraction 내부 구현 | 복잡한 로직 단순화 |
| 메모리 효율 최적화 | 컴파일러 우회 |

## Observations

- [fact] Raw pointer 생성은 safe이지만 역참조는 unsafe입니다 #pointer
- [method] Safe abstraction으로 unsafe 코드를 캡슐화하면 안전성을 높일 수 있습니다 #design-pattern
- [fact] Mutable static 변수는 thread-safe하지 않으므로 atomic 타입 사용을 권장합니다 #concurrency
- [fact] Unsafe 코드의 양을 최소화하는 것이 유지보수 관점에서 중요합니다 #best-practice

## Relations

- part_of [[rust-language]] - Rust 프로그래밍 언어의 고급 기능
- depends_on [[rust-memory-management]] - 메모리 안전성 개념이 필수 선행 지식
- relates_to [[ffi]] - 외부 함수 인터페이싱에 필수
- relates_to [[raw-pointers]] - 저수준 포인터 조작
- extends [[rust-references]] - 참조보다 저수준의 포인터 제어

---

**난이도**: 고급
**카테고리**: Rust
**마지막 업데이트**: 2026년 1월
