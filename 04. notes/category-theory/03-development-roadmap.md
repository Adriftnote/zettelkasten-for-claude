# 카테고리 이론 학습 로드맵: 개발단계별

> Rust 풀스택 프로젝트를 만들면서 카테고리 이론을 배우는 실전 가이드

## 🎯 전체 개요

이 로드맵은 **실제 프로젝트를 만들면서** 카테고리 이론을 학습하는 방식입니다.
각 개발 단계마다 필요한 개념을 just-in-time으로 배웁니다.

**프로젝트 예시:** TODO + 칸반 보드 앱
- 백엔드: Axum + SQLx + PostgreSQL
- 프론트엔드: Leptos (WASM)
- 배포: Docker + Fly.io

---

## Phase 0: 환경 설정 & Rust 기초

**기간:** 1주

### 해야 할 일
- [ ] Rust 설치 (rustup)
- [ ] 에디터 설정 (VS Code + rust-analyzer)
- [ ] 기본 Rust 문법 학습
- [ ] Cargo 사용법

### 카테고리 이론 개념
아직 없음 - Rust 기초에 집중

### 읽을 챕터
없음

### 코드 예제

```rust
// 기본 Rust 문법
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];

    // Iterator 체인 (곧 Functor로 배울 것)
    let doubled: Vec<i32> = numbers
        .iter()
        .map(|x| x * 2)
        .collect();

    println!("{:?}", doubled);

    // Option (곧 Monad로 배울 것)
    let maybe_value = Some(5);
    let result = maybe_value.map(|x| x + 1);

    println!("{:?}", result);
}
```

### 체크포인트
- [ ] Hello World 실행
- [ ] Cargo로 새 프로젝트 생성
- [ ] 기본 타입과 함수 이해

---

## Phase 1: 프로젝트 초기화 & 합성

**기간:** 1-2주

### 해야 할 일
- [ ] 프로젝트 구조 설계
- [ ] Axum 백엔드 기본 설정
- [ ] Health check 엔드포인트
- [ ] 로깅 설정

### 카테고리 이론 개념
- **Composition** (함수 합성)
- **Pure Functions**

### 읽을 챕터
- **Ch 1:** Category: The Essence of Composition
- **Ch 2:** Types and Functions (순수 함수 부분)

### 프로젝트 구조

```
todo-app/
├── Cargo.toml
├── backend/
│   ├── src/
│   │   ├── main.rs
│   │   ├── routes/
│   │   ├── handlers/
│   │   └── lib.rs
└── frontend/
    └── (나중에)
```

### 코드 예제

```rust
// src/main.rs
use axum::{Router, routing::get};

#[tokio::main]
async fn main() {
    // 라우터 합성!
    let app = Router::new()
        .route("/health", get(health_check));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();

    axum::serve(listener, app).await.unwrap();
}

async fn health_check() -> &'static str {
    "OK"
}

// 함수 합성 연습
fn compose<A, B, C>(
    f: impl Fn(B) -> C,
    g: impl Fn(A) -> B,
) -> impl Fn(A) -> C {
    move |x| f(g(x))
}

// 미들웨어는 함수 합성!
use axum::middleware;

let app = Router::new()
    .route("/api", get(handler))
    .layer(middleware::from_fn(logging))    // 합성
    .layer(middleware::from_fn(auth));      // 합성
```

### 과제
- [ ] 함수 합성 유틸리티 작성
- [ ] 3개 이상 미들웨어 체인 구성
- [ ] Pure function과 side effect 구분하기

### 체크포인트
- [ ] 서버 실행 및 health check 확인
- [ ] 합성의 결합 법칙 이해
- [ ] 미들웨어 체인 작동 원리 이해

---

## Phase 2: 도메인 모델링 (ADT)

**기간:** 2주

### 해야 할 일
- [ ] 도메인 모델 설계 (Todo, Board, Card)
- [ ] 타입 정의
- [ ] 불가능한 상태 제거
- [ ] 데이터베이스 스키마

### 카테고리 이론 개념
- **Algebraic Data Types**
- **Product Types** (struct)
- **Sum Types** (enum)
- **Type Algebra**

### 읽을 챕터
- **Ch 4:** Products and Coproducts
- **Ch 5:** Simple Algebraic Data Types

### 도메인 모델

