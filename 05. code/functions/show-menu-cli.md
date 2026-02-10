---
title: show-menu-cli
type: function
permalink: functions/show-menu-cli
level: low
category: automation/workflow/ui
semantic: show interactive menu
path: working/worker/from-code/flow-task-creator/FlowGenerator.ps1
tags:
- powershell
- cli-ui
---

# show-menu-cli

화살표 키 기반 대화형 메뉴를 표시하는 PowerShell 함수

## 📖 시그니처

```powershell
function Show-Menu {
    param(
        [string]$Title,
        [array]$Options,
        [string]$Footer = ""
    )
} → int (선택된 인덱스, -1이면 취소)
```

## Observations

- [impl] Up/Down 화살표로 이동, Enter로 선택, Esc로 취소 #pattern
- [impl] 현재 선택 항목 녹색 하이라이트 + `>` 표시 #pattern
- [impl] Clear-Host로 매번 화면 새로고침 #pattern
- [deps] $host.UI.RawUI.ReadKey #import

## 로직

```powershell
function Show-Menu {
    param([string]$Title, [array]$Options, [string]$Footer = "")
    $selectedIndex = 0
    while ($true) {
        Clear-Host
        # 타이틀, 옵션 출력
        for ($i = 0; $i -lt $Options.Count; $i++) {
            if ($i -eq $selectedIndex) {
                Write-Host "  > $($Options[$i])" -ForegroundColor Green
            } else {
                Write-Host "    $($Options[$i])" -ForegroundColor White
            }
        }
        $key = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        switch ($key.VirtualKeyCode) {
            38 { if ($selectedIndex -gt 0) { $selectedIndex-- } }  # Up
            40 { if ($selectedIndex -lt ($Options.Count - 1)) { $selectedIndex++ } }  # Down
            13 { return $selectedIndex }  # Enter
            27 { return -1 }  # Esc
        }
    }
}
```

## Relations

- part_of [[flow-generator-cli]] (소속 모듈)
- used_by [[new-project-folder]] (프로젝트 선택 등에서 사용)