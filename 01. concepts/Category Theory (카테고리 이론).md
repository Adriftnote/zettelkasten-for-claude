---
title: Category Theory (카테고리 이론)
type: concept
tags:
- mathematics
- functional-programming
- type-theory
- abstract-algebra
category: 수학/컴퓨터과학
difficulty: 고급
created: 2026-01-27
permalink: knowledge/concepts/category-theory
---

# Category Theory (카테고리 이론)

수학에서 **구조들 사이의 관계**를 연구하는 분야입니다. "수학의 수학" 또는 "패턴의 패턴"이라고 불립니다.

## 📖 개요

카테고리 이론은 개별 수학적 대상이 아닌, **대상들 사이의 연결과 변환**을 핵심으로 합니다.

```
카테고리 = Objects(대상) + Morphisms(화살표) + Composition(합성)
```

### 핵심 구성요소

| 요소 | 설명 | 프로그래밍 대응 |
|------|------|----------------|
| **Object** | 대상/것 | 타입 (`i32`, `String`) |
| **Morphism** | 화살표/사상 | 함수 (`fn(A) -> B`) |
| **Composition** | 합성 | 함수 합성 (`g(f(x))`) |
| **Identity** | 항등 사상 | `id` 함수 |

## 🎭 비유

> [!quote] 해부학 vs 생태학
> **집합론**이 "이것은 **무엇으로 이루어져** 있는가?"라면,
> **카테고리 이론**은 "이것은 **무엇과 어떻게 연결**되는가?"입니다.

```
집합론: 2 = {∅, {∅}}  ← 내부 구조로 정의

카테고리 이론: 2 = "1에서 오는 화살표가 정확히 2개인 것"
              ← 외부 관계로 정의
```

## ✨ 핵심 개념들

### 1. Functor (함자)

카테고리 사이의 **구조 보존 매핑**입니다.

```rust
// Option, Vec, Result 모두 Functor
// 공통점: map() 메서드를 가짐

let x: Option<i32> = Some(5);
let y = x.map(|n| n * 2);  // Some(10)

let v: Vec<i32> = vec![1, 2, 3];
let w = v.iter().map(|n| n * 2).collect();  // [2, 4, 6]
```

### 2. Natural Transformation (자연 변환)

Functor 사이의 **타입에 무관한 변환**입니다.

```rust
// Option → Result 변환 (타입 T와 무관하게 동작)
fn option_to_result<T>(opt: Option<T>) -> Result<T, String> {
    opt.ok_or_else(|| "None".to_string())
}
```

### 3. Monad (모나드)

**연쇄 가능한 계산**을 추상화합니다.

```rust
// Rust의 ? 연산자가 Monad 패턴
fn process() -> Option<i32> {
    let a = get_value()?;      // None이면 조기 반환
    let b = transform(a)?;     // 연쇄
    Some(b + 1)
}
```

## 🔗 [[Knowledge Graph (지식 그래프)|지식 그래프]]와의 관계

> [!info] 구조적 대응
> 카테고리 이론과 지식 그래프는 **깊은 구조적 유사성**을 가집니다.

| 카테고리 이론 | 지식 그래프 |
|--------------|------------|
| Object (대상) | Node (엔티티) |
| Morphism (화살표) | Edge (관계) |
| Composition (합성) | Path (경로 추론) |
| Identity | Self-reference |

### 예시 비교

```
카테고리:
  A ──f──▶ B ──g──▶ C
      └── g∘f ──────┘

지식 그래프:
  서울 ──수도──▶ 한국 ──위치──▶ 아시아
      └── 추론: "서울은 아시아에 있다"
```

### 응용 분야

- **Categorical Database Theory** - DB 스키마를 카테고리로 모델링
- **Ologs** - 카테고리 기반 온톨로지
- **Functorial Data Migration** - 스키마 변환을 Functor로 표현

## 💻 프로그래밍에서의 응용

### Rust에서의 카테고리 이론

```rust
// Functor Laws
// 1. fmap(id) == id
// 2. fmap(g . f) == fmap(g) . fmap(f)

// Monad Laws (? 연산자의 동작)
// 1. pure(a).bind(f) == f(a)
// 2. m.bind(pure) == m
// 3. m.bind(f).bind(g) == m.bind(|x| f(x).bind(g))
```

### 실용적 이점

1. **추상화 능력** - 다른 것들 속 같은 패턴 발견
2. **API 설계** - `map`, `flat_map`, `fold` 같은 범용 인터페이스
3. **타입 안전성** - 불가능한 상태를 타입으로 제거

## 📚 학습 자료

- [[01-chapter-roadmap|챕터별 로드맵]] - Category Theory for Programmers 학습 가이드
- [[02-concept-roadmap|개념별 로드맵]] - 주제 중심 학습

## 🏷️ 수학에서의 위치

```
MSC 분류: 18 - Category theory; homological algebra
```

| 관점 | 설명 |
|------|------|
| **역사** | 1945년 Eilenberg & Mac Lane 창시 |
| **기원** | 대수적 위상수학의 도구로 시작 |
| **현재** | 수학 기초론의 대안, 통합 언어로 발전 |

### 집합론과의 관계

> [!note] 경쟁과 보완
> - **집합론 (ZFC)**: 현재 수학의 표준 기초
> - **카테고리 이론 (ETCS)**: 대안적 기초로 연구 중
> - 둘 다 유용하며, 상황에 따라 선택

## Relations

- related_to [[Knowledge Graph (지식 그래프)]]
- example_of [[Middleware (미들웨어)]] - 함수 합성의 실용적 예시
- applied_in [[함수형 프로그래밍 (Functional Programming)]]
- foundation_of [[Type Theory]]
- discussed_in [[Type System과 Category Theory]] - 타입 시스템과의 관계 대화

---

**난이도**: 고급
**카테고리**: 수학/컴퓨터과학
**마지막 업데이트**: 2026년 1월