```rust
// src/domain/mod.rs

// Product type
#[derive(Debug, Clone)]
pub struct TodoId(pub u64);

#[derive(Debug, Clone)]
pub struct Todo {
    pub id: TodoId,
    pub title: String,
    pub description: Option<String>,
    pub status: TodoStatus,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

// Sum type - 불가능한 상태 제거!
#[derive(Debug, Clone)]
pub enum TodoStatus {
    Draft,
    Active { started_at: DateTime<Utc> },
    Completed { completed_at: DateTime<Utc> },
    Archived { reason: ArchiveReason },
}

#[derive(Debug, Clone)]
pub enum ArchiveReason {
    Completed,
    Cancelled,
    Expired,
}

// 타입으로 비즈니스 규칙 표현
impl Todo {
    // Draft만 activate 가능
    pub fn activate(self) -> Result<Todo, TodoError> {
        match self.status {
            TodoStatus::Draft => {
                Ok(Todo {
                    status: TodoStatus::Active {
                        started_at: Utc::now(),
                    },
                    ..self
                })
            }
            _ => Err(TodoError::InvalidTransition),
        }
    }

    // Active만 complete 가능
    pub fn complete(self) -> Result<Todo, TodoError> {
        match self.status {
            TodoStatus::Active { .. } => {
                Ok(Todo {
                    status: TodoStatus::Completed {
                        completed_at: Utc::now(),
                    },
                    ..self
                })
            }
            _ => Err(TodoError::InvalidTransition),
        }
    }
}

// Coproduct - 응답 타입
#[derive(Debug)]
pub enum TodoResponse {
    Success(Todo),
    NotFound,
    Unauthorized,
    ValidationError(Vec<String>),
}

// Product - 생성 요청
#[derive(Debug, Deserialize)]
pub struct CreateTodoRequest {
    pub title: String,
    pub description: Option<String>,
}

// 타입 대수 활용
// Option<bool> = 1 + 2 = 3가지
pub enum FilterOption {
    All,              // 전체
    Active,           // Active만
    Completed,        // Completed만
}
```

### 데이터베이스 스키마

```sql
CREATE TYPE todo_status AS ENUM ('draft', 'active', 'completed', 'archived');

CREATE TABLE todos (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status todo_status NOT NULL DEFAULT 'draft',
    status_data JSONB,  -- Active/Completed의 추가 데이터
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 과제
- [ ] 프로젝트 도메인을 ADT로 모델링
- [ ] 불가능한 상태를 타입으로 제거 (3개 이상)
- [ ] 상태 전이 함수 구현
- [ ] 타입 대수로 경우의 수 계산

### 체크포인트
- [ ] 모든 도메인 타입 정의 완료
- [ ] 불가능한 상태가 타입 에러를 발생시키는지 확인
- [ ] Product와 Coproduct 구분 이해

---

## Phase 3: 비즈니스 로직 (Functor & Monoid)

**기간:** 2-3주

### 해야 할 일
- [ ] CRUD 로직 구현
- [ ] 에러 처리
- [ ] 데이터 변환 파이프라인
- [ ] 로깅 & 모니터링

### 카테고리 이론 개념
- **Functor** (Option, Result, Vec)
- **Monoid** (로그 누적, 설정 병합)

### 읽을 챕터
- **Ch 3:** Categories Great and Small (Monoid)
- **Ch 6:** Functors
- **Ch 11:** Free Monoids

### 코드 예제

```rust
// Functor: 데이터 변환 파이프라인
async fn get_todo(id: TodoId) -> Result<TodoResponse, Error> {
    let todo = db::find_todo(id)
        .await?                           // Result Functor
        .map(|todo| todo.sanitize())      // Option Functor
        .map(|todo| todo.to_response());  // 체인!

    Ok(TodoResponse::Success(todo))
}

// Iterator Functor
fn get_active_todos(todos: Vec<Todo>) -> Vec<TodoDto> {
    todos
        .into_iter()
        .filter(|t| matches!(t.status, TodoStatus::Active { .. }))
        .map(|t| t.to_dto())              // Functor!
        .collect()
}

// Monoid: 로그 누적
#[derive(Clone)]
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

// Monoid: 설정 병합
#[derive(Clone)]
struct Config {
    db_url: Option<String>,
    port: Option<u16>,
    log_level: Option<String>,
}

