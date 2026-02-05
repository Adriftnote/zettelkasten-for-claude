---
title: UTF-8
type: concept
permalink: knowledge/concepts/utf-8
tags:
- utf-8
- encoding
- unicode
- character-encoding
- web-standard
difficulty: intermediate
---

# UTF-8

## 정의

**UTF-8 (8-bit Unicode Transformation Format)**은 Unicode 문자를 1~4바이트(Byte)로 인코딩하는 가변 길이 방식입니다.

현재 **웹과 유닉스/리눅스의 사실상 표준** 인코딩입니다.

## 숫자의 의미

**UTF-8**의 "8"은 **8비트 (1바이트) 단위**로 처리한다는 뜻입니다.

```
8 bits = 1 byte (기본 처리 단위)
```

## 인코딩 방식

문자에 따라 1~4바이트 사용:

| 범위 (Unicode) | 바이트 수 | 예시 문자 |
|---------------|----------|----------|
| U+0000 ~ U+007F | 1 byte | 영어, 숫자 (A, 1) |
| U+0080 ~ U+07FF | 2 bytes | 유럽 문자 (é, ñ) |
| U+0800 ~ U+FFFF | 3 bytes | 한글, 한자 (가, 中) |
| U+10000 ~ U+10FFFF | 4 bytes | 이모지 (😀, 🎉) |

## 실제 예시

### 영어 'A'
```
Unicode: U+0041 (65)
UTF-8:   01000001 (1 byte)
16진수:  0x41
```

### 한글 '가'
```
Unicode: U+AC00 (44032)
UTF-8:   11101010 10110000 10000000 (3 bytes)
16진수:  0xEA 0xB0 0x80
```

### 이모지 '😀'
```
Unicode: U+1F600 (128512)
UTF-8:   11110000 10011111 10011000 10000000 (4 bytes)
16진수:  0xF0 0x9F 0x98 0x80
```

### 문장: "Hello 안녕"
```
H: 1 byte
e: 1 byte
l: 1 byte
l: 1 byte
o: 1 byte
안: 3 bytes
녕: 3 bytes

총합: 11 bytes
```

## 인코딩 규칙

### 비트 패턴

| 바이트 수 | 비트 패턴 |
|----------|----------|
| 1 byte | `0xxxxxxx` |
| 2 bytes | `110xxxxx 10xxxxxx` |
| 3 bytes | `1110xxxx 10xxxxxx 10xxxxxx` |
| 4 bytes | `11110xxx 10xxxxxx 10xxxxxx 10xxxxxx` |

**특징:**
- 첫 바이트: `0` 또는 `110~`, `1110~`, `11110~`로 시작
- 이어지는 바이트: 모두 `10`으로 시작

## 다른 인코딩과 비교

| 특성 | ASCII | CP949 | **UTF-8** | UTF-16 | UTF-32 |
|------|-------|-------|-------|--------|--------|
| **영어 (1문자)** | 1B | 1B | **1B** | 2B | 4B |
| **한글 (1문자)** | ❌ | 2B | **3B** | 2B | 4B |
| **이모지 (1문자)** | ❌ | ❌ | **4B** | 4B | 4B |
| **ASCII 호환** | - | ✅ | **✅** | ❌ | ❌ |
| **다국어** | ❌ | ❌ | **✅** | ✅ | ✅ |
| **고정 길이** | ✅ | ❌ | **❌** | ❌ | ✅ |
| **BOM 필요** | - | - | **❌** | ✅ | ✅ |
| **용도** | 레거시 | 한국 전용 | **웹/Unix** | Windows | 알고리즘 |

## 장점

### 1. ASCII 호환
```
ASCII (7-bit):
  'A' = 0x41

UTF-8:
  'A' = 0x41 (동일!)

→ 기존 ASCII 파일은 그대로 UTF-8 파일
```

### 2. 공간 효율 (영어권)
```
영어 문서:
  UTF-8:  1 byte/문자
  UTF-16: 2 bytes/문자
  UTF-32: 4 bytes/문자

→ UTF-8이 가장 작음!
```

### 3. Endianness 문제 없음
```
UTF-16/32: Big Endian vs Little Endian 구분 필요
UTF-8: 바이트 순서가 고정됨

→ BOM 불필요!
```

### 4. 오류 복구
```
중간에 바이트가 손상되어도:
- 다음 0xxxxxxx 또는 110xxxxx 찾으면 복구 가능
- UTF-16/32는 전체 망가짐
```

### 5. 자기 동기화
```
파일 중간부터 읽어도:
- 비트 패턴으로 문자 경계 자동 감지
- 금방 올바른 위치로 동기화
```

## 단점

