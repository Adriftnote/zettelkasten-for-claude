# Category Theory for Rust Developers

> Bartosz Milewski의 "Category Theory for Programmers"를 Rust 풀스택 개발과 함께 배우는 실전 가이드

## 🎯 이 가이드는 무엇인가요?

이 로드맵은 **카테고리 이론을 실제 Rust 프로젝트를 만들면서 배우는** 학습 가이드입니다.
추상적인 수학 이론을 실용적인 코드로 연결하여, 이론과 실전을 동시에 습득할 수 있습니다.

### 특징
- ✅ **3가지 관점**: 챕터별 / 개념별 / 개발단계별로 재구성
- ✅ **Rust 중심**: 모든 예제를 Rust로 구현
- ✅ **실전 프로젝트**: TODO + 칸반 보드 풀스택 앱 개발
- ✅ **점진적 학습**: 필요할 때 필요한 개념만 학습

---

## 📚 세 가지 학습 경로

### 1. [챕터별 로드맵](01-chapter-roadmap.md) 📖

**책의 순서대로 체계적으로 학습**

```
Preface → Part 1 (기초) → Part 2 (선언적) → Part 3 (고급)
```

**이런 분께 추천:**
- 카테고리 이론을 처음 배우는 분
- 책을 순서대로 읽고 싶은 분
- 이론적 기초를 탄탄히 하고 싶은 분

**구성:**
- 24개 챕터 상세 가이드
- 각 챕터마다 Rust 코드 예제
- 난이도 표시 (⭐ ~ ⭐⭐⭐)
- 실습 과제

---

### 2. [개념별 로드맵](02-concept-roadmap.md) 🎨

**주요 개념 중심으로 재구성**

```
Composition → Functor → Monad → 고급 주제
```

**이런 분께 추천:**
- 특정 개념(Monad 등)을 깊이 이해하고 싶은 분
- 이미 일부 개념을 알고 있는 분
- 개념 간 관계를 명확히 알고 싶은 분

**주요 개념:**
1. **Composition** - 함수 합성
2. **Types & ADT** - 대수적 데이터 타입
3. **Functor** - Option, Result, Vec
4. **Monoid** - 결합 가능한 연산
5. **Natural Transformation** - 타입 간 변환
6. **Monad** - ?, async/await
7. **Adjunction** - 수반 함자
8. **Recursion Schemes** - fold, unfold

---

### 3. [개발단계별 로드맵](03-development-roadmap.md) 🚀

**실제 프로젝트를 만들면서 학습**

```
Phase 0: 환경 설정
Phase 1: 프로젝트 초기화 (Composition)
Phase 2: 도메인 모델링 (ADT)
Phase 3: 비즈니스 로직 (Functor, Monoid)
Phase 4: API 레이어 (Monad)
Phase 5: 데이터 변환 (Natural Transformation)
Phase 6: 프론트엔드 (Leptos)
Phase 7: 고급 기능 (Recursion Schemes)
Phase 8: 배포 & 최적화
```

**이런 분께 추천:**
- 실전 프로젝트를 하면서 배우고 싶은 분
- 이론보다 코드로 먼저 이해하고 싶은 분
- Rust 풀스택 개발 경험을 쌓고 싶은 분

**프로젝트:**
- **백엔드:** Axum + SQLx + PostgreSQL
- **프론트엔드:** Leptos (WebAssembly)
- **배포:** Docker + Fly.io

---

## 🗺️ 어떤 경로를 선택할까요?

### 📖 챕터별로 시작하세요 (추천)
```
- 카테고리 이론 완전 초보
- 체계적인 학습 선호
- 3-6개월 투자 가능
```

### 🎨 개념별로 시작하세요
```
- 특정 개념(Monad 등) 이해 필요
- 이미 일부 개념 알고 있음
- 개념 간 관계 파악 우선
```

### 🚀 개발단계별로 시작하세요 (실전형)
```
- 코드로 먼저 배우고 싶음
- Rust 프로젝트 경험 쌓기
- 이론은 필요할 때 학습
```

---

## 🚀 빠른 시작

### 1. 환경 설정

```bash
# Rust 설치
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 프로젝트 생성
cargo new todo-app
cd todo-app

# 의존성 추가
cargo add axum tokio serde sqlx
```

### 2. 첫 번째 예제: 함수 합성

```rust
// src/main.rs
fn compose<A, B, C>(
    f: impl Fn(B) -> C,
    g: impl Fn(A) -> B,
) -> impl Fn(A) -> C {
    move |x| f(g(x))
}

fn main() {
    let add_one = |x: i32| x + 1;
    let double = |x: i32| x * 2;

    let add_then_double = compose(double, add_one);

    println!("{}", add_then_double(5)); // (5+1)*2 = 12

    // 이것이 카테고리 이론의 시작입니다!
}
```

### 3. 다음 단계

