---
title: Character Encoding - BOM, UTF, and History
type: note
tags:
- encoding
- utf
- bom
- history
- derived
permalink: notes/character-encoding-bom-utf-and-history
source_facts:
- BOM 개념
- UTF 인코딩 방식
- 8비트 바이트 역사
- PowerShell 인코딩 문제
---

# Character Encoding - BOM, UTF, and History

문자 인코딩의 핵심: **기술 표준은 "기술적 완벽함"보다 "역사적 우연 + 시장 지배력 + 적당한 실용성"으로 결정된다.**

## 도출 근거

다음 facts의 조합에서 도출됨:

1. **8비트 바이트는 IBM System/360(1964)이 시장 장악하면서 표준화됨** - 기술적 최적이 아닌 시장 지배력
2. **10비트(10진수 직접 표현), 12비트(약수 많음)도 장점이 있었다** - 하지만 2의 제곱 아니라 실패
3. **UTF-8은 BOM이 불필요하지만 PowerShell 5.x에서는 필요하다** - Windows 하위호환성(CP949) 때문
4. **PowerShell 7+는 기본 UTF-8로 문제 해결** - 시대가 바뀌면 표준도 변화

→ 따라서: **"적당히 좋고 + IBM이 밀어서 + 확장성 좋아서"** 8비트가 이겼다
→ 핵심 교훈: 기술 표준 = 역사적 우연 + 시장 지배력 + 실용성

## Observations

- [fact] BOM은 파일 앞 3바이트(EF BB BF)로 인코딩을 알려주는 마커다 #bom
- [fact] 1 byte = 8 bits, 이건 IBM System/360(1964)이 시장 장악하면서 표준화됨 #history
- [fact] UTF 뒤 숫자(8/16/32)는 데이터를 쪼개는 비트 단위를 의미한다 #utf
- [fact] UTF-8은 바이트 순서가 고정이라 BOM 불필요, UTF-16/32는 Endian 구분 위해 BOM 필수 #encoding
- [fact] PowerShell 5.x BOM 문제는 Windows 하위호환성(CP949) 때문에 발생 #powershell
- [fact] PowerShell 7+는 기본 UTF-8이라 BOM 문제 없음 #powershell
- [decision] IBM이 8비트 채택 → 시장 80% 장악 → 산업 표준 #history
- [decision] 10비트/12비트는 2의 제곱이 아니라 탈락 #history
- [example] 'A'=65=01000001(8비트), '가'=U+AC00=EA B0 80(UTF-8 3바이트) #encoding
- [example] "Hello 안녕": UTF-8=11바이트, UTF-16=14바이트, UTF-32=28바이트 #comparison
- [method] Unix/Linux 환경에서는 BOM 절대 안 씀 (Shebang 인식 오류) #best-practice
- [reference] powershell-korean-encoding-fix - 이 노트의 시작점 #source

---

## 상세 내용

### [[BOM (Byte Order Mark)]]

### 개념

**BOM**은 파일의 맨 앞에 추가되는 특수한 바이트 시퀀스로, 텍스트 파일의 인코딩을 프로그램에게 알려주는 "마커(표지판)" 역할을 합니다.

**UTF-8 BOM:**
- 바이트 값: `EF BB BF` (3바이트)
- 역할: "이 파일은 UTF-8로 인코딩되어 있습니다"
- 효과: PowerShell 5.x가 UTF-8 문자를 CP949로 잘못 해석하는 것을 방지

### BOM의 단점 (일반적으로 안 쓰는 이유)

| 문제 | 설명 | 예시 |
|------|------|------|
| **Unix/Linux 스크립트 실행 오류** | Shebang(`#!/bin/bash`)를 인식 못함 | `bash: bad interpreter` |
| **파일 합치기 시 오류** | 중간에 BOM이 끼어서 이상한 문자 출력 | JavaScript 번들링 시 파싱 에러 |
| **웹 표준 문제** | JSON/HTML 파싱 에러 발생 가능 | HTTP 헤더 전에 BOM 전송됨 |
| **Git diff 복잡** | 보이지 않는 BOM 때문에 차이 발생 | 실제 변경 없어도 diff 표시 |

