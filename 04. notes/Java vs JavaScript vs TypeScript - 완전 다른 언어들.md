---
title: Java vs JavaScript vs TypeScript - 완전 다른 언어들
type: note
tags:
- programming
- comparison
- java
- javascript
- typescript
- faq
- beginner
hub: programming-languages
permalink: notes/java-javascript-typescript-comparison
created: 2026-01-27
---

# Java vs JavaScript vs TypeScript - 완전 다른 언어들

> 이름이 비슷해서 헷갈리는 언어들을 명확하게 정리한 노트입니다.
> 실제 대화에서 나온 질문들을 기반으로 작성되었습니다.

---

## 🤔 자주 하는 질문들

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
- TypeScript의 타입은 **컴파일 후 사라짐**

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

## 📊 엄격함 스펙트럼

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

## 🔄 실행 흐름 비교

### Java (컴파일 → JVM)
```
.java → [javac] → .class (바이트코드) → [JVM] → 실행
                    ↑
                타입 정보 유지됨
```

### TypeScript (트랜스파일 → JavaScript)
```
.ts → [tsc] → .js (JavaScript) → [Node.js/브라우저] → 실행
                 ↑
             타입 정보 사라짐!
```

### JavaScript (인터프리터)
```
.js → [Node.js/브라우저] → 실행
        ↑
    한 줄씩 즉시 실행
```

---

## 🎯 언제 뭘 쓰나?

| 만들 것 | 추천 언어 | 이유 |
|---------|----------|------|
| **웹사이트/웹앱** | TypeScript | 브라우저 = JS만 실행 |
| 안드로이드 앱 | Java/Kotlin | 안드로이드 = JVM 기반 |
| iOS 앱 | Swift | 애플 생태계 |
| 고성능 시스템 | Rust/C++ | 메모리 직접 제어 |
| 기업 백엔드 | Java/C# | 안정성, 인력 풀 |
| AI/데이터 분석 | Python | 라이브러리 생태계 |

---

## 💡 한 줄 요약

| 질문 | 답변 |
|------|------|
| Java = JavaScript? | ❌ **완전 다름** (이름만 비슷) |
| TypeScript ≈ Java? | 🔺 타입 시스템만 비슷 |
| TypeScript ≈ JavaScript? | ✅ **JavaScript의 확장판** |
| 왜 웹에서 TS 쓰나? | 브라우저가 JS만 이해하기 때문 |

---

## 🌐 AI 시대와 타입 언어

> "2025년 학술 연구에 따르면 LLM이 생성한 컴파일 오류의 94%가 타입 체크 실패"

- AI가 코드 생성 → **타입이 가드레일 역할**
- TypeScript가 2025년 GitHub에서 Python, JavaScript 추월
- 출처: [GitHub Blog - Why AI is pushing developers toward typed languages](https://github.blog/ai-and-ml/llms/why-ai-is-pushing-developers-toward-typed-languages/)

---

## Relations

- hub [[programming-languages]] - 이 노트가 속한 허브
- explains [[typescript]], [[javascript]], [[java]] - 세 언어 비교
- relates_to [[transpilation]] - TypeScript의 변환 방식
- connects_to [[compiler]], [[interpreter]] - 실행 방식 차이
