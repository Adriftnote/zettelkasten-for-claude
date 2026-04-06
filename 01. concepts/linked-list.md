---
title: 연결 리스트 (Linked List)
type: concept
tags: [data-structure, memory, pointer, algorithm]
permalink: /concepts/linked-list
category: Data Structure
difficulty: intermediate
date: 2026-01-28
---

# 연결 리스트 (Linked List)

**메모리상 흩어진 위치에 있는 노드들이 포인터로 연결되어 선형 구조를 형성하는 동적 자료구조.**

---

## 비유

연결 리스트는 **책갈피로 연결된 책 페이지**와 같습니다. 각 페이지(노드)에는 다음 페이지의 위치가 표시되어 있고, 우리는 첫 페이지부터 시작해서 순차적으로 따라갑니다. 메모리상 페이지들이 떨어져 있어도 책갈피(포인터)가 연결합니다.

---

## 메모리 구조

```
연결 리스트의 메모리 배치:
(메모리 주소가 비연속적)

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Data: 1     │     │ Data: 2     │     │ Data: 3     │
│ Next: ──────┼────→│ Next: ──────┼────→│ Next: ──────┼────→ null
└─────────────┘     └─────────────┘     └─────────────┘
  (0x1000)            (0x4000)            (0x2000)

Head ──→ [1] ──→ [2] ──→ [3] ──→ null

포인터 체이싱(Pointer Chasing):
1번 노드의 포인터 따라가기
    ↓
2번 노드의 포인터 따라가기
    ↓
3번 노드의 포인터 따라가기
    ↓
null (끝)
```

### 노드 구조
```
struct Node {
    data: T           ← 실제 데이터
    next: *mut Node   ← 다음 노드의 주소
}
```

---

## 장점

- **삽입/삭제 O(1)**: 포인터만 변경하면 됨 (위치를 알고 있을 때)
- **동적 크기**: 필요한 만큼 메모리 할당/해제 가능
- **메모리 낭비 없음**: 필요한 양만 사용

---

## 단점

- **검색 O(n)**: 첫 노드부터 순차적으로 탐색해야 함 (임의접근 불가)
- **캐시 비친화적**: 메모리가 흩어져 있어서 캐시 미스 증가
- **포인터 오버헤드**: 각 노드마다 포인터 저장 필요 (메모리 증가)
- **추가 복잡도**: 더블 프리(double-free), 메모리 누수 위험

---

## 사용 사례

- **자주 삽입/삭제하는 경우**: 텍스트 에디터, 플레이리스트
- **크기가 계속 변하는 경우**: 메시지 큐, 작업 큐
- **LIFO/FIFO 구조**: 스택, 큐의 기본 구현
- **해시 테이블의 체이닝**: 해시 충돌 해결
- **파일 시스템**: 트리 구조의 기반

---

## 성능 분석 (Big O)

| 연산 | 시간복잡도 | 비고 |
|------|-----------|------|
| 검색 | O(n) | 첫 노드부터 순차 탐색 |
| 삽입 | O(1) | 위치를 알고 있을 때 |
| 삭제 | O(1) | 위치를 알고 있을 때 |
| 접근 | O(n) | 임의접근 불가 |

**공간복잡도**: O(n) - 각 노드마다 포인터 저장

---

## Rust 예시 코드

### 기본 구현 (수동)
```rust
// ⚠️ Rust에서 메모리 안정성 때문에 수동 연결 리스트는 까다로움

use std::ptr::NonNull;

struct Node<T> {
    data: T,
    next: Option<NonNull<Node<T>>>,
}

struct LinkedList<T> {
    head: Option<NonNull<Node<T>>>,
}

impl<T> LinkedList<T> {
    fn new() -> Self {
        LinkedList { head: None }
    }

    // 맨 앞에 삽입 (O(1))
    fn push_front(&mut self, data: T) {
        let new_node = NonNull::new(Box::into_raw(Box::new(Node {
            data,
            next: self.head.take(),
        }))).unwrap();

        self.head = Some(new_node);
    }
}
```

### Rust 표준 라이브러리 사용 (권장)
```rust
use std::collections::LinkedList;

fn main() {
    let mut list = LinkedList::new();

    list.push_back(1);
    list.push_back(2);
    list.push_back(3);

    // 순회
    for &val in &list {
        println!("{}", val);  // 1, 2, 3
    }

    // 맨 앞 삭제 (O(1))
    list.pop_front();

    // 맨 뒤 삭제 (O(1))
    list.pop_back();
}
```

### ⚠️ Rust에서 LinkedList가 비권장인 이유

```rust
// 1. 메모리 안전성 때문에 수동 구현 복잡
// 2. std::collections::LinkedList는 느림
//    - 각 노드가 힙 할당됨
//    - 포인터 따라가기 (포인터 체이싱) 비용 높음
//    - 캐시 비친화적

// 3. VecDeque가 대부분의 경우 더 빠름
use std::collections::VecDeque;

let mut queue = VecDeque::new();
queue.push_back(1);
queue.pop_front();  // 더 효율적

// 4. Rust 철학:
//    - 안전성 > 편의성
//    - 메모리 효율 중시
//    → 대부분 Vec이나 VecDeque 사용
```

---

## 비교: 배열 vs 연결 리스트

| 특성 | 배열 | 연결 리스트 |
|------|------|-----------|
| 접근 | O(1) | O(n) |
| 삽입/삭제 | O(n) | O(1)* |
| 메모리 | 연속 | 비연속 |
| 캐시 | 친화적 | 비친화적 |
| 오버헤드 | 없음 | 포인터 저장 |

*: 위치를 알고 있을 때

---

## 변형 구조

- **이중 연결 리스트 (Doubly Linked List)**: 앞/뒤로 이동 가능
- **원형 연결 리스트 (Circular Linked List)**: 마지막이 첫 번째로 연결
- **스킵 리스트 (Skip List)**: 여러 레벨 포인터로 검색 개선

---

## 관련 개념

- [[데이터 구조 (Data Structure)]] - 전체 자료구조
- [[array]] - 배열과의 비교
- [[RAM]] - 메모리 접근 구조
- [[Cache]] - 캐시 비친화성 이해
- [[rust]] - 메모리 안전 언어에서의 구현