impl Monoid for Config {
    fn mempty() -> Self {
        Config {
            db_url: None,
            port: None,
            log_level: None,
        }
    }

    fn mappend(self, other: Self) -> Self {
        Config {
            db_url: other.db_url.or(self.db_url),
            port: other.port.or(self.port),
            log_level: other.log_level.or(self.log_level),
        }
    }
}

// 설정 우선순위: CLI > ENV > File > Default
fn load_config() -> Config {
    let configs = vec![
        default_config(),
        file_config(),
        env_config(),
        cli_config(),
    ];

    configs.into_iter()
        .fold(Config::mempty(), |acc, cfg| acc.mappend(cfg))
}

// 에러 처리 with Functor
async fn update_todo(
    id: TodoId,
    req: UpdateTodoRequest,
) -> Result<Todo, AppError> {
    let todo = db::find_todo(id).await?;

    let updated = todo
        .validate_update(&req)?
        .apply_update(req)
        .map_err(|e| AppError::ValidationError(e))?;  // Bifunctor!

    db::save_todo(updated).await
}
```

### 과제
- [ ] 5개 이상의 Functor 체인 작성
- [ ] Functor laws 테스트
- [ ] 커스텀 타입에 Monoid 구현 (3개)
- [ ] Monoid로 병렬 처리 구현

### 체크포인트
- [ ] CRUD 전체 구현
- [ ] Option/Result 체인 자유자재로 사용
- [ ] Monoid 활용 예제 3개 이상

---

## Phase 4: API 레이어 (Monad)

**기간:** 2-3주

### 해야 할 일
- [ ] REST API 엔드포인트
- [ ] 요청/응답 검증
- [ ] 인증/인가
- [ ] 에러 핸들링

### 카테고리 이론 개념
- **Monad** (Result, Option, Future)
- **Kleisli Category**
- **do-notation** (? 연산자)

### 읽을 챕터
- **Ch 2:** Kleisli Categories (다시 읽기)
- **Ch 16:** Monads: Programmer's Definition
- **Ch 17:** Monads Categorically

### 코드 예제

```rust
// Monadic 에러 처리 (? 연산자 = do-notation)
async fn create_todo_handler(
    Json(req): Json<CreateTodoRequest>,
) -> Result<Json<TodoResponse>, AppError> {
    // ? 연산자는 Monad bind!
    let validated = validate_request(&req)?;
    let todo = create_todo(validated).await?;
    let saved = db::save_todo(todo).await?;
    let response = saved.to_response();

    Ok(Json(TodoResponse::Success(response)))
}

// Kleisli composition
type Kleisli<A, B> = Box<dyn Fn(A) -> Result<B, AppError>>;

fn kleisli_compose<A, B, C>(
    f: impl Fn(A) -> Result<B, AppError> + 'static,
    g: impl Fn(B) -> Result<C, AppError> + 'static,
) -> impl Fn(A) -> Result<C, AppError> {
    move |a| f(a).and_then(&g)
}

// 파이프라인
let process_todo = kleisli_compose(
    validate_todo,
    kleisli_compose(enrich_todo, save_todo)
);

// Future Monad (async/await)
async fn complex_operation(id: TodoId) -> Result<Response, Error> {
    let todo = fetch_todo(id).await?;        // Monad bind
    let user = fetch_user(todo.user_id).await?;  // Monad bind
    let permissions = check_permissions(&user, &todo).await?;

    if !permissions.can_edit {
        return Err(Error::Unauthorized);
    }

    let updated = update_todo(todo).await?;
    notify_watchers(&updated).await?;

    Ok(Response::success(updated))
}

// Reader Monad (의존성 주입)
struct AppContext {
    db: Pool<Postgres>,
    cache: Redis,
    config: Config,
}

// 모든 핸들러가 AppContext를 받음
async fn handler(
    State(ctx): State<AppContext>,
    Path(id): Path<TodoId>,
) -> Result<Json<Todo>, AppError> {
    let todo = db::find_todo(&ctx.db, id).await?;
    Ok(Json(todo))
}
```

### 인증 with Monad

```rust
// Option Monad으로 인증 체인
async fn authenticate(token: &str) -> Option<User> {
    let claims = verify_token(token)?;         // Option Monad
    let user_id = claims.user_id?;
    let user = db::find_user(user_id).await?;

    if user.is_active {
        Some(user)
    } else {
        None
    }
}

