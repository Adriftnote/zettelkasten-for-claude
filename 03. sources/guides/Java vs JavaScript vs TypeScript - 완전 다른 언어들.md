---
title: Java vs JavaScript vs TypeScript - 완전 다른 언어들
type: note
tags:
- programming
- comparison
- java
- javascript
- typescript
- derived
- faq
- beginner
permalink: notes/java-javascript-typescript-comparison
source_facts:
- Java와 JavaScript는 이름만 비슷하고 완전히 다른 언어
- TypeScript는 JavaScript의 확장판이지, Java의 변형이 아님
- 웹 브라우저는 JavaScript만 실행 가능하므로 TypeScript로 작성해도 JS로 변환됨
- TypeScript의 타입 정보는 JavaScript로 트랜스파일 시 제거됨(type erasure). Java의 타입 정보는 바이트코드에 유지되어 런타임에도 접근 가능
---

# Java vs JavaScript vs TypeScript - 완전 다른 언어들

**핵심 도출**: 이름이 비슷한 세 언어는 설계 목적, 실행 방식, 타입 시스템이 완전히 다르며, 각각의 생태계와 제약에 따라 용도가 결정된다.

> 이름이 비슷해서 헷갈리는 언어들을 명확하게 정리한 노트입니다.
> 실제 대화에서 나온 질문들을 기반으로 작성되었습니다.

---

## 도출 근거

### 이름 유사성과 실제 차이의 괴리

**사실들:**
- Java는 Sun Microsystems가 1995년에 만들었고, JavaScript는 같은 해 Netscape가 만듦
- 두 언어는 서로 다른 용도와 완전히 다른 설계 철학을 가짐
- JavaScript 이름은 마케팅 목적으로 Java의 인기에 편승하기 위해 붙여짐

**따라서:** Java와 JavaScript는 "햄"과 "햄스터"만큼 다르며, 이름 유사성은 순전히 역사적 마케팅 결과일 뿐이다.

### TypeScript와 Java의 표면적 유사성

**사실들:**
- TypeScript와 Java 모두 정적 타입 시스템을 제공
- 둘 다 컴파일 단계가 존재함
- interface, generics 등 비슷한 개념을 사용

**하지만:**
- TypeScript의 타입은 트랜스파일 시 제거됨 (출력이 순수 JavaScript이므로 타입 정보가 남을 곳이 없음)
- Java의 타입은 런타임에도 유지됨 (JVM이 알아야 하므로)
- TypeScript는 JavaScript의 상위집합이지, Java의 변형이 아님

**따라서:** TypeScript가 Java와 문법적으로 비슷해 보이지만, 본질은 JavaScript의 타입 안전성을 강화한 도구일 뿐이다.

### 웹 플랫폼의 제약이 만든 필연

**사실들:**
- 웹 브라우저는 JavaScript만 실행 가능
- 200만 개 이상의 npm 패키지가 JavaScript 생태계에 축적됨
- Java나 Rust 같은 더 엄격한 언어를 웹에서 직접 실행할 수 없음

**따라서:** 웹 개발에서 TypeScript가 선택되는 이유는 더 나은 언어라기보다, JavaScript가 필수이면서도 그 자유로움을 제어하기 위한 합리적 타협이다.

---

## Observations

