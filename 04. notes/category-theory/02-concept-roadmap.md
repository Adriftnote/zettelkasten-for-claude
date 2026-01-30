# 카테고리 이론 학습 로드맵: 개념별

> 주요 개념 중심으로 재구성한 학습 가이드

## 🎯 학습 순서

```
1. Composition → 2. Types & Monoid → 3. Functor → 4. Monad → 5. 고급 주제
```

---

## 1. 🔗 Composition (합성)

**관련 챕터:** Ch 1, Ch 8

**핵심 아이디어:**
- 작은 함수들을 조합해서 큰 함수를 만든다
- 프로그래밍의 본질은 합성

**Rust 구현:**

```rust
// 기본 함수 합성
fn compose<A, B, C>(f: impl Fn(B) -> C, g: impl Fn(A) -> B) -> impl Fn(A) -> C {
    move |x| f(g(x))
}

// 매크로로 여러 함수 합성
macro_rules! compose {
    ($f:expr) => { $f };
    ($f:expr, $($rest:expr),+) => {
        |x| $f(compose!($($rest),+)(x))
    };
}

// 사용 예
let add_one = |x: i32| x + 1;
let double = |x: i32| x * 2;
let square = |x: i32| x * x;

let pipeline = compose!(square, double, add_one);
assert_eq!(pipeline(2), 36); // ((2+1)*2)^2 = 36
```

**실전 적용:**

```rust
// Axum 미들웨어 합성
use axum::{Router, middleware};

let app = Router::new()
    .route("/api", handler)
    .layer(middleware::from_fn(auth))      // 합성!
    .layer(middleware::from_fn(logging))    // 합성!
    .layer(middleware::from_fn(cors));      // 합성!

// Iterator 체인도 합성
let result = data
    .iter()
    .filter(|x| x.is_active)    // 합성
    .map(|x| x.process())        // 합성
    .collect();                  // 합성
```

**연습 문제:**
- [ ] 3개 이상 함수를 합성하는 compose_n 작성
- [ ] 파이프라인 연산자 매크로 구현 (|> like)
- [ ] 미들웨어 체인 직접 구현

**관련 개념:**
- Point-free style
- Tacit programming

---

## 2. 📦 Types & Algebraic Data Types

**관련 챕터:** Ch 2, Ch 4, Ch 5

### 2.1 Product Types (곱 타입)

**핵심:** 여러 값을 동시에 가지는 타입

```rust
// Tuple
type Point = (i32, i32);

// Struct
struct User {
    id: u64,
    name: String,
    email: String,
}

// 타입의 대수: User = u64 × String × String
// 가능한 값의 개수 = u64개 × String개 × String개
```

### 2.2 Sum Types (합 타입)

**핵심:** 여러 가능성 중 하나인 타입

```rust
// enum = sum type
enum Response {
    Success(Data),      // Data의 경우의 수
    Error(ErrorCode),   // + ErrorCode의 경우의 수
    Timeout,            // + 1
}

// Option<T> = 1 + T (None 또는 Some(T))
// Result<T, E> = T + E
```

### 2.3 Type Algebra (타입 대수)

```rust
// 0 타입 (never type)
fn absurd<T>(never: !) -> T {
    never
}

// 1 타입 (unit type)
fn unit() -> () {
    ()
}

// Bool = 1 + 1 = 2
enum Bool {
    False,  // 1
    True,   // 1
}

// Option<Bool> = 1 + (1 + 1) = 3
enum OptionBool {
    None,
    SomeFalse,
    SomeTrue,
}

// 지수 타입: B^A = A -> B
// bool^bool = bool -> bool = 4가지 함수
fn id(x: bool) -> bool { x }
fn not(x: bool) -> bool { !x }
fn always_true(_: bool) -> bool { true }
fn always_false(_: bool) -> bool { false }
```

**실전 적용:**

