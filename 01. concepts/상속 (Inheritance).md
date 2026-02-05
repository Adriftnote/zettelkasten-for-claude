---
title: 상속 (Inheritance)
type: concept
permalink: knowledge/concepts/inheritance
tags:
- oop
- programming
- code-reuse
category: 프로그래밍/OOP
difficulty: 중급
---

# 상속 (Inheritance)

부모 클래스의 속성과 메서드를 자식 클래스가 물려받는 것

## 📖 개요

상속은 기존 클래스(부모)를 확장하여 새로운 클래스(자식)를 만드는 방법입니다. 코드 중복을 줄이고 계층 구조를 표현합니다.

## 🎭 비유

생물학적 유전과 같습니다. 부모의 특성(눈 색, 키)을 자식이 물려받되, 자식만의 특성도 추가됩니다.

## ✨ 특징

- **코드 재사용**: 부모 코드를 다시 작성할 필요 없음
- **계층 구조**: "~은 ~이다" (is-a) 관계 표현
- **확장**: 부모 기능에 새 기능 추가
- **오버라이드**: 부모 메서드를 자식이 재정의

## 💡 예시

```python
# 부모 클래스
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        pass

    def move(self):
        print(f"{self.name}이(가) 움직인다")

# 자식 클래스 - Animal을 상속
class Dog(Animal):
    def speak(self):                    # 오버라이드
        print(f"{self.name}: 멍멍!")

    def fetch(self):                    # 새 메서드 추가
        print(f"{self.name}이(가) 공을 물어온다")

class Cat(Animal):
    def speak(self):                    # 오버라이드
        print(f"{self.name}: 야옹~")

# 사용
dog = Dog("바둑이")
dog.move()      # 부모에서 상속: "바둑이이(가) 움직인다"
dog.speak()     # 오버라이드: "바둑이: 멍멍!"
dog.fetch()     # 자식만의 메서드
```

### 상속 계층

```
Animal (부모)
├── Dog (자식)
│   └── Bulldog (손자)
└── Cat (자식)
    └── Persian (손자)
```

## 🔄 상속 vs 조합

| 관계 | 표현 | 예시 |
|------|------|------|
| **상속** (is-a) | "~은 ~이다" | Dog is an Animal |
| **조합** (has-a) | "~은 ~을 가진다" | Car has an Engine |

```python
# 상속 - Dog IS AN Animal
class Dog(Animal):
    pass

# 조합 - Car HAS AN Engine
class Car:
    def __init__(self):
        self.engine = Engine()  # 포함
```

**원칙**: "상속보다 조합을 선호하라" (Favor composition over inheritance)

## ⚠️ 주의점

```python
# 나쁜 예 - 논리적으로 맞지 않는 상속
class Stack(ArrayList):  # Stack IS AN ArrayList? ❌
    pass

# 좋은 예 - 조합 사용
class Stack:
    def __init__(self):
        self._list = ArrayList()  # Stack HAS AN ArrayList ✅
```

## Relations

- part_of [[객체지향 프로그래밍 (OOP)]] (4대 원칙 중 하나)
- enables [[다형성 (Polymorphism)]] (상속이 있어야 다형성 가능)
- relates_to [[캡슐화 (Encapsulation)]] (상속된 것도 캡슐화됨)

---

**난이도**: 중급
**카테고리**: 프로그래밍/OOP
**마지막 업데이트**: 2026년 2월
