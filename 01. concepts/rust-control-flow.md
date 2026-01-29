---
type: concept
title: Rust Control Flow (제어 흐름)
permalink: knowledge/concepts/rust-control-flow
category: Rust
difficulty: 초급
tags:
  - rust
  - control-flow
  - pattern-matching
  - match
---

# Rust Control Flow (제어 흐름)

**한 줄 정의**: Rust의 if, loop, while, for 표현식과 강력한 패턴 매칭 시스템을 통한 프로그램 흐름 제어

## 개념

Rust의 제어 흐름은 일반적인 프로그래밍 언어의 제어문을 포함하면서도, **표현식(expression) 기반**이고 **패턴 매칭**이라는 강력한 도구를 제공합니다.

### 🎭 비유

- **if/else**: 갈림길에서 어느 길을 갈지 선택하는 것
- **loop**: 같은 동작을 반복하는 노래의 코러스
- **match**: 우편물을 받는 사람에 따라 다른 처리를 하는 것 (우편 담당자)
- **패턴 매칭**: 퍼즐 조각을 자리에 맞추는 것

---

## Conditional Expressions (조건 표현식)

### if expression (pp. 91-95)

```rust
if condition {
    // 조건이 참일 때
} else if other {
    // 다른 조건
} else {
    // 모든 조건이 거짓일 때
}

// 표현식으로 사용 - 값 반환
let x = if condition { 5 } else { 6 };

// 모든 분기에서 같은 타입 반환 필수
let y = if condition { 1 } else { "two" }; // 컴파일 에러
```

**특징**:
- `if` 자체가 표현식 (값을 반환할 수 있음)
- 조건은 `bool` 타입이어야 함 (자동 형변환 없음)
- 모든 분기는 같은 타입 반환

---

## Loop Expressions (반복 표현식)

### loop (pp. 95-98)

```rust
loop {
    // 무한 루프
    break;     // 루프 탈출
    continue;  // 다음 반복으로
}

// 반환값과 함께 break
let result = loop {
    if count > 5 {
        break 42;  // 42를 반환
    }
    count += 1;
};
```

**특징**:
- 무조건 반복 (while true와 유사하지만 더 효율적)
- `break` 값으로 루프 결과 반환 가능

### while (pp. 98-101)

```rust
while condition {
    // 조건이 참인 동안 반복
}

// 예시
while count < 5 {
    println!("{}", count);
    count += 1;
}
```

### for (pp. 101-104)

```rust
// 컬렉션 순회
for item in collection {
    println!("{}", item);
}

// 범위 사용
for i in 1..5 { }    // 1, 2, 3, 4 (5 미포함)
for i in 1..=5 { }   // 1, 2, 3, 4, 5 (5 포함)

// 역순
for i in (1..5).rev() {
    println!("{}", i);  // 4, 3, 2, 1
}
```

**특징**:
- Rust에서 가장 안전한 반복 방식
- 범위는 iterator 형태로 구현

### Loop Labels (루프 레이블)

```rust
'outer: loop {
    'inner: loop {
        break 'outer;  // 외부 루프 탈출
    }
}

// 실제 예시
'counting_up: for outer in 1..=3 {
    for inner in 1..=3 {
        if inner == 2 && outer == 2 {
            break 'counting_up;  // 전체 루프 탈출
        }
        println!("({}, {})", outer, inner);
    }
}
```

---

## Pattern Matching (기본) (Ch. 6.2, pp. 189-199)

### match expression

```rust
match value {
    Pattern1 => expression1,
    Pattern2 => expression2,
    _ => default_expression,  // catch-all 패턴
}
```

**특징**:
- **Exhaustiveness checking**: 모든 경우를 다뤄야 함 (컴파일러가 강제)
- **값 추출**: 매칭된 패턴에서 값을 꺼낼 수 있음
- **표현식**: 값을 반환할 수 있음

**예시**:
```rust
match coin {
    Coin::Penny => 1,
    Coin::Nickel => 5,
    Coin::Dime => 10,
    Coin::Quarter => 25,
}

// Option과 함께 사용
match opt {
    Some(x) => println!("Value: {}", x),
    None => println!("No value"),
}

// 값 추출
match message {
    Message::Move { x, y } => {
        println!("Move to ({}, {})", x, y);
    },
    Message::ChangeColor(r, g, b) => {
        // 값 추출
    }
}
```

### if let (pp. 199-201)

```rust
// 단일 패턴만 관심 있을 때 사용
if let Some(x) = option {
    println!("Got value: {}", x);
} else {
    println!("No value");
}

// match와 비교
// match - 모든 경우 다뤄야 함
// if let - 특정 경우만 처리
```

### let...else (pp. 201-203)