```rust
// 불가능한 상태를 타입으로 제거
// ❌ Bad
struct Connection {
    state: ConnectionState,
    socket: Option<TcpStream>,  // state와 불일치 가능
}

// ✅ Good
enum Connection {
    Disconnected,
    Connecting { address: SocketAddr },
    Connected { socket: TcpStream },
}

// 상태 머신
enum OrderState {
    Draft(DraftOrder),
    Placed(PlacedOrder),
    Paid(PaidOrder),
    Shipped(ShippedOrder),
}

impl OrderState {
    fn place(self) -> Result<OrderState, Error> {
        match self {
            OrderState::Draft(order) => {
                // Draft만 Place 가능
                Ok(OrderState::Placed(order.place()?))
            }
            _ => Err(Error::InvalidTransition),
        }
    }
}
```

**연습 문제:**
- [ ] 프로젝트 도메인을 ADT로 모델링
- [ ] 불가능한 상태 타입으로 제거하기
- [ ] 타입 대수로 가능한 경우의 수 계산

---

## 3. 🎨 Functor (함자)

**관련 챕터:** Ch 6, Ch 7, Ch 12

**핵심 아이디어:**
- "컨테이너" 안의 값을 변환
- 구조는 유지하고 내용만 바꾼다

### 3.1 기본 Functor

```rust
trait Functor<A> {
    type Target<B>;
    fn fmap<B, F>(self, f: F) -> Self::Target<B>
    where
        F: FnOnce(A) -> B;
}

// Option은 Functor
// fmap = map
let x = Some(5).map(|n| n * 2);  // Some(10)
let y = None.map(|n: i32| n * 2); // None

// Vec도 Functor
let nums = vec![1, 2, 3].into_iter()
    .map(|n| n * 2)
    .collect::<Vec<_>>();  // [2, 4, 6]

// Result도 Functor
let result: Result<i32, String> = Ok(5);
let doubled = result.map(|n| n * 2);  // Ok(10)
```

### 3.2 Functor Laws

```rust
// Law 1: Identity
// fmap(id) == id
assert_eq!(Some(5).map(|x| x), Some(5));

// Law 2: Composition
// fmap(f . g) == fmap(f) . fmap(g)
let f = |x: i32| x + 1;
let g = |x: i32| x * 2;

let left = Some(5).map(|x| f(g(x)));
let right = Some(5).map(g).map(f);
assert_eq!(left, right);
```

### 3.3 Bifunctor (두 개 타입 파라미터)

```rust
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

// 사용
let result: Result<i32, String> = Ok(5);
let mapped = result.bimap(
    |n| n * 2,                    // Ok 값 변환
    |e| format!("Error: {}", e)   // Err 값 변환
);
```

### 3.4 Contravariant Functor

```rust
// 일반 Functor: F<A> -> (A -> B) -> F<B>
// Contravariant: F<A> -> (B -> A) -> F<B>  // 화살표 반대!

struct Predicate<A> {
    test: Box<dyn Fn(&A) -> bool>,
}

impl<A: 'static> Predicate<A> {
    fn contramap<B: 'static>(self, f: impl Fn(&B) -> A + 'static) -> Predicate<B> {
        Predicate {
            test: Box::new(move |b| (self.test)(&f(b))),
        }
    }
}

// 예제: 길이로 String 검증
let longer_than_5 = Predicate {
    test: Box::new(|n: &usize| *n > 5),
};

// String을 usize로 변환해서 재사용
let string_longer_than_5 = longer_than_5.contramap(|s: &String| s.len());

assert!(string_longer_than_5.test(&"hello world".to_string()));
```

**실전 적용:**

```rust
// API 응답 변환
async fn fetch_user(id: u64) -> Result<User, ApiError> {
    // ...
}

let user_name = fetch_user(42)
    .await?
    .map(|user| user.name);  // Functor!

// 에러 타입 변환
let result: Result<Data, DbError> = query();
let api_result: Result<Data, ApiError> = result
    .map_err(|e| ApiError::Database(e));  // Bifunctor!

// Iterator 체인
let processed = stream
    .filter(|x| x.is_valid())
    .map(|x| x.normalize())      // Functor
    .map(|x| x.transform())       // Functor
    .collect();
```

**연습 문제:**
- [ ] 커스텀 타입에 Functor trait 구현
- [ ] Functor laws 속성 테스트 작성
- [ ] Contravariant Functor 실전 예제 3개

---

## 4. 🔄 Monoid (모노이드)

