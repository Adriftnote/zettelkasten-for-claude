---
title: 절차지향 프로그래밍 (Procedural Programming)
type: concept
permalink: knowledge/concepts/procedural-programming
tags:
- programming
- paradigm
category: 프로그래밍/패러다임
difficulty: 초급
---

# 절차지향 프로그래밍 (Procedural Programming)

프로그램을 순서대로 실행되는 절차(함수)의 모음으로 구성하는 프로그래밍 패러다임

## 📖 개요

절차지향 프로그래밍은 명령형 프로그래밍의 하위 패러다임으로, 프로그램을 "위에서 아래로 실행되는 일련의 절차(프로시저/함수)"로 구성합니다. 데이터와 함수가 분리되어 있고, 함수가 데이터를 받아 처리한 뒤 다음 함수로 넘기는 방식입니다. 가장 직관적인 프로그래밍 방식이며, 대부분의 사람들이 처음 배우는 스타일입니다.

## 🎭 비유

요리 레시피와 같습니다. "1. 재료 준비 → 2. 손질 → 3. 볶기 → 4. 담기"처럼 정해진 순서대로 실행합니다. 요리사(프로그램)는 레시피(코드)를 위에서부터 한 줄씩 따라가고, 재료(데이터)는 각 단계를 거치며 변형됩니다.

## ✨ 특징

- **순차 실행**: 코드가 위에서 아래로 정해진 순서대로 실행
- **함수 중심**: 로직을 함수(프로시저) 단위로 분리하여 재사용
- **데이터와 함수 분리**: 데이터는 변수에, 처리 로직은 함수에 따로 존재
- **상태 변경**: 변수의 값을 변경해가며 결과를 만듦 (명령형 특성)
- **전역/지역 변수**: 데이터를 함수 간 인자 전달 또는 공유 변수로 소통

## 💡 예시

```python
# 절차지향 — 함수가 데이터를 받아서 처리하고 돌려줌
def load(path):
    return read_file(path)

def clean(data):
    return [x.strip() for x in data]

def analyze(data):
    return {"count": len(data), "unique": len(set(data))}

def save(result, path):
    write_file(path, result)

# 실행: 순서대로 호출
raw = load("input.csv")
cleaned = clean(raw)
result = analyze(cleaned)
save(result, "output.json")
```

### 절차지향 vs 함수형 — "둘 다 함수 쓰는데 뭐가 다르지?"

```python
# 절차지향: 상태를 바꿔가며 진행
total = 0
items = get_items()
for item in items:
    if item.active:
        total += item.price    # 변수 값을 계속 바꿈
print(total)

# 함수형: 상태를 바꾸지 않고 함수를 조합
total = (items
    .filter(lambda x: x.active)
    .map(lambda x: x.price)
    .reduce(lambda a, b: a + b))  # 새 값을 만들어냄
```

핵심 차이: 절차지향은 **변수를 바꾸고**, 함수형은 **새 값을 만든다**

## 🔄 비슷해 보이는 세 패러다임 비교

| 구분 | 절차지향 | 함수형 | 객체지향 |
|------|----------|--------|----------|
| **소속** | 명령형 | 선언형 | 명령형 |
| **중심** | 프로시저(함수) | 순수 함수 | 객체 |
| **데이터** | 변수에 저장, 함수 간 전달 | 불변, 새 값 생성 | 객체 내부에 캡슐화 |
| **상태 변경** | O (변수 값 변경) | X (불변) | O (객체 상태 변경) |
| **재사용** | 함수 호출 | 함수 조합 | 상속, 조합 |
| **대표 언어** | C, Pascal | Haskell, Elixir | Java, C++ |

## 🤔 언제 절차지향이 적합한가?

- 단순한 스크립트, 일회성 자동화
- 데이터 변환 파이프라인 (ETL)
- 수학적 계산, 알고리즘 구현
- 시스템 프로그래밍 (OS, 드라이버)
- 성능이 중요한 저수준 코드

## Relations

- part_of [[명령형 프로그래밍 (Imperative Programming)]] (명령형의 하위 패러다임)
- contrasts_with [[객체지향 프로그래밍 (OOP)]] (함수 중심 vs 객체 중심)
- similar_to [[함수형 프로그래밍 (Functional Programming)]] (둘 다 함수를 쓰지만, 상태 변경 여부가 다름)
- relates_to [[선언형 프로그래밍 (Declarative Programming)]] (절차지향의 반대편 패러다임 계열)

---

**난이도**: 초급
**카테고리**: 프로그래밍/패러다임
**마지막 업데이트**: 2026년 2월