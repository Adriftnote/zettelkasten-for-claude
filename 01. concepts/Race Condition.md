---
title: Race Condition
type: concept
tags: [concurrency, debugging, multi-threading, synchronization]
permalink: knowledge/concepts/race-condition
category: 동시성
difficulty: 중급
created: 2026-01-22
---

# Race Condition

**"여러 프로세스/스레드가 공유 자원에 동시 접근할 때 실행 순서에 따라 결과가 달라지는 현상"**

동시성 프로그래밍의 핵심 버그 유형. 타이밍에 따라 성공하기도 하고 실패하기도 해서 디버깅이 어렵습니다.

## 📖 개요

핵심 문제: **"누가 먼저 접근하느냐에 따라 결과가 달라짐"**

```
[스레드 A]        [스레드 B]
counter 읽기(0) ─→ counter 읽기(0)
     ↓                  ↓
  +1 계산(1)        +1 계산(1)
     ↓                  ↓
counter 쓰기(1) ←─ counter 쓰기(1)

예상: counter = 2
실제: counter = 1  ← Race Condition!
```

## 🎭 비유

### 은행 ATM

```
[Race Condition 발생]
사람 A: 잔액 확인(1000원) → 500원 출금 시도
사람 B: 잔액 확인(1000원) → 800원 출금 시도
               ↓
둘 다 "잔액 충분" 판단 → 둘 다 출금 성공
→ 실제 잔액: -300원! (마이너스)

[정상 동작]
A가 확인+출금 완료 → B가 확인+출금
→ B는 "잔액 부족" 판단 → 출금 실패
```

## 💡 발생 조건 (3가지 모두 충족 시)

| 조건 | 설명 |
|------|------|
| **공유 자원** | 여러 프로세스가 접근하는 데이터 |
| **동시 접근** | 동시에 읽기/쓰기 시도 |
| **비원자적 연산** | 읽기-수정-쓰기가 분리됨 |

## 💻 실제 사례

### Claude Code File Watcher 충돌

```
[File Watcher]     [Edit 도구]
파일 감시 중... ─→ 파일 읽기
      ↓                ↓
변경 감지 ←──────── 파일 수정 중
      ↓                ↓
캐시 업데이트 ←─── 파일 쓰기 시도
                      ↓
            "unexpectedly modified" 에러!
```

### 설정 파일 동시 수정

```
[Instance A]       [Instance B]
config 읽기 ─────→ config 읽기
     ↓                  ↓
설정 A 변경 ───→ 설정 B 변경
     ↓                  ↓
config 쓰기 ←─── config 쓰기
                      ↑
               A의 변경 사라짐!
```

## 📊 해결 방법

### 1. 뮤텍스 (Mutex) / 락 (Lock)

```python
import threading

lock = threading.Lock()
counter = 0

def increment():
    global counter
    with lock:  # 한 번에 하나만 접근
        temp = counter
        temp += 1
        counter = temp
```

### 2. 원자적 연산 (Atomic Operation)

```javascript
// ❌ 비원자적
counter = counter + 1;

// ✅ 원자적 (Node.js Atomics)
Atomics.add(sharedArray, 0, 1);
```

### 3. 파일 잠금 (File Locking)

```python
import fcntl

with open('config.json', 'r+') as f:
    fcntl.flock(f, fcntl.LOCK_EX)  # 배타적 잠금
    # 파일 수정
    fcntl.flock(f, fcntl.LOCK_UN)  # 잠금 해제
```

### 4. 원자적 파일 수정

```bash
# temp에 쓰고 rename (rename은 원자적)
echo "content" > file.tmp
mv file.tmp file.json
```

## ⚠️ Race Condition 징후

| 징후 | 설명 |
|------|------|
| **간헐적 실패** | 때때로만 발생하는 버그 |
| **타이밍 의존** | 실행 순서에 따라 결과 다름 |
| **재현 어려움** | 같은 코드인데 결과가 다름 |
| **부하 시 악화** | 동시 요청 많을 때 더 자주 발생 |

## 🔍 디버깅 팁

### 로깅으로 타이밍 확인

```python
import time
import threading

def task(name):
    print(f"[{time.time():.3f}] {name}: 읽기 시작")
    value = shared_data
    print(f"[{time.time():.3f}] {name}: 읽은 값 = {value}")
    time.sleep(0.001)  # 의도적 지연으로 경쟁 유발
    shared_data = value + 1
    print(f"[{time.time():.3f}] {name}: 쓰기 완료")
```

### 의도적 경쟁 유발

```python
# 디버깅용: sleep으로 타이밍 조작
def vulnerable_function():
    data = read_file()
    time.sleep(1)  # ← 여기서 다른 프로세스가 끼어들 수 있음
    write_file(data)
```

## 📋 예방 체크리스트

| 체크 | 내용 |
|------|------|
| 1 | 공유 자원 접근 시 락 사용 |
| 2 | 파일 수정은 원자적으로 (temp + rename) |
| 3 | 읽기-수정-쓰기를 하나의 트랜잭션으로 |
| 4 | 동시 접근 가능성 있는 코드 식별 |
| 5 | 멀티 인스턴스 환경 고려 |

## 💡 패턴별 해결책

| 패턴 | 해결책 |
|------|--------|
| **카운터 증가** | 원자적 연산 또는 락 |
| **파일 수정** | 원자적 파일 수정 |
| **DB 업데이트** | 트랜잭션 + 락 |
| **캐시 갱신** | Compare-and-Swap (CAS) |

## Relations

- prevented_by [[Atomic File Modification]] (파일 Race Condition 방지)
- related_to [[Defensive Coding]] (동시성 고려한 방어적 코딩)
- causes [[Root Cause vs Trigger]] (타이밍 의존 버그의 원인)
- related_to [[트랜잭션]] (DB에서의 동시성 제어)
