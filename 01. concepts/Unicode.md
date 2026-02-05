---
title: Unicode
type: note
permalink: knowledge/concepts/unicode
tags:
- unicode
- character-encoding
- utf
- code-point
difficulty: intermediate
---

# Unicode

## 정의

**Unicode**는 전 세계 모든 문자에 고유한 번호를 부여한 국제 표준입니다.

## 목적

```
문제:
각 나라마다 다른 인코딩 사용
- 한국: CP949
- 일본: Shift-JIS
- 중국: GB2312
→ 다국어 문서 교환 불가능!

해결:
Unicode → 모든 문자에 하나의 고유 번호
```

## 코드 포인트 (Code Point)

Unicode는 각 문자에 `U+XXXX` 형식의 번호를 부여합니다.

### 예시

| 문자 | 코드 포인트 | 10진수 값 |
|------|------------|----------|
| A | U+0041 | 65 |
| a | U+0061 | 97 |
| 가 | U+AC00 | 44,032 |
| 한 | U+D55C | 54,620 |
| 😀 | U+1F600 | 128,512 |
| 🎉 | U+1F389 | 127,881 |

## 범위

| 영역 | 범위 | 설명 |
|------|------|------|
| **Basic Latin** | U+0000 ~ U+007F | ASCII 영역 (영어) |
| **Latin-1 Supplement** | U+0080 ~ U+00FF | 유럽 문자 (é, ñ 등) |
| **한글 음절** | U+AC00 ~ U+D7AF | 한글 11,172자 |
| **CJK Unified** | U+4E00 ~ U+9FFF | 한중일 한자 |
| **Emoji** | U+1F300 ~ U+1F9FF | 이모지 |
| **Private Use** | U+E000 ~ U+F8FF | 사용자 정의 영역 |

전체 범위: U+0000 ~ U+10FFFF (약 114만 개)

## Unicode ≠ 인코딩

**중요:** Unicode는 "번호 매기기 체계"일 뿐, 실제 저장 방법이 아닙니다!

```
Unicode: '가' = U+AC00 (번호만 정의)
         ↓
UTF-8:   EA B0 80 (3바이트로 저장)
UTF-16:  AC 00 (2바이트로 저장)
UTF-32:  00 00 AC 00 (4바이트로 저장)
```

## 인코딩 방식

Unicode를 실제 바이트로 변환하는 방법:

- UTF-8 - 1~4바이트 가변 길이
- UTF-16 - 2 또는 4바이트
- UTF-32 - 항상 4바이트

→ 자세한 내용은 각 인코딩 문서 참조

## 역사

| 시기 | 내용 |
|------|------|
| **1991** | Unicode 1.0 발표 (초기 65,536자) |
| **1996** | UTF-8 등장 (RFC 2279) |
| **2000년대** | 웹 표준으로 채택 |
| **2010** | 이모지 추가 (U+1F300~) |
| **현재** | Unicode 15.1 (약 149,000자) |

## Unicode의 장점

- ✅ 모든 언어를 하나의 문서에 작성 가능
- ✅ 글로벌 소프트웨어 개발 용이
- ✅ 검색/정렬 알고리즘 단순화
- ✅ 문자 깨짐 문제 해결

## 한계

- ❌ 메모리 사용량 증가 (영어도 1바이트 이상)
- ❌ 레거시 시스템과 호환 문제
- ❌ 모든 폰트가 모든 문자 지원 X
- ❌ 정규화 문제 (같은 글자, 다른 코드)

## 정규화 (Normalization)

같은 문자를 다르게 표현할 수 있는 문제:

```
'각' 표현 방법:
1. U+AC01 (완성형 한글)
2. U+1100 U+1161 U+11A8 (초성+중성+종성)

→ 눈으로는 같지만 비교하면 다름!
→ NFC/NFD 정규화로 해결
```

## Relations

- implements [[UTF-8]] (UTF-8로 인코딩)
- implements [[UTF-16]] (UTF-16으로 인코딩)
- implements [[UTF-32]] (UTF-32로 인코딩)
- part_of [[Character Encoding]] (문자 인코딩 체계)
- extends [[ASCII]] (ASCII를 완전히 포함)

## 실용 예시

### Python
```python
ord('가')  # 44032 (코드 포인트 10진수)
hex(ord('가'))  # '0xac00'
chr(0xAC00)  # '가'
```

### JavaScript
```javascript
'가'.charCodeAt(0)  // 44032
String.fromCharCode(0xAC00)  // '가'
'\u{1F600}'  // '😀'
```

## 핵심 요약

Unicode는 "전 세계 문자 번호표"입니다. 실제 파일에 저장하려면 UTF-8, UTF-16, UTF-32 같은 인코딩 방식이 필요합니다. "Unicode로 저장한다"는 표현은 부정확하며, 정확히는 "UTF-8로 저장한다" 같이 말해야 합니다.