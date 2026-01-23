---
title: Endianness
type: note
permalink: knowledge/concepts/endianness
tags:
- endianness
- big-endian
- little-endian
- byte-order
- computer-architecture
difficulty: intermediate
---

# Endianness

## 정의

**Endianness (엔디언)**는 멀티[[Byte]] 데이터를 메모리에 저장할 때 **바이트의 순서**를 정하는 방식입니다.

"Little Endian"과 "Big Endian" 두 가지가 있습니다.

## 이름의 유래

Jonathan Swift의 소설 "걸리버 여행기"에서 유래:

```
릴리푸트 나라의 전쟁:
- 달걀 큰 쪽부터 깨는 사람 (Big-Endian)
- 달걀 작은 쪽부터 깨는 사람 (Little-Endian)

→ 사소한 차이로 큰 논쟁
→ 컴퓨터도 마찬가지!
```

## Big Endian

**큰 쪽(Most Significant Byte)부터** 저장:

### 예시: 0xAC00 (44032, '가')

```
메모리 주소:  0x1000    0x1001
저장 순서:     [AC]      [00]
               ↑         ↑
              MSB       LSB
           (큰 쪽)   (작은 쪽)
```

**특징:**
- 사람이 읽는 순서와 동일
- 네트워크 바이트 순서 (Network Byte Order)
- 디버깅 시 직관적

## Little Endian

**작은 쪽(Least Significant Byte)부터** 저장:

### 예시: 0xAC00 (44032, '가')

```
메모리 주소:  0x1000    0x1001
저장 순서:     [00]      [AC]
               ↑         ↑
              LSB       MSB
           (작은 쪽)  (큰 쪽)
```

**특징:**
- 대부분의 현대 CPU (x86, ARM)
- 메모리 접근 효율적
- 디버깅 시 혼란스러움

## 비교 예시

### 숫자 305,419,896 (0x12345678)

| 방식 | 주소 0 | 주소 1 | 주소 2 | 주소 3 |
|------|--------|--------|--------|--------|
| **Big Endian** | 12 | 34 | 56 | 78 |
| **Little Endian** | 78 | 56 | 34 | 12 |

**메모리 덤프:**
```
Big Endian:    12 34 56 78
Little Endian: 78 56 34 12
```

## UTF-16에서의 Endianness

[[UTF-16]]은 2바이트 단위이므로 순서가 중요합니다:

### 문자 '가' (U+AC00)

```
Big Endian UTF-16:
  메모리: [AC] [00]
  
Little Endian UTF-16:
  메모리: [00] [AC]

→ 똑같은 파일인데 읽는 방식에 따라 다른 문자!
```

### [[BOM]]으로 구분

```
UTF-16 파일 시작:

Big Endian:    FE FF [AC 00] ...
Little Endian: FF FE [00 AC] ...
               ↑
              BOM으로 구분!
```

## UTF-8은 왜 Endianness 문제가 없나?

[[UTF-8]]은 **1바이트 단위**로 처리하므로 순서가 고정됨:

```
'가' = U+AC00

UTF-8:
  항상: EA B0 80 (3바이트)
  
→ Big/Little Endian 구분 불필요!
→ BOM 불필요!
```

## 플랫폼별 사용

| 플랫폼/CPU | Endianness |
|-----------|------------|
| **x86 (Intel, AMD)** | Little Endian |
| **ARM (대부분)** | Little Endian |
| **PowerPC** | Big Endian (일부 양방향) |
| **MIPS** | 양방향 (설정 가능) |
| **네트워크 프로토콜** | Big Endian (표준) |
| **Java Virtual Machine** | Big Endian |

## 네트워크 바이트 순서

인터넷 프로토콜은 **Big Endian**을 표준으로 사용:

```
클라이언트 (Little Endian):
  0x1234 → 메모리: [34 12]
         ↓ htons() (host to network short)
네트워크: [12 34]  (Big Endian)
         ↓ 전송
서버 (Little Endian):
         ↓ ntohs() (network to host short)
  0x1234 → 메모리: [34 12]
```

## 실용 문제

### 1. 파일 교환

```
Big Endian 시스템에서 생성한 바이너리 파일
    ↓
Little Endian 시스템에서 읽기
    ↓
숫자가 모두 엉망!

해결: 파일 형식에 Endianness 명시
예: PNG, JPEG (명시된 형식)
```

### 2. 메모리 덤프 해석

```
메모리: 78 56 34 12

Little Endian CPU:
  → 0x12345678 (305,419,896)

Big Endian CPU:
  → 0x78563412 (2,018,915,346)
```

### 3. 타입 변환

```c
// Little Endian 시스템
int num = 0x12345678;
char *ptr = (char*)&num;

ptr[0] = 0x78  // 하위 바이트
ptr[1] = 0x56
ptr[2] = 0x34
ptr[3] = 0x12  // 상위 바이트
```

## Endianness 감지

### C/C++
```c
int num = 1;
if (*(char*)&num == 1) {
    printf("Little Endian\n");
} else {
    printf("Big Endian\n");
}
```

### Python
```python
import sys
print(sys.byteorder)  # 'little' or 'big'
```

## 변환 함수

### C (POSIX)
```c
#include <arpa/inet.h>

uint16_t htons(uint16_t);  // Host to Network Short
uint16_t ntohs(uint16_t);  // Network to Host Short
uint32_t htonl(uint32_t);  // Host to Network Long
uint32_t ntohl(uint32_t);  // Network to Host Long
```

### Python
```python
import struct

# Little Endian 변환
data = struct.pack('<H', 0xAC00)  # b'\x00\xac'

# Big Endian 변환
data = struct.pack('>H', 0xAC00)  # b'\xac\x00'
```

## 왜 Little Endian이 더 많나?

### Little Endian의 장점

```
1. 메모리 접근 효율:
   4바이트 숫자를 1/2/4바이트로 읽을 때
   항상 같은 주소에서 시작

2. 타입 캐스팅 간편:
   int → short → char
   모두 같은 주소

3. 하드웨어 구현 단순
```

### Big Endian의 장점

```
1. 직관적:
   메모리 덤프가 읽기 쉬움
   
2. 문자열 비교 빠름:
   strcmp() 같은 연산에 유리

3. 네트워크 표준
```

## Relations

- used_by [[UTF-16]]
- used_by [[UTF-32]]
- relates_to [[UTF-8]]
- used_by [[BOM (Byte Order Mark)]]
- part_of [[Byte]]

## 핵심 요약

Endianness는 "바이트 저장 순서"입니다. Big Endian(큰 쪽 먼저)과 Little Endian(작은 쪽 먼저)이 있으며, 현대 PC는 대부분 Little Endian입니다. [[UTF-16]]/[[UTF-32]]는 [[BOM]]으로 구분하지만, [[UTF-8]]은 1바이트 단위라서 이 문제가 없습니다.