---
type: concept
permalink: knowledge/concepts/rust-functional-programming
category: Rust
difficulty: 중급
tags:
  - rust
  - functional
  - closures
  - iterators
created_at: 2026-01-29
updated_at: 2026-01-29
---

# Rust 함수형 프로그래밍

**한 줄 정의**: Closures와 Iterators를 활용하여 선언적이고 composable한 코드를 작성하는 Rust의 함수형 프로그래밍 패러다임.

## 개요

Rust는 1급 함수(first-class functions), 클로저(closures), 이터레이터(iterators)를 통해 함수형 프로그래밍 패러다임을 지원합니다. 이를 통해 더욱 간결하고 표현력 있는 코드를 작성할 수 있으며, 컴파일 타임 최적화로 인해 성능 손실 없이 추상화를 달성합니다.

**출처**: The Rust Programming Language, Chapter 13 (pp. 460-496)

---

## 🎭 비유

함수형 프로그래밍은 **"요리 레시피"** 같습니다:
- **Closures** = 특정 재료만 필요한 하위 레시피 (주변 환경의 재료를 사용)
- **Iterators** = 재료들을 순서대로 처리하는 조리 과정 (한 번에 하나씩, lazy하게 처리)
- **Composition** = 작은 조리 단계들을 조합하여 복잡한 요리를 만듦

---

## Closures (클로저)

클로저는 **환경을 캡처할 수 있는 익명 함수**입니다.

### 기본 문법

```rust
|param| { body }
|x| x + 1           // 단일 표현식
|x, y| x + y        // 다중 파라미터
```

### 특징

- **Capturing Environment**: 주변 변수를 캡처 가능 (함수와의 핵심 차이점)
- **Type Inference**: 파라미터와 반환 타입 타입 추론
- **Flexibility**: 필요시 타입을 명시적으로 지정 가능

### Capture Modes (캡처 방식)

클로저가 환경의 값을 어떻게 사용하는지에 따라 결정됩니다:

| 모드 | 문법 | 설명 | 호출 |
|------|------|------|------|
| **Immutable Borrow** | `&T` | 기본값 - 변수를 불변으로 빌려옴 | 여러 번 |
| **Mutable Borrow** | `&mut T` | 변수를 가변으로 빌려옴 | 여러 번 |
| **Move** | `move \|\| ...` | 소유권을 완전히 이동 | 1번 |

**Example**:
```rust
let x = vec![1, 2, 3];

// 불변 borrow (기본)
let closure = || println!("{:?}", x);
closure();  // OK
closure();  // OK

// 가변 borrow
let mut vec = vec![1, 2, 3];
let mut closure = || vec.push(4);
closure();  // OK - vec 수정
// println!("{:?}", vec);  // Error: vec를 빌려올 수 없음

// Move
let closure = move || println!("{:?}", x);
closure();  // OK
// println!("{:?}", x);  // Error: x의 소유권이 이동됨
```

### Fn Traits (함수 특성)

클로저는 3가지 trait 중 하나를 구현합니다:

| Trait | 설명 | 호출 횟수 | 사용 |
|-------|------|----------|------|
| **FnOnce** | 소유권 이동, 한 번만 호출 | 1번 | 값 소비 |
| **FnMut** | 가변 빌려옴, 여러 번 호출 | 여러 번 | 상태 수정 |
| **Fn** | 불변 빌려옴, 여러 번 호출 | 여러 번 | 읽기만 |

**상속 관계**: `Fn` ⊂ `FnMut` ⊂ `FnOnce`

---

## Iterators (이터레이터)

이터레이터는 **일련의 아이템들을 순서대로 순회하는 메커니즘**입니다.

### Iterator Trait

```rust
pub trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
}
```

모든 이터레이터는 `next()` 메서드를 구현하여, 아이템을 하나씩 반환합니다.

### 이터레이터 생성 메서드

| 메서드 | 반환 타입 | 설명 |
|--------|----------|------|
| `.iter()` | `&T` | 불변 참조로 순회 |
| `.iter_mut()` | `&mut T` | 가변 참조로 순회 |
| `.into_iter()` | `T` | 소유권을 이동하며 순회 |

```rust
let vec = vec![1, 2, 3];

// 불변 참조
for &item in vec.iter() {
    println!("{}", item);
}
println!("{:?}", vec);  // OK - vec은 여전히 사용 가능

// 가변 참조
let mut vec = vec![1, 2, 3];
for item in vec.iter_mut() {
    *item *= 2;
}

// 소유권 이동
for item in vec.into_iter() {
    println!("{}", item);
}
// println!("{:?}", vec);  // Error: vec의 소유권이 이동됨
```

