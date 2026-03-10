---
title: 명령형 프로그래밍 (Imperative Programming)
type: concept
permalink: knowledge/concepts/imperative-programming
tags:
- 프로그래밍
- 패러다임
category: 컴퓨터과학
difficulty: 초급
---

# 명령형 프로그래밍 (Imperative Programming)

"무엇을(What)" 이 아니라 "어떻게(How)" 처리할지 단계별로 지시하는 프로그래밍 패러다임

## 📖 개요

명령형 프로그래밍은 컴퓨터에게 수행할 명령을 순서대로 나열하는 방식입니다. 변수에 값을 저장하고, 조건문으로 분기하고, 반복문으로 순회하는 등 "상태를 변경하는 단계"를 하나씩 기술합니다. 가장 오래되고 직관적인 패러다임으로, 대부분의 범용 프로그래밍 언어가 기본적으로 명령형입니다.

## 🎭 비유

IKEA 가구 조립 설명서와 같습니다. "1단계: A판과 B판을 나사로 연결 → 2단계: C봉을 구멍에 삽입 → 3단계: 뒤집어서 D판 부착..." 순서대로 따라하면 결과물이 완성됩니다. 선언형이 "책장 하나 만들어줘"라면, 명령형은 조립 과정을 하나하나 알려주는 것입니다.

## ✨ 특징

- **순서 중심**: 명령을 위에서 아래로 순차 실행
- **상태 변경**: 변수의 값을 계속 바꿔가며 진행
- **제어 흐름**: if/else, for, while 등으로 흐름 제어
- **직관적**: 컴퓨터 동작 방식과 가까워 이해하기 쉬움
- **디버깅 용이**: 한 줄씩 따라가며 상태 변화 추적 가능

## 💡 예시

### 명령형 vs 선언형 비교

```javascript
// 명령형: 짝수만 골라서 제곱하는 "과정"을 단계별로 기술
const numbers = [1, 2, 3, 4, 5, 6];
const results = [];
for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] % 2 === 0) {
    results.push(numbers[i] * numbers[i]);
  }
}
// results: [4, 16, 36]

// 선언형: "무엇을" 원하는지만 기술
const results = numbers
  .filter(n => n % 2 === 0)
  .map(n => n * n);
```

### 명령형 언어/스타일 예시

| 언어/스타일       | 특징                   |
| ------------ | -------------------- |
| C            | 명령형의 원형. 메모리까지 직접 관리 |
| Python (절차적) | for문, if문 중심 코드      |
| Java (OOP)   | 객체의 상태를 메서드로 변경      |
| Shell Script | 명령어를 순서대로 나열         |

### 명령형의 하위 패러다임

- **절차적 프로그래밍**: 함수/프로시저로 명령을 묶음 (C)
- **객체지향 프로그래밍**: 객체의 상태를 메서드로 변경 (Java, C++)

## Relations

- different_from [[선언형 프로그래밍 (Declarative Programming)]] (How vs What)
- organized_by [[프로그래밍 패러다임 (Programming Paradigms)]] (패러다임 허브)
- relates_to [[범용 프로그래밍 언어 (General-Purpose Language)]] (GPL의 주된 패러다임)
- relates_to [[객체지향 프로그래밍 (OOP)]] (명령형의 하위 패러다임)