// Result Monad으로 상세 에러
async fn authenticate_detailed(token: &str) -> Result<User, AuthError> {
    let claims = verify_token(token)
        .map_err(|_| AuthError::InvalidToken)?;

    let user = db::find_user(claims.user_id).await
        .map_err(|_| AuthError::UserNotFound)?;

    if !user.is_active {
        return Err(AuthError::UserInactive);
    }

    Ok(user)
}
```

### 과제
- [ ] Monad laws 테스트 작성
- [ ] Kleisli composition 활용 (3개 이상)
- [ ] ? 연산자를 and_then으로 desugaring 해보기
- [ ] Reader Monad 패턴 구현

### 체크포인트
- [ ] 모든 API 엔드포인트 구현
- [ ] ? 연산자가 Monad bind임을 이해
- [ ] async/await = Future Monad 이해

---

## Phase 5: 데이터 변환 (Natural Transformation)

**기간:** 1-2주

### 해야 할 일
- [ ] DTO ↔ Domain 변환
- [ ] 에러 타입 통일
- [ ] 타입 안전한 변환 계층

### 카테고리 이론 개념
- **Natural Transformation**
- **Bifunctor**

### 읽을 챕터
- **Ch 7:** Functoriality (Bifunctor)
- **Ch 9:** Natural Transformations

### 코드 예제

```rust
// Natural Transformation: Option -> Result
fn option_to_result<T>(opt: Option<T>) -> Result<T, String> {
    opt.ok_or_else(|| "Not found".to_string())
}

// Natural Transformation: 에러 타입 통일
impl From<DbError> for AppError {
    fn from(e: DbError) -> Self {
        AppError::Database(e)
    }
}

impl From<ValidationError> for AppError {
    fn from(e: ValidationError) -> Self {
        AppError::Validation(e)
    }
}

// 이제 ? 연산자로 자동 변환
async fn handler() -> Result<Response, AppError> {
    let data = db::query().await?;  // DbError -> AppError
    let validated = validate(data)?; // ValidationError -> AppError
    Ok(Response::new(validated))
}

// DTO 변환도 Natural Transformation
trait ToDto<T> {
    fn to_dto(self) -> T;
}

impl ToDto<TodoDto> for Todo {
    fn to_dto(self) -> TodoDto {
        TodoDto {
            id: self.id.0,
            title: self.title,
            status: self.status.to_string(),
        }
    }
}

// Bifunctor: Result 양쪽 변환
fn transform_result<T, E, U, F>(
    result: Result<T, E>,
    success_fn: impl FnOnce(T) -> U,
    error_fn: impl FnOnce(E) -> F,
) -> Result<U, F> {
    result
        .map(success_fn)
        .map_err(error_fn)
}

// 사용
let api_result = db_result
    .map(|todo| todo.to_dto())
    .map_err(|e| e.to_api_error());
```

### Naturality 조건 테스트

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn naturality_condition() {
        // option_to_result(opt.map(f)) == option_to_result(opt).map(f)

        let f = |x: i32| x * 2;
        let opt = Some(5);

        let left = option_to_result(opt.map(f));
        let right = option_to_result(opt).map(f);

        assert_eq!(left, right);
    }
}
```

### 과제
- [ ] 5개 이상 Natural Transformation 구현
- [ ] From/Into trait 체계적으로 구현
- [ ] Naturality 조건 테스트
- [ ] Bifunctor 활용 예제

### 체크포인트
- [ ] 타입 변환 계층 완성
- [ ] 에러 타입 통일
- [ ] Naturality 이해

---

## Phase 6: 프론트엔드 (Leptos)

**기간:** 3-4주

### 해야 할 일
- [ ] Leptos 프로젝트 설정
- [ ] 컴포넌트 설계
- [ ] 상태 관리
- [ ] API 호출

### 카테고리 이론 개념
- **Reactive Programming** (Signal = Functor)
- **State Monad**
- 모든 기존 개념 복습

### 읽을 챕터
복습 위주

### 코드 예제

