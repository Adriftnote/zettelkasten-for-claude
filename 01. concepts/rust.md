---
title: Rust
type: concept
tags:
- programming
- rust
- systems-programming
- memory-safety
- ownership
- compiled
permalink: knowledge/concepts/rust
category: Programming Languages
difficulty: 고급
created: 2026-01-27
---

# Rust 🦀

## 📖 개요

**Rust**는 Mozilla에서 2010년에 시작하여 2015년 1.0이 출시된 시스템 프로그래밍 언어입니다. **메모리 안전성**과 **성능**을 동시에 달성하는 것이 핵심 목표이며, 가비지 컬렉터(GC) 없이 **소유권(Ownership)** 시스템으로 메모리를 관리합니다.

## 🎭 비유

**정밀 토크 드라이버**와 같습니다.
- 모든 나사를 박을 수 있음 (범용성)
- 완벽하게 조여짐 (안전성)
- 하지만 셋팅에 시간이 걸림 (학습 곡선)
- 전문가용 도구 (고급 사용자)

또 다른 비유: **에베레스트 등반**
- 힘들지만 정상에 서면 성취감 최고
- 준비 없이 도전하면 실패

## ✨ 특징

### 핵심 특징
- **소유권 시스템**: GC 없이 메모리 안전성 보장
- **제로 코스트 추상화**: 고수준 기능도 런타임 비용 없음
- **컴파일 타임 검사**: 버그를 실행 전에 발견
- **동시성 안전**: 데이터 레이스 컴파일 타임 방지
- **패턴 매칭**: 강력한 match 표현식

### 도구 생태계
- **Cargo**: 패키지 매니저 + 빌드 도구 (최고 수준)
- **crates.io**: 패키지 저장소 (15만+ 크레이트)
- **rustfmt**: 코드 포매터
- **clippy**: 린터

## 💡 예시

### 소유권(Ownership) 기본
```rust
fn main() {
    // s1이 String의 소유자
    let s1 = String::from("hello");

    // 소유권이 s2로 이동 (move)
    let s2 = s1;

    // println!("{}", s1);  // ❌ 컴파일 에러! s1은 더 이상 유효하지 않음
    println!("{}", s2);     // ✅ OK
}
```

### 빌림(Borrowing)
```rust
fn main() {
    let s1 = String::from("hello");

    // &s1: s1을 빌려줌 (소유권 이동 아님)
    let len = calculate_length(&s1);

    // s1 여전히 사용 가능!
    println!("'{}' 길이: {}", s1, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}  // s는 빌린 것이므로 drop되지 않음
```

### 가변 참조
```rust
fn main() {
    let mut s = String::from("hello");

    change(&mut s);  // 가변으로 빌려줌

    println!("{}", s);  // "hello, world"
}

fn change(s: &mut String) {
    s.push_str(", world");
}
```

### 소유권 규칙 요약
```
1. 각 값은 소유자(owner)라는 변수를 가짐
2. 한 번에 하나의 소유자만 존재
3. 소유자가 스코프를 벗어나면 값은 drop됨

빌림 규칙:
- 불변 참조(&T): 여러 개 동시 가능
- 가변 참조(&mut T): 하나만 가능
- 불변과 가변 동시 불가
```

## 🔄 실행 흐름

```
Rust 소스 (.rs)
      ↓
[rustc 컴파일러]
      ↓
   ┌──────────────────┐
   │ 소유권/빌림 검사 │ ← Borrow Checker
   │ 타입 검사        │
   │ 최적화           │
   └──────────────────┘
      ↓
네이티브 바이너리 (기계어)
      ↓
CPU 직접 실행
```

**특징**: JVM이나 인터프리터 없이 **직접 기계어로 컴파일**

## 🆚 비교

### C/C++ vs Rust
| 특성 | C/C++ | Rust |
|------|-------|------|
| 메모리 관리 | 수동 (malloc/free) | 소유권 시스템 |
| 메모리 안전 | ❌ 개발자 책임 | ✅ 컴파일러 보장 |
| 성능 | 최고 | 최고 (동등) |
| 버퍼 오버플로우 | 가능 (취약점) | 불가능 |
| 학습 곡선 | 가파름 | 더 가파름 |

### 속도 비교 (같은 작업 개발 시간)
| 언어 | 시간 | 비고 |
|------|------|------|
| Python | 1시간 | 기준 |
| Go | 2시간 | 2배 |
| Rust | 5-10시간 | 5-10배 |

### 엄격함 스펙트럼
```
자유로움 ←─────────────────────→ 엄격함

JavaScript  Python  Go  Java  Rust
   🟨        🐍     🐹   ☕    🦀
```

## 🛠️ 사용 사례

### 적합한 경우 ✅
```
1. 성능이 생명인 시스템
   → 게임 엔진, DB 엔진, 브라우저

2. 안전이 필수인 시스템
   → 의료기기, 자동차, 항공, 금융

3. 장기 운영 시스템
   → 10년+ 유지보수 인프라

4. 시스템 프로그래밍
   → OS, 드라이버, 임베디드
```

### 부적합한 경우 ❌
```
1. 빠른 프로토타이핑
   → Python, JavaScript 사용

2. 데이터 분석/AI
   → Python 생태계 압도적

3. 간단한 스크립트
   → 오버킬

4. 스타트업 MVP
   → 개발 속도가 중요
```

## 📊 현황 (2025-2026)

- **TIOBE Index**: 13위 (역대 최고)
- **Stack Overflow**: 9년 연속 "가장 사랑받는 언어"
- **GitHub**: 연 40% 성장
- **Linux 커널**: 공식 지원 (2022~)

### 사용 기업
```
Discord, Cloudflare, AWS, Microsoft, Google, Dropbox,
Mozilla, Meta, npm, 1Password, Figma...
```

## Relations

- hub [[rust-language]] - Rust 종합 가이드
- hub [[programming-languages]] - 언어 비교
- contrasts_with [[c-cpp]] - C/C++와 비교
- is_a [[compiler]] 언어 - 네이티브 컴파일
- uses [[ownership]] - 소유권 시스템
- relates_to [[memory-safety]] - 메모리 안전성

## 📚 참고 자료

- [The Rust Programming Language (한글)](https://doc.rust-kr.org/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
- [Rustlings](https://github.com/rust-lang/rustlings) - 연습문제
