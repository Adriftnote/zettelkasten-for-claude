---
title: Character Encoding
type: note
permalink: knowledge/concepts/character-encoding
tags:
- character-encoding
- encoding
- utf-8
- unicode
- ascii
- text
difficulty: beginner
---

# Character Encoding

## 정의

**Character Encoding (문자 인코딩)**은 문자를 컴퓨터가 저장하고 전송할 수 있는 [[Byte]] 형태로 변환하는 방법입니다.

```
문자 (사람이 읽음)
    ↓ 인코딩
바이트 (컴퓨터가 저장)
    ↓ 디코딩
문자 (사람이 읽음)
```

## 왜 필요한가?

컴퓨터는 숫자만 이해하므로:

```
사람: "안녕하세요"
컴퓨터: ??? (이해 못함)

인코딩:
"안" → 0xEC 0x95 0x88 (UTF-8)
"녕" → 0xEB 0x85 0x95
...

→ 컴퓨터가 저장/전송 가능!
```

## 역사적 발전

### 1. ASCII (1963)

```
7 bits = 128가지
- 영어 대소문자
- 숫자
- 기호

문제: 다른 나라 언어는?
```

→ [[ASCII]] 참조

### 2. 각국 확장 인코딩 (1970~1990년대)

```
한국: CP949 (완성형 한글)
일본: Shift-JIS
중국: GB2312
유럽: ISO-8859-1 (Latin-1)

문제: 서로 호환 안 됨!
한글 파일을 일본 컴퓨터에서 열면 깨짐
```

→ [[CP949]] 참조

### 3. Unicode 시대 (1991~현재)

```
Unicode: 전 세계 모든 문자에 번호 부여
UTF-8/16/32: Unicode를 바이트로 변환

→ 전 세계가 하나의 표준 사용!
```

→ [[Unicode]], [[UTF-8]] 참조

## 주요 인코딩 방식

| 인코딩 | 연도 | 범위 | 바이트/문자 | 용도 |
|--------|------|------|------------|------|
| [[ASCII]] | 1963 | 영어 | 1 | 레거시 시스템 |
| ISO-8859-1 | 1987 | 서유럽 | 1 | 구형 웹 |
| [[CP949]] | 1990s | 한글 | 2 | Windows 한국어 |
| Shift-JIS | 1980s | 일본어 | 1~2 | Windows 일본어 |
| GB2312 | 1980 | 중국어 | 2 | Windows 중국어 |
| **[[UTF-8]]** | 1993 | 전 세계 | 1~4 | **웹 표준** |
| [[UTF-16]] | 1996 | 전 세계 | 2~4 | Windows 내부 |
| UTF-32 | 1996 | 전 세계 | 4 | 내부 처리 |

## 인코딩 vs 디코딩

### 인코딩 (Encoding)

문자 → 바이트

```python
text = "안녕"
bytes = text.encode('utf-8')  # b'\xec\x95\x88\xeb\x85\x95'
```

### 디코딩 (Decoding)

바이트 → 문자

```python
bytes = b'\xec\x95\x88\xeb\x85\x95'
text = bytes.decode('utf-8')  # "안녕"
```

### 잘못된 디코딩

```python
# UTF-8 바이트를 CP949로 잘못 디코딩
bytes = "안녕".encode('utf-8')
text = bytes.decode('cp949')  # 깨진 문자 출력!
```

## 문자 깨짐 원인

### 1. 인코딩 불일치

```
파일 저장: UTF-8
파일 읽기: CP949
    ↓
문자 깨짐! (洹몃９ 같은 이상한 글자)
```

→ [[PowerShell 한글 인코딩 문제]]

### 2. BOM 누락

```
UTF-8 파일 (BOM 없음)
    ↓
PowerShell 5.x: "BOM 없으니 CP949로 읽자"
    ↓
한글 깨짐!
```

→ [[BOM (Byte Order Mark)]]

### 3. Endianness 불일치

```
UTF-16 Big Endian 파일
    ↓
Little Endian으로 읽음
    ↓
문자 깨짐!
```

→ [[Endianness]]

## 인코딩 감지

### 방법 1: BOM 확인

```
파일 시작:
EF BB BF → UTF-8 (with BOM)
FE FF    → UTF-16 BE
FF FE    → UTF-16 LE
```

### 방법 2: 통계적 분석

- 바이트 패턴 분석
- 한글 범위 확인
- 라이브러리: chardet (Python), ICU

### 방법 3: 메타데이터

```html
<meta charset="UTF-8">
```

```http
Content-Type: text/html; charset=UTF-8
```

## 모범 사례

### 1. 항상 UTF-8 사용

```
✅ 권장: UTF-8 (BOM 없음)
❌ 피하기: CP949, EUC-KR (한국어 전용)
```

### 2. 인코딩 명시

```python
# 파일 읽기
with open('file.txt', encoding='utf-8') as f:
    content = f.read()

# 파일 쓰기
with open('file.txt', 'w', encoding='utf-8') as f:
    f.write(content)
```

### 3. BOM 주의

```
웹/Linux: BOM 없는 UTF-8
Windows 스크립트: BOM 있는 UTF-8 (필요시)
```

### 4. 오류 처리

```python
# 엄격 모드 (기본)
text = bytes.decode('utf-8')  # 에러 발생

# 대체 문자 사용
text = bytes.decode('utf-8', errors='replace')  # '�'로 대체

# 무시
text = bytes.decode('utf-8', errors='ignore')  # 건너뛰기
```

## 실전 예시

### HTML
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>한글 페이지</title>
</head>
```

### HTTP 헤더
```http
Content-Type: text/html; charset=UTF-8
```

### Python
```python
# 명시적 인코딩 (권장)
with open('한글.txt', encoding='utf-8') as f:
    content = f.read()

# 시스템 기본 인코딩 (위험!)
with open('한글.txt') as f:  # Windows: CP949, Linux: UTF-8
    content = f.read()
```

### PowerShell
```powershell
# UTF-8 with BOM으로 저장
$content = Get-Content file.ps1
$utf8Bom = New-Object System.Text.UTF8Encoding($true)
[System.IO.File]::WriteAllText($filePath, $content, $utf8Bom)
```

## 디버깅

### 바이트 확인

```bash
# Hex dump
hexdump -C file.txt | head

# 첫 3바이트 확인 (BOM)
xxd -l 3 file.txt
```

### Python으로 분석

```python
with open('file.txt', 'rb') as f:
    raw = f.read()
    print(raw[:20])  # 첫 20바이트
    
    # 여러 인코딩 시도
    for enc in ['utf-8', 'cp949', 'euc-kr']:
        try:
            text = raw.decode(enc)
            print(f"{enc}: {text[:10]}")
        except:
            print(f"{enc}: 실패")
```

## Relations

- part_of [[ASCII]]
- extends [[Unicode]]
- implements [[UTF-8]]
- implements [[UTF-16]]
- implements [[CP949]]

## 핵심 요약

Character Encoding은 "문자를 숫자로 바꾸는 약속"입니다. 과거에는 나라마다 다른 인코딩을 썼지만([[CP949]], Shift-JIS 등), 현재는 [[UTF-8]]이 사실상 표준입니다. **항상 UTF-8을 사용하고, 인코딩을 명시**하면 대부분의 문제를 피할 수 있습니다.