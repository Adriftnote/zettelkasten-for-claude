---
title: flow-generator-cli
type: module
permalink: modules/flow-generator-cli
level: low
category: automation/workflow/cli
semantic: create folder structure cli
path: working/worker/from-code/flow-task-creator/FlowGenerator.ps1
tags:
- powershell
- cli
- folder-generator
---

# flow-generator-cli

Flow Task Creator CLI 도구 - 폴더 구조 생성 및 JSON 변환 (971줄, 25+개 함수)

## Observations

- [impl] 화살표 키 기반 대화형 메뉴 시스템 #pattern
- [impl] 계층 구조: Project > Group > Task > Subtask #algo
- [impl] 힌트 템플릿 자동 생성 (Task용, Subtask용) #pattern
- [impl] 폴더 구조 → project.json 변환 #algo
- [impl] 다중 Task 선택 후 tasks.json 생성 #pattern
- [deps] System.IO.File, Get-ChildItem #import
- [note] FlowGeneratorGUI.ps1의 CLI 버전 (기능 동일) #context

## 함수 목록

### 유틸리티
| 함수 | 역할 |
|------|------|
| `Write-Utf8File` | UTF8 BOM 파일 쓰기 |
| `New-HintFile` | 힌트 템플릿 파일 생성 |
| `Read-InputOrCancel` | 사용자 입력 또는 취소 |
| `Get-FolderContent` | 폴더의 .txt/.md 내용 읽기 |

### UI/메뉴
| 함수 | 역할 |
|------|------|
| `Show-Help` | 업무명 작성 가이드 표시 |
| `Show-Structure` | 폴더 구조 트리 표시 |
| `Show-Tree` | 재귀적 트리 출력 |
| `Show-Menu` | 화살표 키 메뉴 |
| `Select-Folder` | 폴더 선택 메뉴 |
| `Show-AfterCreateMenu` | 생성 후 다음 작업 메뉴 |

### 구조 생성
| 함수 | 역할 |
|------|------|
| `New-Project` | 프로젝트 폴더 생성 |
| `New-Group` | 그룹 폴더 생성 |
| `New-Task` | Task 폴더 생성 |
| `New-Subtask` | Subtask 폴더 생성 |

### JSON 생성
| 함수 | 역할 |
|------|------|
| `New-ProjectJson` | 전체 프로젝트 JSON |
| `Get-AllTasks` | 모든 Task 목록 수집 |
| `Show-TaskSelectMenu` | Task 다중 선택 메뉴 |
| `New-TaskJson` | 선택한 Task의 JSON |

## 메뉴 구조

```
메인 메뉴
├── [N] 폴더 구조 생성
│   ├── [P] 새 프로젝트
│   ├── [G] 그룹 추가
│   ├── [T] 업무 추가
│   └── [S] 하위업무 추가
├── [P] Project JSON 생성
├── [T] Task JSON 생성
└── [X] 종료
```

## Relations

- part_of [[Flow 업무처리 자동화]] (소속 프로젝트)
- similar_to [[flow-generator-gui]] (GUI 버전)