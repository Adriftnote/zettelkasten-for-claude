# PS2EXE 트러블슈팅 가이드

> PowerShell 스크립트를 EXE로 변환할 때 겪은 문제와 해결책

## 배경

FlowGeneratorGUI.ps1 (PowerShell WinForms GUI)을 EXE로 변환하는 과정에서 여러 문제 발생.

---

## 문제 1: 한글 인코딩 깨짐

### 증상
```
?≪뀡 踰꾪듉
?낅Т:"
癒쇱? 洹몃９???좏깮?섏꽭??
```
PowerShell 실행 시 한글이 깨져서 파싱 에러 발생.

### 원인
- Claude Code가 파일을 UTF-8 **without BOM**으로 저장
- PowerShell은 BOM 없으면 시스템 기본 인코딩(CP949)으로 해석

### 해결
```python
# Python으로 UTF-8 BOM 적용
with open('file.ps1', 'r', encoding='utf-8') as f:
    content = f.read()
with open('file.ps1', 'w', encoding='utf-8-sig') as f:
    f.write(content)
```

또는 영어로만 작성하면 문제 없음.

---

## 문제 2: -NoConsole 사용 시 GUI 안 뜸

### 증상
```powershell
Invoke-PS2EXE ... -NoConsole
```
실행하면 "0" 메시지박스만 뜨고 GUI 창이 안 뜸.

### 원인
- WinForms는 **STA (Single Thread Apartment)** 모드에서 실행되어야 함
- `-NoConsole`만 쓰면 MTA 모드로 실행됨

### 해결
```powershell
Invoke-PS2EXE ... -NoConsole -STA
```

**`-STA` 옵션 필수!**

---

## 문제 3: "0" 메시지박스 출력

### 증상
`-NoConsole -STA` 옵션으로 빌드해도 실행 시 "0"이라는 메시지박스가 먼저 뜸.

![메시지박스 예시](0-messagebox.png)

### 원인
- `-NoConsole` 모드에서는 **모든 출력이 메시지박스로 표시**됨
- 스크립트의 마지막 반환값(exit code)이 출력됨
- `ShowDialog()`나 `Application.Run()`의 반환값이 출력됨

### 해결

**1단계: -NoOutput 옵션 추가**
```powershell
Invoke-PS2EXE ... -NoConsole -STA -NoOutput
```

**2단계: 스크립트에서 모든 출력을 Out-Null 처리**
```powershell
# Before
Update-Preview
[System.Windows.Forms.Application]::Run($mainForm)

# After
Update-Preview | Out-Null
[System.Windows.Forms.Application]::Run($mainForm) | Out-Null
```

---

## 최종 빌드 명령어

```powershell
Invoke-PS2EXE `
    -InputFile "FlowGeneratorGUI.ps1" `
    -OutputFile "FlowTaskCreator.exe" `
    -NoConsole `
    -STA `
    -NoOutput `
    -Title "Flow Task Creator"
```

### 옵션 설명

| 옵션 | 필수 | 설명 |
|------|------|------|
| `-NoConsole` | O | 콘솔 창 숨김 (GUI 전용) |
| `-STA` | O | WinForms 필수 (Single Thread Apartment) |
| `-NoOutput` | O | 표준 출력 억제 |
| `-Title` | - | EXE 파일 제목 |

---

## 체크리스트

EXE 변환 전 확인사항:

- [ ] 스크립트가 UTF-8 BOM으로 저장되었는가? (한글 포함 시)
- [ ] 모든 출력을 `| Out-Null`로 처리했는가?
- [ ] `-NoConsole -STA -NoOutput` 옵션을 모두 사용했는가?

---

## 참고 자료

- [MScholtes/PS2EXE GitHub](https://github.com/MScholtes/PS2EXE)
- [PS2EXE README](https://github.com/MScholtes/PS2EXE/blob/master/README.md)

---

## 관련 Task

- task-20260126-004: FlowGenerator GUI 버전 개발
