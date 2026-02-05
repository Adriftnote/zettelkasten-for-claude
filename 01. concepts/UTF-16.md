---
title: UTF-16
type: note
permalink: knowledge/concepts/utf-16
tags:
- utf-16
- encoding
- unicode
- endianness
- windows
- java
difficulty: intermediate
---

# UTF-16

## 정의

**UTF-16 (16-bit Unicode Transformation Format)**은 Unicode 문자를 2 또는 4바이트(Byte)로 인코딩하는 가변 길이 방식입니다.

Windows와 Java의 내부 문자열 표현 방식입니다.

## 숫자의 의미

**UTF-16**의 "16"은 **16비트 (2바이트) 단위**로 처리한다는 뜻입니다.

```
16 bits = 2 bytes (기본 처리 단위)
```

## 인코딩 방식

문자에 따라 2 또는 4바이트 사용:

| 범위 (Unicode) | 바이트 수 | 예시 문자 |
|---------------|----------|----------|
| U+0000 ~ U+FFFF | 2 bytes | 대부분 문자 (영어, 한글, 한자) |
| U+10000 ~ U+10FFFF | 4 bytes | 이모지, 고대 문자 |

## 실제 예시

### 영어 'A'
```
Unicode: U+0041 (65)
UTF-16:  0x0041 (2 bytes)
```

### 한글 '가'
```
Unicode: U+AC00 (44032)
UTF-16:  0xAC00 (2 bytes)
```

### 이모지 '😀'
```
Unicode: U+1F600 (128512)
UTF-16:  0xD83D 0xDE00 (4 bytes, surrogate pair)
```

### 문장: "Hello 안녕"
```
H: 2 bytes
e: 2 bytes
l: 2 bytes
l: 2 bytes
o: 2 bytes
안: 2 bytes
녕: 2 bytes

총합: 14 bytes
```

## Endianness 문제

UTF-16은 2바이트 단위이므로 바이트 순서가 중요합니다:

### Big Endian vs Little Endian

```
'가' = U+AC00

Big Endian:    [AC] [00]
Little Endian: [00] [AC]

→ 같은 파일, 다른 해석!
```

### BOM으로 구분

파일 시작에 BOM을 넣어서 구분:

| 인코딩 | BOM | 파일 시작 |
|--------|-----|----------|
| UTF-16 BE | `FE FF` | `FE FF AC 00 ...` |
| UTF-16 LE | `FF FE` | `FF FE 00 AC ...` |

**BOM은 필수입니다!** (없으면 구분 불가)

## Surrogate Pair (서로게이트 쌍)

U+10000 이상은 4바이트로 표현:

### 원리
```
U+1F600 (😀) 인코딩:

1. 0x10000을 뺌: 0xF600
2. 상위 10비트: 0x3D → 0xD800 + 0x3D = 0xD83D
3. 하위 10비트: 0x00 → 0xDC00 + 0x00 = 0xDE00

결과: 0xD83D 0xDE00 (4 bytes)
```

### 특수 범위

| 범위 | 용도 |
|------|------|
| U+D800 ~ U+DBFF | High Surrogate (앞 2바이트) |
| U+DC00 ~ U+DFFF | Low Surrogate (뒤 2바이트) |

**주의:** 이 범위는 단독으로 유효한 문자가 아님!

## 다른 인코딩과 비교

| 특성 | ASCII | CP949 | UTF-8 | **UTF-16** | UTF-32 |
|------|-------|-------|-------|--------|--------|
| **영어 (1문자)** | 1B | 1B | 1B | **2B** | 4B |
| **한글 (1문자)** | ❌ | 2B | 3B | **2B** | 4B |
| **이모지 (1문자)** | ❌ | ❌ | 4B | **4B** | 4B |
| **ASCII 호환** | - | ✅ | ✅ | **❌** | ❌ |
| **다국어** | ❌ | ❌ | ✅ | **✅** | ✅ |
| **고정 길이** | ✅ | ❌ | ❌ | **❌** | ✅ |
| **BOM 필요** | - | - | ❌ | **✅** | ✅ |
| **용도** | 레거시 | 한국 전용 | 웹/Unix | **Windows** | 알고리즘 |

## 장점

### 1. BMP 문자에 효율적

```
BMP (Basic Multilingual Plane):
  U+0000 ~ U+FFFF (대부분의 현대 문자)

UTF-16: 2 bytes
UTF-8:  1~3 bytes

→ 한글/한자는 UTF-16이 더 작을 수 있음
```

### 2. 고정 길이에 가까움

```
대부분의 문자: 2 bytes
이모지만: 4 bytes

→ UTF-8보다 예측 가능
```

### 3. Windows/Java 네이티브

```
Windows API: UTF-16 (wchar_t)
Java String: UTF-16 내부 표현

→ 변환 오버헤드 없음
```

## 단점

### 1. ASCII 비호환

```
'A' (U+0041):
  ASCII:  0x41 (1 byte)
  UTF-16: 0x00 0x41 (2 bytes)

→ 기존 ASCII 파일과 호환 안 됨!
```

### 2. 영어 비효율

```
"Hello" (5 문자):
  UTF-8:  5 bytes
  UTF-16: 10 bytes

→ 영어 문서는 2배 크기
```

### 3. Endianness 복잡성

```
파일 교환 시 BOM 필수
Big/Little Endian 변환 필요
→ 구현 복잡
```

### 4. 여전히 가변 길이

