---
title: 객체지향 프로그래밍 (OOP)
type: concept
permalink: knowledge/concepts/oop
tags:
- programming
- paradigm
- software-design
category: 프로그래밍/패러다임
difficulty: 중급
---

# 객체지향 프로그래밍 (OOP)

데이터와 그 데이터를 처리하는 함수를 "객체"로 묶어서 프로그래밍하는 방식

## 📖 개요

OOP(Object-Oriented Programming)는 프로그램을 "객체"들의 상호작용으로 구성하는 패러다임입니다. 절차지향(함수 중심)과 대비되며, 코드의 재사용성과 유지보수성을 높입니다.

## 🎭 비유

```
[절차지향] 요리 레시피
1. 재료 준비
2. 손질
3. 조리
4. 담기
→ 순서대로 실행

[객체지향] 요리사 + 재료
요리사.준비(재료)
요리사.조리(재료)
요리사.담기(접시)
→ 요리사가 재료와 방법을 알고 있음
```

## ✨ 4대 원칙

| 원칙 | 영어 | 설명 |
|------|------|------|
| **캡슐화** | Encapsulation | 데이터+메서드 묶기 |
| **추상화** | Abstraction | 복잡성 숨기기 |
| **상속** | Inheritance | 부모 클래스 물려받기 |
| **다형성** | Polymorphism | 같은 이름, 다른 동작 |

## 💡 예시

```python
# 절차지향 - 함수들이 데이터를 전달
data = load_data("file.csv")
data = process_data(data)
save_data(data, "output.csv")

# 객체지향 - 객체가 데이터를 들고 있음
processor = DataProcessor("file.csv")
processor.process()
processor.save("output.csv")
```

### 객체 = 데이터 + 메서드

```python
class DataProcessor:
    def __init__(self, path):
        self.data = None          # 데이터
        self.path = path

    def load(self):               # 메서드
        self.data = read_file(self.path)

    def process(self):            # 메서드
        self.data = transform(self.data)

    def save(self, output):       # 메서드
        write_file(output, self.data)
```

## 🔄 절차지향 vs 객체지향

| 구분 | 절차지향 | 객체지향 |
|------|----------|----------|
| **중심** | 함수 | 객체 |
| **데이터** | 함수 간 전달 | 객체 내부 보관 |
| **코드 구조** | 순차적 흐름 | 객체 간 협력 |
| **재사용** | 함수 복사 | 상속, 조합 |
| **대표 언어** | C, Pascal | Java, Python, C++ |

## 🤔 언제 OOP를 쓰나?

```
[OOP가 적합]
- 여러 종류의 비슷한 것들 (User, Admin, Guest)
- 상태를 유지해야 하는 것들 (게임 캐릭터, UI 컴포넌트)
- 코드 재사용이 많은 경우

[절차지향이 적합]
- 단순한 스크립트
- 데이터 변환 파이프라인
- 수학적 계산
```

## Relations

- contains [[캡슐화 (Encapsulation)]] (4대 원칙 - 묶기)
- contains [[추상화 (Abstraction)]] (4대 원칙 - 숨기기)
- contains [[상속 (Inheritance)]] (4대 원칙 - 물려받기)
- contains [[다형성 (Polymorphism)]] (4대 원칙 - 다른 동작)
- contains [[메서드 (Method)]] (클래스의 함수)
- contrasts_with [[절차지향 프로그래밍 (Procedural Programming)]] (대비되는 패러다임)
- organized_by [[프로그래밍 패러다임 (Programming Paradigms)]] (패러다임 허브)

---

**난이도**: 중급
**카테고리**: 프로그래밍/패러다임
**마지막 업데이트**: 2026년 2월
