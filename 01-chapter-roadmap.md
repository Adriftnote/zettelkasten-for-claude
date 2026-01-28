# 카테고리 이론 학습 로드맵: 챕터별

> Category Theory for Programmers를 Rust로 배우는 체계적 가이드

## 📚 학습 방법

- ✅ 완료한 챕터는 체크
- 🔄 진행 중인 챕터 표시
- 각 챕터마다 Rust 코드 예제 실습
- 난이도: ⭐ 쉬움 | ⭐⭐ 보통 | ⭐⭐⭐ 어려움

---

## Part One: 기초 (19-197페이지)

### Chapter 1: Category: The Essence of Composition (20-29) ⭐

**핵심 개념:**
- 카테고리의 정의: Objects + Morphisms + Composition
- 합성의 법칙: 결합성, 항등원

**Rust 연결:**
```rust
// 함수 합성
fn compose<A, B, C, F, G>(f: F, g: G) -> impl Fn(A) -> C
where
    F: Fn(B) -> C,
    G: Fn(A) -> B,
{
    move |x| f(g(x))
}

let add_one = |x: i32| x + 1;
let double = |x: i32| x * 2;
let add_then_double = compose(double, add_one);

assert_eq!(add_then_double(3), 8); // (3+1)*2
```

**프로젝트 적용:**
- 미들웨어 체인 (Axum의 Layer)
- 함수형 파이프라인 설계

**과제:**
- [ ] 세 개 이상의 함수를 합성하는 매크로 작성
- [ ] 합성의 결합성 테스트 작성

---

### Chapter 2: Types and Functions (29-69) ⭐

**핵심 개념:**
- 타입 시스템의 중요성
- Pure Functions
- Kleisli Categories (부작용 있는 함수)

**Rust 연결:**
```rust
// Pure function - 같은 입력 → 같은 출력, 부작용 없음
fn add(a: i32, b: i32) -> i32 {
    a + b
}

// Kleisli category - Result로 부작용 표현
fn safe_divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err("Division by zero".to_string())
    } else {
        Ok(a / b)
    }
}

// Kleisli 합성
fn kleisli_compose() -> Result<i32, String> {
    safe_divide(10, 2)?
        .pipe(|x| safe_divide(x, 2))
}
```

**프로젝트 적용:**
- 에러 처리를 Result/Option으로 체계화
- Pure function 위주로 비즈니스 로직 작성

**과제:**
- [ ] 프로젝트의 모든 함수를 순수/비순수로 분류
- [ ] Kleisli arrow 타입 정의하고 사용

---

### Chapter 3: Categories Great and Small (45-90) ⭐⭐

**핵심 개념:**
- Simple Graphs
- Orders (preorder, partial order)
- Monoid as Category

**Rust 연결:**
```rust
// Monoid trait
trait Monoid {
    fn mempty() -> Self;
    fn mappend(self, other: Self) -> Self;
}

// String은 Monoid
impl Monoid for String {
    fn mempty() -> Self {
        String::new()
    }

    fn mappend(mut self, other: Self) -> Self {
        self.push_str(&other);
        self
    }
}

// Vec도 Monoid
impl<T> Monoid for Vec<T> {
    fn mempty() -> Self {
        Vec::new()
    }

    fn mappend(mut self, mut other: Self) -> Self {
        self.append(&mut other);
        self
    }
}
```

**프로젝트 적용:**
- 로그 누적 (String monoid)
- 리스트 병합 (Vec monoid)
- 설정 병합 (Config monoid)

**과제:**
- [ ] 커스텀 타입에 Monoid trait 구현
- [ ] fold를 사용해 Monoid 리스트 합치기

---

### Chapter 4: Products and Coproducts (69-107) ⭐⭐

**핵심 개념:**
- Initial/Terminal Objects
- Products (곱)
- Coproducts (합)
- Duality

**Rust 연결:**
```rust
// Product - 튜플, 구조체
struct Product<A, B> {
    first: A,
    second: B,
}

// Coproduct - enum
enum Coproduct<A, B> {
    Left(A),
    Right(B),
}

// Initial object - !  (never type)
// Terminal object - () (unit type)

fn terminal<T>(_: T) -> () {
    ()
}

// Sum type 실전 예제
enum Response {
    Success(String),
    Error(i32),
    Timeout,
}
```