- [fact] Java와 JavaScript는 1995년에 동시에 탄생했지만 완전히 다른 목적을 가짐 #history
- [fact] JavaScript의 원래 이름은 "LiveScript"였고, 마케팅상 "JavaScript"로 변경됨 #naming
- [fact] 웹 브라우저는 보안 샌드박스 때문에 JavaScript만 실행 가능하도록 설계됨 #browser
- [fact] TypeScript 타입은 개발·컴파일 시점에만 존재하며, 트랜스파일 후 JavaScript에는 타입 정보가 없음 (type erasure) #type-erasure
- [method] 타입 선언 방식의 차이: Java는 변수 선언 시 타입 명시, TypeScript도 동일, JavaScript는 런타임 결정 #type-system
- [method] 컴파일 흐름: Java는 .java → 바이트코드 → JVM 실행 / TypeScript는 .ts → JavaScript → 브라우저/Node.js 실행 #compilation
- [method] 에러 감지 시점: JavaScript는 런타임, TypeScript와 Java는 개발 단계에서 감지 #error-detection
- [decision] 웹 개발자는 TypeScript를 선택하여 JavaScript의 자유도를 제약하고 안정성을 높임 #web-dev
- [decision] 기업 백엔드는 Java를 선택하여 규모, 보안, 인력 풀을 우선시 #enterprise
- [decision] 안드로이드 개발은 Java/Kotlin만 가능하므로 플랫폼이 선택을 강제 #mobile
- [example] JavaScript 문제: `let age = 25; age = "스물다섯";` 컴파일 오류 없이 실행 됨 #dynamic-typing
- [example] TypeScript 해결: `let age: number = 25; age = "스물다섯";` 개발 단계에서 빨간 줄 표시 #static-typing
- [example] Java의 엄격함: 클래스 구조, 접근 제어자, 예외 처리 강제 #strictness
- [reference] GitHub Blog: "Why AI is pushing developers toward typed languages" (2025) #source
- [reference] LLM 연구: AI 생성 코드의 컴파일 오류 대부분이 타입 체크 실패 (정확한 비율은 연구 조건에 따라 다름) #ai-research
- [reference] npm 통계: 200만+ 패키지가 JavaScript 생태계에 축적 #ecosystem
- [question] 왜 브라우저는 JavaScript만 실행할까? → 보안과 표준화 때문에 #browser-security
- [question] TypeScript가 Java를 대체할 수 있을까? → 웹에서만 가능, 안드로이드는 불가능 #platform
- [question] 왜 모든 언어가 정적 타입을 채택하지 않을까? → 개발 속도와 유연성의 트레이드오프 #tradeoff

---

## 자주 하는 질문들

### Q1: "Java랑 JavaScript 같은 거야?"

**A: 완전히 다릅니다!**

> "Java와 JavaScript는 '햄'과 '햄스터'만큼 다르다"

| | Java ☕ | JavaScript 🟨 |
|--|--------|---------------|
| **만든 곳** | Sun Microsystems (1995) | Netscape (1995) |
| **용도** | 서버, 안드로이드 앱 | 웹 브라우저, 웹사이트 |
| **타입** | 정적 (미리 선언) | 동적 (자유로움) |
| **실행** | JVM (바이트코드) | 인터프리터 |
| **문법** | 엄격함 | 유연함 |

**이름이 비슷한 이유?**
```
1995년 당시:
- Java가 엄청 핫한 언어였음 ☕🔥
- Netscape가 새 언어를 만들면서 "LiveScript"라고 이름 붙임
- 인기를 얻으려고 "JavaScript"로 이름 변경 (Java의 인기에 편승)
- 실제로는 전혀 다른 언어!
```

---

### Q2: "TypeScript는 Java에 가까운 거야?"

**A: 아니요, JavaScript의 확장판입니다.**

```
관계도:

Java ☕ ←────────────────→ JavaScript 🟨
         (이름만 비슷, 남남)              ↑
                                         │ 확장
                                         │
                                   TypeScript 🔷
                                   (JS + 타입)
```

**TypeScript와 Java의 유사점**:
- 둘 다 정적 타입 시스템
- 둘 다 컴파일 단계 존재
- interface, generics 등 비슷한 개념

**결정적 차이**:
- TypeScript는 **JavaScript로 변환**되어 실행
- Java는 **바이트코드로 변환**되어 JVM에서 실행
- TypeScript의 타입은 **트랜스파일 시 제거됨** (type erasure)

---

### Q3: "TypeScript는 JavaScript인데 Java처럼 엄격해지려는 건가?"

**A: 정확합니다! 🎯**

JavaScript의 문제:
```javascript
// JavaScript - 너무 자유로움
let age = 25;
age = "스물다섯";   // OK (숫자 → 문자열)
age = [1, 2, 3];    // OK (→ 배열)
age = null;         // OK (→ null)

// 실행해봐야 에러 발견 😱
```

TypeScript의 해결:
```typescript
// TypeScript - 미리 잡아줌
let age: number = 25;
age = "스물다섯";   // ❌ 에러! number에 string 안 됨

// 코드 작성할 때 바로 빨간 줄 → 배포 전에 발견 😌
```

---

### Q4: "그럼 왜 Java나 Rust 같은 더 엄격한 언어 안 쓰고 TypeScript 써?"

**A: 웹에서는 JavaScript가 유일한 선택지이기 때문입니다.**

