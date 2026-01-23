---
extraction_status: pending
permalink: 03.-sources/work-cases/powershell-korean-encoding-fix
---

# PowerShell 한글 인코딩 문제 해결

## 문제 상황

generate-menu.ps1에서 `[G]`를 `[그룹]`으로 변경 후 실행하면:
```
[洹몃９] 4. 배포 및 베타테스트
```
한글이 깨져서 출력됨.

## 시도했지만 안 된 방법

```powershell
# generate.bat
chcp 65001 >nul

# generate-menu.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
```

이 설정들은 **출력 인코딩**만 변경함. 파일 읽기 인코딩은 변경 안 됨.

## 근본 원인

```
┌─────────────────────────────────────────────────────────┐
│  .ps1 파일 (UTF-8, BOM 없음)                            │
│  "그룹" = EA B7 B8 EB A3 B9 (UTF-8 바이트)              │
└────────────────────┬────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────┐
│  PowerShell 5.x 파일 읽기                               │
│  기본값: 시스템 코드페이지 (한국 Windows: CP949)        │
│  UTF-8 바이트를 CP949로 해석 → "洹몃９" (깨짐)          │
└─────────────────────────────────────────────────────────┘
```

| 설정 | 영향 범위 | 파일 읽기에 영향? |
|------|----------|------------------|
| `chcp 65001` | 콘솔 출력 | ❌ |
| `OutputEncoding` | 출력 스트림 | ❌ |
| **UTF-8 BOM** | 파일 인코딩 감지 | ✅ |

## 해결책: UTF-8 BOM 추가

UTF-8 BOM (Byte Order Mark): `EF BB BF` 3바이트를 파일 앞에 추가하면 PowerShell이 UTF-8로 인식.

### PowerShell로 BOM 추가

```powershell
$filePath = 'C:\path\to\script.ps1'
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
$utf8Bom = New-Object System.Text.UTF8Encoding($true)  # $true = BOM 포함
[System.IO.File]::WriteAllText($filePath, $content, $utf8Bom)
```

### BOM 확인

```powershell
$bytes = [System.IO.File]::ReadAllBytes($filePath)[0..2]
$hasBom = ($bytes[0] -eq 0xEF) -and ($bytes[1] -eq 0xBB) -and ($bytes[2] -eq 0xBF)
Write-Host "BOM 존재: $hasBom"
```

## 적용 파일

- `generate-menu.ps1` ✅
- `generate.ps1` ✅
- `generate-task.ps1` ✅

## 참고

- PowerShell 7+는 기본 UTF-8 사용 (이 문제 없음)
- VS Code에서 저장 시 "UTF-8 with BOM" 선택 가능
- 메모장에서도 저장 시 인코딩 선택 가능

## 관련 Task

- task-20260120-001: Flow JSON Generator 스크립트 한글 인코딩 문제 해결

## Observations

- [fact] PowerShell 5.x는 기본적으로 시스템 코드페이지(CP949)로 파일을 읽어 UTF-8 한글이 깨짐 #powershell #encoding
- [warning] chcp 65001과 OutputEncoding 설정은 출력 인코딩만 변경하며 파일 읽기 인코딩에는 영향 없음 #powershell #encoding
- [solution] UTF-8 BOM (EF BB BF)을 파일 앞에 추가하면 PowerShell이 UTF-8로 인식 #encoding #fix
- [tech] PowerShell 7+는 기본 UTF-8 사용으로 이 문제가 발생하지 않음 #powershell #version
- [method] UTF-8 BOM 추가는 System.Text.UTF8Encoding($true)로 구현 #powershell #encoding