**관련 챕터:** Ch 3, Ch 11, Ch 17

**핵심 아이디어:**
- 결합 가능한 연산 + 항등원
- 병렬 처리의 기초

### 4.1 Monoid Laws

```rust
trait Monoid: Clone {
    fn mempty() -> Self;
    fn mappend(self, other: Self) -> Self;

    // Laws (테스트로 검증):
    // 1. Left identity:  mempty().mappend(x) == x
    // 2. Right identity: x.mappend(mempty()) == x
    // 3. Associativity:  a.mappend(b).mappend(c) == a.mappend(b.mappend(c))
}
```

### 4.2 기본 Monoid 예제

```rust
// String Monoid
impl Monoid for String {
    fn mempty() -> Self {
        String::new()
    }

    fn mappend(mut self, other: Self) -> Self {
        self.push_str(&other);
        self
    }
}

// Vec Monoid
impl<T: Clone> Monoid for Vec<T> {
    fn mempty() -> Self {
        Vec::new()
    }

    fn mappend(mut self, mut other: Self) -> Self {
        self.append(&mut other);
        self
    }
}

// 숫자 Monoid (덧셈)
#[derive(Clone)]
struct Sum(i32);

impl Monoid for Sum {
    fn mempty() -> Self {
        Sum(0)
    }

    fn mappend(self, other: Self) -> Self {
        Sum(self.0 + other.0)
    }
}

// 숫자 Monoid (곱셈)
#[derive(Clone)]
struct Product(i32);

impl Monoid for Product {
    fn mempty() -> Self {
        Product(1)
    }

    fn mappend(self, other: Self) -> Self {
        Product(self.0 * other.0)
    }
}
```

### 4.3 Free Monoid

```rust
// Vec<T>는 T의 Free Monoid
// 어떤 타입이든 리스트로 감싸면 Monoid가 됨

fn free_monoid<T>() {
    let empty: Vec<T> = Vec::new();  // mempty

    let mut a = vec![1, 2];
    let mut b = vec![3, 4];
    a.append(&mut b);  // mappend → [1,2,3,4]
}

// Monoid fold
fn mconcat<M: Monoid>(items: Vec<M>) -> M {
    items.into_iter()
        .fold(M::mempty(), |acc, x| acc.mappend(x))
}
```

**실전 적용:**

```rust
// 로그 누적
struct Logs(Vec<String>);

impl Monoid for Logs {
    fn mempty() -> Self {
        Logs(Vec::new())
    }

    fn mappend(mut self, mut other: Self) -> Self {
        self.0.append(&mut other.0);
        self
    }
}

// 병렬 처리
fn parallel_process<T, M>(items: Vec<T>, f: impl Fn(T) -> M + Sync) -> M
where
    M: Monoid + Send,
    T: Send,
{
    use rayon::prelude::*;

    items.into_par_iter()
        .map(f)
        .reduce(|| M::mempty(), |a, b| a.mappend(b))
}

// 설정 병합
#[derive(Clone)]
struct Config {
    host: Option<String>,
    port: Option<u16>,
    timeout: Option<Duration>,
}

impl Monoid for Config {
    fn mempty() -> Self {
        Config {
            host: None,
            port: None,
            timeout: None,
        }
    }

    fn mappend(self, other: Self) -> Self {
        Config {
            host: other.host.or(self.host),
            port: other.port.or(self.port),
            timeout: other.timeout.or(self.timeout),
        }
    }
}

// CLI args > ENV > defaults
let config = mconcat(vec![defaults, env_config, cli_config]);
```

**연습 문제:**
- [ ] 커스텀 타입 5개에 Monoid 구현
- [ ] Monoid laws 속성 테스트
- [ ] MapReduce 패턴 구현

---

## 5. 🎭 Natural Transformation (자연 변환)

**관련 챕터:** Ch 9, Ch 19

**핵심 아이디어:**
- Functor 사이의 변환
- 타입에 독립적 (polymorphic)