**프로젝트 적용:**
- API 응답 타입 설계 (Result + 커스텀 enum)
- 상태 머신 구현

**과제:**
- [ ] 프로젝트의 도메인 모델을 Product/Coproduct로 표현
- [ ] Either 타입 구현하고 사용

---

### Chapter 5: Simple Algebraic Data Types (90-131) ⭐

**핵심 개념:**
- Product Types (struct)
- Sum Types (enum)
- Algebra of Types

**Rust 연결:**
```rust
// Product type
struct User {
    id: u64,
    name: String,
    email: String,
}

// Sum type
enum UserEvent {
    Created(User),
    Updated { id: u64, field: String },
    Deleted(u64),
}

// Algebra: Bool × Bool = 4가지 경우
// Option<T> = 1 + T (None or Some(T))
// Result<T, E> = T + E

// 타입의 대수
// Option<bool> = 1 + 2 = 3가지
enum OptionBool {
    None,
    SomeTrue,
    SomeFalse,
}
```

**프로젝트 적용:**
- 도메인 모델링 with enum
- 이벤트 소싱 패턴

**과제:**
- [ ] 프로젝트 도메인을 ADT로 모델링
- [ ] 불가능한 상태를 타입으로 제거

---

### Chapter 6: Functors (107-152) ⭐⭐

**핵심 개념:**
- Functor: 카테고리 간 매핑
- Functor Laws (identity, composition)
- Maybe/List/Reader Functors

**Rust 연결:**
```rust
// Functor trait
trait Functor<A> {
    type Target<B>;
    fn fmap<B, F>(self, f: F) -> Self::Target<B>
    where
        F: FnOnce(A) -> B;
}

// Option은 Functor
impl<A> Functor<A> for Option<A> {
    type Target<B> = Option<B>;

    fn fmap<B, F>(self, f: F) -> Option<B>
    where
        F: FnOnce(A) -> B,
    {
        self.map(f)
    }
}

// Vec도 Functor
impl<A> Functor<A> for Vec<A> {
    type Target<B> = Vec<B>;

    fn fmap<B, F>(self, f: F) -> Vec<B>
    where
        F: FnOnce(A) -> B,
    {
        self.into_iter().map(f).collect()
    }
}

// 실전 사용
let numbers = vec![1, 2, 3];
let doubled = numbers.fmap(|x| x * 2);

let maybe_value = Some(5);
let maybe_doubled = maybe_value.fmap(|x| x * 2);
```

**프로젝트 적용:**
- Option/Result로 에러 처리
- Iterator 체인으로 데이터 변환

**과제:**
- [ ] Functor laws 테스트 작성
- [ ] 커스텀 타입에 Functor 구현

---

### Chapter 7: Functoriality (131-172) ⭐⭐⭐

**핵심 개념:**
- Bifunctors
- Contravariant Functors
- Profunctors

**Rust 연결:**
```rust
// Bifunctor - 두 개의 타입 파라미터
trait Bifunctor<A, B> {
    type Target<C, D>;
    fn bimap<C, D, F, G>(self, f: F, g: G) -> Self::Target<C, D>
    where
        F: FnOnce(A) -> C,
        G: FnOnce(B) -> D;
}

// Result는 Bifunctor
impl<A, B> Bifunctor<A, B> for Result<A, B> {
    type Target<C, D> = Result<C, D>;

    fn bimap<C, D, F, G>(self, f: F, g: G) -> Result<C, D>
    where
        F: FnOnce(A) -> C,
        G: FnOnce(B) -> D,
    {
        match self {
            Ok(a) => Ok(f(a)),
            Err(b) => Err(g(b)),
        }
    }
}

// Contravariant Functor 예제
struct Predicate<A> {
    test: Box<dyn Fn(&A) -> bool>,
}

impl<A> Predicate<A> {
    fn contramap<B, F>(self, f: F) -> Predicate<B>
    where
        F: Fn(&B) -> A + 'static,
        A: 'static,
    {
        Predicate {
            test: Box::new(move |b| (self.test)(&f(b))),
        }
    }
}
```

