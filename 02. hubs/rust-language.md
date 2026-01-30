---
title: Rust 언어 완전 가이드
type: hub
tags:
- hub
- rust
- systems-programming
- memory-safety
- fullstack
- ownership
permalink: hubs/rust-language
created: 2026-01-27
---

# Rust 언어 완전 가이드

Rust는 C/C++의 성능을 유지하면서 메모리 안전성을 컴파일 타임에 보장하는 시스템 프로그래밍 언어입니다. 소유권 시스템을 통해 GC 없이 안전성과 성능을 동시에 달성합니다.

## Observations

- [fact] 소유권 시스템으로 GC 없이 메모리 안전성 보장 - 컴파일 타임에 버그 차단 #ownership #memory-safety
- [fact] 컴파일되면 거의 버그 없음 - "컴파일러와 싸우고 런타임에서 평화" #compiler #safety
- [fact] 기술적 범위는 C/C++와 동일 - 커널부터 웹까지 모두 가능 #systems-programming
- [fact] 개발 속도 vs 안전성 트레이드오프 - 빠른 프로토타이핑엔 부적합 #tradeoff
- [fact] 2025년 풀스택 생태계 성숙 - Leptos + Axum 조합 트렌드 #ecosystem
- [fact] 9년 연속 가장 사랑받는 언어 - 83% 개발자 만족도 (Stack Overflow) #popularity

## Relations

- organizes [[rust-memory-management]] (1. 소유권, 빌림, 라이프타임 개념의 핵심)
  - extends [[rust-error-handling]] (1a. Result와 Option 기반 에러 처리 패턴)
- organizes [[rust-type-system]] (2. 제네릭, 트레잇, 타입 안전성)
  - extends [[rust-collections]] (2a. Vec, HashMap, String 등 표준 컬렉션)
  - extends [[rust-oop]] (2b. 구조체, 열거형, 트레잇 객체)
- organizes [[rust-control-flow]] (3. 패턴 매칭, 반복문, 조건문)
  - extends [[rust-functional-programming]] (3a. 클로저, 이터레이터, 함수형 패턴)
- organizes [[rust-concurrency]] (4. 스레드, async/await, 동시성 안전성)
- organizes [[rust-code-organization]] (5. 모듈, 크레이트, 패키지 구조)
  - extends [[rust-macros]] (5a. 매크로 시스템과 메타프로그래밍)
  - extends [[rust-projects]] (5b. Cargo 프로젝트 관리와 워크스페이스)
- organizes [[rust-testing]] (6. 단위 테스트, 통합 테스트, 문서 테스트)
- organizes [[rust-unsafe]] (7. unsafe 블록과 FFI)
- organizes [[rust-book-overview]] (8. 공식 Rust Book 학습 가이드)
  - extends [[rust-learning-paths]] (8a. 수준별 학습 로드맵)
- connects_to [[programming-languages]] - 언어 비교 및 특성 분석
- connects_to [[programming-basics]] - 컴파일러, 런타임 기초 개념
- connects_to [[data-structure]] - Rust로 구현하는 자료구조
- has_guide [[Rust 완전 정복 - 기술적 한계부터 풀스택까지]] - 종합 가이드 문서
