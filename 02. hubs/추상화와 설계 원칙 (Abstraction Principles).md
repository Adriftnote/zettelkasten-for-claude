---
title: 추상화와 설계 원칙
type: hub
permalink: hubs/abstraction-and-design-principles
tags:
- hub
- abstraction
- architecture
- design-principles
---

# 추상화와 설계 원칙

추상화를 뿌리로 하는 설계 원칙과 패턴들을 조직화합니다. 세 개념의 핵심 차이: 추상화는 "무엇을 감추는가", DIP는 "누가 누구에게 의존하는가", IoC는 "누가 누구를 호출하는가".

## Observations

- [fact] CS의 기초는 추상화다 — 복잡한 것을 단순한 인터페이스로 감추는 것 #abstraction
- [pattern] 모든 추상화는 "복잡 → 중간계층 → 단순" 3단 구조로 반복된다 #architecture
- [fact] 추상화 패턴은 원리(감추기)이고, DIP와 IoC는 그 원리를 활용하는 설계 기법이다 #design-principles
- [fact] DIP는 추상화로 의존 방향을 역전시키고, IoC는 추상화로 호출 주도권을 역전시킨다 #solid #ioc
- [fact] DI(의존성 주입)는 DIP 원칙을 IoC 방식으로 구현한 것 — 두 개념이 겹치는 지점 #di
- [fact] 다형성이 있어야 DIP와 IoC 모두 가능하다 — 추상화의 런타임 기반 메커니즘 #polymorphism
- [insight] ORM, HTTP, 파일시스템, 프로그래밍 언어, 폰노이만 구조 모두 같은 추상화 패턴의 변형 #architecture
- [method] 새 기술 학습 시 "무엇을 추상화하는가?"를 먼저 파악하면 본질을 빠르게 이해 #learning
- [caution] 과도한 추상화 금지 — 단순한 경우는 직접 의존도 OK #design-principles

## Relations

- organizes [[추상화 패턴 (Abstraction Pattern)]] (1. 원리 — "무엇을 감추는가")
  - extends [[ORM (Object-Relational Mapping)]] (1a. DB 영역 추상화)
  - extends [[MCP CLI Polymorphism]] (1b. CLI 영역 추상화)
- organizes [[Dependency Inversion Principle (DIP)]] (2. 의존 방향 역전 — "누가 누구에게 의존하는가")
  - extends [[Strategy Pattern]] (2a. DIP를 구현하는 대표 패턴)
- organizes [[Inversion of Control (제어의 역전)]] (3. 호출 주도권 역전 — "누가 누구를 호출하는가")
- organizes [[다형성 (Polymorphism)]] (4. 추상화의 런타임 기반 — 같은 인터페이스, 다른 동작)
- organizes [[추상화는 3단 구조로 반복된다]] (5. 도출된 학습법)
- connects_to [[SOLID 원칙]] (DIP가 SOLID의 D)
- connects_to [[일반 CS 개념 (General CS)]] (CS 기초 = 추상화)