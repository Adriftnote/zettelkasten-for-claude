---
title: UTF-32
type: note
permalink: knowledge/concepts/utf-32
tags:
- utf-32
- encoding
- unicode
- fixed-length
- memory-inefficient
difficulty: intermediate
---

# UTF-32

## 정의

**UTF-32 (32-bit Unicode Transformation Format)**은 [[Unicode]] 문자를 항상 4[[Byte]]로 인코딩하는 **고정 길이** 방식입니다.

가장 단순하지만 공간 효율이 가장 낮은 인코딩입니다.

## 숫자의 의미

**UTF-32**의 "32"는 **32[[Bit]] (4[[Byte]]) 단위**로 처리한다는 뜻입니다.

```
32 bits = 4 bytes (고정 크기)
```

## 인코딩 방식

**모든 문자가 4바이트 고정:**

| 문자 | Unicode | UTF-32 | 크기 |
|------|---------|--------|------|
| A | U+0041 | 0x00000041 | 4 bytes |
| 가 | U+AC00 | 0x0000AC00 | 4 bytes |
| 😀 | U+1F600 | 0x0001F600 | 4 bytes |

## 실제 예시

### 영어 'A'
```
Unicode: U+0041 (65)
UTF-32:  00 00 00 41 (4 bytes)
```

### 한글 '가'
```
Unicode: U+AC00 (44032)
UTF-32:  00 00 AC 00 (4 bytes)
```

### 이모지 '😀'
```
Unicode: U+1F600 (128512)
UTF-32:  00 01 F6 00 (4 bytes)
```

### 문장: "Hello 안녕"
```
모든 문자: 4 bytes × 7 = 28 bytes

H: 00 00 00 48
e: 00 00 00 65
l: 00 00 00 6C
l: 00 00 00 6C
o: 00 00 00 6F
안: 00 00 C5 48
녕: 00 00 B1 55
```

## [[Endianness]] 문제

UTF-32도 4바이트 단위이므로 바이트 순서가 중요합니다:

### Big Endian vs Little Endian

```
'가' = U+AC00

Big Endian:    [00] [00] [AC] [00]
Little Endian: [00] [AC] [00] [00]
```

### [[BOM]]으로 구분

| 인코딩 | BOM | 파일 시작 |
|--------|-----|----------|
| UTF-32 BE | `00 00 FE FF` | `00 00 FE FF 00 00 AC 00 ...` |
| UTF-32 LE | `FF FE 00 00` | `FF FE 00 00 00 AC 00 00 ...` |

## 다른 인코딩과 비교

| 특성 | ASCII | CP949 | UTF-8 | UTF-16 | **UTF-32** |
|------|-------|-------|-------|--------|--------|
| **영어 (1문자)** | 1B | 1B | 1B | 2B | **4B** |
| **한글 (1문자)** | ❌ | 2B | 3B | 2B | **4B** |
| **이모지 (1문자)** | ❌ | ❌ | 4B | 4B | **4B** |
| **ASCII 호환** | - | ✅ | ✅ | ❌ | **❌** |
| **다국어** | ❌ | ❌ | ✅ | ✅ | **✅** |
| **고정 길이** | ✅ | ❌ | ❌ | ❌ | **✅** |
| **BOM 필요** | - | - | ❌ | ✅ | **✅** |
| **용도** | 레거시 | 한국 전용 | 웹/Unix | Windows | **알고리즘** |

## 장점

### 1. 랜덤 접근 가능

```
n번째 문자 위치 = n × 4 bytes

예: 10번째 문자는 무조건 40바이트 위치
→ O(1) 인덱싱!
```

### 2. 간단한 구현

```c
// UTF-32: 간단!
uint32_t chars[] = {0x48, 0x65, 0x6C, 0x6C, 0x6F};  // "Hello"

// UTF-8: 복잡!
// 각 문자가 1~4바이트, 가변 길이 처리 필요
```

### 3. 문자 수 = 바이트 수 ÷ 4

```
파일 크기: 40 bytes
문자 수: 40 ÷ 4 = 10 문자

→ 즉시 계산 가능!
```

### 4. Surrogate 쌍 없음

```
UTF-16: 이모지는 4바이트 (surrogate pair)
UTF-32: 모든 문자 4바이트

→ 특수 처리 불필요
```

## 단점

### 1. 공간 낭비

```
"Hello" (5 문자):
  UTF-8:  5 bytes (1×5)
  UTF-16: 10 bytes (2×5)
  UTF-32: 20 bytes (4×5) ← 4배 낭비!

"안녕" (2 문자):
  UTF-8:  6 bytes (3×2)
  UTF-16: 4 bytes (2×2)
  UTF-32: 8 bytes (4×2) ← 2배 낭비
```

### 2. 메모리 비효율

```
1 MB 텍스트:
  UTF-8:  약 1 MB
  UTF-32: 약 4 MB

→ 메모리 4배 소비
```

### 3. [[ASCII]] 비호환

```
'A':
  ASCII:  0x41 (1 byte)
  UTF-32: 0x00000041 (4 bytes)

→ 기존 ASCII 파일과 완전 비호환
```

### 4. 캐시 비효율

```
CPU 캐시:
  UTF-8:  더 많은 문자 로드 가능
  UTF-32: 적은 문자만 로드

→ 캐시 미스 증가, 성능 저하
```

### 5. 네트워크 낭비

```
전송 데이터:
  UTF-8:  작음 → 빠름
  UTF-32: 큼 → 느림

→ 대역폭 낭비
```

## UTF-8 vs UTF-16 vs UTF-32 비교

