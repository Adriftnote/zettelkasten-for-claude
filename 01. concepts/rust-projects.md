---
type: concept
title: Rust Projects
permalink: knowledge/concepts/rust-projects
category: Rust
difficulty: 중급
tags:
- rust
- projects
- minigrep
- web-server
---

# Rust Projects

**한 줄 정의**: Rust 공식 가이드에서 제시하는 3가지 실전 프로젝트를 통해 소유권, 에러 처리, 동시성 등 핵심 개념을 실습하는 과정.

## 🎭 비유

프로젝트들을 학습 계단이라 생각하면:
- **Guessing Game** = 기초 문법 연습 (반복문, 패턴 매칭)
- **minigrep** = 실무 구조 학습 (에러 처리, 테스트, 리팩토링)
- **Web Server** = 동시성의 깊이 이해 (스마트 포인터, 스레드, 채널)

---

## 1. Guessing Game

**난이도**: 초급 | **Chapter**: 2 | **Pages**: 29-58

추측 숫자 게임을 구현하여 기초 문법과 외부 크레이트 사용법을 배웁니다.

### 학습 개념
- `io` 라이브러리, `String`, `read_line`
- `rand` crate (외부 의존성 추가)
- `match` 패턴 매칭, `Ordering`
- `loop`, `break`, `continue` 제어 흐름

### 핵심 패턴
```rust
loop {
    let mut guess = String::new();
    io::stdin().read_line(&mut guess)?;

    match guess.trim().parse::<u32>() {
        Ok(num) => { /* 숫자 비교 로직 */ },
        Err(_) => continue,
    }
}
```

---

## 2. minigrep (CLI Tool)

**난이도**: 중급 | **Chapter**: 12 | **Pages**: 409-460

`grep` 명령어를 재구현하여 파일 I/O, 에러 처리, TDD, 리팩토링을 학습합니다.

### 아키텍처
```
src/
├── main.rs   → CLI 파싱, 에러 처리
└── lib.rs    → 비즈니스 로직 분리
```

### 학습 개념
- **Command line args**: `env::args`로 CLI 인자 수집
- **File I/O**: `fs::read_to_string`으로 파일 읽기
- **Config 패턴**: 설정을 구조체로 캡슐화
- **에러 처리**: `Result<T, E>` 타입과 에러 전파
- **환경 변수**: `env::var`로 동적 설정
- **TDD**: 테스트 먼저 작성, 구현 후 테스트 통과 (pp. 438-447)
- **Iterator 리팩토링**: 함수형 스타일로 코드 개선 (pp. 487-494)

### 핵심 패턴
```rust
pub fn run(config: Config) -> Result<(), Box<dyn Error>> {
    let contents = fs::read_to_string(config.filename)?;
    let results = search(&config.query, &contents);
    println!("{:?}", results);
    Ok(())
}
```

---

## 3. Multithreaded Web Server

**난이도**: 고급 | **Chapter**: 21 | **Pages**: 839-904

단일 스레드 HTTP 서버를 구현한 후 스레드 풀로 확장하여 동시성과 우아한 종료를 학습합니다.

### Phase 1: Single-threaded (pp. 841-859)
- `TcpListener`로 클라이언트 연결 수락
- HTTP Request/Response 형식 이해
- HTML 파일 서빙
- 404 에러 처리

### Phase 2: Thread Pool (pp. 859-904)

스레드 풀을 통해 동시 요청 처리:

```rust
pub struct ThreadPool {
    workers: Vec<Worker>,
    sender: mpsc::Sender<Job>,
}

type Job = Box<dyn FnOnce() + Send + 'static>;
```

**핵심 구조**:
- `Arc<Mutex<Receiver>>`: 여러 워커가 동일한 채널 수신자 공유
- `Worker` 구조체: 각 스레드의 상태 관리
- `Drop` 트레이트 구현: 우아한 종료 (graceful shutdown)

### 통합 개념
- **소유권 & 빌림**: Arc로 공유 소유권, Mutex로 상호배제
- **스마트 포인터**: Arc, Mutex, Box 활용
- **스레드 동시성**: spawn, join 메커니즘
- **채널 (mpsc)**: 크로스 스레드 통신
- **에러 처리**: unwrap 대신 robust error handling

---

## 프로젝트별 핵심 패턴 비교

| 프로젝트 | 핵심 패턴 | 난이도 |
|----------|----------|--------|
| Guessing Game | `loop` + `match` + `continue/break` | 초급 |
| minigrep | `Config` struct + `Result` 전파 + TDD | 중급 |
| Web Server | `Arc<Mutex<>>` + Thread Pool + Drop | 고급 |

---

## Relations

- **part_of** [[The Rust Programming Language]] - Rust 공식 가이드의 실습 프로젝트들
- **demonstrates** [[rust-memory-management]] - 소유권, 빌림, 스마트 포인터 실습
- **demonstrates** [[rust-concurrency]] - 스레드, 채널, 뮤텍스 실습
- **demonstrates** [[rust-error-handling]] - Result 타입과 에러 처리 전파

---

**Category**: Rust | **Difficulty**: 중급 | **Last Updated**: 2026-01-29