### BOM 사용 여부

| 상황 | BOM 사용? |
|------|----------|
| **일반적인 경우** | ❌ 안 씀 (호환성 문제) |
| **PowerShell 5.x 스크립트** | ✅ 써야 함 (버그 회피) |
| **Windows 전용 .txt 파일** | 선택 사항 |
| **웹/Unix 환경** | ❌ 절대 안 씀 |

---

## UTF (Unicode Transformation Format)

→ 자세한 내용: [[Unicode]], [[UTF-8]], [[UTF-16]], [[UTF-32]]

### Unicode란?

전 세계 모든 문자에 고유 번호를 부여한 표준:

```
'A' = U+0041 (65번)
'가' = U+AC00 (44032번)
'😀' = U+1F600 (128512번)
```

### UTF는 이 번호를 바이트로 변환하는 방법

| 방식 | 숫자 의미 | 한 문자당 바이트 | 예: '가' (U+AC00) |
|------|----------|-----------------|------------------|
| **UTF-32** | 32bit = 4바이트 단위 | 항상 4바이트 | `00 00 AC 00` |
| **UTF-16** | 16bit = 2바이트 단위 | 2 또는 4바이트 | `AC 00` |
| **UTF-8** | 8bit = 1바이트 단위 | 1~4바이트 | `EA B0 80` |

**숫자의 의미:**
- UTF-**8**: 8bit (1바이트) 블록으로 쪼개서 저장
- UTF-**16**: 16bit (2바이트) 블록으로 저장
- UTF-**32**: 32bit (4바이트) 블록으로 저장

### 용량 비교: "Hello 안녕" 저장

```
UTF-8:
  H e l l o = 5바이트 (각 1바이트)
  안녕      = 6바이트 (각 3바이트)
  합계: 11바이트

UTF-16:
  H e l l o = 10바이트 (각 2바이트)
  안녕      = 4바이트 (각 2바이트)
  합계: 14바이트

UTF-32:
  H e l l o = 20바이트 (각 4바이트)
  안녕      = 8바이트 (각 4바이트)
  합계: 28바이트
```

---

## Bit와 Byte

→ 자세한 내용: [[Bit]], [[Byte]]

### 기본 관계

```
1 byte (바이트) = 8 bits (비트)
```

### Bit (비트)

컴퓨터의 가장 작은 단위 - 0 또는 1 하나

```
1 bit = 0 또는 1
```

### Byte (바이트)

비트 8개를 묶은 것 - 실제로 사용하는 최소 단위

```
1 byte = 8 bits

예: 문자 'A' = 65 = 01000001 (8자리 2진수)
```

### 크기 비교

```
8 bits  = 1 byte
16 bits = 2 bytes
32 bits = 4 bytes

1 KB = 1,024 bytes
1 MB = 1,024 KB
1 GB = 1,024 MB
```

---

## 왜 8비트가 표준이 되었나?

### 초기 컴퓨터 (1950~1960년대)

바이트 크기가 제각각이었습니다:

```
6 bits = 1 byte (일부 IBM)
7 bits = 1 byte (일부 초기 시스템)
8 bits = 1 byte (IBM System/360)
9 bits = 1 byte (일부 PDP)
```

### 8비트 승리 이유

#### 1. IBM System/360 (1964년)의 영향

```
IBM이 8비트 바이트 채택
    ↓
IBM이 시장 장악 (80% 점유율)
    ↓
다른 회사들도 따라함
    ↓
8비트 = 산업 표준
```

#### 2. 8이 좋은 이유

| 이유 | 설명 |
|------|------|
| **영어 알파벳 저장** | 2^8 = 256가지 (대소문자 + 숫자 + 기호 + 확장 문자) |
| **2의 제곱수** | 8 = 2^3 → 컴퓨터 계산 쉬움, 메모리 주소 계산 간편 |
| **확장 가능** | 8 → 16 → 32 → 64 (모두 2의 제곱) |
| **골디락스** | 너무 작지도(6비트), 크지도(12비트) 않음 |

