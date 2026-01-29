---
title: 문자 인코딩 시스템
type: hub
tags:
- hub
- encoding
- unicode
- utf-8
- character-set
- zettelkasten
- basic-memory
permalink: hubs/encoding-systems-1
---

# 문자 인코딩 시스템 (Encoding Systems)

컴퓨터는 **숫자**만 안다. 문자를 저장하려면 "A=65" 같은 **매핑 규칙**이 필요하다. 이것이 **인코딩**이다.

## Observations

- [insight] UTF-8이 웹의 표준이 된 이유: 영어는 1바이트, 다른 언어는 필요할 때만 더 쓴다 #encoding #utf8
- [insight] ASCII는 영어만 생각한 시대의 산물 (7비트, 128자) #ascii #history
- [insight] Unicode는 전세계 문자를 하나의 번호 체계로 해결 - 정의만 제공 #unicode
- [insight] UTF-8, UTF-16, UTF-32는 Unicode를 저장하는 방식의 차이 - 구현의 차이 #encoding
- [path] 기초: Bit(정보 최소 단위) → Byte(데이터 기본 단위) #learning
- [path] 역사: ASCII(영문 전용) → Unicode(전세계 통합) #learning
- [path] 구현: UTF-8(웹 표준) → UTF-16(Windows/Java) → UTF-32(고정 길이) #learning
- [path] 세부: BOM(파일 마커) → Endianness(바이트 순서) #learning

## Relations

- organizes [[Character Encoding]] (1. 문자↔숫자 매핑의 총칭, 시작점)
  - part_of [[Bit]] (1a. 0 또는 1, 정보의 최소 단위)
  - part_of [[Byte]] (1b. 8비트, 데이터의 기본 단위)
- organizes [[ASCII]] (2. 7비트 영문 전용, 첫 번째 표준)
  - extends [[CP949]] (2a. 한글 전용, ASCII 확장 레거시)
- organizes [[Unicode]] (3. 전세계 문자 통합 번호 체계, 개념/정의)
  - extends [[UTF-8]] (3a. 가변 길이 1~4바이트, 웹 표준)
    - part_of [[BOM (Byte Order Mark)|BOM]] (3a1. 인코딩 식별 마커)
  - extends [[UTF-16]] (3b. 2 또는 4바이트, Windows/Java 내부)
  - extends [[UTF-32]] (3c. 고정 4바이트, 단순하지만 비효율)
- organizes [[Endianness]] (4. Big Endian vs Little Endian, 바이트 저장 순서)
- explains [[Character Encoding - BOM, UTF, and History]] (왜 8비트? 왜 PowerShell만?)
- connects_to [[web-fundamentals]] (웹은 UTF-8이 표준)
- connects_to [[programming-basics]] (소스 코드 파일도 인코딩 필요)
- connects_to [[memory-systems]] (메모리에 문자 저장 방식)

---

## 핵심 비교표

| 인코딩 | 크기 | 장점 | 단점 | 사용처 |
|--------|------|------|------|--------|
| [[ASCII]] | 1바이트 | 단순 | 영어만 | 레거시 |
| [[UTF-8]] | 1~4바이트 | ASCII 호환, 효율적 | 가변 길이 | **웹 표준** |
| [[UTF-16]] | 2~4바이트 | 대부분 2바이트 | ASCII 비호환 | Windows, Java |
| [[UTF-32]] | 4바이트 | 고정 길이 | 비효율 | 내부 처리 |

---

## 개념 관계도

```
[Bit] × 8 = [Byte]  ← [index:1a, 1b]
              │
        ┌─────┴─────┐
        │           │
    [ASCII]    [Unicode] ─── 코드 포인트 (번호 체계)
    [index:2]   [index:3]
                    │
         ┌──────────┼──────────┐
         │          │          │
     [UTF-8]   [UTF-16]   [UTF-32]
   [3a]        [3b]       [3c]
     │
   [BOM]
  [3a1]
```