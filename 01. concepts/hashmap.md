---
title: 해시맵
type: concept
tags: [자료구조, 해시, 해시맵, 검색]
permalink: /concepts/hashmap
category: 자료구조
difficulty: 중급
date: 2026-01-28
---

# 해시맵 (HashMap / Dictionary)

**한 줄 정의**: 해시 함수를 사용하여 키-값 쌍을 빠르게 저장하고 검색할 수 있는 자료구조입니다.

## 비유: 전화번호부

전화번호부를 생각해봅시다. 이름을 알면 그 사람의 전화번호를 즉시 찾을 수 있습니다.
- "홍길동" → 전화번호 010-1234-5678
- "김철수" → 전화번호 010-9876-5432

해시맵도 마찬가지로 **이름(키)을 알면 정보(값)를 즉시 찾을 수 있습니다.**

## 동작 원리

해시맵은 **해시 함수**라는 마법의 상자를 사용합니다:

```
입력 (키)  →  [해시 함수]  →  배열 위치
"홍길동"  →  해시 계산      →  342번 위치
"김철수"  →  해시 계산      →  567번 위치
"이순신"  →  해시 계산      →  201번 위치
```

1. **해시 함수**: 키를 숫자(배열 인덱스)로 변환합니다
2. **배열 저장**: 계산된 위치에 값을 저장합니다
3. **검색**: 같은 방식으로 키를 계산하면 값의 위치를 즉시 알 수 있습니다

## 장점

| 장점 | 설명 |
|------|------|
| ⚡ **빠른 검색** | 평균적으로 O(1) 시간 복잡도 |
| 🎯 **직관적** | 키-값 쌍으로 데이터 관리 |
| 🔄 **유연한 키** | 정수뿐만 아니라 문자열, 객체도 키로 사용 가능 |
| 📦 **간단한 구현** | 대부분의 언어에서 내장 지원 |

## 단점

| 단점 | 설명 |
|------|------|
| 💾 **메모리 오버헤드** | 필요 이상으로 메모리 할당 (로드팩터) |
| 🔀 **순서 없음** | 저장된 순서를 보장하지 않음 |
| 🚨 **해시 충돌** | 다른 키가 같은 위치에 매핑될 수 있음 |
| 🔍 **최악의 경우** | 충돌이 많으면 O(n)까지 저하 가능 |

## 해시 충돌 해결

두 키가 같은 위치에 매핑되면?

**체이닝 (Chaining)**: 같은 위치에 여러 값을 연결리스트로 저장
```
위치 342: "홍길동" → "박길동" → "정길동"
```

**개방 주소법 (Open Addressing)**: 다른 빈 위치에 저장
```
위치 342: "홍길동"
위치 343: "박길동"  (충돌 시 옆으로 이동)
```

## 성능 분석 (Big O)

| 연산 | 평균 | 최악 |
|------|------|------|
| 검색 (Get) | **O(1)** | O(n) |
| 삽입 (Insert) | **O(1)** | O(n) |
| 삭제 (Delete) | **O(1)** | O(n) |
| 순회 | O(n) | O(n) |

> **평균**: 해시 함수가 잘 분산될 때
> **최악**: 해시 충돌이 많을 때

## 사용 사례

| 사례 | 설명 |
|------|------|
| 🎮 **게임 캐시** | 플레이어ID → 플레이어 정보 매핑 |
| 📝 **중복 확인** | 데이터 중복 여부 빠른 검색 |
| 🔗 **URL 라우팅** | 경로 → 핸들러 함수 매핑 |
| 👥 **사용자 데이터** | username → 사용자 프로필 |
| 🔍 **단어 검색** | 단어 → 빈도수 카운팅 |
| 🏪 **캐싱** | 쿼리 → 결과 캐싱 |

## Rust 예시 코드

### 기본 사용

```rust
use std::collections::HashMap;

fn main() {
    // 해시맵 생성
    let mut contacts = HashMap::new();

    // 데이터 삽입 (Insert)
    contacts.insert("홍길동", "010-1234-5678");
    contacts.insert("김철수", "010-9876-5432");
    contacts.insert("이순신", "010-5555-6666");

    // 검색 (Get) - O(1)
    match contacts.get("홍길동") {
        Some(phone) => println!("홍길동: {}", phone),
        None => println!("없음"),
    }

    // 업데이트
    contacts.insert("홍길동", "010-1111-1111");

    // 삭제 (Delete)
    contacts.remove("김철수");

    // 순회
    for (name, phone) in &contacts {
        println!("{}: {}", name, phone);
    }

    // 크기 확인
    println!("총 연락처: {}", contacts.len());
}
```

**출력:**
```
홍길동: 010-1234-5678
이순신: 010-5555-6666
홍길동: 010-1111-1111
총 연락처: 2
```

### 좀 더 복잡한 예시

```rust
use std::collections::HashMap;

#[derive(Clone, Debug)]
struct Student {
    name: String,
    age: u8,
    gpa: f32,
}

fn main() {
    let mut students = HashMap::new();

    // 객체를 값으로 저장
    students.insert(
        "2024001",
        Student {
            name: "김학생".to_string(),
            age: 20,
            gpa: 3.8,
        },
    );

    students.insert(
        "2024002",
        Student {
            name: "이학생".to_string(),
            age: 21,
            gpa: 3.5,
        },
    );

    // 검색하기
    if let Some(student) = students.get("2024001") {
        println!("학생: {}", student.name);
        println!("나이: {}", student.age);
        println!("학점: {}", student.gpa);
    }

    // 모든 학생 출력
    for (id, student) in &students {
        println!("{}: {} (GPA: {})", id, student.name, student.gpa);
    }
}
```

### 단어 빈도수 계산

```rust
use std::collections::HashMap;

fn main() {
    let text = "hello world hello rust hello";
    let words: Vec<&str> = text.split_whitespace().collect();

    let mut word_count = HashMap::new();

    for word in words {
        // entry() API로 효율적인 업데이트
        let count = word_count.entry(word).or_insert(0);
        *count += 1;
    }

    for (word, count) in &word_count {
        println!("{}: {} 번", word, count);
    }
}
```

**출력:**
```
hello: 3 번
rust: 1 번
world: 1 번
```

## Rust HashMap의 특징

- **타입 안전**: 제네릭으로 타입 지정 `HashMap<K, V>`
- **메모리 관리**: 자동 메모리 해제 (Ownership)
- **entry() API**: 메모리 할당 최소화하면서 효율적 업데이트
- **기본 해시 함수**: SipHash (보안, 예측 불가능)

## 관련 개념

- [[data-structure]] - 자료구조 개요
- [[array]] - 배열 기초
- [[hash-function]] - 해시 함수 상세
- [[collision-resolution]] - 충돌 해결 기법
- [[load-factor]] - 로드팩터와 성능

## 추가 학습

- 다른 언어의 HashMap: Python dict, JavaScript Object, Java HashMap
- 순서가 필요하면? LinkedHashMap 또는 BTreeMap
- 스레드 안전이 필요하면? DashMap (Rust)
