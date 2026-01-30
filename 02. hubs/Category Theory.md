---
title: Category Theory 허브
type: hub
permalink: 02.-hubs/category-theory-heobeu
tags:
- hub
- category-theory
- functional-programming
- rust
- mathematics
- haskell
---

# Category Theory 

수학에서 **구조들 사이의 관계**를 연구하는 분야입니다. 프로그래밍에서는 **합성 가능한 추상화**의 이론적 기반이 됩니다.

> **원서**: Category Theory for Programmers (Bartosz Milewski, 498p)
> **실습 가이드**: Category Theory for Rust Developers
> **예상 학습 시간**: 80-120시간

---

## Observations

- [fact] 프로그래밍의 본질은 합성(Composition) - 작은 조각을 조합해 큰 프로그램을 만든다 #category-theory
- [fact] 타입 = Object, 함수 = Morphism - 타입 시스템이 곧 카테고리 #type-system
- [fact] Functor/Monad는 "컨테이너 패턴"의 수학적 일반화 - Option, Result, Vec 모두 Functor #functor
- [fact] Rust의 `?` 연산자는 Haskell의 do-notation과 동치 #monad
- [fact] 불가능한 상태를 타입으로 제거 - Sum Type(enum)의 힘 #adt
- [fact] Monad = Monoid in category of endofunctors #monad

---

## 학습 자료

### 가이드 폴더 (03. sources/guides)

| 문서 | 설명 |
|------|------|
| 원서 요약 | 24개 챕터 전체 레퍼런스 |
| Rust 가이드 개요 | 3가지 학습 경로 안내 |
| 챕터별 로드맵 | 책 순서대로, Rust 예제 |
| 개념별 로드맵 | 주제 중심 학습 |
| 개발단계별 로드맵 | 풀스택 프로젝트와 매핑 |

### Rust 기초 문서 (reference/rust)

| 문서 | CT 연결 |
|------|---------|
| The Rust Book 개요 | 전체 구조 |
| 함수형 프로그래밍 | Closures = 고차함수, Iterators = Functor |
| 타입 시스템 | Struct = Product, Enum = Coproduct |
| 에러 처리 | Result/Option = Monad, ? = do-notation |
| 컬렉션 | Vec = Free Monoid |
| 동시성 | Channels, Async (Effects) |
| 메모리 관리 | Ownership, Lifetimes |
| 학습 경로 | 초급/중급/고급 가이드 |

---

## 인덱싱 (루만식)

### 1. 기초 개념 (Part 1: 19-197p)

- (1) Category - Objects + Morphisms + Composition
  - (1a) Identity: `f ∘ id = f`
  - (1b) Associativity: `h ∘ (g ∘ f) = (h ∘ g) ∘ f`
- (2) Types and Functions - 타입 = 집합, 순수 함수
  - (2a) Void, Unit, Bool 타입
- (3) Products and Coproducts - 곱과 합 타입
  - (3a) Product: `(a, b)` / struct
  - (3b) Coproduct: `Either a b` / enum

### 2. 중급 개념 (Part 2)

- (4) Functor - `fmap :: (a -> b) -> F a -> F b`
  - (4a) Functor Laws: Identity, Composition
  - (4b) Bifunctor - 두 타입 파라미터
  - (4c) Contravariant Functor - 화살표 반대
- (5) Function Types - Exponentials, Currying
  - (5a) Curry-Howard: Types ↔ Propositions
- (6) Natural Transformation - Functor 간 변환
  - (6a) Naturality Square

### 3. 고급 개념 (Part 3)

- (7) Limits and Colimits - Universal Construction
- (8) Yoneda Lemma - `Nat(C(a, -), F) ≅ F a`
- (9) Adjunction - `L ⊣ R`
  - (9a) **Every adjunction generates a monad**
- (10) Monad - 순차적 계산의 추상화
  - (10a) Monad Laws: Associativity, Identity
  - (10b) Common: Maybe, List, Reader, Writer, State, IO
- (11) Comonad - Monad의 쌍대
- (12) F-Algebra - Recursion Schemes
  - (12a) Catamorphism (fold)
  - (12b) Anamorphism (unfold)

### 4. 전문가 개념 (Part 4)

- (13) Ends and Coends
- (14) Kan Extensions - 모든 것의 일반화
- (15) Enriched Categories
- (16) Topoi
- (17) Lawvere Theories
- (18) Bicategories

---

## Rust ↔ Category Theory 대응

The Rust Book의 각 챕터가 카테고리 이론과 어떻게 연결되는지 정리합니다.

### 핵심 대응표

