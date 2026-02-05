---
title: 다형성 (Polymorphism)
type: concept
permalink: knowledge/concepts/polymorphism
tags:
- oop
- programming
- interface
category: 프로그래밍/OOP
difficulty: 중급
---

# 다형성 (Polymorphism)

같은 인터페이스로 다른 동작을 하는 것

## 📖 개요

다형성(Polymorphism)은 "많은 형태"라는 뜻입니다. 같은 메서드 이름을 호출해도 객체 타입에 따라 다른 동작을 합니다. 코드를 유연하고 확장 가능하게 만듭니다.

## 🎭 비유

리모컨의 "재생" 버튼과 같습니다. TV, 라디오, 게임기 어디에 누르든 "재생"이지만, 각각 다른 방식으로 재생됩니다.

## ✨ 특징

- **같은 인터페이스**: 동일한 메서드 이름
- **다른 구현**: 객체마다 다른 동작
- **유연성**: 새 타입 추가해도 기존 코드 변경 없음

## 💡 예시

```python
class Animal:
    def speak(self):
        pass

class Dog(Animal):
    def speak(self):
        return "멍멍!"

class Cat(Animal):
    def speak(self):
        return "야옹~"

class Duck(Animal):
    def speak(self):
        return "꽥꽥!"

# 다형성 - 같은 메서드, 다른 결과
def make_sound(animal):
    print(animal.speak())  # 어떤 동물이든 speak() 호출

animals = [Dog(), Cat(), Duck()]
for animal in animals:
    make_sound(animal)

# 출력:
# 멍멍!
# 야옹~
# 꽥꽥!
```

### 다형성 없이 vs 있을 때

```python
# 다형성 없이 - 타입마다 분기 ❌
def make_sound(animal):
    if isinstance(animal, Dog):
        print("멍멍!")
    elif isinstance(animal, Cat):
        print("야옹~")
    elif isinstance(animal, Duck):
        print("꽥꽥!")
    # 새 동물 추가할 때마다 여기도 수정해야 함

# 다형성 사용 - 깔끔 ✅
def make_sound(animal):
    print(animal.speak())
    # 새 동물 추가해도 이 코드는 그대로
```

## 🔄 다형성의 종류

| 종류 | 설명 | 예시 |
|------|------|------|
| **오버라이딩** | 부모 메서드 재정의 | `Dog.speak()` |
| **오버로딩** | 같은 이름, 다른 매개변수 | `add(1,2)` vs `add("a","b")` |
| **덕 타이핑** | 타입 상관없이 메서드만 있으면 됨 | Python 방식 |

### 덕 타이핑 (Duck Typing)

```python
# "오리처럼 걷고 오리처럼 울면, 그건 오리다"

class Robot:  # Animal 상속 안 함!
    def speak(self):
        return "삐빕!"

# 상속 없어도 speak()만 있으면 동작
make_sound(Robot())  # "삐빕!"
```

## 🎯 실용적 예시

```python
# 파일 저장 - 다양한 포맷 지원
class FileSaver:
    def save(self, data, path):
        pass

class JSONSaver(FileSaver):
    def save(self, data, path):
        # JSON 형식으로 저장

class CSVSaver(FileSaver):
    def save(self, data, path):
        # CSV 형식으로 저장

class ExcelSaver(FileSaver):
    def save(self, data, path):
        # Excel 형식으로 저장

# 사용 - 어떤 Saver든 동일하게 사용
def export_report(saver, data, path):
    saver.save(data, path)  # 다형성!

export_report(JSONSaver(), data, "report.json")
export_report(CSVSaver(), data, "report.csv")
```

## Relations

- part_of [[객체지향 프로그래밍 (OOP)]] (4대 원칙 중 하나)
- requires [[상속 (Inheritance)]] (오버라이딩에 필요)
- relates_to [[추상화 (Abstraction)]] (인터페이스 추상화)
- enables [[Inversion of Control (제어의 역전)]] (프레임워크가 내 코드 호출 가능케 함)

---

**난이도**: 중급
**카테고리**: 프로그래밍/OOP
**마지막 업데이트**: 2026년 2월