### 1. 한글/한자 비효율
```
'가' (U+AC00):
  UTF-8:  3 bytes
  UTF-16: 2 bytes
  
→ 한국/중국/일본 문서는 UTF-16이 더 작음
```

### 2. 랜덤 접근 불가
```
UTF-8: 가변 길이 → n번째 문자 위치 알 수 없음
UTF-32: 고정 길이 → n×4 바이트로 즉시 접근

→ 문자열 인덱싱이 느림
```

### 3. 문자열 길이 계산 복잡
```
"Hello안녕" = 7문자

바이트 수: 11 bytes
문자 수: 처음부터 세어야 알 수 있음
```

## BOM (Byte Order Mark)

UTF-8은 BOM이 **선택 사항**입니다:

| BOM 유무 | 바이트 | 사용 |
|---------|--------|------|
| **BOM 없음** | - | 권장 (웹, 유닉스) |
| **BOM 있음** | `EF BB BF` | Windows 일부 프로그램 |

**문제:**
- 웹: BOM이 있으면 파싱 에러
- 유닉스: 스크립트 실행 실패
- Windows: PowerShell 5.x는 BOM 필수

→ 자세한 내용은 BOM (Byte Order Mark) 참조

## 역사

| 시기 | 내용 |
|------|------|
| **1992** | Ken Thompson, Rob Pike가 설계 |
| **1993** | ISO 10646 표준에 추가 |
| **1996** | RFC 2279로 공식 표준화 |
| **2000년대** | 웹 표준으로 채택 |
| **2008** | 웹 트래픽의 50% 돌파 |
| **현재** | 웹의 98% 이상이 UTF-8 사용 |

## 다른 UTF와 비교

| 특성           | UTF-8    | UTF-16        | UTF-32  |
| ------------ | -------- | ------------- | ------- |
| **바이트/문자**   | 1~4 (가변) | 2~4 (가변)      | 4 (고정)  |
| **영어**       | 1 byte   | 2 bytes       | 4 bytes |
| **한글**       | 3 bytes  | 2 bytes       | 4 bytes |
| **ASCII 호환** | ✅ 완전     | ❌ 없음          | ❌ 없음    |
| **BOM 필요**   | ❌ 선택     | ✅ 필수          | ✅ 필수    |
| **랜덤 접근**    | ❌ 느림     | ❌ 느림          | ✅ 빠름    |
| **사용처**      | 웹, 유닉스   | Windows, Java | 내부 처리   |

## 실용 가이드

### 사용 권장

| 상황 | UTF-8 사용? |
|------|-----------|
| **웹사이트** | ✅ 필수 |
| **API (JSON, XML)** | ✅ 권장 |
| **리눅스/맥 파일** | ✅ 기본값 |
| **크로스 플랫폼** | ✅ 권장 |
| **이메일** | ✅ 표준 |

### 사용 주의

| 상황 | 이유 |
|------|------|
| **내부 문자열 처리** | 인덱싱 느림 → UTF-32 고려 |
| **한중일 전용 문서** | UTF-16이 더 작을 수 있음 |
| **Windows 레거시** | BOM 필요할 수 있음 |

## 프로그래밍 예시

### Python
```python
text = "Hello안녕"
encoded = text.encode('utf-8')
print(encoded)  # b'Hello\xec\x95\x88\xeb\x85\x95'
print(len(encoded))  # 11 bytes

decoded = encoded.decode('utf-8')
print(decoded)  # Hello안녕
```

### JavaScript
```javascript
const text = "Hello안녕";
const encoded = new TextEncoder().encode(text);
console.log(encoded.length);  // 11 bytes

const decoded = new TextDecoder().decode(encoded);
console.log(decoded);  // Hello안녕
```

### HTML
```html
<meta charset="UTF-8">
```

## Relations

- implements [[Unicode]] (Unicode를 바이트로 인코딩)
- similar_to [[UTF-16]] (다른 UTF 방식)
- similar_to [[UTF-32]] (다른 UTF 방식)
- extends [[ASCII]] (ASCII와 완전 호환)
- uses [[BOM (Byte Order Mark)]] (선택적으로 BOM 사용)
- part_of [[Character Encoding]] (문자 인코딩 방식)
- relates_to [[Endianness]] (Endianness 문제 없음)
- uses [[Bit]] (8비트 단위 처리)
- uses [[Byte]] (1~4바이트 가변 길이)

## 핵심 요약

UTF-8은 "전 세계 웹의 표준 인코딩"입니다. ASCII 호환, 공간 효율, Endianness 문제 없음 등의 장점으로 압도적 1위를 차지했습니다. 한글은 3바이트로 비효율적이지만, 범용성과 호환성 때문에 여전히 최선의 선택입니다.