**프로젝트 적용:**
- Result의 양쪽 타입 변환
- 검증 로직 합성

**과제:**
- [ ] Either 타입을 Bifunctor로 구현
- [ ] Contravariant 예제 작성

---

### Chapter 8: Function Types (152-197) ⭐⭐

**핵심 개념:**
- Exponentials (함수 타입)
- Currying
- Cartesian Closed Categories

**Rust 연결:**
```rust
// Currying - 여러 인자를 받는 함수를 단일 인자 함수들의 체인으로
fn curry<A, B, C, F>(f: F) -> impl Fn(A) -> Box<dyn Fn(B) -> C>
where
    F: Fn(A, B) -> C + 'static,
    A: 'static,
    B: 'static,
    C: 'static,
{
    move |a| Box::new(move |b| f(a, b))
}

fn add(a: i32, b: i32) -> i32 {
    a + b
}

let curried_add = curry(add);
let add_5 = curried_add(5);
assert_eq!(add_5(3), 8);

// Partial application
fn partial_apply<A, B, C, F>(f: F, a: A) -> impl Fn(B) -> C
where
    F: Fn(A, B) -> C,
    A: Clone + 'static,
{
    move |b| f(a.clone(), b)
}
```

**프로젝트 적용:**
- 고차 함수 활용
- 부분 적용으로 재사용 가능한 함수 생성

**과제:**
- [ ] 3개 인자 함수 커링
- [ ] Builder 패턴을 커링으로 구현

---

### Chapter 9: Natural Transformations (172-197) ⭐⭐⭐

**핵심 개념:**
- Functor 사이의 변환
- Polymorphic Functions
- Naturality Condition

**Rust 연결:**
```rust
// Natural Transformation: F[A] -> G[A]
// 타입에 관계없이 작동하는 변환

// Option -> Result
fn option_to_result<T>(opt: Option<T>) -> Result<T, String> {
    opt.ok_or_else(|| "None value".to_string())
}

// Vec -> Option (safe head)
fn vec_to_option<T>(mut vec: Vec<T>) -> Option<T> {
    if vec.is_empty() {
        None
    } else {
        Some(vec.remove(0))
    }
}

// 이들은 Natural Transformation
// 타입 T와 무관하게 작동

// Naturality square 확인
fn verify_naturality<A, B, F>(f: F, a: A)
where
    F: Fn(A) -> B,
    A: Clone,
    B: PartialEq + std::fmt::Debug,
{
    let opt_a = Some(a.clone());
    let vec_a = vec![a];

    // fmap then transform == transform then fmap
    let left = option_to_result(opt_a.map(&f));
    let right = option_to_result(Some(a)).map(&f);

    assert_eq!(left, right);
}
```

**프로젝트 적용:**
- 타입 간 안전한 변환
- From/Into trait 구현

**과제:**
- [ ] 3개 이상의 Natural Transformation 구현
- [ ] Naturality 조건 테스트

---

## Part Two: 선언적 프로그래밍 (197-271)

### Chapter 10: Limits and Colimits (206-229) ⭐⭐⭐

**핵심 개념:**
- Universal Construction
- Product/Coproduct as Limits
- Equalizer, Pullback

**Rust 연결:**
```rust
// Product as Limit
struct Product<A, B>(A, B);

// Coproduct as Colimit
enum Coproduct<A, B> {
    Left(A),
    Right(B),
}

// Equalizer - 두 함수가 같은 결과를 내는 입력들
fn equalizer<T, F, G>(values: Vec<T>, f: F, g: G) -> Vec<T>
where
    T: Clone,
    F: Fn(&T) -> i32,
    G: Fn(&T) -> i32,
{
    values
        .into_iter()
        .filter(|x| f(x) == g(x))
        .collect()
}
```

**프로젝트 적용:**
- 복잡한 데이터 구조 설계
- 쿼리 결과 조합 (JOIN)

---

### Chapter 11: Free Monoids (229-238) ⭐⭐

**핵심 개념:**
- Free Construction
- List as Free Monoid

