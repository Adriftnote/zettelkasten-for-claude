---
title: 스택
type: concept
tags: [data-structure, stack, lifo, dsa]
permalink: /concepts/stack
category: 자료구조
difficulty: 초급
date: 2026-01-28
---

# 스택 (Stack)

## 핵심 정의

**LIFO (Last In, First Out)**: 마지막에 들어온 데이터가 가장 먼저 나간다.

## 비유

접시를 쌓아놓은 더미를 생각해보세요. 맨 위에 놓은 접시를 먼저 꺼내고, 맨 아래 접시는 맨 마지막에 꺼냅니다.

```
[5]  ← 마지막에 넣은 것 (먼저 꺼냄)
[4]
[3]
[2]
[1]  ← 처음 넣은 것 (마지막에 꺼냄)
```

## 동작 원리

### Push (삽입)
스택의 맨 위에 새로운 데이터를 추가합니다.

### Pop (제거)
스택의 맨 위 데이터를 제거하고 반환합니다.

### 그 외 주요 연산
- **Peek**: 맨 위 데이터를 확인하되 제거하지 않음
- **isEmpty**: 스택이 비어있는지 확인
- **size**: 스택에 저장된 원소의 개수

## 시각화

```
초기 상태: []

Push(1): [1]
Push(2): [1, 2]
Push(3): [1, 2, 3]
Pop()  : [1, 2]      (3을 반환)
Pop()  : [1]         (2를 반환)
Push(4): [1, 4]
Pop()  : [1]         (4를 반환)
```

## 사용 사례

- **함수 호출 스택**: 프로그램 실행 중 함수 호출 관리
- **되돌리기 (Undo) 기능**: 편집기에서 이전 상태로 돌아가기
- **괄호 매칭**: 프로그래밍 언어의 괄호 짝 확인
- **깊이 우선 탐색 (DFS)**: 그래프 탐색 알고리즘
- **웹 브라우저 뒤로가기**: 방문 페이지 히스토리 관리

## Rust 예시 코드

```rust
// Vec을 이용한 스택 구현
struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    // 새로운 스택 생성
    fn new() -> Stack<T> {
        Stack {
            items: Vec::new(),
        }
    }

    // Push: 데이터 추가
    fn push(&mut self, item: T) {
        self.items.push(item);
    }

    // Pop: 데이터 제거 및 반환
    fn pop(&mut self) -> Option<T> {
        self.items.pop()
    }

    // Peek: 맨 위 데이터 확인 (제거하지 않음)
    fn peek(&self) -> Option<&T> {
        self.items.last()
    }

    // isEmpty: 스택이 비어있는지 확인
    fn is_empty(&self) -> bool {
        self.items.is_empty()
    }

    // size: 스택의 크기
    fn size(&self) -> usize {
        self.items.len()
    }
}

// 사용 예시
fn main() {
    let mut stack: Stack<i32> = Stack::new();

    // 데이터 추가
    stack.push(1);
    stack.push(2);
    stack.push(3);
    stack.push(4);
    stack.push(5);

    // 맨 위 데이터 확인
    println!("맨 위: {:?}", stack.peek());  // Some(5)

    // 데이터 제거
    while !stack.is_empty() {
        println!("{:?}", stack.pop());  // 5, 4, 3, 2, 1 순서로 출력
    }

    // 빈 스택에서 pop
    println!("{:?}", stack.pop());  // None
}
```

## 관련 개념

- [[데이터 구조 (Data Structure)]] - 기본 자료구조
- [[queue]] - 스택의 대응 개념 (FIFO)
- [[array]] - 스택의 기반 자료구조
