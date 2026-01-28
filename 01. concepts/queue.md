---
title: 큐 (Queue)
type: concept
tags: [data-structure, queue, fifo, linear-data-structure]
permalink: queue
category: Data Structure
difficulty: Beginner
date: 2026-01-28
---

# 큐 (Queue)

**핵심 정의**: FIFO(First In, First Out) - 먼저 들어온 데이터가 먼저 나가는 선형 자료구조

## 비유

줄을 서서 기다리는 상황을 생각해보세요. 맨 앞에 선 사람이 가장 먼저 나가고, 새로운 사람은 줄의 맨 뒤에 서게 됩니다. 큐도 정확히 같은 원리로 동작합니다.

```
[1][2][3][4][5]
 ↑           ↑
나감        들어옴
```

## 동작 원리

큐는 두 가지 기본 연산으로 구성됩니다:

- **Enqueue (입력)**: 데이터를 큐의 뒤(rear)에 추가합니다.
- **Dequeue (출력)**: 큐의 앞(front)에서 데이터를 제거하고 반환합니다.

추가 연산:
- **Peek**: 데이터를 제거하지 않고 앞의 요소만 확인
- **isEmpty**: 큐가 비어있는지 확인
- **size**: 큐의 요소 개수 반환

## 시각화

```
초기 상태 (비어있음):
[]

enqueue(1):
[1]

enqueue(2):
[1, 2]

enqueue(3):
[1, 2, 3]

dequeue() → 1 반환:
[2, 3]

dequeue() → 2 반환:
[3]

enqueue(4):
[3, 4]
```

## 사용 사례

- **대기열 관리**: 콜센터, 은행, 병원 등에서 순서를 기다리는 대기열
- **작업 스케줄링**: 운영체제에서 프로세스/스레드 관리
- **이벤트 처리**: 사용자 입력, 메시지 큐 등 이벤트 순서 관리
- **너비 우선 탐색 (BFS)**: 그래프 탐색에서 노드를 레벨별로 방문
- **프린트 큐**: 인쇄 작업 대기열
- **네트워크 라우팅**: 데이터 패킷 처리

## Rust 예시 코드

Rust의 표준 라이브러리에서 `VecDeque`를 사용하여 큐를 구현합니다:

```rust
use std::collections::VecDeque;

fn main() {
    // 큐 생성
    let mut queue: VecDeque<i32> = VecDeque::new();

    // enqueue: 요소 추가
    queue.push_back(1);
    queue.push_back(2);
    queue.push_back(3);
    queue.push_back(4);
    queue.push_back(5);

    println!("초기 큐: {:?}", queue);
    // 초기 큐: [1, 2, 3, 4, 5]

    // peek: 앞의 요소 확인 (제거하지 않음)
    if let Some(&front) = queue.front() {
        println!("앞의 요소: {}", front);  // 앞의 요소: 1
    }

    // dequeue: 요소 제거 및 반환
    if let Some(value) = queue.pop_front() {
        println!("제거된 요소: {}", value);  // 제거된 요소: 1
    }

    println!("dequeue 후: {:?}", queue);
    // dequeue 후: [2, 3, 4, 5]

    // 크기 확인
    println!("큐의 크기: {}", queue.len());  // 큐의 크기: 4

    // 비어있는지 확인
    println!("비어있는가? {}", queue.is_empty());  // 비어있는가? false

    // 모든 요소 처리
    println!("\n모든 요소 순서대로 처리:");
    while let Some(value) = queue.pop_front() {
        println!("처리 중: {}", value);
    }
    // 처리 중: 2
    // 처리 중: 3
    // 처리 중: 4
    // 처리 중: 5

    println!("비어있는가? {}", queue.is_empty());  // 비어있는가? true
}
```

## 고급 예시: 너비 우선 탐색 (BFS)

```rust
use std::collections::VecDeque;

fn bfs(graph: &Vec<Vec<usize>>, start: usize) {
    let mut visited = vec![false; graph.len()];
    let mut queue = VecDeque::new();

    queue.push_back(start);
    visited[start] = true;

    println!("BFS 순서: ");

    while let Some(node) = queue.pop_front() {
        print!("{} ", node);

        for &neighbor in &graph[node] {
            if !visited[neighbor] {
                visited[neighbor] = true;
                queue.push_back(neighbor);
            }
        }
    }
    println!();
}

fn main() {
    // 그래프: 0 - 1 - 3
    //         |   |
    //         2   4
    let graph = vec![
        vec![1, 2],     // 0의 인접 노드
        vec![0, 3, 4],  // 1의 인접 노드
        vec![0],        // 2의 인접 노드
        vec![1],        // 3의 인접 노드
        vec![1],        // 4의 인접 노드
    ];

    bfs(&graph, 0);
    // BFS 순서: 0 1 2 3 4
}
```

## Stack과의 비교

| 구조 | 삽입 위치 | 삭제 위치 | 특징 |
|------|---------|---------|------|
| **Stack** | Top | Top | LIFO (Last In, First Out) - 한쪽 끝 |
| **Queue** | Rear | Front | FIFO (First In, First Out) - 양쪽 끝 |

## 시간 복잡도

| 연산 | 시간 복잡도 |
|------|----------|
| Enqueue | O(1) |
| Dequeue | O(1) |
| Peek | O(1) |
| isEmpty | O(1) |

## 관련 개념

- [[data-structure]] - 자료구조 개요
- [[stack]] - LIFO 자료구조
- [[array]] - 배열 기반 구현
