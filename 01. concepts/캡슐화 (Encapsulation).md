---
title: 캡슐화 (Encapsulation)
type: concept
permalink: knowledge/concepts/encapsulation
tags:
- oop
- software-design
- abstraction
category: 프로그래밍/OOP
difficulty: 중급
---

# 캡슐화 (Encapsulation)

관련된 데이터와 메서드를 하나의 단위(클래스)로 묶는 것

## 📖 개요

캡슐화는 객체지향 프로그래밍의 핵심 개념 중 하나입니다. 연관된 변수와 함수를 하나의 클래스로 묶어서 관리합니다. "캡슐"처럼 내용물을 하나로 포장하는 것입니다.

## 🎭 비유

약 캡슐과 같습니다. 여러 성분(데이터)을 하나의 캡슐(클래스)에 담아 관리하기 쉽게 만듭니다.

## ✨ 특징

- **묶기**: 관련 데이터 + 메서드를 하나로
- **은닉**: 내부 상태를 외부에서 직접 접근 못하게 (private)
- **인터페이스**: 정해진 메서드로만 상호작용

## 💡 예시

```python
# 캡슐화 전 - 흩어진 함수들
def validate_email(email): ...
def validate_phone(phone): ...
def validate_name(name): ...

# 캡슐화 후 - 클래스로 묶음
class Validator:
    def email(self, value): ...
    def phone(self, value): ...
    def name(self, value): ...
```

### 함수 vs 클래스

| 구분 | 함수 | 클래스 |
|------|------|--------|
| **역할** | 동사 (행위) | 명사 (개체) |
| **단위** | 단일 동작 | 데이터 + 메서드 묶음 |
| **예시** | `load_csv()` | `CSVLoader` |

> **핵심**: 함수 = 동사 (뭘 **하는지**), 클래스 = 명사 (뭘 **다루는지**)

## 🔄 캡슐화 vs 추상화

```
[캡슐화]                           [추상화]
관련된 것들을 묶기                  내부 구현을 숨기기
         ↘                      ↙
            함께 일어남

validator = Validator()
validator.email("test@test.com")
   ↑                    ↑
   캡슐화된 객체         추상화된 인터페이스
```

**캡슐화**: 묶는 행위 자체
**추상화**: 묶은 후 세부사항을 숨기는 효과

→ 클래스를 만들면 둘 다 동시에 일어남

## Relations

- relates_to [[추상화 (Abstraction)]] (함께 사용되는 개념)
- part_of [[객체지향 프로그래밍 (OOP)]] (OOP의 핵심 원칙)
- used_by [[RPG (Repository Planning Graph)]] (클래스 노드 구분에 활용)

---

**난이도**: 중급
**카테고리**: 프로그래밍/OOP
**마지막 업데이트**: 2026년 2월
