---
title: flow-generator-gui
type: module
level: high
category: "automation/workflow/json-generation"
semantic: "generate project json"
permalink: modules/flow-generator-gui
path: "working/worker/from-code/flow-task-creator/FlowGeneratorGUI.ps1"
tags:
- powershell
- winforms
- gui
---

# flow-generator-gui

폴더 구조를 project.json으로 변환하는 PowerShell GUI 도구

## 📖 개요

Windows Forms 기반 GUI로 폴더 구조를 탐색하고, Flow.team 등록용 project.json을 자동 생성. 힌트 템플릿과 체크박스 선택 기능 제공.

## Observations

- [impl] PowerShell + WinForms GUI #pattern
- [impl] 폴더명에서 그룹/Task 번호와 제목 파싱 #algo
- [impl] .md/.txt 파일에서 Task content 자동 읽기 #algo
- [deps] System.Windows.Forms, System.Drawing #import
- [usage] FlowGeneratorGUI.bat 실행 → 폴더 선택 → Generate
- [note] UTF-8 BOM 인코딩으로 한글 지원 #context

## 파일 구조

```
flow-task-creator/
├── FlowGeneratorGUI.ps1   ← GUI 메인
├── FlowGeneratorGUI.bat   ← 실행 배치
├── FlowGenerator.ps1      ← CLI 버전
└── FlowTaskCreator.exe    ← 컴파일된 EXE
```

## 주요 함수

### Get-FolderContent
```powershell
# 폴더 내 .txt/.md 파일에서 content 읽기
if (Test-Path "$folderPath/$folderName.md") {
    return Get-Content ... -Encoding UTF8
}
```

### Write-Utf8File
```powershell
# UTF-8 BOM으로 파일 저장
[System.IO.File]::WriteAllText($Path, $Content, $utf8Bom)
```

## 출력 형식 (project.json)

```json
{
  "name": "[팀명] 프로젝트명",
  "groups": [
    {
      "title": "0. 그룹명",
      "tasks": [
        { "title": "1. Task명", "content": "...", "subtasks": [...] }
      ]
    }
  ]
}
```

## Relations

- part_of [[Flow 업무처리 자동화]] (소속 프로젝트)