```rust
// Natural Transformation: F<A> -> G<A> (모든 A에 대해)

// Option -> Result
fn option_to_result<T>(opt: Option<T>) -> Result<T, String> {
    opt.ok_or_else(|| "None".to_string())
}

// Vec -> Option
fn vec_to_option<T>(mut vec: Vec<T>) -> Option<T> {
    vec.pop()
}

// Result -> Option
fn result_to_option<T, E>(result: Result<T, E>) -> Option<T> {
    result.ok()
}

// Naturality condition:
// option_to_result(opt.map(f)) == option_to_result(opt).map(f)
```

**실전 적용:**

```rust
// From/Into trait는 Natural Transformation
impl From<String> for Vec<u8> {
    fn from(s: String) -> Vec<u8> {
        s.into_bytes()
    }
}

// 타입 간 안전한 변환
trait NaturalTransform<F, G> {
    fn transform<T>(from: F<T>) -> G<T>;
}

// 에러 타입 통일
fn api_handler() -> Result<Response, ApiError> {
    let db_result: Result<Data, DbError> = database_query();
    let cache_result: Result<Data, CacheError> = cache_get();

    // 모두 ApiError로 변환
    let data = db_result
        .map_err(|e| e.into())?;  // Natural transformation!

    Ok(Response::new(data))
}
```

**연습 문제:**
- [ ] 5개의 Natural Transformation 구현
- [ ] Naturality 조건 테스트
- [ ] 프로젝트의 타입 변환을 NT로 정리

---

## 6. 🚀 Monad (모나드)

**관련 챕터:** Ch 2 (Kleisli), Ch 16, Ch 17, Ch 23

**핵심 아이디어:**
- "계산의 컨텍스트"를 추상화
- 순차적 계산을 합성

### 6.1 Monad Laws

```rust
trait Monad<A>: Functor<A> {
    // pure (return)
    fn pure(a: A) -> Self;

    // bind (>>=, flatMap, and_then)
    fn bind<B, F>(self, f: F) -> Self::Target<B>
    where
        F: FnOnce(A) -> Self::Target<B>;
}

// Laws:
// 1. Left identity:  pure(a).bind(f) == f(a)
// 2. Right identity: m.bind(pure) == m
// 3. Associativity:  m.bind(f).bind(g) == m.bind(|x| f(x).bind(g))
```

### 6.2 기본 Monad 예제

```rust
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

// Result Monad
impl<A, E> Monad<A> for Result<A, E> {
    fn pure(a: A) -> Self {
        Ok(a)
    }

    fn bind<B, F>(self, f: F) -> Result<B, E>
    where
        F: FnOnce(A) -> Result<B, E>,
    {
        self.and_then(f)
    }
}

// Vec Monad (list comprehension)
impl<A> Monad<A> for Vec<A> {
    fn pure(a: A) -> Self {
        vec![a]
    }

    fn bind<B, F>(self, f: F) -> Vec<B>
    where
        F: FnOnce(A) -> Vec<B>,
    {
        self.into_iter().flat_map(f).collect()
    }
}
```

### 6.3 do-notation (? 연산자)

```rust
// Haskell의 do-notation과 유사
fn computation() -> Option<i32> {
    let x = Some(5)?;      // bind
    let y = Some(3)?;      // bind
    let z = Some(2)?;      // bind
    Some(x + y + z)        // pure
}

// 이것은 다음과 동등:
fn computation_desugared() -> Option<i32> {
    Some(5).and_then(|x|
        Some(3).and_then(|y|
            Some(2).and_then(|z|
                Some(x + y + z))))
}
```

### 6.4 Kleisli Composition

```rust
// Kleisli arrow: A -> M<B>
type Kleisli<A, B> = Box<dyn Fn(A) -> Option<B>>;

// Kleisli composition (fish operator >=>)
fn kleisli_compose<A, B, C>(
    f: impl Fn(A) -> Option<B> + 'static,
    g: impl Fn(B) -> Option<C> + 'static,
) -> impl Fn(A) -> Option<C> {
    move |a| f(a).and_then(&g)
}

// 예제
fn safe_div(a: i32, b: i32) -> Option<i32> {
    if b == 0 { None } else { Some(a / b) }
}

fn safe_sqrt(x: i32) -> Option<i32> {
    if x < 0 { None } else { Some((x as f64).sqrt() as i32) }
}

let div_then_sqrt = kleisli_compose(
    |x| safe_div(x, 2),
    safe_sqrt
);

assert_eq!(div_then_sqrt(8), Some(2));
```