### Consuming Adapters (소비 어댑터)

이터레이터를 소비하여 최종 값을 생성합니다:

```rust
let vec = vec![1, 2, 3];

vec.iter().sum()        // 합계: 6
vec.iter().collect()    // 컬렉션으로 변환
vec.iter().count()      // 개수: 3
vec.iter().find(|&x| x > 1)  // 조건 만족하는 첫 아이템
```

### Iterator Adapters (이터레이터 어댑터)

이터레이터를 변환하여 새로운 이터레이터를 반환합니다 (lazy evaluation):

```rust
let vec = vec![1, 2, 3, 4, 5];

// map: 각 요소 변환
vec.iter().map(|x| x * 2)

// filter: 조건에 맞는 요소만
vec.iter().filter(|&x| x > 2)

// take: 처음 N개
vec.iter().take(3)

// skip: 처음 N개 건너뛰기
vec.iter().skip(2)

// 체이닝 (composable)
let result: Vec<_> = vec.iter()
    .filter(|&x| x % 2 == 0)
    .map(|x| x * 2)
    .collect();
```

**특징**:
- **Lazy Evaluation**: 실제 아이템을 처리하지 않음 (`.collect()` 같은 소비 어댑터 호출 시)
- **체이닝 가능**: 여러 어댑터를 조합
- **클로저 활용**: 각 단계에서 클로저 활용

---

## 성능 특성 (Zero-Cost Abstractions)

Rust의 함수형 프로그래밍은 **Zero-cost abstractions** 원칙을 따릅니다:

- **컴파일 타임 최적화**: 이터레이터는 for 루프로 컴파일됨
- **성능 동등**: 기존 명령형 코드와 동일한 머신 코드 생성
- **추상화 무료**: 표현력 있는 코드를 작성해도 성능 손실 없음

```rust
// 이 둘은 동일한 머신 코드로 컴파일됨
let sum1: i32 = vec.iter().map(|x| x * 2).sum();

let mut sum2 = 0;
for &x in &vec {
    sum2 += x * 2;
}
```

---

## 실전 사례: minigrep 리팩토링

### Before (명령형)
```rust
let args: Vec<String> = env::args().collect();
let mut lines_match = Vec::new();
for line in contents.lines() {
    if line.contains(query) {
        lines_match.push(line);
    }
}
lines_match
```

### After (함수형)
```rust
contents
    .lines()
    .filter(|line| line.contains(query))
    .collect()
```

**개선점**:
- 더 간결하고 읽기 쉬운 코드
- 중간 변수(`lines_match`) 제거
- 의도가 명확함 (선언적)

---

## Relations

### part_of
- [[Rust Programming Language Overview]] - Rust의 핵심 개념

### used_in
- [[Rust Concurrency]] - 스레드와 async에서 클로저 활용
- [[Rust Collections]] - 컬렉션의 이터레이터 메서드
- [[Rust Projects]] - 실제 프로젝트에서의 함수형 패턴 적용

### related_to
- [[Rust Type System]] - Fn traits와 제네릭 타입
- [[Rust Memory Management]] - 캡처 모드와 소유권

---

## 학습 경로

```
함수형 기초 (Closures)
    ↓
이터레이터 메커니즘 (Iterator Trait)
    ↓
어댑터 체이닝 (Composability)
    ↓
성능 특성 이해 (Zero-cost abstractions)
    ↓
병렬화와 async 활용 (Concurrency)
```

---

## 핵심 요점

1. **Closures**: 환경을 캡처할 수 있는 익명 함수 → FnOnce, FnMut, Fn trait
2. **Iterators**: lazy evaluation으로 효율적인 순회 → adapters와 consumers
3. **Composition**: 작은 함수들을 조합하여 복잡한 로직 구성
4. **Performance**: 함수형 코드도 명령형 코드만큼 빠름 (컴파일 최적화)

---

## Metadata

| 항목 | 내용 |
|------|------|
| **난이도** | 중급 |
| **카테고리** | Rust |
| **학습 시간** | 2-3시간 |
| **선행 학습** | Rust 기초, 소유권 시스템 |
| **출처** | The Rust Programming Language, Chapter 13 |
| **마지막 업데이트** | 2026-01-29 |