선택한 경로의 가이드를 읽고 따라하세요:
- [챕터별 로드맵](01-chapter-roadmap.md)
- [개념별 로드맵](02-concept-roadmap.md)
- [개발단계별 로드맵](03-development-roadmap.md)

---

## 📊 학습 진행 추적

### 진행률 체크리스트

**기초 개념 (필수)**
- [ ] Composition (함수 합성)
- [ ] Types & Functions
- [ ] Product Types (struct)
- [ ] Sum Types (enum)
- [ ] Functor (Option, Result, Vec)
- [ ] Monad (?, async/await)

**중급 개념**
- [ ] Monoid
- [ ] Natural Transformation
- [ ] Kleisli Category
- [ ] Bifunctor

**고급 개념**
- [ ] Adjunction
- [ ] Recursion Schemes
- [ ] Yoneda Lemma

**프로젝트 진행**
- [ ] 백엔드 API 구현
- [ ] 프론트엔드 UI 구현
- [ ] 배포 완료

---

## 🎓 학습 목표

이 로드맵을 완료하면:

✅ **카테고리 이론 핵심 개념 10개 이상** 이해
- Composition, Functor, Monad, Natural Transformation 등

✅ **Rust 풀스택 개발 경험**
- Axum 백엔드, Leptos 프론트엔드, 배포까지

✅ **함수형 프로그래밍 사고방식**
- 타입 중심 설계, 합성 가능한 코드

✅ **실전 적용 능력**
- 추상적 이론을 실용적 코드로 변환

---

## 📖 원본 책 정보

**Category Theory for Programmers**
- 저자: Bartosz Milewski
- 페이지: 498페이지
- 라이선스: CC BY-SA 4.0
- 온라인: [무료 PDF](https://github.com/hmemcpy/milewski-ctfp-pdf)

### 책 구조

- **Part One (19-197)**: 기초 (9 chapters)
  - Category, Types, Functors, Products, ADT, Natural Transformations

- **Part Two (197-271)**: 선언적 프로그래밍 (5 chapters)
  - Limits, Free Monoids, Yoneda Lemma

- **Part Three (271-491)**: 고급 (10 chapters)
  - Adjunctions, Monads, F-Algebras, Kan Extensions, Enriched Categories

---

## 🛠️ 기술 스택

### 백엔드
```toml
[dependencies]
axum = "0.7"              # 웹 프레임워크
tokio = "1"               # 비동기 런타임
sqlx = "0.7"              # 데이터베이스
serde = "1"               # 직렬화
```

### 프론트엔드
```toml
[dependencies]
leptos = "0.6"            # 리액티브 프레임워크
leptos_router = "0.6"     # 라우팅
```

### 개발 도구
- **Rust**: 1.75+
- **PostgreSQL**: 15+
- **Docker**: 최신 버전

---

## 💡 학습 팁

### 1. 완벽주의 버리기
모든 것을 100% 이해하려 하지 마세요. 일단 코드를 작성하고, 나중에 이해가 깊어집니다.

### 2. Just-in-time 학습
필요할 때 필요한 개념만 배우세요. 고급 주제는 나중에!

### 3. 코드 먼저, 이론은 나중에
추상적 이론보다 구체적인 코드 예제로 시작하세요.

### 4. 과도한 추상화 피하기
카테고리 이론을 알았다고 모든 곳에 적용하지 마세요. 실용성 우선!

### 5. 커뮤니티 활용
- [Rust Users Forum](https://users.rust-lang.org/)
- [r/rust](https://www.reddit.com/r/rust/)
- [Rust Discord](https://discord.gg/rust-lang)

---

## 🔗 유용한 리소스

### Rust 학습
- [The Rust Book](https://doc.rust-lang.org/book/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
- [Rustlings](https://github.com/rust-lang/rustlings)

### 카테고리 이론
- [Category Theory for Programmers (원본)](https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/)
- [Haskell Wiki](https://wiki.haskell.org/Category_theory)

### Rust 웹 개발
- [Axum Docs](https://docs.rs/axum/)
- [Leptos Book](https://leptos-rs.github.io/leptos/)
- [SQLx Guide](https://github.com/launchbadge/sqlx)

---

## 🤝 기여하기

이 로드맵은 오픈소스입니다. 개선 사항이나 오류를 발견하시면:
1. Issue 열기
2. Pull Request 보내기
3. 피드백 공유하기

---

## 📝 라이선스

이 가이드는 원본 책과 같은 **CC BY-SA 4.0** 라이선스를 따릅니다.
자유롭게 공유하고 수정할 수 있습니다.

---

## 🎉 시작하세요!

준비되셨나요? 세 가지 경로 중 하나를 선택해서 시작하세요:

1. **[챕터별 로드맵](01-chapter-roadmap.md)** - 체계적 학습
2. **[개념별 로드맵](02-concept-roadmap.md)** - 개념 중심
3. **[개발단계별 로드맵](03-development-roadmap.md)** - 실전 프로젝트

---

**Happy Coding! 🦀✨**

> "카테고리 이론은 코드의 대수학입니다"
