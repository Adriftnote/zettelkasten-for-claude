---
title: Rust - 동시성 & 병렬성
type: concept
tags:
- rust
- concurrency
- threads
- async
- channels
- fearless-concurrency
permalink: knowledge/concepts/rust-concurrency
category: Rust
difficulty: 고급
---

# Rust - 동시성 & 병렬성

Rust의 "Fearless Concurrency" - 컴파일 타임에 동시성 버그를 방지하며 메모리 안전성을 보장합니다.

## 📖 개요

Rust는 멀티스레드 환경에서 데이터 경쟁(data race)과 메모리 안전 문제를 컴파일 타임에 감지하여 런타임 에러를 원천 차단합니다. 스레드 기반 동시성과 비동기 프로그래밍 두 가지 패러다임을 모두 지원하며, 각각 `thread`, `std::sync` 모듈과 `async/await` 문법으로 구현됩니다.

## 🎭 비유

여러 요리사(스레드)가 한 부엌(메모리)에서 요리할 때, Rust는 각자의 도구 사용 권한을 엄격히 제어하는 감독관입니다. 어떤 도구도 동시에 두 사람이 쓸 수 없고, 규칙을 어기려 하면 요리를 시작하기 전에 막아버립니다.

## ✨ 특징

### Thread-based Concurrency
- **스레드 생성**: `thread::spawn()`으로 경량 스레드 생성
- **소유권 이동**: `move` 클로저로 안전한 데이터 전달
- **동기화 기울**: `JoinHandle`로 스레드 완료 대기

### Message Passing
- **채널**: MPSC(Multi-Producer, Single-Consumer) 패턴
- **전송 기반**: "메모리 공유로 통신하지 말고, 통신으로 메모리를 공유하라"
- **소유권**: 전송된 값의 소유권이 완전히 이동

### Shared-State Concurrency
- **Mutex**: 상호 배제를 통한 동시성 제어
- **Arc**: Atomic Reference Counting으로 여러 스레드에서 소유
- **조합**: `Arc<Mutex<T>>` 패턴으로 안전한 공유

### Marker Traits
- **Send**: 스레드 간 소유권 이동 가능 여부 표시
- **Sync**: 스레드 간 참조 공유 가능 여부 표시

### Async Programming
- **Future**: 값을 언젠가 반환할 작업의 추상화
- **await**: Future 완료 대기
- **비블로킹**: 운영체제 스레드 오버헤드 없이 경량 동시성

## 💡 예시

### 스레드 기본 사용법

```rust
use std::thread;
use std::time::Duration;

// 스레드 생성 및 완료 대기
let handle = thread::spawn(|| {
    for i in 1..5 {
        println!("Thread: {}", i);
        thread::sleep(Duration::from_millis(100));
    }
});

handle.join().unwrap();  // 스레드 완료 대기
```

### 메시지 패싱

```rust
use std::sync::mpsc;
use std::thread;

let (tx, rx) = mpsc::channel();

thread::spawn(move || {
    let val = String::from("hi");
    tx.send(val).unwrap();  // 값 전송 (소유권 이동)
});

let received = rx.recv().unwrap();  // 값 수신
println!("{}", received);
```

### 공유 상태 (Mutex + Arc)

```rust
use std::sync::{Arc, Mutex};
use std::thread;

let counter = Arc::new(Mutex::new(0));
let mut handles = vec![];

for _ in 0..10 {
    let counter_clone = Arc::clone(&counter);

    let handle = thread::spawn(move || {
        let mut num = counter_clone.lock().unwrap();
        *num += 1;
    });

    handles.push(handle);
}

for handle in handles {
    handle.join().unwrap();
}

println!("Result: {}", *counter.lock().unwrap());  // 10
```

### 비동기 프로그래밍

```rust
async fn fetch_data() -> String {
    // I/O 작업 수행
    String::from("data")
}

async fn main() {
    let data = fetch_data().await;
    println!("{}", data);
}

// 실행
#[tokio::main]
async fn main() {
    // ...
}
```

## 📚 주요 개념

### Thread-based Concurrency (Chapter 16)

| 항목 | 설명 | 페이지 |
|------|------|--------|
| Using Threads | 스레드 생성, JoinHandle, move 클로저 | 595-607 |
| Message Passing | mpsc 채널, send/recv 패턴 | 607-617 |
| Shared-State | Mutex, Arc, 다중 소유권 | 617-630 |
| Marker Traits | Send, Sync 트레이트 | 628-630 |

### Async Programming (Chapter 17)

| 항목 | 설명 | 페이지 |
|------|------|--------|
| Fundamentals | async fn, await, Future | 633-646 |
| spawn_task | 비동기 태스크 생성 | 649-654 |
| Async Channels | 비동기 메시지 전송 | 654-668 |
| Streams | 비동기 이터레이터 | 672-676 |
| Future Trait | poll() 메커니즘 | 676-679 |
| Pin & Unpin | 자기 참조 타입 안전성 | 679-692 |

## 🔍 심화 개념

### Send와 Sync의 의미

```rust
// Send: T 값을 스레드 경계를 넘어 이동 가능
impl<T: Send> Send for Vec<T> {}

// Sync: &T를 스레드 간 공유 가능
impl<T: Sync> Sync for Mutex<T> {}

// 자동 구현 (모든 필드가 Send/Sync이면)
struct MyData {
    value: i32,  // Send + Sync
}  // → MyData도 Send + Sync
```

### Future와 Pin

```rust
// Future는 state machine처럼 동작
pub trait Future {
    type Output;
    fn poll(self: Pin<&mut Self>, cx: &mut Context)
        -> Poll<Self::Output>;
}

// Poll::Ready(value) 또는 Poll::Pending 반환
// Pin은 메모리 위치 고정 (자기 참조 때문)
```

### Tokio 런타임 활용

```rust
use tokio::task;
use tokio::time::sleep;
use std::time::Duration;

#[tokio::main]
async fn main() {
    // 비동기 작업 생성
    let handle = task::spawn(async {
        sleep(Duration::from_secs(1)).await;
        "완료"
    });

    let result = handle.await.unwrap();
    println!("{}", result);
}
```

## ⚠️ 주의사항

- **Mutex 데드락**: lock() 호출 후 panic 발생 시 주의
- **Arc 순환 참조**: Weak로 부모 참조 방지
- **async 런타임**: tokio, async-std 등 선택 필요
- **블로킹 작업**: async 함수에서 동기 블로킹 피하기
- **메모리 안전성**: Send/Sync 구현 조건 확인

## Relations

- extends [[rust-memory-management]] - 메모리 안전성의 심화 응용
- part_of [[rust-language]] - Rust 핵심 기능
- relates_to [[rust-type-system]] - 트레이트 기반 추상화
- requires [[rust-ownership]] - 소유권 이해 필수
- demonstrates [[fearless-concurrency]] - Rust의 핵심 가치 제안

---

**난이도**: 고급
**카테고리**: Rust
**마지막 업데이트**: 2026년 1월
**출처**: The Rust Programming Language (Chapters 16-17)