```
브라우저가 실행할 수 있는 언어:
✅ JavaScript
❌ Java
❌ Rust
❌ Python
❌ 그 외 전부

웹사이트 만들려면 → JavaScript 필수 → TypeScript는 그 업그레이드
```

**추가 이유들**:

1. **기존 생태계**: npm에 200만+ 패키지 (JS 기반)
2. **점진적 도입**: 기존 JS 프로젝트에 조금씩 TS 추가 가능
3. **적당한 균형**: 80% 안전 + 20% 유연함 (급할 땐 `any`로 탈출)
4. **학습 곡선**: Java/Rust보다 배우기 쉬움

---

## 상세 비교

### 📊 엄격함 스펙트럼

```
자유로움 ←─────────────────────────────→ 엄격함

JavaScript   TypeScript   Java   Rust
   🟨           🔷         ☕      🦀
  (막 됨)    (적당히)    (꽤 엄격)  (매우 엄격)
```

| 언어 | 타입 | 엄격함 | 학습 난이도 | 개발 속도 |
|------|------|--------|------------|----------|
| JavaScript | 동적 | ⭐ | 쉬움 | 빠름 |
| TypeScript | 정적 | ⭐⭐⭐ | 보통 | 보통 |
| Java | 정적 | ⭐⭐⭐⭐ | 어려움 | 느림 |
| Rust | 정적 | ⭐⭐⭐⭐⭐ | 매우 어려움 | 매우 느림 |

---

### 🔄 실행 흐름 비교

#### Java (컴파일 → JVM)
```
.java → [javac] → .class (바이트코드) → [JVM] → 실행
                    ↑
                타입 정보 유지됨
```

#### TypeScript (트랜스파일 → JavaScript)
```
.ts → [tsc] → .js (JavaScript) → [Node.js/브라우저] → 실행
                 ↑
             타입 정보 제거됨 (type erasure)
```

#### JavaScript (인터프리터)
```
.js → [Node.js/브라우저] → 실행
        ↑
    한 줄씩 즉시 실행
```

---

### 🎯 언제 뭘 쓰나?

| 만들 것 | 추천 언어 | 이유 |
|---------|----------|------|
| **웹사이트/웹앱** | TypeScript | 브라우저 = JS만 실행 |
| 안드로이드 앱 | Java/Kotlin | 안드로이드 = JVM 기반 |
| iOS 앱 | Swift | 애플 생태계 |
| 고성능 시스템 | Rust/C++ | 메모리 직접 제어 |
| 기업 백엔드 | Java/C# | 안정성, 인력 풀 |
| AI/데이터 분석 | Python | 라이브러리 생태계 |

---

### 💡 한 줄 요약

| 질문 | 답변 |
|------|------|
| Java = JavaScript? | ❌ **완전 다름** (이름만 비슷) |
| TypeScript ≈ Java? | 🔺 타입 시스템만 비슷 |
| TypeScript ≈ JavaScript? | ✅ **JavaScript의 확장판** |
| 왜 웹에서 TS 쓰나? | 브라우저가 JS만 이해하기 때문 |

---

## 🌐 AI 시대와 타입 언어

> 일부 연구에서 LLM이 생성한 컴파일 오류의 대부분이 타입 체크 실패라고 보고 (GitHub Blog, 2025)

- AI가 코드 생성 → **타입이 가드레일 역할**
- TypeScript가 2025년 GitHub에서 Python, JavaScript 추월
- 출처: [GitHub Blog - Why AI is pushing developers toward typed languages](https://github.blog/ai-and-ml/llms/why-ai-is-pushing-developers-toward-typed-languages/)

---

## Relations

- hub [[프로그래밍 언어 비교 (Programming Languages)]] - 이 노트가 속한 허브
- explains [[typescript]], [[javascript]], [[java]] - 세 언어 비교
- derived_from [[JavaScript의 동적 타입 문제]], [[Java의 정적 타입 시스템]], [[웹 플랫폼의 제약]] - 여러 사실을 조합한 도출
- relates_to [[transpilation]] - TypeScript의 변환 방식
- connects_to [[compiler]], [[interpreter]] - 실행 방식 차이

---

**도출일**: 2026-01-27
**출처**: Obsidian 노트 (사용자의 실제 질문 기반) + GitHub Blog (AI와 타입 언어 2025 연구)