```rust
// 패턴이 매칭되지 않으면 else 블록 실행
let Some(x) = option else {
    return;  // 매칭 실패 시 함수 종료
};

// value는 계속 사용 가능
println!("{}", x);
```

---

## Advanced Pattern Matching (Ch. 19, pp. 734-768)

### Pattern 사용 위치 (pp. 735-743)

패턴은 Rust의 여러 위치에서 사용 가능합니다:

| 위치 | 예시 |
|------|------|
| match arms | `Some(x) =>` |
| let statements | `let Some(x) = value;` |
| if let | `if let Some(x) = value` |
| while let | `while let Some(x) = iter.next()` |
| for loops | `for (x, y) in points` |
| function parameters | `fn print_coords((x, y): (i32, i32))` |

### Refutability (pp. 743-747)

패턴은 두 가지 종류가 있습니다:

| 유형 | 설명 | 예시 | 사용처 |
|------|------|------|--------|
| **Irrefutable** | 항상 매칭됨 | `let x = 5;` | let, function params |
| **Refutable** | 실패할 수 있음 | `if let Some(x) = ...` | if let, match, while let |

```rust
// 올바른 사용
let x = 5;                    // irrefutable (O)
if let Some(x) = option { }   // refutable (O)
let Some(x) = option;         // 컴파일 에러! (irrefutable 자리에 refutable)
```

### Advanced Pattern Syntax (pp. 747-767)

| 패턴 | 문법 | 설명 | 예시 |
|------|------|------|------|
| **Literals** | `1`, `"hello"` | 정확한 값 매칭 | `1 \| 2` (1 또는 2) |
| **Multiple** | `x \| y \| z` | 여러 패턴 (OR) | `0 \| 1 \| 2` |
| **Ranges** | `1..=5` | 범위 매칭 | `'a'..='z'` |
| **Destructuring** | `Point { x, y }` | 구조 분해 | 아래 참고 |
| **Ignoring** | `_`, `_rest`, `..` | 값 무시 | `_` (모두 무시) |
| **Match Guards** | `x if x > 5` | 추가 조건 | `Some(x) if x < 5` |
| **@ Bindings** | `id @ 1..=5` | 바인딩과 테스트 | 값을 변수에 저장하면서 조건 테스트 |

### 구조 분해 (Destructuring)

```rust
// Struct 분해
let Point { x, y } = point;
let Point { x: px, y: py } = point;  // 다른 이름으로

// Enum 분해
match msg {
    Message::Move { x, y } => println!("Move: ({}, {})", x, y),
    Message::Write(text) => println!("Write: {}", text),
    Message::ChangeColor(r, g, b) => println!("Color: ({}, {}, {})", r, g, b),
}

// 중첩 분해
let ((a, b), Point { x, y }) = ((1, 2), Point { x: 3, y: 4 });

// 값 무시하면서 분해
let (first, _) = tuple;
let Point { x, .. } = point;  // y는 무시
```

### Match Guard (추가 조건)

```rust
match num {
    Some(x) if x < 5 => println!("Less than 5"),
    Some(x) if x >= 5 => println!("5 or more"),
    None => println!("None"),
}

// 변수와 함께
match point {
    Point { x, y } if x == y => println!("Diagonal"),
    Point { x, y } => println!("Not diagonal"),
}
```

### @ Binding (값 바인딩과 테스트)

```rust
match msg {
    Message::Hello { id: id_var @ 3..=7 } => {
        println!("Found id in range 3-7: {}", id_var);
        // id_var에 실제 값이 바인딩됨
    },
    Message::Hello { id: _ } => {
        println!("Found other id");
    }
}

// 예시: 조건 테스트와 값 바인딩 동시에
match point {
    Point { x: x @ 0..=5, y: y @ 0..=5 } => {
        println!("Point in first quadrant: ({}, {})", x, y);
    },
    _ => println!("Point outside range"),
}
```

---

## Relations

- **part_of**: The Rust Programming Language - Overview
- **used_with**:
  - Rust Type System
  - Rust Error Handling
- **essential_for**:
  - Rust Algorithm Implementation
  - Rust Collections

---

## 학습 경로

1. **기초 (초급)**: if, loop, while, for 학습
2. **심화 (중급)**: match와 기본 패턴 매칭
3. **고급 (상급)**: 고급 패턴 문법, destructuring, match guards

---

## 참고 자료

- Rust Book Chapter 3.5: Control Flow (pp. 91-105)
- Rust Book Chapter 6.2: Pattern Matching (pp. 189-203)
- Rust Book Chapter 19: Pattern Matching Advanced (pp. 734-768)

---

**마지막 업데이트**: 2026-01-29
**난이도**: 초급 → 상급
**카테고리**: Rust Language