---
title: build-exe
type: module
permalink: modules/build-exe
level: low
category: automation/build/packaging
semantic: build exe from ps1
path: working/worker/from-code/flow-task-creator/build_exe.ps1
tags:
- powershell
- csharp
- build-tool
---

# build-exe

PowerShell GUI 스크립트를 EXE로 컴파일하는 빌드 도구 (84줄)

## Observations

- [impl] PS1 파일을 Base64로 인코딩 후 C# 래퍼에 삽입 #pattern
- [impl] csc.exe (.NET Framework)로 EXE 컴파일 #algo
- [impl] 실행 시 임시 PS1 생성 후 PowerShell 호출 #pattern
- [impl] /target:winexe로 콘솔 창 숨김 #context
- [deps] .NET Framework csc.exe (v4.0.30319) #import
- [note] 컴파일된 EXE는 PS1 내용을 Base64로 포함 #caveat

## 동작 원리

```
1. PS1 파일 읽기 → Base64 인코딩
2. C# 래퍼 코드 생성 (Base64 포함)
3. csc.exe로 EXE 컴파일
4. 실행 시: Base64 디코딩 → 임시 PS1 생성 → 실행 → 삭제
```

## 주요 로직

### C# 래퍼 생성
```csharp
string psScriptBase64 = "$base64";  // PS1 내용이 여기 삽입됨
byte[] scriptBytes = Convert.FromBase64String(psScriptBase64);
string scriptContent = Encoding.UTF8.GetString(scriptBytes);
// 임시 파일로 저장 후 PowerShell 실행
```

### 컴파일 옵션
```powershell
csc.exe /target:winexe /out:FlowTaskCreator.exe /r:System.Windows.Forms.dll temp_launcher.cs
```

## Relations

- part_of [[flow-task-creator]] (소속 프로젝트)
- transforms [[flow-generator-gui]] (PS1 → EXE 변환)