```
대부분: 2 bytes
이모지: 4 bytes

→ 랜덤 접근 여전히 복잡
```

### 5. Null 바이트 문제

```
'A' = 0x00 0x41

C 문자열: 0x00이 문자열 끝
→ UTF-16을 C 문자열로 못 씀
```

## UTF-8 vs UTF-16 비교

| 특성 | UTF-8 | UTF-16 |
|------|-------|--------|
| **바이트/문자** | 1~4 (가변) | 2~4 (가변) |
| **영어** | 1 byte | 2 bytes |
| **한글** | 3 bytes | 2 bytes |
| **이모지** | 4 bytes | 4 bytes |
| **ASCII 호환** | ✅ 완전 | ❌ 없음 |
| **BOM 필요** | ❌ 선택 | ✅ 필수 |
| **Endianness** | 문제 없음 | 구분 필요 |
| **사용처** | 웹, Unix | Windows, Java |

### 용량 비교

```
영어 위주 문서 "Hello World":
  UTF-8:  11 bytes
  UTF-16: 22 bytes
  → UTF-8 승리!

한글 위주 문서 "안녕하세요":
  UTF-8:  15 bytes (5×3)
  UTF-16: 10 bytes (5×2)
  → UTF-16 승리!

혼합 문서 "Hello 안녕":
  UTF-8:  11 bytes (5 + 6)
  UTF-16: 14 bytes (7×2)
  → 비슷함
```

## 실용 가이드

### Windows API

```c
// UTF-16 (Wide Character)
wchar_t str[] = L"안녕";
wprintf(L"%s\n", str);

// UTF-8 변환
WideCharToMultiByte(CP_UTF8, ...);
MultiByteToWideChar(CP_UTF8, ...);
```

### Java

```java
// Java String은 내부적으로 UTF-16
String str = "안녕";

// UTF-8로 변환
byte[] utf8 = str.getBytes(StandardCharsets.UTF_8);

// UTF-16 바이트 얻기
byte[] utf16 = str.getBytes(StandardCharsets.UTF_16);
```

### Python

```python
text = "Hello안녕"

# UTF-16 인코딩 (BOM 포함)
utf16 = text.encode('utf-16')
print(utf16.hex())  # 'fffe480065006c006c006f00...'

# UTF-16 LE (BOM 없음)
utf16le = text.encode('utf-16-le')

# UTF-16 BE (BOM 없음)
utf16be = text.encode('utf-16-be')
```

### Node.js

```javascript
const text = "Hello안녕";

// Node.js Buffer는 UTF-16 지원
const buf = Buffer.from(text, 'utf16le');
console.log(buf);

// 다시 문자열로
const decoded = buf.toString('utf16le');
```

## 플랫폼별 사용

| 플랫폼 | 내부 인코딩 | 파일 인코딩 |
|--------|------------|------------|
| **Windows** | UTF-16 LE | UTF-8 (권장) |
| **Java** | UTF-16 | UTF-8 (권장) |
| **JavaScript** | UTF-16 | UTF-8 (권장) |
| **.NET** | UTF-16 | UTF-8 (권장) |
| **Linux** | UTF-8 | UTF-8 |
| **macOS** | UTF-8 | UTF-8 |

**패턴:**
- 내부 처리: UTF-16 (Windows/Java 생태계)
- 파일/네트워크: UTF-8 (호환성)

## 역사

| 시기 | 내용 |
|------|------|
| **1996** | UTF-16 표준화 (RFC 2781) |
| **1998** | Windows NT 4.0부터 UTF-16 사용 |
| **1995** | Java 1.0부터 UTF-16 사용 |
| **2000년대** | 웹에서 UTF-8에 밀림 |
| **현재** | 내부 처리용으로만 사용 |

## 주의사항

### 1. 파일로 저장 금지

```
❌ 파일: UTF-16
✅ 파일: UTF-8

이유:
- 크기 비효율
- Endianness 문제
- 도구 호환성
```

### 2. BOM 필수

```python
# ❌ 잘못됨: BOM 없음
with open('file.txt', 'w', encoding='utf-16-le') as f:
    f.write(text)

# ✅ 올바름: BOM 포함
with open('file.txt', 'w', encoding='utf-16') as f:
    f.write(text)
```

### 3. Surrogate 쌍 주의

```javascript
const emoji = '😀';
console.log(emoji.length);  // 2 (!) - surrogate pair

// 올바른 문자 수
console.log([...emoji].length);  // 1
```

## Relations

- implements [[Unicode]] (Unicode를 바이트로 인코딩)
- similar_to [[UTF-8]] (다른 UTF 방식)
- similar_to [[UTF-32]] (다른 UTF 방식)
- used_by [[Endianness]] (Big/Little Endian 구분 필요)
- uses [[BOM (Byte Order Mark)]] (BOM 필수)
- part_of [[Character Encoding]] (문자 인코딩 방식)
- relates_to [[ASCII]] (ASCII 비호환)
- uses [[Bit]] (16비트 단위 처리)
- uses [[Byte]] (2~4바이트 가변 길이)

## 핵심 요약

UTF-16은 "Windows/Java의 내부 인코딩"입니다. 한글/한자에는 효율적이지만, ASCII 비호환, Endianness 복잡성 때문에 파일 저장용으로는 UTF-8에 밀렸습니다. **내부 처리는 UTF-16, 파일 저장은 UTF-8**이 일반적 패턴입니다.