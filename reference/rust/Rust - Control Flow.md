---
title: Rust - Control Flow
type: note
permalink: reference/rust/rust-control-flow
tags:
- rust
- control-flow
- pattern-matching
- match
---

# Rust - 제어 흐름 & 패턴

기본 제어문과 Rust의 강력한 패턴 매칭 시스템입니다.

## 기본 제어문

- [chapter:: 3.5]
- [pages:: 91-105]

### if expressions (pp. 91-95)
```rust
if condition {
    // ...
} else if other {
    // ...
} else {
    // ...
}

// 표현식으로 사용
let x = if condition { 5 } else { 6 };
```

### loop (pp. 95-98)
```rust
loop {
    // 무한 루프
    break;     // 탈출
    continue;  // 다음 반복
}

// 반환값
let result = loop {
    break 42;
};
```

### while (pp. 98-101)
```rust
while condition {
    // 조건부 반복
}
```

### for (pp. 101-104)
```rust
for item in collection {
    // 컬렉션 순회
}

for i in 1..5 { }     // 1, 2, 3, 4
for i in 1..=5 { }    // 1, 2, 3, 4, 5
```

### Loop Labels
```rust
'outer: loop {
    'inner: loop {
        break 'outer;  // 외부 루프 탈출
    }
}
```

## Pattern Matching (기본)

- [chapter:: 6.2]
- [pages:: 189-199]

### match expression
```rust
match value {
    Pattern1 => expression1,
    Pattern2 => expression2,
    _ => default,  // catch-all
}
```

**특징:**
- Exhaustiveness checking (모든 경우 처리 필수)
- 값 추출 가능

### if let (pp. 199-201)
```rust
// 단일 패턴만 관심 있을 때
if let Some(x) = option {
    println!("{}", x);
}
```

### let...else (pp. 201-203)
```rust
let Some(x) = option else {
    return;  // 매칭 실패 시
};
```

## Pattern Matching (고급)

- [chapter:: 19]
- [pages:: 734-768]

### 패턴 사용 위치 (pp. 735-743)
- match arms
- let statements
- if let, while let
- for loops
- function parameters

### Refutability (pp. 743-747)

| 유형 | 설명 | 예시 |
|------|------|------|
| Irrefutable | 항상 매칭 | `let x = 5;` |
| Refutable | 실패 가능 | `if let Some(x) = ...` |

### 고급 패턴 문법 (pp. 747-767)

| 패턴 | 문법 | 설명 |
|------|------|------|
| Literals | `1`, `"hello"` | 리터럴 매칭 |
| Multiple | `1 \| 2 \| 3` | 여러 패턴 |
| Ranges | `1..=5` | 범위 |
| Destructuring | `Point { x, y }` | 구조 분해 |
| Ignoring | `_`, `..` | 값 무시 |
| Match Guards | `x if x > 5` | 추가 조건 |
| @ Bindings | `id @ 1..=5` | 바인딩과 테스트 |

### 구조 분해 예시
```rust
// Struct
let Point { x, y } = point;

// Enum
match msg {
    Message::Move { x, y } => ...,
    Message::Write(text) => ...,
}

// Nested
let ((a, b), Point { x, y }) = nested;
```

### Match Guard
```rust
match num {
    Some(x) if x < 5 => println!("less than 5"),
    Some(x) => println!("{}", x),
    None => (),
}
```

### @ Binding
```rust
match msg {
    Message::Hello { id: id_var @ 3..=7 } => {
        println!("Found id in range: {}", id_var)
    }
}
```

## 관계

- [part_of:: The Rust Programming Language - 개요]
- [used_with:: Rust - Type System]
- [essential_for:: Rust - Error Handling]