```rust
// Leptos Signal은 Functor!
use leptos::*;

#[component]
fn TodoList() -> impl IntoView {
    let (todos, set_todos) = create_signal(Vec::<Todo>::new());

    // Functor: Signal<Vec<Todo>> -> Signal<Vec<TodoView>>
    let todo_views = move || {
        todos()
            .into_iter()
            .map(|todo| view! { <TodoItem todo=todo /> })
            .collect::<Vec<_>>()
    };

    view! {
        <div>
            <For
                each=move || todos()
                key=|todo| todo.id
                children=|todo| view! { <TodoItem todo=todo /> }
            />
        </div>
    }
}

// API 호출 with Monad (Resource)
#[component]
fn TodoDetail(id: TodoId) -> impl IntoView {
    let todo = create_resource(
        move || id,
        |id| async move { fetch_todo(id).await }
    );

    view! {
        <Suspense fallback=|| view! { <p>"Loading..."</p> }>
            {move || todo.get().map(|todo| match todo {
                Ok(t) => view! { <TodoView todo=t /> },
                Err(e) => view! { <ErrorView error=e /> },
            })}
        </Suspense>
    }
}

// 상태 관리 with State Monad 패턴
#[derive(Clone)]
struct AppState {
    todos: Vec<Todo>,
    filter: FilterOption,
    user: Option<User>,
}

impl AppState {
    fn add_todo(mut self, todo: Todo) -> Self {
        self.todos.push(todo);
        self
    }

    fn set_filter(mut self, filter: FilterOption) -> Self {
        self.filter = filter;
        self
    }

    fn filtered_todos(&self) -> Vec<&Todo> {
        match self.filter {
            FilterOption::All => self.todos.iter().collect(),
            FilterOption::Active => self.todos
                .iter()
                .filter(|t| matches!(t.status, TodoStatus::Active { .. }))
                .collect(),
            FilterOption::Completed => self.todos
                .iter()
                .filter(|t| matches!(t.status, TodoStatus::Completed { .. }))
                .collect(),
        }
    }
}
```

### 과제
- [ ] 3개 이상 페이지 구현
- [ ] Signal을 Functor로 사용
- [ ] 상태 관리 체계 구축

### 체크포인트
- [ ] 프론트엔드 기본 기능 완성
- [ ] 백엔드와 연동
- [ ] 반응형 UI 작동

---

## Phase 7: 고급 기능 (Recursion Schemes)

**기간:** 2-3주

### 해야 할 일
- [ ] 댓글 스레드 (트리 구조)
- [ ] 태그 계층 구조
- [ ] 재귀적 데이터 처리

### 카테고리 이론 개념
- **F-Algebras**
- **Catamorphism** (fold)
- **Anamorphism** (unfold)

### 읽을 챕터
- **Ch 18:** F-Algebras

### 코드 예제

```rust
// 댓글 트리 구조
#[derive(Debug, Clone)]
pub struct Comment {
    pub id: CommentId,
    pub content: String,
    pub replies: Vec<Comment>,
}

// Catamorphism: 트리를 값으로 fold
fn count_comments(comment: &Comment) -> usize {
    1 + comment.replies
        .iter()
        .map(count_comments)
        .sum::<usize>()
}

fn max_depth(comment: &Comment) -> usize {
    1 + comment.replies
        .iter()
        .map(max_depth)
        .max()
        .unwrap_or(0)
}

// 일반화된 fold
fn cata<T, F>(comment: &Comment, f: &F) -> T
where
    F: Fn(&str, Vec<T>) -> T,
{
    let replies_results: Vec<T> = comment.replies
        .iter()
        .map(|reply| cata(reply, f))
        .collect();

    f(&comment.content, replies_results)
}

// 사용 예
let total = cata(&comment_tree, &|content, replies| {
    1 + replies.iter().sum::<usize>()
});

// Anamorphism: 값에서 트리 생성
fn build_comment_tree(
    comment_id: CommentId,
    all_comments: &[Comment],
) -> Option<Comment> {
    let comment = all_comments
        .iter()
        .find(|c| c.id == comment_id)?;

    let replies = all_comments
        .iter()
        .filter(|c| c.parent_id == Some(comment_id))
        .filter_map(|c| build_comment_tree(c.id, all_comments))
        .collect();

    Some(Comment {
        id: comment.id,
        content: comment.content.clone(),
        replies,
    })
}

// Iterator fold (catamorphism)
fn flatten_comments(root: &Comment) -> Vec<String> {
    let mut result = vec![root.content.clone()];

    for reply in &root.replies {
        result.extend(flatten_comments(reply));
    }

    result
}
```