| 특성 | UTF-8 | UTF-16 | UTF-32 |
|------|-------|--------|--------|
| **바이트/문자** | 1~4 (가변) | 2~4 (가변) | 4 (고정) |
| **영어** | 1 byte | 2 bytes | 4 bytes |
| **한글** | 3 bytes | 2 bytes | 4 bytes |
| **이모지** | 4 bytes | 4 bytes | 4 bytes |
| **랜덤 접근** | ❌ 느림 | ❌ 느림 | ✅ O(1) |
| **공간 효율** | ✅ 최고 | 중간 | ❌ 최악 |
| **ASCII 호환** | ✅ 완전 | ❌ 없음 | ❌ 없음 |
| **BOM 필요** | ❌ 선택 | ✅ 필수 | ✅ 필수 |
| **용도** | 파일, 웹 | 내부 처리 | 알고리즘 |

## 실제 사용 사례

### 1. 텍스트 처리 알고리즘

```python
# UTF-32로 변환 → 처리 → UTF-8로 저장

# 입력 (UTF-8)
text = "Hello안녕"

# UTF-32로 변환 (고정 길이)
chars = [ord(c) for c in text]  # [72, 101, 108, 108, 111, 50504, 45397]

# 처리 (인덱싱 빠름)
reversed_chars = chars[::-1]

# 출력 (UTF-8)
result = ''.join(chr(c) for c in reversed_chars)
```

### 2. 문자열 분석

```python
# 정확한 문자 수 계산
text = "Hello😀"

# UTF-8: 바이트 수 ≠ 문자 수
len(text.encode('utf-8'))  # 9 bytes

# UTF-32: 바이트 수 ÷ 4 = 문자 수
len(text.encode('utf-32-le')) // 4  # 6 문자
```

### 3. 내부 표현 (일부 시스템)

```
Python 3.3+:
  내부적으로 "Flexible String Representation"
  - ASCII만: 1바이트/문자
  - Latin-1: 1바이트/문자
  - BMP: 2바이트/문자
  - 기타: 4바이트/문자 (UTF-32)
```

## 프로그래밍 예시

### Python

```python
text = "Hello안녕"

# UTF-32 LE 인코딩
utf32le = text.encode('utf-32-le')
print(utf32le.hex())
# '480000006500000...'

# 바이트 수 = 문자 수 × 4
assert len(utf32le) == len(text) * 4

# 디코딩
decoded = utf32le.decode('utf-32-le')
```

### C

```c
#include <stdint.h>

// UTF-32 문자열
uint32_t str[] = {0x48, 0x65, 0x6C, 0x6C, 0x6F, 0};  // "Hello"

// n번째 문자 접근
uint32_t third_char = str[2];  // 'l' (0x6C)
```

### JavaScript

```javascript
const text = "Hello안녕";

// UTF-32 코드 포인트 배열
const codePoints = [...text].map(c => c.codePointAt(0));
console.log(codePoints);
// [72, 101, 108, 108, 111, 50504, 45397]

// 랜덤 접근
const thirdChar = [...text][2];  // 'l'
```

## 사용 권장 사항

| 상황 | 사용? |
|------|------|
| **파일 저장** | ❌ 절대 안 됨 (공간 낭비) |
| **네트워크 전송** | ❌ 절대 안 됨 (대역폭 낭비) |
| **웹** | ❌ 절대 안 됨 |
| **내부 처리** | 🤔 경우에 따라 (랜덤 접근 필요시) |
| **알고리즘** | ✅ 고려 가능 (복잡도 중요시) |
| **데이터베이스** | 🤔 경우에 따라 (정렬/검색 빈번시) |

## 성능 비교

### 메모리

```
1,000자 텍스트:
  UTF-8:  약 3 KB (평균 3 bytes/문자)
  UTF-16: 약 2 KB (평균 2 bytes/문자)
  UTF-32: 4 KB (고정 4 bytes/문자)
```

### 인덱싱 속도

```
n번째 문자 찾기:

UTF-8:  O(n) - 처음부터 세어야 함
UTF-16: O(n) - surrogate pair 때문에
UTF-32: O(1) - 즉시 계산 가능
```

### 변환 속도

```
Unicode → UTF-32: 가장 빠름 (그대로 복사)
Unicode → UTF-16: 중간 (surrogate 변환)
Unicode → UTF-8:  느림 (가변 길이 계산)
```

## 역사

| 시기 | 내용 |
|------|------|
| **1996** | UTF-32 (UCS-4) 표준화 |
| **2000년대** | 내부 처리용으로만 사용 |
| **현재** | 거의 사용 안 됨 (공간 비효율) |

## 주의사항

### 1. 파일로 저장 금지

```
❌ UTF-32로 파일 저장
✅ UTF-8로 저장 후 필요시 메모리에서 UTF-32 변환
```

### 2. BOM 필수

```python
# ❌ BOM 없음: Endianness 불명확
with open('file.txt', 'w', encoding='utf-32-le') as f:
    f.write(text)

# ✅ BOM 포함
with open('file.txt', 'w', encoding='utf-32') as f:
    f.write(text)
```

### 3. 내부 처리에만 사용

```
읽기: UTF-8
  ↓
변환: UTF-32 (메모리)
  ↓
처리: 고속 알고리즘
  ↓
변환: UTF-8
  ↓
쓰기: UTF-8
```

## Relations

- implements [[Unicode]]
- similar_to [[UTF-8]]
- similar_to [[UTF-16]]
- used_by [[Endianness]]
- used_by [[BOM (Byte Order Mark)]]
- part_of [[Character Encoding]]

## 핵심 요약

UTF-32는 "모든 문자를 4바이트로 표현"하는 가장 단순한 인코딩입니다. 랜덤 접근이 빠르지만 공간 낭비가 심해서 **파일 저장에는 절대 사용하지 않습니다**. 내부 알고리즘에서 복잡도가 중요할 때만 제한적으로 사용됩니다.