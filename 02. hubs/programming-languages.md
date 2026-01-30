---
title: 프로그래밍 언어 비교
type: hub
tags:
- hub
- programming
- languages
- typescript
- javascript
- java
- comparison
permalink: hubs/programming-languages
created: 2026-01-27
---

# 프로그래밍 언어 비교 (Programming Languages)

**프로그래밍 언어**들의 특성, 분류, 그리고 흔한 혼동을 정리한 허브. 특히 이름이 비슷해서 헷갈리는 언어들(Java vs JavaScript)과 현대 웹 개발의 핵심인 TypeScript를 다룹니다.

## Observations

- [fact] Java와 JavaScript는 완전히 다른 언어 - 이름만 비슷함 (마케팅 때문) #naming
- [fact] TypeScript = JavaScript + 타입 시스템 - Java의 친척이 아님 #typescript
- [fact] 웹 브라우저는 JavaScript만 실행 가능 → 웹 개발에선 JS/TS가 필수 #web
- [fact] AI 시대에 타입 언어가 부상 중 - LLM 생성 코드의 가드레일 역할 #ai

## 언어별 용도

```
웹 프론트엔드 (브라우저)
├── JavaScript 🟨 - 유일한 선택지
└── TypeScript 🔷 - JS로 변환 후 실행

웹 백엔드 (서버)
├── Node.js (JavaScript/TypeScript)
├── Python (Django, FastAPI)
├── Java (Spring)
└── Go, Rust

모바일 앱
├── Android → Java/Kotlin
├── iOS → Swift
└── 크로스플랫폼 → React Native (JS), Flutter (Dart)

시스템/고성능
├── C/C++ - 운영체제, 게임 엔진
└── Rust - 안전한 시스템 프로그래밍

AI/데이터
└── Python - 압도적 생태계
```

## 엄격함 스펙트럼

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

## AI 시대와 타입 언어

> "2025년 학술 연구에 따르면 LLM이 생성한 컴파일 오류의 94%가 타입 체크 실패"
> — [GitHub Blog](https://github.blog/ai-and-ml/llms/why-ai-is-pushing-developers-toward-typed-languages/)

- AI가 코드 생성 → **타입이 가드레일 역할**
- TypeScript가 2025년 GitHub에서 Python, JavaScript 추월
- 타입 = AI 생성 코드의 "검증 도구"

## Relations

- organizes [[typescript]] (1. 타입 시스템을 추가한 JavaScript)
- organizes [[javascript]] (2. 웹 브라우저의 언어)
- organizes [[java]] (3. JVM 기반 컴파일 언어)
- organizes [[rust]] (4. 시스템 프로그래밍, 메모리 안전)
- organizes [[transpilation]] (5. 고급 언어 → 고급 언어 변환)
- explains [[Java vs JavaScript vs TypeScript - 완전 다른 언어들]] (혼동 해소 가이드)
- explains [[Rust 완전 정복 - 기술적 한계부터 풀스택까지]] (Rust 심화)
- extends [[programming-basics]] (언어별 상세 비교 추가)
- connects_to [[rust-language]] (Rust 심화 가이드)
- connects_to [[mcp-tool-patterns]] (TypeScript로 MCP 서버 개발)
