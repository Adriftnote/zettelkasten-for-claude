---
title: 프로그래밍 패러다임
type: hub
permalink: hubs/programming-paradigms
tags:
- hub
- programming
- paradigm
created: 2026-02-09
---

# 프로그래밍 패러다임 (Programming Paradigms)

프로그래밍의 **사고방식**을 분류하는 허브. "어떻게 생각하고 코드를 구성하는가"에 대한 근본적 접근법들을 정리합니다.

## Observations

- [fact] 명령형(How)과 선언형(What)은 프로그래밍의 두 가지 근본적 사고방식 #core
- [fact] 함수형 프로그래밍은 선언형의 하위 패러다임 - 순수 함수와 불변 데이터 중심 #functional
- [fact] OOP는 명령형의 하위 패러다임 - 객체에 상태와 행동을 캡슐화 #oop
- [fact] 현대 언어는 대부분 멀티 패러다임 - 명령형/선언형/함수형/OOP 혼용 (Python, Rust, JS 등) #multi
- [fact] 패러다임은 언어가 아니라 사고방식 - 같은 언어로 여러 패러다임 가능 #mindset

## 패러다임 스펙트럼

```
명령형 (How)  ←──────────────────→  선언형 (What)
"어떻게 하는지 지시"              "무엇을 원하는지 선언"

C    Java   Python   JS    SQL   HTML   CSS
 ├────┤       ├───────┤      ├─────┤
 순수 명령형    멀티 패러다임    순수 선언형
```

| 패러다임 | 핵심 질문 | 예시 |
|---------|----------|------|
| 명령형 | "어떻게?" | for문으로 하나씩 처리 |
| 선언형 | "무엇을?" | filter/map으로 결과 선언 |

## 패러다임 계층

```
프로그래밍 패러다임
├── 명령형 (Imperative) ─── "어떻게" 하는지 지시
│   ├── 절차지향 ─── 함수/프로시저 단위로 구성
│   └── 객체지향 (OOP) ─── 객체에 상태+행동 캡슐화
│
└── 선언형 (Declarative) ─── "무엇을" 원하는지 선언
    ├── 함수형 (FP) ─── 순수 함수의 조합
    └── DSL ─── SQL, HTML, CSS (도메인 특화)
```

## Relations

- organizes [[명령형 프로그래밍 (Imperative Programming)]] (1. "어떻게" - 상태 변경으로 진행)
  - extends [[객체지향 프로그래밍 (OOP)]] (1a. 명령형의 하위 - 객체에 상태+행동 캡슐화)
- organizes [[선언형 프로그래밍 (Declarative Programming)]] (2. "무엇을" - 결과만 선언)
  - extends [[함수형 프로그래밍 (Functional Programming)]] (2a. 선언형의 하위 - 순수 함수 조합)
- connects_to [[프로그래밍 언어 비교 (Programming Languages)]] (각 언어가 어떤 패러다임을 지원하는지)
- connects_to [[프로그래밍 기초 (Programming Basics)]] (프로그래밍 기초 개념)