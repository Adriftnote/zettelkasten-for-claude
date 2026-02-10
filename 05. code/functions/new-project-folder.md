---
title: new-project-folder
type: function
permalink: functions/new-project-folder
level: low
category: automation/workflow/generator
semantic: create project folder
path: working/worker/from-code/flow-task-creator/FlowGenerator.ps1
tags:
- powershell
- folder-generator
---

# new-project-folder

새 프로젝트 폴더를 생성하는 PowerShell 함수

## 📖 시그니처

```powershell
function New-Project → string (다음 액션)
```

## Observations

- [impl] 대화형 프롬프트로 프로젝트명 입력 받음 #pattern
- [impl] 금지 문자 자동 치환 (`/\:*?"<>|` → `_`) #algo
- [impl] 중복 폴더명 검사 #pattern
- [impl] 생성 후 다음 작업 메뉴 표시 #pattern
- [deps] New-Item, Test-Path, Read-Host #import
- [return] "AddGroup" | "Back" | null (다음 액션)

## 로직

```powershell
function New-Project {
    # 프로젝트명 규칙 안내 출력
    $projectName = Read-InputOrCancel -Prompt "프로젝트명"
    if ($null -eq $projectName) { return $null }
    
    $projectName = $projectName -replace '[/\\:*?"<>|]', '_'
    $projectPath = Join-Path $baseDir $projectName
    
    if (Test-Path $projectPath) {
        Write-Host "이미 존재하는 폴더입니다" -ForegroundColor Red
        return $null
    }
    
    New-Item -Path $projectPath -ItemType Directory -Force | Out-Null
    $script:CurrentProject = Get-Item -LiteralPath $projectPath
    
    return Show-AfterCreateMenu -Level "Project" -CreatedPath $projectPath
}
```

## Relations

- part_of [[flow-generator-cli]] (소속 모듈)
- calls [[new-group-folder]] (다음 단계)