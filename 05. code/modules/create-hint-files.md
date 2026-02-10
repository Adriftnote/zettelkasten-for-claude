---
title: create-hint-files
type: module
permalink: modules/create-hint-files
level: low
category: automation/file/generator
semantic: create hint template files
path: working/worker/from-code/flow-task-creator/create-hint-files.ps1
tags:
- powershell
- template
- file-generator
---

# create-hint-files

프로젝트 폴더 구조에 힌트 템플릿 파일을 일괄 생성 (43줄)

## Observations

- [impl] 정규식으로 Task/Subtask 폴더 패턴 매칭 #algo
- [impl] Task: `^\d+\. 콘텐츠명$` 패턴 #pattern
- [impl] Subtask: `^\d+\. (브리프|기획안|킥오프|시안|채널|성과)` 패턴 #pattern
- [impl] UTF8 BOM 인코딩으로 한글 깨짐 방지 #context
- [deps] Get-ChildItem, Join-Path, System.IO.File #import
- [note] 프로젝트 경로 하드코딩됨, 필요시 수정 #caveat

## 힌트 템플릿

### Task용
```
## 방법
1.

## 산출물
-

## 첨부
-
```

### Subtask용
```
## 방법
1.

## 산출물
-
```

## 동작 원리

```
1. 프로젝트 경로 하위 폴더 재귀 탐색
2. Task 패턴 매칭 → Task 힌트 파일 생성
3. Subtask 패턴 매칭 → Subtask 힌트 파일 생성
4. 파일명 = 폴더명.txt
```

## Relations

- part_of [[flow-task-creator]] (소속 프로젝트)
- supports [[flow-generator-gui]] (GUI에서 사용할 힌트 파일)