### 6.5 실전 Monad 예제

```rust
// Reader Monad (의존성 주입)
struct Reader<R, A> {
    run: Box<dyn Fn(&R) -> A>,
}

impl<R, A> Reader<R, A> {
    fn bind<B>(self, f: impl Fn(A) -> Reader<R, B> + 'static) -> Reader<R, B>
    where
        A: 'static,
        R: 'static,
    {
        Reader {
            run: Box::new(move |r| {
                let a = (self.run)(r);
                let reader_b = f(a);
                (reader_b.run)(r)
            }),
        }
    }
}

// Writer Monad (로깅)
struct Writer<W, A> {
    value: A,
    log: W,
}

impl<W: Monoid, A> Writer<W, A> {
    fn bind<B>(self, f: impl FnOnce(A) -> Writer<W, B>) -> Writer<W, B> {
        let writer_b = f(self.value);
        Writer {
            value: writer_b.value,
            log: self.log.mappend(writer_b.log),
        }
    }
}

// State Monad
struct State<S, A> {
    run: Box<dyn FnOnce(S) -> (A, S)>,
}

impl<S: 'static, A: 'static> State<S, A> {
    fn bind<B: 'static>(self, f: impl FnOnce(A) -> State<S, B> + 'static) -> State<S, B> {
        State {
            run: Box::new(move |s| {
                let (a, s2) = (self.run)(s);
                let state_b = f(a);
                (state_b.run)(s2)
            }),
        }
    }
}
```

**실전 적용:**

```rust
// 에러 처리
async fn process_order(order_id: u64) -> Result<Response, ApiError> {
    let order = fetch_order(order_id).await?;        // Monad bind
    let payment = process_payment(&order).await?;    // Monad bind
    let shipment = create_shipment(&order).await?;   // Monad bind

    Ok(Response {
        order,
        payment,
        shipment,
    })
}

// 비동기 처리 (Future는 Monad)
async fn fetch_user_posts(user_id: u64) -> Result<Vec<Post>, Error> {
    let user = fetch_user(user_id).await?;
    let posts = fetch_posts_by_author(user.id).await?;
    Ok(posts)
}

// 옵션 체인
fn get_nested_value(data: &Data) -> Option<String> {
    data.user?
        .profile?
        .settings?
        .theme?
        .color
        .clone()
}
```

**연습 문제:**
- [ ] Monad laws 테스트
- [ ] Reader/Writer/State Monad 실전 예제
- [ ] 커스텀 Monad 구현
- [ ] do-notation 매크로 작성

---

## 7. 🔀 Adjunction (수반 함자)

**관련 챕터:** Ch 15, Ch 17

**핵심 아이디어:**
- 두 Functor 사이의 특별한 관계
- Monad는 Adjunction에서 유도됨

```rust
// Free/Forgetful Adjunction
// Free: A -> F<A>  (자유 구조 생성)
// Forgetful: F<A> -> A  (구조 잊기)

// 예: Free Monoid
fn free<A>(a: A) -> Vec<A> {
    vec![a]
}

fn forgetful<A>(vec: Vec<A>) -> Option<A> {
    vec.into_iter().next()
}

// Product/Exponential Adjunction
// A × - ⊣ A → -

// Curry/Uncurry
fn curry<A, B, C>(f: impl Fn((A, B)) -> C) -> impl Fn(A) -> Box<dyn Fn(B) -> C>
where
    A: Clone + 'static,
    B: 'static,
    C: 'static,
{
    move |a: A| {
        let a = a.clone();
        Box::new(move |b| f((a.clone(), b)))
    }
}

fn uncurry<A, B, C>(f: impl Fn(A) -> Box<dyn Fn(B) -> C>) -> impl Fn((A, B)) -> C {
    move |(a, b)| f(a)(b)
}
```

**실전 적용:**
- 추상화 레벨 조정
- 데이터 구조 간 변환

---

## 8. 📊 Recursion Schemes (재귀 스킴)

**관련 챕터:** Ch 18

