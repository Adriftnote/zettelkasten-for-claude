---
title: 프로그래밍 기초
type: hub
tags:
- hub
- programming
- compiler
- runtime
- module
- zettelkasten
- basic-memory
permalink: hubs/programming-basics-1
---

# 프로그래밍 기초 (Programming Basics)

**소스 코드**가 **실행 가능한 프로그램**이 되기까지의 여정. 컴파일러, 인터프리터, 런타임의 역할을 이해하면 프로그래밍의 본질이 보인다.

## Observations

### 핵심 인사이트
- [insight] 모든 코드는 결국 **기계어**가 된다. 그 변환 과정을 누가, 언제 하느냐의 차이일 뿐
- [insight] [[compiler]]는 **미리** 번역, [[interpreter]]는 **실행하면서** 번역
- [insight] [[library]]는 **가져다 쓰는 것**, [[framework]]는 **그 안에서 작성하는 것** ([[Inversion of Control (제어의 역전)|IoC]])

### 학습 경로
- [path] 소스코드 → 실행도구(컴파일러/인터프리터) → 실행환경(런타임) → 기계어 실행
- [path] 모듈 → 패키지 → 라이브러리 → 프레임워크 (재사용성 증가)

### 인덱싱 (루만식)
- [index:1] [[source-code]] - 프로그래밍의 시작점, 사람이 읽는 코드
- [index:1a] [[script]] - 1에서 파생: 인터프리터가 실행하는 코드
- [index:1b] [[program]] - 1에서 파생: 독립 실행 가능한 소프트웨어
- [index:1c] [[binary]] - 1에서 파생: 컴파일된 실행 파일
- [index:1d] [[machine-language]] - 1에서 파생: CPU가 직접 실행하는 명령어
- [index:2] [[compiler]] - 소스를 미리 기계어로 변환하는 도구
- [index:2a] [[linker]] - 2에서 파생: 여러 오브젝트 파일을 연결
- [index:3] [[interpreter]] - 소스를 실행하면서 즉시 변환하는 도구
- [index:3a] [[runtime]] - 3에서 파생: 프로그램이 실행되는 환경 (Node.js, JVM, .NET)
- [index:3b] [[virtual-machine]] - 3에서 파생: 추상화된 실행 환경
- [index:4] [[assembler]] - 어셈블리 언어를 기계어로 변환하는 도구
- [index:5] [[module]] - 코드의 논리적 단위, 구조화의 첫 단계
- [index:5a] [[package]] - 5에서 파생: 모듈의 배포 단위
- [index:5a1] [[library]] - 5a에서 파생: 재사용 가능한 코드 모음
- [index:5a1i] [[framework]] - 5a1에서 파생: 애플리케이션의 뼈대 (IoC 적용)
- [index:5b] [[sdk]] - 5에서 파생: 개발 도구 모음
- [index:5c] [[api]] - 5에서 파생: 인터페이스 정의
- [index:6] [[Inversion of Control (제어의 역전)]] - 프레임워크의 핵심 설계 원리

## Relations

### 학습 노트

- explains_simply [[프로그래밍 기초 용어 가이드]] (비개발자용 쉬운 설명, 비유 중심)
- explains_deeply [[코드 실행 흐름 - 고급 언어에서 기계어까지]] (전체 흐름 다이어그램, 언어별 비교)

### 관리하는 노트들
- organizes [[source-code]]
- organizes [[script]]
- organizes [[program]]
- organizes [[binary]]
- organizes [[machine-language]]
- organizes [[compiler]]
- organizes [[interpreter]]
- organizes [[runtime]]
- organizes [[assembler]]
- organizes [[linker]]
- organizes [[virtual-machine]]
- organizes [[module]]
- organizes [[package]]
- organizes [[library]]
- organizes [[framework]]
- organizes [[sdk]]
- organizes [[api]]
- organizes [[Inversion of Control (제어의 역전)]]

### 새로 추가된 개념
- organizes [[transpilation]] - 고급 언어 → 고급 언어 변환 (TypeScript → JavaScript)

### 다른 허브와의 연결
- connects_to [[programming-languages]] (언어별 비교: Java vs JavaScript vs TypeScript)
- connects_to [[web-fundamentals]] (JavaScript는 인터프리터 언어)
- connects_to [[encoding-systems]] (소스 코드도 텍스트 파일, 인코딩 필요)