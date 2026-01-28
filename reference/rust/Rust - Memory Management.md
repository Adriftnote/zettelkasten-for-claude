---
title: Rust - Memory Management
type: note
permalink: reference/rust/rust-memory-management
tags:
- rust
- memory
- ownership
- borrowing
- lifetimes
---

# Rust - 메모리 관리 & 안전성

Rust의 가장 핵심적인 개념 영역입니다. GC 없이 메모리 안전성을 보장하는 Rust만의 독특한 시스템입니다.

## Ownership System ⭐

- [chapter:: 4]
- [pages:: 105-147]
- [importance:: critical]

### Stack vs Heap (pp. 106-108)
- LIFO 스택
- 포인터 기반 힙
- 성능 차이 이해

### Ownership Rules (pp. 108-109)
> 각 값은 하나의 소유자만 가질 수 있고, 소유자가 스코프를 벗어나면 drop됨

### Move Semantics (pp. 114-117)
- 대입 시 소유권 이동
- 이전 변수 무효화
- double-free 방지

### Clone vs Copy (pp. 117-120)
- `clone()` - 명시적 deep copy
- `Copy` trait - 스택 데이터 자동 복사

### Ownership in Functions (pp. 120-125)
- 함수 호출 시 소유권 이동 또는 복사

## References & Borrowing

- [chapter:: 4.2]
- [pages:: 125-136]

### Immutable References
```rust
&T  // 여러 개 동시 존재 가능
```

### Mutable References (pp. 129-133)
```rust
&mut T  // 한 번에 하나만, 불변 참조와 동시 사용 불가
```

### Dangling References (pp. 133-136)
- 컴파일러가 자동 방지

### Slice Type (pp. 136-147)
```rust
&str, &[T]  // 컬렉션의 일부 참조
```

## Lifetimes

- [chapter:: 10.3]
- [pages:: 336-356]

### Borrow Checker (pp. 338-340)
- 컴파일 타임에 참조 유효성 검증

### Lifetime Annotation Syntax (pp. 342-343)
```rust
'a, 'b  // 라이프타임 파라미터
```

### In Function Signatures (pp. 343-349)
```rust
fn foo<'a>(x: &'a str) -> &'a str
```

### Lifetime Elision (pp. 350-353)
- 3가지 규칙으로 자동 추론

### Static Lifetime (pp. 354-355)
```rust
'static  // 프로그램 전체 수명
```

## Smart Pointers

- [chapter:: 15]
- [pages:: 528-593]

| 타입 | 용도 | 페이지 |
|------|------|--------|
| `Box<T>` | 힙 할당, 재귀 타입 | 530-539 |
| `Rc<T>` | Reference counting (단일 스레드) | 555-562 |
| `RefCell<T>` | Interior mutability, 런타임 검사 | 562-579 |
| `Arc<T>` | Atomic RC (스레드 안전) | 621-628 |
| `Weak<T>` | 순환 참조 방지 | 579-593 |

### 관련 Traits
- `Deref` (pp. 539-549) - `*` 연산자, deref coercion
- `Drop` (pp. 549-555) - 스코프 벗어날 때 cleanup

## 개념 연결

```
Ownership → Borrowing → Lifetimes → Smart Pointers → Arc<Mutex<T>>
```

## 관계

- [part_of:: The Rust Programming Language - 개요]
- [prerequisite_for:: Rust - Concurrency]