**핵심 아이디어:**
- 재귀를 추상화
- Catamorphism (fold), Anamorphism (unfold)

### 8.1 Catamorphism (Fold)

```rust
// 리스트의 재귀 구조
enum List<T> {
    Nil,
    Cons(T, Box<List<T>>),
}

// Catamorphism - 구조를 소비해서 값 생성
fn cata<T, R>(list: List<T>, f: impl Fn(Option<(T, R)>) -> R) -> R {
    match list {
        List::Nil => f(None),
        List::Cons(head, tail) => {
            let tail_result = cata(*tail, &f);
            f(Some((head, tail_result)))
        }
    }
}

// 예제
fn sum(list: List<i32>) -> i32 {
    cata(list, |opt| match opt {
        None => 0,
        Some((head, tail_sum)) => head + tail_sum,
    })
}

fn length<T>(list: List<T>) -> usize {
    cata(list, |opt| match opt {
        None => 0,
        Some((_, tail_len)) => 1 + tail_len,
    })
}

// Iterator의 fold는 catamorphism
let sum: i32 = vec![1, 2, 3, 4]
    .into_iter()
    .fold(0, |acc, x| acc + x);
```

### 8.2 Anamorphism (Unfold)

```rust
// 값에서 구조를 생성
fn ana<T, S>(seed: S, f: impl Fn(S) -> Option<(T, S)>) -> List<T> {
    match f(seed) {
        None => List::Nil,
        Some((value, next_seed)) => {
            List::Cons(value, Box::new(ana(next_seed, f)))
        }
    }
}

// 예제: range 생성
fn range(start: i32, end: i32) -> List<i32> {
    ana(start, |n| {
        if n >= end {
            None
        } else {
            Some((n, n + 1))
        }
    })
}

// Iterator는 anamorphism
let nums: Vec<i32> = (0..10).collect();
```

**실전 적용:**

```rust
// JSON 파싱 (fold)
fn parse_json(tokens: Vec<Token>) -> Value {
    tokens.into_iter().fold(Value::Null, |acc, token| {
        // catamorphism!
        combine(acc, token)
    })
}

// AST 순회
fn eval(expr: Expr) -> i32 {
    cata(expr, |node| match node {
        ExprF::Lit(n) => n,
        ExprF::Add(a, b) => a + b,
        ExprF::Mul(a, b) => a * b,
    })
}
```

**연습 문제:**
- [ ] 커스텀 트리 타입에 catamorphism 구현
- [ ] unfold로 피보나치 수열 생성
- [ ] fold/unfold로 리스트 reverse 구현

---

## 9. 🎓 고급 주제

### Limits & Colimits (Ch 10)
- Universal constructions
- Product/Coproduct의 일반화

### Yoneda Lemma (Ch 13-14)
- `F[A] ≅ ∀X. (A → X) → F[X]`
- Continuation Passing Style

### Kan Extensions (Ch 20)
- Left/Right Kan Extension
- Functor의 일반화

### Enriched Categories (Ch 21)
- Monoidal Categories
- Type-level programming

### Lawvere Theories (Ch 23)
- Effect Systems
- Side Effects 추상화

---

## 📚 개념 의존성 그래프

```
Composition
    ↓
Types & ADT ──→ Monoid
    ↓              ↓
Functor ─────→ Monad ←─── Adjunction
    ↓              ↓
Natural Transformation
    ↓
Recursion Schemes
```

---

## 🎯 학습 전략별 개념 선택

### 최소 필수 (실용)
1. Composition
2. ADT (Product/Sum)
3. Functor (Option, Result, Vec)
4. Monad (?, async/await)

### 중급 (함수형 프로그래밍)
+ Monoid
+ Natural Transformation
+ Kleisli Category
+ Recursion Schemes

### 고급 (이론)
+ Adjunction
+ Yoneda Lemma
+ Kan Extensions
+ Enriched Categories

---

## 다음 단계

- [챕터별 로드맵](01-chapter-roadmap.md) - 책 순서대로 학습
- [개발단계별 로드맵](03-development-roadmap.md) - 프로젝트 단계와 연결
- [README](README.md) - 전체 가이드 개요
