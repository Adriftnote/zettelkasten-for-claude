---
title: Rust - Concurrency
type: note
permalink: reference/rust/rust-concurrency
tags:
- rust
- concurrency
- threads
- async
- channels
---

# Rust - 동시성 & 병렬성

Rust의 "Fearless Concurrency" - 컴파일 타임에 동시성 버그를 방지합니다.

## Thread-based Concurrency

- [chapter:: 16]
- [pages:: 593-631]

### Using Threads (pp. 595-607)

```rust
// 스레드 생성
thread::spawn(|| { ... })

// 완료 대기
let handle: JoinHandle<T> = thread::spawn(...);
handle.join()

// 소유권 이동
move || { ... }
```

### Message Passing (pp. 607-617)

> "Share memory by communicating"

```rust
let (tx, rx) = mpsc::channel();

// 송신
tx.send(value).unwrap();

// 수신
let received = rx.recv().unwrap();

// 다중 생산자
let tx2 = tx.clone();
```

### Shared-State Concurrency (pp. 617-630)

```rust
// Mutex
let m = Mutex::new(5);
let num = m.lock().unwrap();  // MutexGuard<T>

// 스레드 안전 공유: Arc<Mutex<T>>
let counter = Arc::new(Mutex::new(0));
let counter_clone = Arc::clone(&counter);
```

### Marker Traits (pp. 628-630)

| Trait | 의미 |
|-------|------|
| `Send` | 스레드 간 소유권 이동 가능 |
| `Sync` | 스레드 간 참조 공유 가능 |

## Async Programming

- [chapter:: 17]
- [pages:: 631-696]

### Fundamentals (pp. 633-646)

```rust
async fn fetch_data() -> String { ... }

// 실행
data.await
trpl::block_on(future)
```

### Operations

| 기능 | 페이지 | 설명 |
|------|--------|------|
| `spawn_task` | 649-654 | 비동기 작업 생성 |
| Message Passing | 654-668 | async channel |
| Yielding | 663-668 | `yield_now()` |
| Timeout | 668-672 | 추상화 구축 |

### Advanced Async

| 개념 | 페이지 | 설명 |
|------|--------|------|
| Streams | 672-676 | 비동기 이터레이터 |
| Future Trait | 676-679 | `poll()` → `Poll::Ready \| Pending` |
| Pin & Unpin | 679-692 | 자기 참조 타입 메모리 안정성 |

## 관계

- [part_of:: The Rust Programming Language - 개요]
- [requires:: Rust - Memory Management]
- [demonstrated_in:: Rust - Projects]