**Rust 연결:**
```rust
// Vec<T>는 T의 Free Monoid
// 어떤 타입이든 리스트로 만들면 Monoid가 됨

fn free_monoid<T>() {
    let empty: Vec<T> = Vec::new(); // identity

    let mut list1 = vec![1, 2];
    let mut list2 = vec![3, 4];
    list1.append(&mut list2); // mappend
}

// Universal property
fn fold_free_monoid<T, M>(list: Vec<T>, f: impl Fn(T) -> M) -> M
where
    M: Monoid,
{
    list.into_iter()
        .map(f)
        .fold(M::mempty(), |acc, x| acc.mappend(x))
}
```

**프로젝트 적용:**
- 커맨드 패턴 (Vec<Command>)
- 이벤트 로그 (Vec<Event>)

---

### Chapter 12: Representable Functors (238-249) ⭐⭐⭐

**핵심 개념:**
- Hom-Functor
- Tabulate and Index

**Rust 연결:**
```rust
// Representable Functor: F[A] ≅ R -> A
trait Representable {
    type Rep;
    type Value;

    fn index(&self, r: Self::Rep) -> Option<Self::Value>;
    fn tabulate<F>(f: F) -> Self
    where
        F: Fn(Self::Rep) -> Self::Value;
}

// Vec는 usize로 representable
impl<T: Clone> Representable for Vec<T> {
    type Rep = usize;
    type Value = T;

    fn index(&self, r: usize) -> Option<T> {
        self.get(r).cloned()
    }

    fn tabulate<F>(f: F) -> Self
    where
        F: Fn(usize) -> T,
    {
        (0..100).map(f).collect() // 임의의 크기
    }
}
```

**프로젝트 적용:**
- Memoization
- Lookup tables

---

### Chapter 13-14: Yoneda Lemma & Embedding (249-271) ⭐⭐⭐

**핵심 개념:**
- Yoneda Lemma: `F[A] ≅ ∀X. (A → X) → F[X]`
- Continuation Passing Style

**Rust 연결:**
```rust
// Yoneda encoding
struct Yoneda<F, A>
where
    F: Functor<A>,
{
    run: Box<dyn Fn(Box<dyn Fn(A) -> B>) -> F::Target<B>>,
}

// CPS (Continuation Passing Style)
fn cps_add(a: i32, b: i32, cont: impl FnOnce(i32)) {
    cont(a + b)
}

fn cps_example() {
    cps_add(3, 4, |result| {
        println!("Result: {}", result);
    });
}

// Async Rust는 CPS의 실용적 사용
async fn fetch_data() -> String {
    // 내부적으로 continuation 사용
    "data".to_string()
}
```

**프로젝트 적용:**
- Async/await 이해
- 콜백 패턴

---

## Part Three: 고급 주제 (271-491)

### Chapter 15: Adjunctions (280-307) ⭐⭐⭐

**핵심 개념:**
- Left/Right Adjoint
- Free/Forgetful Functors
- Unit and Counit

**Rust 연결:**
```rust
// Free/Forgetful adjunction 예제
// Free: A -> Vec<A> (값을 리스트로)
// Forgetful: Vec<A> -> A (첫 원소 추출)

fn free<A>(a: A) -> Vec<A> {
    vec![a]
}

fn forgetful<A>(vec: Vec<A>) -> Option<A> {
    vec.into_iter().next()
}

// Adjunction: Hom(Free(A), B) ≅ Hom(A, Forgetful(B))
```

**프로젝트 적용:**
- 데이터 구조 간 변환
- 추상화 레벨 조정

---

### Chapter 16-17: Monads (307-370) ⭐⭐⭐

**핵심 개념:**
- Monad Laws
- do-notation
- Kleisli Category
- Monads from Adjunctions

