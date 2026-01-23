---
title: BOM (Byte Order Mark)
type: note
permalink: knowledge/concepts/bom-byte-order-mark
tags:
- bom
- encoding
- utf-8
- byte-order-mark
- file-format
difficulty: intermediate
---

# BOM (Byte Order Mark)

## 정의

**BOM (Byte Order Mark)**은 텍스트 파일의 맨 앞에 추가되는 특수한 바이트 시퀀스로, 파일의 인코딩 방식을 프로그램에게 알려주는 마커(표지판)입니다.

## 바이트 값

| 인코딩 | BOM 바이트 | 크기 |
|--------|-----------|------|
| UTF-8 | `EF BB BF` | 3바이트 |
| UTF-16 BE | `FE FF` | 2바이트 |
| UTF-16 LE | `FF FE` | 2바이트 |
| UTF-32 BE | `00 00 FE FF` | 4바이트 |
| UTF-32 LE | `FF FE 00 00` | 4바이트 |

## 역할

```
파일 구조:
[EF BB BF] [파일 내용...]
    ↑
   BOM
"이 파일은 UTF-8입니다"
```

프로그램이 파일을 읽을 때 첫 3바이트를 보고 인코딩을 자동으로 감지합니다.

## 필요성

| 인코딩 | BOM 필요? | 이유 |
|--------|----------|------|
| [[UTF-16]] | ✅ 필수 | [[Endianness]] 구분 필요 |
| [[UTF-32]] | ✅ 필수 | [[Endianness]] 구분 필요 |
| [[UTF-8]] | ❌ 선택 | 바이트 순서가 고정됨 |

## 장점

- ✅ 인코딩 자동 감지
- ✅ 잘못된 해석 방지 (예: UTF-8 → [[CP949]] 오독 방지)
- ✅ [[PowerShell]] 5.x 같은 레거시 시스템 호환

## 단점

### 1. Unix/Linux 스크립트 오류

```bash
#!/bin/bash
echo "Hello"
```

BOM이 있으면:
```
EF BB BF #!/bin/bash
         ↑
    시스템이 인식 못함
```

결과: `bash: bad interpreter` 에러

### 2. 파일 합치기 문제

```javascript
// file1.js (BOM 있음)
EF BB BF const a = 1;

// file2.js (BOM 있음)
EF BB BF const b = 2;

// 합치면
EF BB BF const a = 1;
EF BB BF const b = 2;  // ← 중간에 이상한 문자
```

### 3. 웹 표준 문제

```json
EF BB BF {"name": "test"}
         ↑
      파싱 에러!
```

### 4. Git diff 복잡화

보이지 않는 BOM 때문에 실제 변경이 없어도 차이로 표시됨.

## 사용 권장 사항

| 환경 | BOM 사용 |
|------|---------|
| **웹 (HTML, CSS, JS)** | ❌ 사용 금지 |
| **Unix/Linux 스크립트** | ❌ 사용 금지 |
| **PowerShell 5.x 스크립트** | ✅ 필수 |
| **Windows 메모장 .txt** | 선택 사항 |
| **크로스 플랫폼 코드** | ❌ 피하기 |

## 확인 방법

### PowerShell
```powershell
$bytes = [System.IO.File]::ReadAllBytes($filePath)[0..2]
$hasBom = ($bytes[0] -eq 0xEF) -and ($bytes[1] -eq 0xBB) -and ($bytes[2] -eq 0xBF)
Write-Host "BOM 존재: $hasBom"
```

### Bash
```bash
hexdump -C file.txt | head -n 1
# EF BB BF가 있으면 BOM 존재
```

## BOM 추가 방법

### PowerShell
```powershell
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
$utf8Bom = New-Object System.Text.UTF8Encoding($true)
[System.IO.File]::WriteAllText($filePath, $content, $utf8Bom)
```

### VS Code
"UTF-8" → "UTF-8 with BOM" 선택해서 저장

## Relations

- used_by [[UTF-8]]
- used_by [[UTF-16]]
- relates_to [[Endianness]]
- part_of [[Character Encoding]]

## 핵심 요약

BOM은 "필요악"입니다. 원래 [[UTF-8]]에는 불필요하지만, 레거시 시스템([[PowerShell]] 5.x) 호환을 위해 어쩔 수 없이 사용합니다. 가능하면 피하고, 꼭 필요한 경우에만 사용하세요.