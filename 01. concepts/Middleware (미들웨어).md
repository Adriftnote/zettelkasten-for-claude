---
title: Middleware (미들웨어)
type: concept
tags:
- web-development
- design-patterns
- functional-programming
- category-theory
category: 소프트웨어 아키텍처
difficulty: 중급
created: 2026-01-27
permalink: 01.-concepts/middleware-mideulweeo
---

# Middleware (미들웨어)

**요청(Request)과 응답(Response) 사이에서 처리를 담당하는 소프트웨어 계층**입니다. "중간(Middle)에 있는 소프트웨어(Ware)"라는 뜻 그대로입니다.

## 📖 개요

미들웨어는 클라이언트 요청이 최종 핸들러에 도달하기 전에 거쳐가는 **처리 단계들의 연속**입니다.

```
클라이언트 ──▶ [미들웨어1] ──▶ [미들웨어2] ──▶ [핸들러] ──▶ 응답
                  │              │              │
               로깅           인증          비즈니스 로직
```

## 🎭 비유

> [!quote] 공항 비유
> ```
> 출발 ──▶ 보안검색 ──▶ 출국심사 ──▶ 탑승구 ──▶ 비행기
>             │            │           │          │
>          미들웨어1    미들웨어2   미들웨어3     핸들러
> ```
>
> - **보안검색**: 위험물 체크 (검증)
> - **출국심사**: 신원 확인 (인증)
> - **탑승구**: 탑승권 확인 (권한)
> - **비행기**: 실제 목적지 (비즈니스 로직)

## ✨ 핵심 특성

### 파이프라인 구조

미들웨어 체인은 **선형 파이프라인**입니다:

```
Input ──▶ [A] ──▶ [B] ──▶ [C] ──▶ Output
            │       │       │
         output  output  output
            =       =       =
         input   input   input
```

> [!warning] 지식 그래프와의 차이
> | | 미들웨어 체인 | [[Knowledge Graph (지식 그래프)|지식 그래프]] |
> |---|---|---|
> | **구조** | 선형 파이프라인 | 자유 그래프 |
> | **순서** | 고정 (순차적) | 자유 (탐색 가능) |
> | **비유** | 공장 조립 라인 🏭 | 지하철 노선도 🚇 |
> | **목적** | 단계별 처리/변환 | 관계 탐색/추론 |

### 조합 가능성 (Composability)

> [!note] "재조합 가능"의 정확한 의미
> - **독립적 작성**: 각 미들웨어가 다른 미들웨어 코드를 몰라도 됨
> - **선택적 조합**: 필요한 것만 골라서 연결 가능
> - **순서는 중요**: 어떤 순서로 연결하느냐에 따라 **결과가 달라짐**

```rust
// 두 가지 순서 모두 "동작"하지만 결과가 다름
app.layer(logging).layer(auth)   // 로깅 먼저 → 인증 실패해도 로그 남음
app.layer(auth).layer(logging)   // 인증 먼저 → 인증 실패하면 로그 안 남음
```

## 🔗 [[Category Theory (카테고리 이론)|카테고리 이론]]과의 연결

미들웨어 체인은 **함수 합성(Function Composition)**의 직접적인 예시입니다.

```
카테고리 이론:
  f: A → B    (미들웨어 1)
  g: B → C    (미들웨어 2)
  h: C → D    (핸들러)

  h ∘ g ∘ f: A → D    (전체 파이프라인)
```

### 교환법칙은 성립하지 않음

> [!danger] 중요
> **합성 가능(composable) ≠ 교환 가능(commutative)**

```rust
fn add_one(x: i32) -> i32 { x + 1 }
fn double(x: i32) -> i32 { x * 2 }

double(add_one(3))  // (3+1)*2 = 8
add_one(double(3))  // (3*2)+1 = 7

// g ∘ f ≠ f ∘ g (순서가 다르면 결과가 다름!)
```

일상 비유:
- ✅ 교환 가능: 양말 신기 (왼발→오른발 = 오른발→왼발)
- ❌ 교환 불가: 옷 입기 (속옷→바지 ≠ 바지→속옷)

## 💻 코드 예시

### Rust/Axum

```rust
use axum::{Router, middleware};

async fn logging(req: Request, next: Next) -> Response {
    println!("→ {} {}", req.method(), req.uri());
    let response = next.run(req).await;
    println!("← {}", response.status());
    response
}

async fn auth(req: Request, next: Next) -> Response {
    if !is_valid_token(&req) {
        return Response::unauthorized();
    }
    next.run(req).await
}

let app = Router::new()
    .route("/api", get(handler))
    .layer(middleware::from_fn(logging))
    .layer(middleware::from_fn(auth));
```

### 다른 프레임워크

| 언어/프레임워크 | 미들웨어 형태 |
|----------------|--------------|
| **Express (Node)** | `app.use(middleware)` |
| **Django (Python)** | `MIDDLEWARE = [...]` |
| **Axum (Rust)** | `.layer(middleware)` |
| **Gin (Go)** | `router.Use(middleware)` |

## 🔧 일반적인 미들웨어 종류

| 미들웨어 | 역할 | 비유 |
|---------|------|------|
| **Logging** | 요청/응답 기록 | CCTV |
| **Auth** | 인증/권한 확인 | 신분증 검사 |
| **CORS** | Cross-Origin 설정 | 출입국 관리 |
| **Compression** | gzip/brotli 압축 | 짐 포장 |
| **Rate Limiting** | 요청 제한 | 입장 인원 제한 |
| **Error Handling** | 에러 포맷팅 | 안내 데스크 |

## Relations

- applied_in [[01-chapter-roadmap|카테고리 이론 학습 로드맵]] (함수 합성 실제 적용)
- mathematically_related [[Category Theory (카테고리 이론)]] (수학적 기초)
- structurally_different [[Knowledge Graph (지식 그래프)]] (구조 비교)
- is_instance_of [[Monoid와 비가환 구조|비가환 모노이드]] (행렬 곱셈과 같은 구조)

## 📚 더 알아보기

- [[Category Theory (카테고리 이론)#Composition|함수 합성]] - 수학적 기초
- Axum 공식 문서의 Tower middleware

---

**난이도**: 중급
**카테고리**: 소프트웨어 아키텍처
**마지막 업데이트**: 2026년 1월