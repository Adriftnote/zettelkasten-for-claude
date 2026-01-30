---
title: 데이터 구조
type: hub
tags:
- hub
- programming
- data-structure
- memory
- performance
- zettelkasten
- basic-memory
permalink: hubs/data-structure
---

# 데이터 구조 (Data Structure)

**데이터를 메모리(RAM)에 저장하고 정리하는 방법**. 같은 데이터라도 어떻게 배치하느냐에 따라 접근 속도가 수십~수백 배 차이날 수 있다.

## Observations

- [fact] Big O만으로는 실제 성능을 예측할 수 없다 - CPU 캐시 친화성이 현대 시스템에서 더 중요 #performance
- [fact] 연속 배치(배열)는 캐시 활용, 흩어진 배치(연결 리스트)는 캐시 미스 발생 #cache
- [fact] Rust에서 LinkedList보다 Vec/VecDeque가 대부분 더 빠름 (캐시 친화성) #rust

## Relations

- organizes [[array]] (1. 연속 메모리, 인덱스 접근 O(1))
  - extends [[stack]] (1a. LIFO 후입선출, Undo/함수 호출)
  - extends [[queue]] (1b. FIFO 선입선출, 대기열/BFS)
- organizes [[linked-list]] (2. 포인터 연결, 동적 크기 - 캐시 비친화적 주의)
- organizes [[hashmap]] (3. 해시 함수로 즉시 접근 O(1))
- organizes [[ram-memory-access]] (4. RAM 물리적 구조와 메모리 접근)
  - extends [[cache-friendliness]] (4a. 캐시 친화성과 성능 최적화)
- connects_to [[memory-systems]] (데이터 구조가 저장되는 메모리 계층)
- connects_to [[programming-basics]] (데이터 구조를 활용하는 알고리즘/코드)
- connects_to [[optimization-patterns]] (캐시 친화성, 성능 최적화)

---

## 참고: 성능 비교 (Big O)

| 작업 | 배열 | 연결 리스트 | 해시맵 |
|------|------|----------|------|
| 검색 | O(n) | O(n) | O(1) |
| 인덱스 접근 | O(1) | O(n) | N/A |
| 삽입 (끝) | O(1) | O(1) | O(1) |
| 삽입 (중간) | O(n) | O(1) | O(1) |
| 삭제 | O(n) | O(1) | O(1) |

## 참고: Rust 권장 타입

| 필요한 것 | 권장 타입 |
|----------|----------|
| 동적 배열 | `Vec<T>` |
| 키-값 저장 | `HashMap<K, V>` |
| 스택 | `Vec<T>` (push/pop) |
| 큐 | `VecDeque<T>` |
| 연결 리스트 | 대부분 `Vec`가 더 빠름 |
