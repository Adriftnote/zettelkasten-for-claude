---
title: 함수형 프로그래밍 (Functional Programming)
type: concept
permalink: knowledge/concepts/functional-programming
tags:
- 프로그래밍
- 패러다임
category: 컴퓨터과학
difficulty: 중급
---

# 함수형 프로그래밍 (Functional Programming)

순수 함수와 불변 데이터를 중심으로 프로그램을 구성하는 선언형 프로그래밍의 하위 패러다임

## 📖 개요

함수형 프로그래밍(FP)은 "상태를 바꾸지 않고, 순수 함수의 조합으로 결과를 만들어내는" 방식입니다. 명령형이 "변수 값을 계속 바꿔가며 결과를 만드는 것"이라면, 함수형은 "입력을 변환하는 함수를 파이프라인처럼 연결하는 것"입니다. 선언형 프로그래밍의 하위 패러다임이며, 현대 언어들은 함수형 기능을 적극적으로 도입하고 있습니다.

## 🎭 비유

공장의 컨베이어 벨트와 같습니다. 원재료(입력)가 벨트를 따라 흘러가면서 각 공정(함수)을 거쳐 완제품(출력)이 됩니다. 각 공정은 자기 할 일만 하고, 다른 공정의 상태를 건드리지 않습니다. 원재료를 다시 넣으면 항상 똑같은 완제품이 나옵니다.

## ✨ 특징

- **순수 함수**: 같은 입력이면 항상 같은 출력 (외부 상태에 의존하지 않음)
- **불변성**: 데이터를 변경하지 않고 새로운 데이터를 만듦
- **일급 함수**: 함수를 변수에 담고, 인자로 전달하고, 반환값으로 사용
- **고차 함수**: 함수를 받거나 반환하는 함수 (map, filter, reduce)
- **부수효과 최소화**: 예측 가능하고 테스트하기 쉬운 코드

## 💡 예시

### 명령형 vs 함수형

```javascript
const numbers = [1, 2, 3, 4, 5, 6];

// 명령형: 상태를 변경하며 진행
let sum = 0;
for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] % 2 === 0) {
    sum += numbers[i] * numbers[i];
  }
}
// sum = 56

// 함수형: 함수를 파이프라인처럼 연결
const sum = numbers
  .filter(n => n % 2 === 0)    // [2, 4, 6]
  .map(n => n * n)              // [4, 16, 36]
  .reduce((a, b) => a + b, 0); // 56
```

### 순수 함수 vs 비순수 함수

```javascript
// 비순수: 외부 상태(discount)에 의존 → 결과 예측 어려움
let discount = 0.1;
function getPrice(price) {
  return price * (1 - discount); // discount가 바뀌면 결과가 달라짐
}

// 순수: 입력만으로 결과 결정 → 항상 예측 가능
function getPrice(price, discount) {
  return price * (1 - discount);
}
```

### 함수형 언어 스펙트럼

| 언어            | 함수형 정도      | 특징                            |
| ------------- | ----------- | ----------------------------- |
| Haskell       | 순수 함수형      | 부수효과를 타입으로 관리                 |
| Elixir/Erlang | 함수형         | 불변 데이터, 동시성 강점                |
| Clojure       | 함수형         | JVM 위의 Lisp                   |
| Rust          | 멀티 (함수형 강함) | 이터레이터, 패턴 매칭, 불변 기본           |
| JavaScript    | 멀티 (함수형 지원) | map/filter/reduce, 클로저        |
| Python        | 멀티 (함수형 지원) | lambda, map/filter, 리스트 컴프리헨션 |

## Relations

- part_of [[선언형 프로그래밍 (Declarative Programming)]] (선언형의 하위 패러다임)
- different_from [[명령형 프로그래밍 (Imperative Programming)]] (상태 변경 vs 함수 조합)
- different_from [[객체지향 프로그래밍 (OOP)]] (객체+메서드 vs 함수+데이터)
- relates_to [[DSL (Domain-Specific Language)]] (DSL도 선언형 경향)
- organized_by [[프로그래밍 패러다임]] (패러다임 허브)