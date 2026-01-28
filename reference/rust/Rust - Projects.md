---
title: Rust - Projects
type: note
permalink: reference/rust/rust-projects
tags:
- rust
- projects
- minigrep
- web-server
---

# Rust - 실전 프로젝트

책에서 다루는 3개의 실습 프로젝트입니다.

## 1. Guessing Game

- [chapter:: 2]
- [pages:: 29-58]
- [difficulty:: beginner]

### 학습 개념
- `io` 라이브러리, `String`, `read_line`
- `rand` crate (외부 의존성)
- `match`, `Ordering`
- `loop`, `break`, `continue`

## 2. minigrep (CLI Tool)

- [chapter:: 12]
- [pages:: 409-460]
- [difficulty:: intermediate]

### 아키텍처
```
src/
├── main.rs   → CLI 파싱, 에러 처리
└── lib.rs    → 비즈니스 로직
```

### 학습 개념
- Command line args: `env::args`
- File I/O: `fs::read_to_string`
- `Config` struct 패턴
- `Result<T, E>` 에러 전파
- 환경 변수: `env::var`
- TDD (pp. 438-447)
- Iterator 리팩토링 (pp. 487-494)

## 3. Multithreaded Web Server

- [chapter:: 21]
- [pages:: 839-904]
- [difficulty:: advanced]

### Phase 1: Single-threaded (pp. 841-859)
- TcpListener
- HTTP Request/Response
- HTML Serving
- 404 Handling

### Phase 2: Thread Pool (pp. 859-904)

```rust
struct ThreadPool {
    workers: Vec<Worker>,
    sender: mpsc::Sender<Job>,
}

type Job = Box<dyn FnOnce() + Send + 'static>;
```

### 핵심 패턴
- `Arc<Mutex<Receiver>>`
- Worker struct
- Graceful Shutdown with Drop

### 통합 개념
- Ownership & borrowing
- Smart pointers
- Thread concurrency
- Channels (mpsc)
- Error handling

## 프로젝트별 핵심 패턴

| 프로젝트 | 핵심 패턴 |
|----------|----------|
| Guessing Game | `loop` + `match` + `continue/break` |
| minigrep | `Config` struct + `Result` 전파 + TDD |
| Web Server | `Arc<Mutex<Receiver>>` + Thread Pool + Drop |

## 관계

- [part_of:: The Rust Programming Language - 개요]
- [demonstrates:: Rust - Memory Management]
- [demonstrates:: Rust - Concurrency]
- [demonstrates:: Rust - Error Handling]
