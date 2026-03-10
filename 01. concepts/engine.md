---
title: 엔진 (Engine)
type: concept
permalink: knowledge/concepts/engine
tags:
- programming-basics
- runtime
- execution-tools
category: 실행 도구
difficulty: 중급
---

# 엔진 (Engine)

소스 코드를 읽고 해석하여 실행하는 핵심 소프트웨어 컴포넌트

## 📖 개요

엔진은 프로그래밍 언어로 작성된 코드를 실제로 이해하고 실행하는 핵심 부품이다. JavaScript 엔진을 예로 들면, `let x = 1 + 2` 같은 코드를 파싱(구문 분석)하고, 의미를 해석하여, 실제 연산 결과를 만들어낸다.

엔진은 런타임의 핵심이지만, 엔진만으로는 파일 읽기나 네트워크 통신 같은 시스템 작업을 수행할 수 없다. 이런 기능은 플랫폼 레이어가 담당한다.

## 🎭 비유

자동차의 엔진과 같다. 연료(소스 코드)를 넣으면 동력(실행 결과)을 만들어내는 핵심 장치이지만, 바퀴(플랫폼 레이어)가 없으면 실제로 도로(OS) 위를 달릴 수 없다.

## ✨ 특징

- **코드 해석**: 소스 코드를 파싱하고 의미를 이해하여 실행
- **순수 연산 담당**: 변수, 함수, 루프, 조건문 등 언어 자체의 기능을 처리
- **성능 전략 분화**: 인터프리터(한 줄씩 실행) vs JIT 컴파일(실행 중 기계어 변환) 방식으로 나뉨
- **런타임 내부 부품**: 단독으로는 완전한 실행 환경이 되지 못하며, 플랫폼 레이어와 결합하여 런타임을 구성

## 💡 예시

### 주요 JavaScript 엔진 비교

| 엔진 | 개발사 | 사용처 | 특징 |
|------|--------|--------|------|
| **V8** | Google | Chrome, Node.js, Deno | JIT 컴파일, 고성능, 큰 바이너리 |
| **JavaScriptCore** | Apple | Safari, Bun | JIT 컴파일, Apple 생태계 |
| **SpiderMonkey** | Mozilla | Firefox | 최초의 JS 엔진, JIT 지원 |
| **QuickJS-ng** | 커뮤니티 | txiki.js | 인터프리터 기반, 극소 크기 |

### 엔진 ≠ 런타임

```
엔진(V8)만으로는:
  ✅ let x = 1 + 2          → 가능 (순수 연산)
  ✅ function add(a,b){}    → 가능 (함수 정의)
  ❌ fs.readFile("a.txt")   → 불가능 (파일 시스템 접근)
  ❌ fetch("https://...")    → 불가능 (네트워크 요청)

엔진 + 플랫폼 레이어 = 런타임(Node.js):
  ✅ 위 모든 것이 가능
```

## Relations

- part_of [[런타임 (Runtime)|런타임 (Runtime)]] (런타임의 핵심 구성 요소)
- depends_on [[interpreter|인터프리터]] (인터프리터 방식 엔진은 코드를 한 줄씩 실행)
- relates_to [[compiler|컴파일러]] (JIT 엔진은 실행 중 기계어로 컴파일)
- enables [[javascript|JavaScript]] (JS 코드를 실행 가능하게 만드는 핵심)
- complemented_by [[platform-layer|플랫폼 레이어]] (엔진이 못하는 시스템 작업을 보완)

---
**난이도**: 중급
**카테고리**: 실행 도구
**마지막 업데이트**: 2026년 3월
