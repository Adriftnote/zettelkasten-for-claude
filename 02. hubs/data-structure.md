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

### 핵심 인사이트
- Big O만으로는 실제 성능을 예측할 수 없다. **CPU 캐시 친화성**이 현대 시스템에서 더 중요 #insights #performance
- 연속 배치(배열) → 캐시 활용 ⚡ / 흩어진 배치(연결 리스트) → 캐시 미스 😰 #cache-awareness
- Rust에서 `LinkedList`보다 `Vec`나 `VecDeque`가 대부분 더 빠름 (캐시 친화성) #rust #performance

### 학습 경로
- 선형 구조(배열, 리스트) → 키-값 구조(해시맵) → 성능 최적화(캐시 친화성) #learning-path
- 고전(알고리즘 복잡도 중심) → 최신(실제 하드웨어 성능 중심) #history

### 인덱싱 (루만식)

#### 1. 선형 구조
(1) Array - 연속 메모리, 인덱스 접근 O(1)
(1a) Linked List - 포인터 연결, 동적 크기 (캐시 비친화적 주의)
(1b) Stack - LIFO (후입선출), Undo/함수 호출에 사용
(1c) Queue - FIFO (선입선출), 대기열/BFS에 사용

#### 2. 키-값 구조
(2) HashMap - 해시 함수로 즉시 접근 O(1), 빠른 검색/캐싱

#### 3. 메모리와 성능
(3) RAM Memory Access - RAM 물리적 구조와 메모리 접근
(3a) Cache Friendliness - 캐시 친화성과 성능 최적화

## 📊 성능 비교 (Big O)

| 작업 | 배열 | 연결 리스트 | 해시맵 |
|------|------|----------|------|
| **검색** | O(n) | O(n) | O(1) ⚡ |
| **인덱스 접근** | O(1) ⚡ | O(n) | N/A |
| **삽입 (끝)** | O(1) | O(1) | O(1) |
| **삽입 (중간)** | O(n) | O(1) ⚡ | O(1) |
| **삭제** | O(n) | O(1) ⚡ | O(1) |

## 🎯 선택 가이드

| 필요한 것 | 권장 구조 |
|----------|----------|
| 빠른 인덱스 접근 | 배열/Vec |
| 자주 검색 | 해시맵 |
| 자주 삽입/삭제 | 연결 리스트 (캐시 고려) |
| LIFO 작업 | 스택 (Vec로 구현) |
| FIFO 작업 | 큐 (VecDeque) |

## 🦀 Rust 권장 타입

| 필요한 것 | 권장 타입 |
|----------|----------|
| 동적 배열 | `Vec<T>` |
| 키-값 저장 | `HashMap<K, V>` |
| 스택 | `Vec<T>` (push/pop) |
| 큐 | `VecDeque<T>` |
| 연결 리스트 | ❌ 대부분 `Vec`가 더 빠름 |

## Relations

### 관리하는 노트들
- organizes [[array]] (연속 메모리의 기본 데이터 구조)
- organizes [[linked-list]] (포인터 기반 동적 구조)
- organizes [[hashmap]] (해시 함수를 통한 즉시 접근)
- organizes [[stack]] (LIFO 원칙의 후입선출 구조)
- organizes [[queue]] (FIFO 원칙의 선입선출 구조)
- organizes [[ram-memory-access]] (물리적 메모리 접근 메커니즘)
- organizes [[cache-friendliness]] (캐시 최적화와 성능 향상)

### 다른 허브와의 연결
- connects_to [[memory-systems]] (데이터 구조가 저장되는 메모리 계층)
- connects_to [[programming-basics]] (데이터 구조를 활용하는 알고리즘/코드)
- connects_to [[optimization-patterns]] (캐시 친화성, 성능 최적화)