| 카테고리 이론 | Rust | Haskell |
|--------------|------|---------|
| Object | Type | Type |
| Morphism | `fn(A) -> B` | `a -> b` |
| Composition | `f(g(x))` | `f . g` |
| Identity | `\|x\| x` | `id` |
| **Product** | `struct`, `(A, B)` | `(a, b)` |
| **Coproduct** | `enum` | `Either a b` |
| **Functor** | `.map()`, `.iter()` | `fmap` |
| **Monad** | `.and_then()`, `?` | `>>=`, do |
| Natural Trans. | `From`/`Into` | polymorphic fn |
| Monoid | `Default + concat` | `Monoid` |

### Rust 실전 예제

```rust
// Functor: Iterator.map()
let doubled: Vec<i32> = vec![1, 2, 3].iter()
    .map(|x| x * 2)      // fmap
    .collect();

// Monad: ? operator
fn process() -> Result<i32, Error> {
    let a = get_value()?;     // bind (>>=)
    let b = compute(a)?;       // bind (>>=)
    Ok(a + b)                  // return/pure
}

// Product/Coproduct
struct Point { x: i32, y: i32 }  // Product
enum Shape { Circle(f64), Rect(f64, f64) }  // Coproduct

// Natural Transformation: From/Into
let s: String = "hello".into();  // &str → String
```

---

## 개념 간 관계도

```
(1) Category ──────────────────────────────────────┐
    │                                              │
(2) Types ─────────────(3) Products/Coproducts     │
    │                        │                     │
(4) Functor ←────────────────┘                     │
    │                                              │
(5) Natural Transformation                         │
    │                                              │
(7) Limits ──────(8) Yoneda                        │
    │                │                             │
(9) Adjunction ──────┘                             │
    │                                              │
(10) Monad ←─── "순차적 계산" ←────────────────────┘
    │
(11) Comonad ←── "컨텍스트 계산"
    │
(12) F-Algebra ←── "재귀 스킴"
```

---

## 학습 전략

### 실용주의 경로 (2-4주)

Rust 개발자용 Quick Start:
1. Ch 1-2: Category, Types - 기초 개념
2. Ch 5-6: ADT, Functor - Option/Result 이해
3. Ch 16: Monad - `?` 연산자의 본질
4. 개발단계별 로드맵: 실전 프로젝트에 적용

### 완주 경로 (3-6개월)

책 순서대로:
- Part 1 (Ch 1-9): 기초 개념 - 2개월
- Part 2 (Ch 10-14): 선언적 프로그래밍 - 1개월
- Part 3 (Ch 15-24): 고급 주제 - 2-3개월

---

## Quick Reference

### 실전 문제 → 해결책

| 문제 | 해결책 | 개념 |
|------|--------|------|
| null 처리 | Option monad | Monad |
| 에러 처리 | Result monad | Monad |
| 로깅 | Writer monad | Monad |
| 상태 관리 | State monad | Monad |
| 설정 읽기 | Reader monad | Monad |
| 재귀 처리 | Catamorphism (fold) | F-Algebra |

### Haskell → Rust

| Haskell | Rust | 메서드 |
|---------|------|--------|
| `Functor` | `Option/Result/Vec` | `.map()` |
| `Monad` | `Option/Result` | `.and_then()`, `?` |
| `Monoid` | `Default + Add` | `Default::default()`, `+` |

---

## Relations

- has_guide [[Category Theory for Programmers]] (원서 레퍼런스 498p)
- has_guide [[README]] (Rust 실습 가이드 개요)
- has_guide [[01-chapter-roadmap]] (챕터별 로드맵)
- has_guide [[02-concept-roadmap]] (개념별 로드맵)
- has_guide [[03-development-roadmap (개발단계별 로드맵)
- implements [[The Rust Programming Language - 개요]] (The Rust Book 개요)
- implements [[Rust - Functional Programming]] (Closures, Iterators = Functor)
- implements [[Rust - Type System]] (Struct = Product, Enum = Coproduct)
- implements [[Rust - Error Handling]] (Result/Option = Monad)
- implements [[Rust - Collections]] (Vec = Free Monoid)
- implements [[Rust - Concurrency]] (Channels, Async)
- implements [[Rust - Memory Management]] (Ownership)
- implements [[Rust - Learning Paths]] (학습 경로)
- organizes [[Category Theory (카테고리 이론)]] (개념 노트)
- organizes [[Functor (함자)]]
- organizes [[Monad (모나드)]]
- organizes [[Monoid (모노이드)]]
- organizes [[Pure Function과 Side Effect]]
- connects_to [[rust-language]] (Rust 언어 허브)
- connects_to [[programming-basics]] (타입 시스템, 컴파일러 기초)
- connects_to [[ai-ml-concepts]] (Attention과 함수 합성)
- connects_to [[architectures]] (미들웨어 = 함수 합성)

---

## 참고 자료

- [Category Theory for Programmers (PDF)](https://github.com/hmemcpy/milewski-ctfp-pdf)
- [Bartosz Milewski's YouTube](https://www.youtube.com/user/DrBartosz)
- [The Rust Book (한글)](https://doc.rust-kr.org/)
