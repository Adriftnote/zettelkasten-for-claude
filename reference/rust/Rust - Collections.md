---
title: Rust - Collections
type: note
permalink: reference/rust/rust-collections
tags:
- rust
- collections
- vector
- string
- hashmap
---

# Rust - 컬렉션

힙에 저장되는 가변 크기 데이터 구조입니다.

## 개요

- [chapter:: 8]
- [pages:: 242-272]

## Vec<T>

- [pages:: 243-251]

### 생성
```rust
let v: Vec<i32> = Vec::new();
let v = vec![1, 2, 3];  // 매크로
```

### 수정
```rust
v.push(4);    // 추가
v.pop();      // 제거 (Option 반환)
```

### 접근

| 방법 | 문법 | 실패 시 |
|------|------|---------|
| Indexing | `v[i]` | panic! |
| Safe | `v.get(i)` | `Option<&T>` |

### 순회
```rust
for i in &v { }       // 불변 참조
for i in &mut v { }   // 가변 참조
for i in v { }        // 소유권 이동
```

## String

- [pages:: 251-264]

### 타입 구분

| 타입 | 소유권 | 용도 |
|------|--------|------|
| `String` | owned | 힙에 저장, 가변 |
| `&str` | borrowed | 문자열 슬라이스 |

### 생성
```rust
String::new()
String::from("hello")
"hello".to_string()
```

### 수정
```rust
s.push_str("world");  // 문자열 추가
s.push('!');          // 문자 추가
```

### 연결
```rust
// + 연산자 (첫 번째 소유권 이동)
let s3 = s1 + &s2;

// format! 매크로 (소유권 이동 없음)
let s = format!("{}-{}", s1, s2);
```

### UTF-8 인코딩

> String은 인덱싱 불가!

```rust
// 올바른 순회 방법
for c in s.chars() { }   // 문자 단위
for b in s.bytes() { }   // 바이트 단위
```

## HashMap<K, V>

- [pages:: 264-272]

### 생성
```rust
use std::collections::HashMap;
let mut map = HashMap::new();
```

### 기본 연산
```rust
map.insert(key, value);     // 삽입/덮어쓰기
map.get(&key);              // Option<&V>
```

### 조건부 삽입
```rust
// 키가 없을 때만 삽입
map.entry(key).or_insert(value);

// 기존 값 수정
*map.entry(key).or_insert(0) += 1;
```

### 소유권
- Copy trait 구현 타입: 복사
- 나머지: 소유권 이동

## 컬렉션 비교

| 타입 | 용도 | 순서 | 키 |
|------|------|------|-----|
| `Vec<T>` | 순차 목록 | O | 인덱스 |
| `String` | UTF-8 텍스트 | O | - |
| `HashMap<K,V>` | 키-값 저장 | X | 임의 |

## 관계

- [part_of:: The Rust Programming Language - 개요]
- [related_to:: Rust - Memory Management]
- [used_with:: Rust - Functional Programming]
