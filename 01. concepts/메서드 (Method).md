---
title: 메서드 (Method)
type: concept
permalink: knowledge/concepts/method
tags:
- oop
- programming
- function
category: 프로그래밍/OOP
difficulty: 초급
---

# 메서드 (Method)

클래스 안에 정의된 함수

## 📖 개요

메서드는 클래스에 속한 함수입니다. 독립적으로 존재하는 함수와 달리, 특정 객체(클래스 인스턴스)와 연결되어 동작합니다.

## 🎭 비유

함수가 "독립 용병"이라면, 메서드는 "소속된 직원"입니다. 같은 일을 하더라도 소속이 다릅니다.

## ✨ 함수 vs 메서드

| 구분 | 함수 (Function) | 메서드 (Method) |
|------|----------------|-----------------|
| **위치** | 독립적 | 클래스 안 |
| **호출** | `load_csv(path)` | `loader.load(path)` |
| **첫 인자** | 없음 | `self` (객체 자신) |
| **데이터 접근** | 인자로 전달 | `self`로 내부 데이터 접근 |

## 💡 예시

```python
# 함수 - 독립적으로 존재
def load_csv(path):
    with open(path) as f:
        return f.read()

# 메서드 - 클래스 안에 속함
class CSVLoader:
    def __init__(self, encoding='utf-8'):
        self.encoding = encoding

    def load(self, path):           # ← 메서드
        with open(path, encoding=self.encoding) as f:
            return f.read()

# 사용
data1 = load_csv("data.csv")              # 함수 호출

loader = CSVLoader(encoding='cp949')
data2 = loader.load("data.csv")           # 메서드 호출
```

### self의 역할

```python
class Counter:
    def __init__(self):
        self.count = 0

    def increment(self):    # self = 이 객체 자신
        self.count += 1     # 객체의 데이터에 접근

c = Counter()
c.increment()  # self는 자동으로 c가 됨
print(c.count)  # 1
```

## 🔄 왜 메서드를 쓰나?

```
[함수만 사용]
load_csv(path, encoding, delimiter, ...)  ← 매번 옵션 전달

[메서드 사용]
loader = CSVLoader(encoding='utf-8', delimiter=',')
loader.load(path)  ← 설정은 객체가 기억, 간단한 호출
```

**장점**: 관련 설정을 객체가 들고 있어서 호출이 간결해짐

## Relations

- part_of [[캡슐화 (Encapsulation)]] (클래스로 묶는 방법)
- relates_to [[추상화 (Abstraction)]] (내부 구현 숨김)
- part_of [[객체지향 프로그래밍 (OOP)]] (OOP의 기본 요소)

---

**난이도**: 초급
**카테고리**: 프로그래밍/OOP
**마지막 업데이트**: 2026년 2월
