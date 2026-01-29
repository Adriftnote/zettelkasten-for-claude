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

- [insight] 모든 코드는 결국 기계어가 된다 - 그 변환 과정을 누가, 언제 하느냐의 차이일 뿐 #compilation
- [insight] 컴파일러는 미리 번역, 인터프리터는 실행하면서 번역 #execution
- [insight] 라이브러리는 가져다 쓰는 것, 프레임워크는 그 안에서 작성하는 것 (IoC) #architecture
- [path] 소스코드 → 실행도구(컴파일러/인터프리터) → 실행환경(런타임) → 기계어 실행 #learning
- [path] 모듈 → 패키지 → 라이브러리 → 프레임워크 (재사용성 증가) #modularity

## Relations

- organizes [[source-code]] (1. 프로그래밍의 시작점, 사람이 읽는 코드)
  - extends [[script]] (1a. 인터프리터가 실행하는 코드)
  - extends [[program]] (1b. 독립 실행 가능한 소프트웨어)
  - extends [[binary]] (1c. 컴파일된 실행 파일)
  - extends [[machine-language]] (1d. CPU가 직접 실행하는 명령어)
- organizes [[compiler]] (2. 소스를 미리 기계어로 변환하는 도구)
  - part_of [[linker]] (2a. 여러 오브젝트 파일을 연결)
- organizes [[interpreter]] (3. 소스를 실행하면서 즉시 변환하는 도구)
  - extends [[runtime]] (3a. 프로그램이 실행되는 환경 (Node.js, JVM, .NET))
  - extends [[virtual-machine]] (3b. 추상화된 실행 환경)
- organizes [[assembler]] (4. 어셈블리 언어를 기계어로 변환하는 도구)
- organizes [[module]] (5. 코드의 논리적 단위, 구조화의 첫 단계)
  - extends [[package]] (5a. 모듈의 배포 단위)
    - extends [[library]] (5a1. 재사용 가능한 코드 모음)
      - extends [[framework]] (5a1i. 애플리케이션의 뼈대 (IoC 적용))
  - extends [[sdk]] (5b. 개발 도구 모음)
  - extends [[api]] (5c. 인터페이스 정의)
- organizes [[Inversion of Control (제어의 역전)]] (6. 프레임워크의 핵심 설계 원리)
- organizes [[transpilation]] (7. 고급 언어 → 고급 언어 변환)
- explains [[프로그래밍 기초 용어 가이드]] (비개발자용 쉬운 설명)
- explains [[코드 실행 흐름 - 고급 언어에서 기계어까지]] (전체 흐름 다이어그램)
- connects_to [[programming-languages]] (언어별 비교)
- connects_to [[web-fundamentals]] (JavaScript는 인터프리터 언어)
- connects_to [[encoding-systems]] (소스 코드도 텍스트 파일, 인코딩 필요)
