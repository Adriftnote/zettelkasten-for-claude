---
title: 컴파일러 (Compiler)
type: concept
tags:
- programming-basics
- concepts
- execution-tools
permalink: knowledge/concepts/compiler
category: 실행 도구
difficulty: 중급
---

# 컴파일러 (Compiler)

소스코드 전체를 한 번에 기계어로 번역하는 프로그램입니다.

## 📖 개요

컴파일러는 개발자가 작성한 소스코드를 읽어서 한 번에 모두 기계어(또는 바이너리)로 변환합니다. 변환된 코드는 원본 소스코드 없이도 독립적으로 실행 가능합니다. C, C++, Go, Rust 등이 컴파일 언어입니다.

## 🎭 비유

책 전체를 다른 언어로 번역한 후 출판하는 것과 같습니다. 한 번 번역되면, 계속 그 번역본을 사용할 수 있습니다.

## ✨ 특징

- **높은 속도**: 실행 파일이 매우 빠름
- **독립적 실행**: 원본 소스코드 불필요
- **사전 오류 검사**: 컴파일 시점에 오류 발견
- **플랫폼 종속성**: 각 OS별로 따로 컴파일 필요

## 💡 예시

```bash
# C 코드 컴파일
gcc hello.c -o hello.exe
# 결과: 실행 가능한 hello.exe 생성
```

## Observations

- [fact] 컴파일러는 소스코드 전체를 한 번에 기계어로 변환한다 #compilation
- [fact] 컴파일된 실행 파일은 원본 소스코드 없이 독립 실행 가능하다 #binary
- [method] 소스코드 → 렉싱 → 파싱 → AST → 코드 생성 → 기계어 #process
- [example] C, C++, Go, Rust는 컴파일 언어다 #languages
- [decision] GCC는 GNU 프로젝트에서 오픈소스로 개발하기로 결정했다 #open-source

## 🆚 파서 vs 컴파일러

| 도구 | 역할 | 출력 |
|------|------|------|
| **[[01. concepts/파서 (Parser)\|파서]]** | 텍스트 분석 | 데이터 구조 (RAM) |
| **컴파일러** | 코드 번역 | 기계어 (CPU 실행) |

```
파서: JSON 텍스트 → 프로그램 객체 (메모리)
컴파일러: 소스코드 → 기계어 (01010101...)
```

> [!info] 컴파일러 내부에도 파서가 있음!
> 컴파일러는 먼저 소스코드를 **파싱**해서 AST(추상 구문 트리)로 만든 후, 이를 기계어로 변환합니다.

## Relations

- similar_to [[interpreter]] (둘 다 코드를 실행 가능하게 변환)
- different_from [[01. concepts/파서 (Parser)]] (파서는 분석만, 컴파일러는 번역)
- consumes [[source-code]] (입력으로 소스코드 받음)
- produces [[binary]] (실행 파일 생성)
- produces [[machine-language]] (기계어로 변환)

---

**난이도**: 중급
**카테고리**: 실행 도구
**마지막 업데이트**: 2026년 1월