#### 3. 왜 7비트는 안 됐나?

```
ASCII = 7 bits = 128가지
    ↓
영어는 가능하지만...
    ↓
다른 나라 언어? (독일어 ü, ö)
그래픽 문자?
한글/한자?
    ↓
7비트로는 부족!
    ↓
8비트로 확장 (256가지)
```

### 10비트/12비트 대안 논쟁

#### 10비트 주장

**장점:**
- 10진수를 직접 표현 가능 (BCD - Binary Coded Decimal)
- 재무/회계 시스템에 유리
- 은행 시스템에서 소수점 오차 방지

**단점:**
```
❌ 2의 제곱 아님 (10 ≠ 2^n) → 하드웨어 설계 복잡
❌ 메모리 낭비 (1024 중 1000만 사용)
❌ 범용성 부족 (과학 계산 비효율)
```

#### 12비트 주장

**장점:**
- 약수가 많음: 1, 2, 3, 4, 6, 12 (6개)
- 나누기 연산 유연 (12÷3=4, 12÷4=3)
- PDP-8 컴퓨터(1965)에서 사용

**단점:**
```
❌ 너무 큼 (영어 알파벳에는 과함)
❌ 확장성 나쁨 (12 → 24 → 48 → 96, 어중간)
❌ 메모리 설계 복잡 (1.5 bytes??)
```

### 결론

| 주장 | 장점 | 단점 | 결과 |
|------|------|------|------|
| **10비트** | 10진수 직접 표현 | 2의 제곱 아님, 비효율 | ❌ 실패 |
| **12비트** | 약수 많음, 유연함 | 확장성 나쁨, 복잡 | ❌ 실패 |
| **8비트** | 2의 제곱, 확장 쉬움 | 10진수 비효율 | ✅ 승리 |

8비트는 "기술적으로 완벽"해서가 아니라 **"적당히 좋고 + IBM이 밀어서 + 확장성 좋아서"** 이긴 것입니다.

---

## Big Endian vs Little Endian

→ 자세한 내용: [[Endianness]]

### 개념

"바이트를 어느 순서로 쓸까?" 문제

### 예시: 숫자 44032 (0xAC00) 저장

```
Big Endian (큰 것부터):
   [AC] [00]
    ↑    ↑
   먼저  나중

Little Endian (작은 것부터):
   [00] [AC]
    ↑    ↑
   먼저  나중
```

### UTF-16에서 BOM이 필요한 이유

```
'가' = U+AC00

Big Endian UTF-16:    AC 00
Little Endian UTF-16: 00 AC

→ 똑같은 파일인데 읽는 순서에 따라 다른 문자!
→ BOM으로 구분 필요!
```

### UTF-8은 왜 BOM이 불필요한가?

```
UTF-8은 1바이트씩 순서가 정해져 있음:
'가' = EA B0 80 (항상 이 순서)

→ Big/Little Endian 구분 불필요!
```

| 인코딩 | BOM 필요? | 이유 |
|--------|----------|------|
| UTF-16 | ✅ 필수 | Big Endian/Little Endian 구분 필요 |
| UTF-32 | ✅ 필수 | 바이트 순서 구분 필요 |
| **UTF-8** | ❌ 불필요 | **바이트 순서가 1가지뿐** |

---

## 왜 PowerShell만 BOM 문제가 있나?

→ 자세한 내용: [[CP949]], [[Character Encoding]]

### Windows의 역사적 배경

```
1990년대 Windows:
   └─ 한국: CP949 (한글 전용)
   └─ 일본: Shift-JIS
   └─ 중국: GB2312
   
2000년대 Windows:
   └─ UTF-16 도입 (모든 언어 지원)
   └─ 하지만 기존 CP949도 유지 (호환성)

PowerShell 5.x (2016년):
   └─ "BOM 없으면 CP949로 읽기" ← 문제 발생!
   
PowerShell 7+ (2020년~):
   └─ "기본 UTF-8" ← 문제 해결!
```

