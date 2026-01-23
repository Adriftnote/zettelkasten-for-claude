---
title: ASCII
type: note
permalink: knowledge/concepts/ascii
tags:
- ascii
- character-encoding
- text
- legacy
- utf-8
difficulty: beginner
---

# ASCII

## 정의

**ASCII (American Standard Code for Information Interchange)**는 1963년에 제정된 문자 인코딩 표준으로, 7[[Bit]]로 영어 알파벳과 기본 기호를 표현합니다.

## 특징

```
7 bits = 2^7 = 128가지

범위: 0 ~ 127 (10진수)
      0x00 ~ 0x7F (16진수)
```

## 문자표

### 제어 문자 (0~31)

| 코드 | 이름 | 의미 |
|------|------|------|
| 0 | NUL | Null (문자열 끝) |
| 9 | TAB | 탭 |
| 10 | LF | Line Feed (줄바꿈, Unix) |
| 13 | CR | Carriage Return (줄바꿈, Mac) |
| 27 | ESC | Escape |

### 출력 가능 문자 (32~126)

| 범위 | 문자 | 예시 |
|------|------|------|
| 32 | 공백 | ` ` |
| 33~47 | 기호 | `! " # $ % & ' ( ) * + , - . /` |
| 48~57 | 숫자 | `0 1 2 3 4 5 6 7 8 9` |
| 58~64 | 기호 | `: ; < = > ? @` |
| 65~90 | 대문자 | `A B C ... X Y Z` |
| 91~96 | 기호 | `[ \ ] ^ _ `` ` |
| 97~122 | 소문자 | `a b c ... x y z` |
| 123~126 | 기호 | `{ | } ~` |
| 127 | DEL | Delete |

## 주요 문자 코드

| 문자 | 10진수 | 16진수 | 2진수 |
|------|--------|--------|-------|
| 공백 | 32 | 0x20 | 0010 0000 |
| 0 | 48 | 0x30 | 0011 0000 |
| A | 65 | 0x41 | 0100 0001 |
| a | 97 | 0x61 | 0110 0001 |

**패턴:**
- 대문자 + 32 = 소문자 (A:65 → a:97)
- 숫자 문자 - 48 = 숫자 값 ('5':53 → 5)

## 줄바꿈 (Newline)

운영체제마다 다름:

| OS | 줄바꿈 | 바이트 | ASCII 코드 |
|-----|--------|--------|-----------|
| **Unix/Linux/macOS** | LF | `\n` | 10 (0x0A) |
| **Windows** | CR+LF | `\r\n` | 13, 10 (0x0D 0x0A) |
| **구형 Mac (OS 9)** | CR | `\r` | 13 (0x0D) |

### 문제 예시

```
Windows에서 작성:
"Hello\r\nWorld"

Unix에서 열면:
"Hello^M
World"  ← ^M이 보임!
```

## 한계

### 1. 영어만 지원

```
✅ 가능: A, a, 1, !, @
❌ 불가능: 가, 中, é, ñ, 😀
```

### 2. 7비트 = 1바이트 낭비

```
1 Byte = 8 bits
ASCII = 7 bits (최상위 비트 미사용)

→ 128~255 범위를 활용 못함
```

## 확장 ASCII (Extended ASCII)

8[[Bit]]를 모두 사용해 128~255 추가:

| 인코딩 | 범위 | 추가 문자 |
|--------|------|----------|
| **ISO-8859-1** (Latin-1) | 128~255 | 유럽 문자 (é, ñ, ü) |
| **CP437** | 128~255 | DOS 그래픽 문자 (░, ▒, █) |
| **Windows-1252** | 128~255 | Windows 유럽 문자 |

**문제:**
- 확장 범위가 표준 아님 (호환성 문제)
- 한글/한자는 여전히 불가능

## Unicode와의 관계

[[Unicode]]는 ASCII를 **완전히 포함**합니다:

```
ASCII:   'A' = 65
Unicode: 'A' = U+0041 (65)

→ 호환 가능!
```

[[UTF-8]]은 ASCII와 **1:1 호환**:

```
ASCII:   'A' = 0x41 (1 byte)
UTF-8:   'A' = 0x41 (1 byte)

→ ASCII 파일은 그대로 UTF-8 파일!
```

**이것이 UTF-8의 최대 장점:**
```
기존 ASCII 텍스트 파일
    ↓
인코딩 변환 없이 그대로 UTF-8
    ↓
한글/이모지 추가 가능!
```

## 실용 예시

### Python
```python
ord('A')      # 65
chr(65)       # 'A'
hex(ord('A')) # '0x41'

# ASCII 범위 확인
def is_ascii(char):
    return ord(char) < 128

is_ascii('A')  # True
is_ascii('가') # False
```

### C
```c
char c = 'A';
printf("%d\n", c);  // 65

// 대소문자 변환 (ASCII 트릭)
char lower = 'A' + 32;  // 'a'
char upper = 'a' - 32;  // 'A'
```

### JavaScript
```javascript
'A'.charCodeAt(0)      // 65
String.fromCharCode(65) // 'A'

// ASCII 문자만 필터
text.replace(/[^\x00-\x7F]/g, '');
```

## ASCII Art

ASCII 문자로 그림 그리기:

```
  /\_/\  
 ( o.o ) 
  > ^ <
```

**활용:**
- 구형 터미널
- 이메일 서명
- 프로그램 로고

## 역사

| 시기 | 내용 |
|------|------|
| **1963** | ASCII 최초 표준화 (ASA X3.4) |
| **1967** | 소문자 추가 (초기엔 대문자만) |
| **1986** | ISO 표준 (ISO 646) |
| **1991** | [[Unicode]] 등장 (ASCII 포함) |
| **현재** | 레거시 시스템에만 사용 |

## ASCII vs UTF-8 비교

| 특성 | ASCII | UTF-8 |
|------|-------|-------|
| **비트** | 7 bits | 8~32 bits |
| **문자 수** | 128개 | 140만+ 개 |
| **영어** | 1 byte | 1 byte (동일!) |
| **한글** | ❌ 불가능 | 3 bytes |
| **호환성** | UTF-8과 호환 | ASCII 완전 포함 |
| **용도** | 레거시 | 현대 표준 |

## 주의사항

### 1. 인코딩 명시

```python
# 잘못된 가정
with open('file.txt') as f:  # 시스템 인코딩 (불확실)
    text = f.read()

# 올바른 방법
with open('file.txt', encoding='utf-8') as f:
    text = f.read()
```

### 2. ASCII 범위 확인

```python
# 안전하지 않음
if ord(char) < 128:  # ASCII 범위
    ...

# 더 안전함
if char.isascii():  # Python 3.7+
    ...
```

### 3. 바이너리 vs 텍스트

```python
# ASCII도 텍스트 모드 사용
with open('file.txt', 'r', encoding='ascii') as f:
    text = f.read()

# 바이너리로 열 필요 없음
```

## Relations

- part_of [[Character Encoding]]
- part_of [[Unicode]]
- implements [[UTF-8]]
- part_of [[Bit]]
- part_of [[Byte]]

## 핵심 요약

ASCII는 "컴퓨터 문자의 시작"입니다. 7비트로 영어만 표현했지만, [[UTF-8]]에 완전히 포함되어 여전히 살아있습니다. **ASCII 텍스트 = UTF-8 텍스트** 이므로, UTF-8을 쓰면 자동으로 ASCII 호환입니다.