### 과제
- [ ] 트리 구조 catamorphism 3개 작성
- [ ] anamorphism으로 데이터 생성
- [ ] fold/unfold 활용 예제

### 체크포인트
- [ ] 재귀 데이터 구조 처리 완성
- [ ] Catamorphism 이해
- [ ] fold의 본질 이해

---

## Phase 8: 배포 & 최적화

**기간:** 1-2주

### 해야 할 일
- [ ] Docker 컨테이너화
- [ ] CI/CD 파이프라인
- [ ] 성능 최적화
- [ ] 모니터링

### 카테고리 이론 개념
- **Monoid** (병렬 처리)
- 전체 복습

### 코드 예제

```rust
// Monoid로 병렬 처리 최적화
use rayon::prelude::*;

fn process_todos_parallel(todos: Vec<Todo>) -> ProcessResult {
    todos
        .par_iter()
        .map(|todo| process_todo(todo))
        .reduce(
            || ProcessResult::mempty(),
            |a, b| a.mappend(b)
        )
}

// 메트릭 수집도 Monoid
#[derive(Clone)]
struct Metrics {
    requests: u64,
    errors: u64,
    latency_sum: Duration,
}

impl Monoid for Metrics {
    fn mempty() -> Self {
        Metrics {
            requests: 0,
            errors: 0,
            latency_sum: Duration::ZERO,
        }
    }

    fn mappend(self, other: Self) -> Self {
        Metrics {
            requests: self.requests + other.requests,
            errors: self.errors + other.errors,
            latency_sum: self.latency_sum + other.latency_sum,
        }
    }
}
```

### Dockerfile

```dockerfile
# Multi-stage build
FROM rust:1.75 as builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
COPY --from=builder /app/target/release/todo-app /usr/local/bin/
CMD ["todo-app"]
```

### 체크포인트
- [ ] 배포 완료
- [ ] 성능 최적화
- [ ] 프로젝트 완성!

---

## 🎯 Phase별 카테고리 이론 매핑

| Phase | 기간 | 주요 개념 | 챕터 | 프로젝트 진행률 |
|-------|------|----------|------|----------------|
| 0 | 1주 | - | - | 0% |
| 1 | 1-2주 | Composition | 1-2 | 10% |
| 2 | 2주 | ADT, Product/Coproduct | 4-5 | 30% |
| 3 | 2-3주 | Functor, Monoid | 3, 6, 11 | 50% |
| 4 | 2-3주 | Monad, Kleisli | 2, 16-17 | 70% |
| 5 | 1-2주 | Natural Transformation | 7, 9 | 80% |
| 6 | 3-4주 | 복습 (Functor, Monad) | - | 90% |
| 7 | 2-3주 | Recursion Schemes | 18 | 95% |
| 8 | 1-2주 | 복습 (Monoid) | - | 100% |

**총 기간:** 약 3-6개월

---

## 📊 진행 체크리스트

### Phase 완료 조건

각 Phase를 완료하려면:
- [ ] 해당 챕터 읽기
- [ ] 개념 이해 및 예제 실습
- [ ] 프로젝트에 적용
- [ ] 과제 완료
- [ ] 체크포인트 통과

### 전체 프로젝트 목표

- [ ] 백엔드 API 완성
- [ ] 프론트엔드 UI 완성
- [ ] 배포 완료
- [ ] 카테고리 이론 핵심 개념 10개 이상 적용
- [ ] 책 Part 1-2 완독
- [ ] (선택) Part 3 고급 주제

---

## 🚀 시작하기

```bash
# Phase 0: 환경 설정
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo new todo-app
cd todo-app

# Phase 1: 프로젝트 초기화
cargo add axum tokio serde
cargo run

# 계속 진행...
```

---

## 다음 단계

- [챕터별 로드맵](01-chapter-roadmap.md) - 책 순서대로 상세 학습
- [개념별 로드맵](02-concept-roadmap.md) - 개념 중심 학습
- [README](README.md) - 전체 가이드 개요

---

## 💡 팁

1. **Just-in-time 학습**: 필요할 때 해당 챕터 읽기
2. **코드 먼저**: 이론은 코드를 작성하면서 이해
3. **과도한 추상화 피하기**: 실용적으로 적용
4. **꾸준히**: 매일 조금씩이 낫다
5. **커뮤니티**: Rust 커뮤니티와 공유하며 학습

화이팅! 🦀