### 다른 언어와의 비교

| 언어/프로그램 | 기본 인코딩 | BOM 필요? |
|--------------|------------|----------|
| **Linux/Mac 모든 도구** | UTF-8 | ❌ |
| **Python 3** | UTF-8 | ❌ |
| **Node.js** | UTF-8 | ❌ |
| **PowerShell 5.x** | CP949 (한국) | ✅ |
| **PowerShell 7+** | UTF-8 | ❌ |

### 근본 원인

```
PowerShell 5.x의 설계 실수:

1. 전 세계 대세: UTF-8
2. Windows만 고집: "BOM 없으면 시스템 코드페이지"
3. 한국 Windows: CP949가 시스템 코드페이지
4. 결과: UTF-8 파일을 CP949로 잘못 읽음
```

**Microsoft의 선택:**
- Windows는 UTF-16을 내부적으로 사용 (모든 Windows API)
- "UTF-8은 외부 파일 형식"이라고 생각
- "BOM 없으면 레거시 인코딩"이라고 가정
- → **하위 호환성**을 지키려다 생긴 **시대착오적 버그**

---

## 관련 문서

### 원자적 개념 노트
- [[BOM (Byte Order Mark)]] - BOM 상세 설명
- [[Unicode]] - 유니코드 표준
- [[UTF-8]] - UTF-8 인코딩 (웹 표준)
- [[UTF-16]] - UTF-16 인코딩 (Windows/Java)
- [[UTF-32]] - UTF-32 인코딩 (고정 길이)
- [[ASCII]] - ASCII 인코딩 (7비트)
- [[CP949]] - 한국 Windows 레거시 인코딩
- [[Bit]] - 비트 (컴퓨터 최소 단위)
- [[Byte]] - 바이트 (8비트)
- [[Endianness]] - 바이트 순서 (Big/Little Endian)
- [[Character Encoding]] - 문자 인코딩 전반

### 실전 가이드
- [[03. sources/work-cases/powershell-korean-encoding-fix]] - BOM 추가 실전 가이드

### 기타
- [[glossary]] - 관련 용어 정의
- [[history]] - 컴퓨팅 역사 전반

---

## 요약

| 개념 | 핵심 내용 |
|------|----------|
| **BOM** | 파일 인코딩을 알려주는 3바이트 마커 (EF BB BF) |
| **UTF** | 유니코드를 바이트로 변환하는 방법 (8/16/32bit 단위) |
| **Bit/Byte** | 1 byte = 8 bits (컴퓨터 최소 단위) |
| **8비트 역사** | IBM System/360 (1964) → 산업 표준화 |
| **Endian** | 바이트 순서 (Big/Little), UTF-16/32에서 BOM 필요 |
| **PowerShell 문제** | Windows 하위 호환성 때문에 BOM 필수 (5.x) |

**핵심 교훈:** 기술 표준은 "기술적 완벽함"보다 **"역사적 우연 + 시장 지배력 + 적당한 실용성"**으로 결정됩니다.

---

## Relations

- derived_from [[문자 인코딩 시스템 (Encoding Systems)]] (인코딩 시스템 허브에서 도출)
- derived_from [[03. sources/work-cases/powershell-korean-encoding-fix]] (실무 문제에서 학습 시작)
- mentions [[BOM (Byte Order Mark)]], [[Unicode]], [[UTF-8]], [[UTF-16]], [[UTF-32]]
- mentions [[Bit]], [[Byte]], [[Endianness]], [[CP949]], [[ASCII]]
- connects_to [[컴퓨팅 역사의 선구자들]] (IBM System/360 역사적 맥락)

---

**도출일**: 2026-01-22
**출처**: PowerShell 인코딩 문제 해결 과정에서 BOM/UTF/역사 학습