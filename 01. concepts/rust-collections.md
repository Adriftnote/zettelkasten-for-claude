---
title: Rust Collections (러스트 컬렉션)
type: concept
tags:
- rust
- collections
- vector
- string
- hashmap
- data-structures
category: Rust
difficulty: 중급
last_updated: 2026-01-29
permalink: knowledge/concepts/rust-collections
---

# Rust Collections (러스트 컬렉션)

**힙에 저장되는 가변 크기 데이터 구조**로, 여러 값을 한 곳에 모아 관리합니다.

## 📖 개요

Rust의 컬렉션은 고정 크기의 배열과 달리 런타임에 크기가 변할 수 있습니다. 세 가지 주요 컬렉션이 있습니다:

- **Vec\<T>**: 순차 목록
- **String**: UTF-8 텍스트
- **HashMap\<K, V>**: 키-값 쌍

참고: Rust Programming Language 8장 (242-272 페이지)

## 🎭 비유

| 상황 | 배열 (고정) | 컬렉션 (가변) |
|------|-----------|-----------|
| **책장** | 책을 놓을 칸이 정해짐 | 필요한 만큼 책을 추가 |
| **메모** | 정해진 칸에만 쓸 수 있음 | 필요한 만큼 페이지 추가 |
| **사전** | 위치가 정해짐 | 새 단어를 언제든 추가 |

## Vec\<T> - 동적 배열

### 생성 (pages 243-251)

```rust
let v: Vec<i32> = Vec::new();
let v = vec![1, 2, 3];  // 매크로 - 타입 추론
let mut v = vec![1, 2, 3];  // 가변 벡터
```

### 수정

```rust
v.push(4);    // 끝에 추가
v.pop();      // 끝에서 제거 (Option 반환)
```

### 접근

| 방법 | 문법 | 실패 시 동작 |
|------|------|-----------|
| Indexing | `v[i]` | panic! 발생 |
| Safe | `v.get(i)` | `Option<&T>` 반환 |

```rust
let third = &v[2];        // panic 가능
match v.get(2) {
    Some(third) => println!("{}", third),
    None => println!("없음"),
}
```

### 순회

```rust
for i in &v { }       // 불변 참조 (소유권 유지)
for i in &mut v { }   // 가변 참조 (값 수정 가능)
for i in v { }        // 소유권 이동 (v 사용 불가)
```

## String - UTF-8 텍스트

### 타입 구분 (pages 251-264)

| 타입 | 소유권 | 저장 | 용도 |
|------|--------|------|------|
| `String` | owned | 힙 | 가변 문자열 |
| `&str` | borrowed | 고정 | 문자열 슬라이스 |

### 생성

```rust
String::new()                   // 빈 String
String::from("hello")           // 리터럴에서
"hello".to_string()            // to_string 메서드
```

### 수정

```rust
let mut s = String::from("hello");
s.push_str(" world");  // 문자열 추가
s.push('!');           // 단일 문자 추가
```

### 문자열 연결

```rust
// + 연산자 (첫 번째 String의 소유권 이동)
let s1 = String::from("hello");
let s2 = String::from("world");
let s3 = s1 + &s2;     // s1은 이제 사용 불가

// format! 매크로 (소유권 이동 없음)
let s = format!("{}-{}", s1, s2);
```

### UTF-8 인코딩의 주의점

> **String은 인덱싱 불가!** UTF-8 인코딩 때문에 바이트 길이와 문자 길이가 다를 수 있습니다.

```rust
let s = "hello";

// 올바른 순회 방법
for c in s.chars() { }   // 문자 단위 순회
for b in s.bytes() { }   // 바이트 단위 순회

// 잘못된 방법
// let answer = &s[0];    // 에러! 인덱싱 불가
```

## HashMap\<K, V> - 키-값 저장소

### 생성 (pages 264-272)

```rust
use std::collections::HashMap;

let mut map = HashMap::new();
map.insert("color", "red");
```

### 기본 연산

```rust
map.insert(key, value);    // 삽입 또는 덮어쓰기
map.get(&key);             // Option<&V> 반환
map.contains_key(&key);    // 키 존재 확인
map.remove(&key);          // 제거
```

### 조건부 삽입 (entry API)

```rust
// 키가 없을 때만 삽입
map.entry(key).or_insert(value);

// 기존 값 수정
*map.entry(key).or_insert(0) += 1;
```

### 소유권 규칙

```rust
let key = String::from("color");
let value = String::from("red");

map.insert(key, value);
// key와 value는 이제 map에 소유권이 이동됨
// println!("{}, {}", key, value);  // 에러!

// Copy trait 구현 타입 (i32 등)은 복사됨
let key = 1;
map.insert(key, 10);
map.insert(key, 20);  // 문제없음
```

## 컬렉션 비교

| 타입 | 용도 | 순서 | 접근 방식 | 복잡도 |
|------|------|------|-----------|--------|
| `Vec<T>` | 순차 목록 | O | 인덱스 | O(1) |
| `String` | UTF-8 텍스트 | O | 슬라이스 | O(n) |
| `HashMap<K,V>` | 키-값 저장 | X | 키 | O(1) 평균 |

## 관련 문서

### Used In

- [[rust-memory-management]]
- [[rust-functional-programming]]

### Part Of

- [[The Rust Programming Language]]