**Rust 연결:**
```rust
// Monad trait
trait Monad<A>: Functor<A> {
    fn pure(a: A) -> Self;
    fn bind<B, F>(self, f: F) -> Self::Target<B>
    where
        F: FnOnce(A) -> Self::Target<B>;
}

// Option Monad
impl<A> Monad<A> for Option<A> {
    fn pure(a: A) -> Self {
        Some(a)
    }

    fn bind<B, F>(self, f: F) -> Option<B>
    where
        F: FnOnce(A) -> Option<B>,
    {
        self.and_then(f)
    }
}

// ? 연산자는 do-notation과 유사
fn monadic_computation() -> Option<i32> {
    let x = Some(5)?;
    let y = Some(3)?;
    Some(x + y)
}

// Monad laws:
// 1. Left identity: pure(a).bind(f) == f(a)
// 2. Right identity: m.bind(pure) == m
// 3. Associativity: m.bind(f).bind(g) == m.bind(|x| f(x).bind(g))
```

**프로젝트 적용:**
- 에러 처리 (Option, Result)
- 비동기 (Future)
- 상태 관리 (State monad)

**과제:**
- [ ] Monad laws 테스트
- [ ] 커스텀 Monad 구현 (Reader, Writer, State)

---

### Chapter 18: F-Algebras (370-402) ⭐⭐⭐

**핵심 개념:**
- Catamorphisms (fold)
- Recursion Schemes
- Coalgebras (unfold)

**Rust 연결:**
```rust
// List algebra
enum List<T> {
    Nil,
    Cons(T, Box<List<T>>),
}

// Catamorphism (fold)
fn cata<T, R>(list: List<T>, f: impl Fn(Option<(T, R)>) -> R) -> R {
    match list {
        List::Nil => f(None),
        List::Cons(head, tail) => {
            let tail_result = cata(*tail, &f);
            f(Some((head, tail_result)))
        }
    }
}

// 실전: sum
fn sum(list: List<i32>) -> i32 {
    cata(list, |opt| match opt {
        None => 0,
        Some((head, tail_sum)) => head + tail_sum,
    })
}

// Iterator는 catamorphism의 실용적 구현
let result = vec![1, 2, 3, 4]
    .into_iter()
    .fold(0, |acc, x| acc + x);
```

**프로젝트 적용:**
- 재귀 데이터 구조 처리
- AST 순회

---

### Chapter 19-20: Ends, Coends, Kan Extensions (402-438) ⭐⭐⭐

고급 주제 - 실제 프로그래밍에서는 덜 자주 사용

**프로젝트 적용:**
- 라이브러리 설계
- 고급 추상화

---

### Chapter 21: Enriched Categories (438-453) ⭐⭐⭐

**핵심 개념:**
- 카테고리의 일반화
- Metric Spaces as Categories

**Rust 연결:**
- Type-level programming
- 고급 trait 설계

---

### Chapter 22: Topoi (452-461) ⭐⭐⭐

**핵심 개념:**
- Subobject Classifier
- Intuitionistic Logic

**Rust 연결:**
- Type system과 logic
- 타입 안전성 증명

---

### Chapter 23: Lawvere Theories (461-480) ⭐⭐⭐

**핵심 개념:**
- Universal Algebra
- Side Effects as Theories

**프로젝트 적용:**
- Effect system 설계
- 부작용 추상화

---

### Chapter 24: Monads, Monoids, and Categories (480-491) ⭐⭐⭐

**핵심 개념:**
- Bicategories
- 카테고리 이론의 통합

**프로젝트 적용:**
- 전체 시스템 아키텍처

---

## 📖 학습 전략

### 초보자 경로 (필수만)
1. Ch 1-2: 기초
2. Ch 5-6: ADT, Functor
3. Ch 16: Monad
4. Ch 18: Fold/Recursion

### 실용 중심 경로
1. Part One 전체
2. Ch 10: Limits
3. Ch 16-17: Monads
4. Ch 18: F-Algebras

### 완주 경로
- 순서대로 전부 (6-12개월)

---

## 🎯 체크리스트

각 챕터마다:
- [ ] 책 읽기
- [ ] Rust 예제 실습
- [ ] 프로젝트에 적용
- [ ] 과제 완료

## 다음 단계

- [개념별 로드맵](./02-concept-roadmap.md) - 주제 중심 학습
- [개발단계별 로드맵](./03-development-roadmap.md) - 프로젝트 단계와 매핑
- [README](./README.md) - 전체 가이드 개요
